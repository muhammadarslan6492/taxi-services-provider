const swaggerDefinition = {
  info: {
    title: 'Mobio Backend Apis',
    version: '0.0.1',
    description: 'Mobio is a B2B taxi as a service platform',
  },
  host: process.env.LIVE_LINK,
  basePath: "/api",
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

export default swaggerOptions;
