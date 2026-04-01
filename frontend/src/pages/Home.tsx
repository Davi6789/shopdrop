// frontend/pages/Home.tsx

import { useEffect, useState } from 'react';
import { getProducts } from '../api/client';
import type { Product } from '../types/index';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // suchfunktion
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Produkte konnten nicht geladen werden.'))
      .finally(() => setLoading(false));
  }, []);

  // Erweiter Live-Filter — läuft komplett im Frontend 
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  ); 

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Pflanzen werden geladen... 🌱</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">


{/* Suchfeld */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pflanze suchen..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Ergebnis-Zähler */}
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-2 ml-1">
            {filtered.length === 0
              ? 'Keine Pflanzen gefunden'
              : `${filtered.length} Pflanze${filtered.length !== 1 ? 'n' : ''} gefunden`}
          </p>
        )}
      </div>

      <h1 className="text-3xl font-bold text-green-800 mb-8">🌿 Unsere Pflanzen</h1>

      {/* Kein Ergebnis */}
      {filtered.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-4xl mb-3">🪴</p>
          <p className="text-gray-500">Keine Pflanze namens <strong>"{searchQuery}"</strong> gefunden.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-green-600 hover:text-green-800 underline text-sm"
          >
            Suche zurücksetzen
          </button>
        </div>
      )}

      {/* Produkt Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}