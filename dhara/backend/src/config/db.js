const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'dhara',
  process.env.DB_USER || 'root', // Default XAMPP user
  process.env.DB_PASS || '',     // Default XAMPP password is empty
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, 
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected via Sequelize');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
