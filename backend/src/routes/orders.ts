// backend/src/routes/orders.ts

import { Router } from "express";
import pool from "../db/client";

const router = Router();

router.post("/", async (req, res) => {
  const { customer_name, customer_address, items } = req.body;

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

    // Gesamtpreis berechnen + Stock prüfen
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
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_address, total)
       VALUES ($1, $2, $3) RETURNING id`,
      [customer_name, customer_address, total.toFixed(2)],
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
        [item.quantity, item.product_id],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Bestellung erfolgreich",
      orderId,
      total: total.toFixed(2),
    });
      
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message || "Bestellung fehlgeschlagen" });
  } finally {
    client.release();
  }
});

export default router;
