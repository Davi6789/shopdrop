// src/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/client'; // Stelle sicher, dass die Datei in src/db/client.ts liegt!
import productsRouter from './routes/products';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Konfiguration
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// --- HIER DIE ROUTEN REGISTRIEREN ---
app.use('/products', productsRouter);

// Health-Check Route
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