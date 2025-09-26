import { Sequelize } from 'sequelize';
import configData from '../config/config.js';

const dbConfig = configData.development;

const db_connection = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        define: {
            timestamps: true,
            underscored: true,
        },
    }
);

export default db_connection;
