import { Sequelize } from 'sequelize-typescript';
import configData from '../config/config.js';
import { UserModel } from "../models/UserModel.js";
import { PostModel } from "../models/PostModel.js";

const dbConfig = configData.development;

export const db_connection = new Sequelize({
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    define: {
        timestamps: true,
        underscored: true,
    },
    models: [UserModel, PostModel],
});

export default db_connection;
