// frontend/src/pages/Orders.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  customer_name: string;
  customer_address: string;
  total: string;
  created_at: string;
  items: OrderItem[];
}

interface Props {
  onBack: () => void;
}

export default function Orders({ onBack }: Props) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(() => setError('Bestellungen konnten nicht geladen werden.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Bestellungen werden geladen... 🌱</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="text-green-700 hover:text-green-900 mb-6 flex items-center gap-1"
      >
        ← Zurück zum Shop
      </button>

      <h1 className="text-2xl font-bold text-green-800 mb-8">📦 Meine Bestellungen</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">🪴</p>
          <p className="text-gray-500">Du hast noch keine Bestellungen.</p>
          <button
            onClick={onBack}
            className="mt-4 text-green-600 hover:text-green-800 underline text-sm"
          >
            Jetzt einkaufen
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-md p-6">

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-green-900">Bestellung #{order.id}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('de-DE', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {parseFloat(order.total).toFixed(2)} €
                </span>
              </div>

              {/* Artikel */}
              <div className="border-t pt-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-green-700 font-medium">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              {/* Adresse */}
              <div className="border-t mt-4 pt-3 text-sm text-gray-400">
                📍 {order.customer_address}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}