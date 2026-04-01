# 🌱 ShopDrop — Pflanzenshop

Ein Fullstack E-Commerce Shop für Zimmerpflanzen.  
Gebaut mit React, Node.js und PostgreSQL.

## Tech Stack

- **Frontend:** Bun, React, TypeScript, TailwindCSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Datenbank:** PostgreSQL

## Features

- Produktübersicht mit Bildern und Preisen
- Warenkorb mit Mengenänderung
- Checkout mit Name und Adresse
- Bestellung wird in PostgreSQL gespeichert
- Lagerbestand wird automatisch reduziert

## Voraussetzungen

- Node.js 18+
- Bun
- PostgreSQL 14+

## Installation

### 1. Repository klonen

\`\`\`bash
git clone https://github.com/Davi6789/shopdrop.git
cd shopdrop
\`\`\`

### 2. Datenbank einrichten

\`\`\`bash
psql -c "CREATE DATABASE shopdrop;"
psql shopdrop -f backend/src/db/schema.sql
psql shopdrop -f backend/src/db/seed.sql
\`\`\`

### 3. Backend starten

\`\`\`bash
cd backend
cp ../.env.example .env
# .env mit deinen Daten befüllen
npm install
npm run dev
\`\`\`

### 4. Frontend starten

\`\`\`bash
cd frontend
bun install
bun run dev
\`\`\`

### 5. Browser öffnen

\`\`\`
http://localhost:5173
\`\`\`

## Umgebungsvariablen

Kopiere `.env.example` nach `backend/.env` und fülle diese Werte aus:

| Variable | Beschreibung | Beispiel |
|---|---|---|
| DATABASE_URL | PostgreSQL Verbindung | postgresql://user@localhost:5432/shopdrop |
| PORT | Backend Port | 3001 |
| FRONTEND_URL | Frontend URL für CORS | http://localhost:5173 |

## API Endpoints

| Method | Route | Beschreibung |
|---|---|---|
| GET | /health | Server Status |
| GET | /products | Alle Produkte |
| GET | /products/:id | Einzelnes Produkt |
| POST | /orders | Bestellung aufgeben |

## Projektstruktur

\`\`\`
shopdrop/
├── frontend/        # Bun React + Tailwind + Typescript
│   └── src/
│       ├── components/CartDrawer.tsx, ProductCard.tsx
│       ├── pages/Checkout.tsx, Home.tsx, OrderSuccess.tsx
│       ├── context/CartContext.tsx
│       ├── types/index.tsx
│       └── api/client.ts
│       └── App.tsx, index.css, main.tsx
│ 
├── backend/         # Express + TypeScript
│   └── .env, .gitignore, package.json, tsconfig.json
│   └── src/
│       ├── db/client.ts, seed.ts, schema.sql, seed.sql, 
│       └── routes/orders.ts, products.ts
│       └── index.ts
│
└── README.md
\`\`\`