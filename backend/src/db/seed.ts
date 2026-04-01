// backend/src/db/seed.ts (aktualisiert)
import pool from './client';

const seedProducts = async () => {
  const products = [
    {
      name: 'Monstera Deliciosa',
      description: 'Tropische Zimmerpflanze mit großen, gefensterten Blättern.',
      price: 24.99,
      image_url: 'https://dein-bild-hoster.com/monstera.png', // Lade das KI-Bild hoch!
      stock: 15
    },
    {
      name: 'Bogenhanf',
      description: 'Nahezu unkaputtbare Pflanze, reinigt die Luft.',
      price: 14.99,
      image_url: 'https://dein-bild-hoster.com/bogenhanf.png',
      stock: 10
    },
    {
      name: 'Einblatt',
      description: 'Elegante Zimmerpflanze mit schönen weißen Blüten.',
      price: 19.99,
      image_url: 'https://dein-bild-hoster.com/einblatt.png',
      stock: 12
    },
    {
      name: 'Efeutute',
      description: 'Schnell wachsende Kletterpflanze für Regale.',
      price: 12.50,
      image_url: 'https://dein-bild-hoster.com/efeutute.png',
      stock: 8
    },
    {
      name: 'Zebra-Haworthie',
      description: 'Kleine, markante Sukkulente, perfekt für den Schreibtisch.',
      price: 9.99,
      image_url: 'https://dein-bild-hoster.com/zebra.png',
      stock: 20
    },
    {
      name: 'Geigenfeige',
      description: 'Große, dekorative Pflanze mit ausdrucksstarken Blättern.',
      price: 39.99,
      image_url: 'https://dein-bild-hoster.com/geigenfeige.png',
      stock: 5
    }
  ];

  try {
    for (const p of products) {
      await pool.query(
        'INSERT INTO products (name, description, price, image_url, stock) VALUES ($1, $2, $3, $4, $5)',
        [p.name, p.description, p.price, p.image_url, p.stock]
      );
    }
    console.log("✅ Neue Test-Produkte erfolgreich hinzugefügt!");
  } catch (err) {
    console.error("❌ Fehler beim Seeding:", err);
  } finally {
    process.exit();
  }
};

seedProducts();