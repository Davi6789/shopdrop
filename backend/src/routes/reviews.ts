import { Router } from 'express';
import pool from '../db/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router({ mergeParams: true });

// 1. Alle Bewertungen für ein Produkt laden
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.email as user_email
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.productId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Laden der Reviews:", error);
    res.status(500).json({ error: 'Bewertungen konnten nicht geladen werden' });
  }
});

// 2. Bewertung hinzufügen — nur eingeloggte Nutzer
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  // Validierung
  if (!rating || !comment) {
    res.status(400).json({ error: 'Bewertung und Kommentar erforderlich' });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Bewertung muss zwischen 1 und 5 liegen' });
    return;
  }

  try {
    // Prüfen ob User schon bewertet hat
    const exists = await pool.query(
      'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
      [productId, req.user!.userId]
    );

    if (exists.rows.length > 0) {
      res.status(409).json({ error: 'Du hast dieses Produkt bereits bewertet' });
      return;
    }

    // Der wichtige INSERT mit 5 Werten ($1 bis $5)
    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment, user_email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, rating, comment, created_at, user_email`,
      [productId, req.user!.userId, rating, comment, req.user!.email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Fehler beim Speichern der Review:", error);
    res.status(500).json({ error: 'Bewertung konnte nicht gespeichert werden' });
  }
});

export default router;