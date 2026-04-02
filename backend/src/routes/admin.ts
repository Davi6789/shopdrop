// backend/src/routes/admin.ts

import { Router } from 'express';
import pool from '../db/client';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = Router();

// Beide Middlewares auf alle Admin-Routes anwenden
router.use(authMiddleware, adminMiddleware);

// Alle Produkte abrufen
router.get('/products', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id'
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Fehler beim Laden' });
  }
});

// Stock + Preis updaten
router.put('/products/:id', async (req, res) => {
  const { stock, price, name, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products 
       SET stock = $1, price = $2, name = $3, description = $4
       WHERE id = $5 RETURNING *`,
      [stock, price, name, description, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produkt nicht gefunden' });
      return;
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Fehler beim Updaten' });
  }
});

// Neues Produkt hinzufügen
router.post('/products', async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;
  if (!name || !price) {
    res.status(400).json({ error: 'Name und Preis sind erforderlich' });
    return;
  }
  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, stock)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, price, image_url || '', stock || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Fehler beim Hinzufügen' });
  }
});

// Produkt löschen
router.delete('/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Produkt gelöscht' });
  } catch {
    res.status(500).json({ error: 'Fehler beim Löschen' });
  }
});

export default router;