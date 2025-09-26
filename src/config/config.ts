import dotenv from 'dotenv';
dotenv.config();

export default {
    development: {
        database: process.env['DB_NAME']!,
        username: process.env['USER_DB']!,
        password: process.env['PASSWORD_DB']!,
        host: process.env['HOST']!,
        port: 3306,
        dialect: process.env['DB_DIALECT'] as 'mysql',
    }
};