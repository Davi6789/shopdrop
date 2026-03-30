// src/db/clinet.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();  // SEHR WICHTIG: Das muss hier oder in der index.ts ganz oben stehen!

console.log("Verbinde mit URL:", process.env.DATABASE_URL); // Nur zum Testen!
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unerwarteter Datenbankfehler:', err);
  process.exit(-1);
});

export default pool;