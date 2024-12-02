import sequelize from './connection.js';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Failed to Synchronize Database:', error);
  }
};

export default syncDatabase;