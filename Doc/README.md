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
git clone https://github.com/DEIN-USERNAME/shopdrop.git
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
├── frontend/        # React + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── api/
├── backend/         # Express + TypeScript
│   └── src/
│       ├── routes/
│       └── db/
└── README.md
\`\`\`