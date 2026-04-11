const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'matrimony_db',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || '',
    {
        host: process.env.MYSQL_HOST || 'localhost',
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected via Sequelize');
    } catch (error) {
        console.error(`Unable to connect to the database: ${error.message}`);
        console.log('Continuing without database connection for development...');
    }
};

module.exports = { sequelize, connectDB };
