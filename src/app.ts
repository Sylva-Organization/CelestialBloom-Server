import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize-typescript';

// Como app.ts está en src/, las rutas son relativas a src/
import { PostModel } from './models/PostModel.js';  // ← Sin .js
import { UserModel } from './models/UserModel.js';  // ← Sin .js

const app = express();

// ====== Middlewares básicos ======
app.use(cors());
app.use(express.json());

// ====== Rutas ======
app.get('/', (_req: Request, res: Response) => {
  res.send('Hola API');
});

// ====== Validación de variables de entorno ======
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'USER_DB', 'PASSWORD_DB', 'DB_NAME'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Falta la variable de entorno: ${envVar}`);
  }
}

// ====== Validación de variables de entorno ======
if (!process.env['DB_HOST'] || 
    !process.env['DB_PORT'] || 
    !process.env['USER_DB'] || 
    !process.env['PASSWORD_DB'] || 
    !process.env['DB_NAME']) {
  throw new Error('Faltan variables de entorno requeridas para la base de datos');
}

// ====== Instancia de Sequelize ======
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  username: process.env['USER_DB'],
  password: process.env['PASSWORD_DB'],
  database: process.env['DB_NAME'],
  models: [UserModel, PostModel],
  logging: false,
});

// ====== Función de inicialización ======
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    await sequelize.sync(); // { alter: true } en desarrollo
    console.log('🧩 Modelos sincronizados');

    const PORT = Number(process.env['PORT'] || 8000);
    app.listen(PORT, () => {
      console.log(`🚀 Server up in http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('❌ Error conectando la DB:', err);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();

export default app;