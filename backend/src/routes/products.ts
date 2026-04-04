// shopdrop/backend/src/routes/products.ts

import { Router } from 'express';
import pool from '../db/client';

const router = Router();

// Kombinierte Route: Alle Produkte ODER nach Kategorie gefiltert
router.get('/', async (req, res) => {
  const { category } = req.query; 
  
  try {
    let query = "SELECT * FROM products";
    let params: any[] = [];

    if (category && category !== 'Alle') {
      query += " WHERE category = $1";
      params.push(category);
    }

    query += " ORDER BY id"; // Immer schön sortiert lassen

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Datenbankfehler beim Laden der Produkte' });
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
