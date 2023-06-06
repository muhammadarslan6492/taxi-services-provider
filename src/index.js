import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import helmet from 'helmet';

import compression from 'compression';
import { config } from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import Router from './routes';
import swaggerOptions from './config/swagger';
import DB from './db';
import idleOffline from './cron/idleOffline';
import sendPush from './cron/bookingPush';

config();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const swaggerUiHandler = swaggerUi.setup(swaggerSpec);
const docsJsonPath = '/api/api-docs.json';
const app = express();
const { PORT } = process.env;
const server = createServer(app);
const io = new Server(server, {
  path: '/api/socket.io',
});
const connectedUsers = {};
io.on('connection', (socket) => {
  console.log('a user connected', socket.handshake.query);
  const { userId } = socket.handshake.query;
  connectedUsers[userId] = socket.id;
  socket.on('disconnect', () => {
    delete connectedUsers[userId];
  });
});

// const { Op } = Sequelize;
app.use(morgan('dev'));
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});

app.use(compression());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
try {
  DB.connect();
  app.use(
    '/api/docs',
    basicAuth({
      users: { mobio: process.env.DATABASE_PASSWORD },
      challenge: true,
    }),
    swaggerUi.serve,
    (req, res, next) => {
      if (!req.query.url) {
        res.redirect(
          `/api/docs?url=${req.protocol}://${req.headers.host}${docsJsonPath}`
        );
      } else {
        swaggerUiHandler(req, res, next);
      }
    }
  );
  // app.use(helmet());
  app.get('/api/health', (req, res) =>
    res.status(200).json({ msg: 'API Working!' })
  );
  app.get(docsJsonPath, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(swaggerSpec);
  });
  app.use('/api', Router);

  idleOffline(io);
  sendPush();
  server.listen(PORT);
} catch (error) {
  console.log(error);
}

// io.on('connection', (socket) => {
//   socket.on('error', (error) => {
//     console.log('socket error:', error);
//   });
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });
