import { Sequelize } from 'sequelize-typescript';
import configData from '../config/config.js';
import { UserModel } from "../models/UserModel.js";
import { PostModel } from "../models/PostModel.js";
import { CategoryModel } from '../models/CategoryModel.js';
import { SubcategoryModel } from '../models/SubcategoryModel.js';

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
    models: [UserModel, PostModel, CategoryModel, SubcategoryModel],
    logging: process.env['NODE_ENV'] === "test" ? false : console.log
});

export default db_connection;
