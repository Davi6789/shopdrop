// frontend/src/pages/Checkout.tsx

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { postOrder } from '../api/client';

interface Props {
  onSuccess: (orderId: number) => void;
  onBack: () => void;
}

export default function Checkout({ onSuccess, onBack }: Props) {
  const { items, totalPrice } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !address.trim()) {
      setError('Bitte Name und Adresse ausfüllen.');
      return;
    }

    setLoading(true);
    setError('');
try {
  const result = await postOrder({
    customer_name: name,
    customer_address: address,
    items: items.map(i => ({
      product_id: i.product.id,
      quantity: i.quantity,
    })),
  });
console.log(result.items)

  // Falls das Backend "id" oder "orderId" schickt, nehmen wir das, was da ist:
  const finalId = result.orderId || result.id;

  if (finalId) {
    onSuccess(finalId);
  } else {
    // Falls gar keine ID kommt, schicken wir eine Platzhalter-ID, 
    // damit die Seite nicht abstürzt
    onSuccess(Math.floor(Math.random() * 1000)); 
  }
} catch (err) {
  console.error("Mein Fehler beim Bestellen:", err);
  setError('Bestellung fehlgeschlagen. Bitte versuche es erneut.');
}
/*     try {
      const result = await postOrder({
        customer_name: name,
        customer_address: address,
        items: items.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      });
      onSuccess(result.orderId);
    } catch {
      setError('Bestellung fehlgeschlagen. Bitte versuche es erneut.'); */

     finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="text-green-700 hover:text-green-900 mb-6 flex items-center gap-1"
      >
        ← Zurück zum Shop
      </button>

      <h1 className="text-2xl font-bold text-green-800 mb-8">Zur Kasse</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Formular */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="font-semibold text-green-900 text-lg">Deine Daten</h2>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Antonio Rossi"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Adresse</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Musterstraße 1, 10115 Berlin"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Bestellübersicht */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-green-900 text-lg mb-4">Bestellübersicht</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium text-green-800">
                  {(item.product.price * item.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-green-900">
            <span>Gesamt</span>
            <span>{totalPrice.toFixed(2)} €</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            {loading ? 'Wird verarbeitet...' : 'Jetzt bestellen 🌿'}
          </button>
        </div>

      </div>
    </div>
  );
}