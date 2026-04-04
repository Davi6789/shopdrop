// backend/src/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/client'; // Stelle sicher, dass die Datei in src/db/client.ts liegt!
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';   // ← neu
import authRouter from './routes/auth';          // ← neu
import adminRouter from './routes/admin';   // ← neu
import reviewsRouter from './routes/reviews';  // ← neu

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// CORS Konfiguration
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// --- HIER DIE ROUTEN REGISTRIEREN ---
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);              // ← neu
app.use('/auth', authRouter);                    // ← neu
app.use('/admin', adminRouter);
app.use('/products/:productId/reviews', reviewsRouter);             // ← neu admin

// 1. Die richtige Root-Route für http://localhost:3001/
app.get('/', (req: Request, res: Response) => {
  res.send('Willkommen beim ShopDrop API-Server! 🚀');
});

// 2. Health-Check Route
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Wir prüfen, ob der Pool antwortet
    await pool.query('SELECT 1');
    // 2. Wenn das klappt, schicken wir "ok"
    res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    console.error("Datenbank-Fehler:", error);
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`🌱 Server läuft auf http://localhost:${PORT}`);
});