// backend/src/middleware/admin.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import pool from '../db/client';

export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user!.userId]
    );

    if (result.rows[0]?.role !== 'admin') {
      res.status(403).json({ error: 'Kein Zugriff — nur für Admins' });
      return;
    }

    next();
  } catch {
    res.status(500).json({ error: 'Authentifizierung fehlgeschlagen' });
  }
}