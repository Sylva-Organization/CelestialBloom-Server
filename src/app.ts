import 'dotenv/config';
import 'reflect-metadata'; // ya esta
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import db_connection from './database/db_connection.js';
import UserRouter from './routes/UserRoutes.js';
import PostRouter from './routes/PostRoutes.js';
import AuthRouter from './routes/AuthRoutes.js';

const app = express();

// ====== Middlewares básicos ======
app.use(cors());
app.use(express.json());

// ====== Rutas ======
app.get('/', (_req: Request, res: Response) => {
  res.send('Hola API');
});
app.use('/users', UserRouter);
app.use('/post', PostRouter);
app.use('/auth', AuthRouter); 

// ====== Función de inicialización ======
async function startServer() {
  try {
    await db_connection.authenticate();
console.log('✅ Conectado a la base de datos');

// ⚠️ solo en desarrollo, temporalmente
await db_connection.sync();

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