// backend/src/routes/orders.ts

import { Router } from "express";
import pool from "../db/client";
import { authMiddleware, AuthRequest } from "../middleware/auth"; // Erweiter

const router = Router();

/* router.post("/", async (req, res) => { */
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { customer_name, customer_address, items } = req.body;

  // 2. Hier holen wir uns die ID des Users aus dem Token
  const userId = req.user?.userId;

  // Validierung
  if (!customer_name || !customer_address || !items || items.length === 0) {
    res
      .status(400)
      .json({ error: "Name, Adresse und Produkte sind erforderlich" });
    return;
  }

  // Datenbankverbindung holen
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Gesamtpreis berechnen + Stock prüfen
    let total = 0;
    for (const item of items) {
      const result = await client.query(
        "SELECT price, stock FROM products WHERE id = $1",
        [item.product_id],
      );

      if (result.rows.length === 0) {
        throw new Error(`Produkt ${item.product_id} nicht gefunden`);
      }

      const product = result.rows[0];

      if (product.stock < item.quantity) {
        throw new Error(
          `Nicht genug Lagerbestand für Produkt ${item.product_id}`,
        );
      }

      total += parseFloat(product.price) * item.quantity;
    }

    // Bestellung anlegen
    // Wir speichern hier direkt die user_id mit

    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_address, total, user_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [customer_name, customer_address, total.toFixed(2), userId],
    );

    const orderId = orderResult.rows[0].id;

    // Einzelne Artikel speichern + Stock reduzieren
    for (const item of items) {
      const productResult = await client.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );
      const priceAtPurchase = productResult.rows[0].price;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, priceAtPurchase],
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id],);
   }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Bestellung erfolgreich",
      orderId,
      total: total.toFixed(2),
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message || "Bestellung fehlgeschlagen. Bitte erneut versuchen." });
  } finally {
    client.release();
  }
});

// Bestellhistorie — nur für eingeloggte Nutzer
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        o.id, o.customer_name, o.customer_address, 
        o.total, o.created_at,
        json_agg(json_build_object(
          'name', p.name,
          'quantity', oi.quantity,
          'price', oi.price_at_purchase
        )) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user!.userId],
    );
    res.json(result.rows);
  } catch {
    res
      .status(500)
      .json({ error: "Bestellhistorie konnte nicht geladen werden" });
  }
});

export default router;
