import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
);
const connect = async () => {
  try {
    await sequelize.authenticate();
    // sequelize.sync({
    //   alter: true,
    // });
  } catch (err) {
    process.exit(1);
  }
};

export default {
  connect,
  sequelize,
};
