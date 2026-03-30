import { Router } from 'express';
import pool from '../db/client';

const router = Router();

// Alle Produkte
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Datenbankfehler' });
  }
});

// Einzelnes Produkt
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produkt nicht gefunden' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Datenbankfehler' });
  }
});

export default router;
