// backend/src/routes/auth.ts

import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Registrierung
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email und Passwort erforderlich" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Passwort muss mindestens 6 Zeichen haben" });
    return;
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (exists.rows.length > 0) {
      res.status(409).json({ error: "Email bereits registriert" });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, password_hash],
    );

    const userWithRole = await pool.query(
      "SELECT id, email, role FROM users WHERE id = $1",
      [user.id],
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: userWithRole.rows[0].role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.status(201).json({ token, email: user.email, role: userWithRole.rows[0].role });
  } catch {
    res.status(500).json({ error: "Registrierung fehlgeschlagen" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email und Passwort erforderlich" });
    return;
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      res.status(401).json({ error: "Email oder Passwort falsch" });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: "Email oder Passwort falsch" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role  },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.json({ token, email: user.email, role: user.role  });
  } catch {
    res.status(500).json({ error: "Login fehlgeschlagen" });
  }
});

router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, street, city, zip, country, created_at FROM users WHERE id = $1",
      [req.user!.userId],
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Profil konnte nicht geladen werden" });
  }
});

router.put("/profile", authMiddleware, async (req: AuthRequest, res) => {
  const { street, city, zip, country } = req.body;
  try {
    await pool.query(
      "UPDATE users SET street = $1, city = $2, zip = $3, country = $4 WHERE id = $5",
      [street, city, zip, country || "Deutschland", req.user!.userId],
    );
    res.json({ message: "Adresse gespeichert" });
  } catch {
    res.status(500).json({ error: "Adresse konnte nicht gespeichert werden" });
  }
});

router.put("/password", authMiddleware, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res
      .status(400)
      .json({ error: "Aktuelles und neues Passwort erforderlich" });
    return;
  }
  if (newPassword.length < 6) {
    res
      .status(400)
      .json({ error: "Neues Passwort muss mindestens 6 Zeichen haben" });
    return;
  }
  try {
    const result = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [req.user!.userId],
    );
    const user = result.rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Aktuelles Passwort ist falsch" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      newHash,
      req.user!.userId,
    ]);
    res.json({ message: "Passwort erfolgreich geändert" });
  } catch {
    res.status(500).json({ error: "Passwort konnte nicht geändert werden" });
  }
});

export default router;
