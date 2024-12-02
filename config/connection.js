import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); 

const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;