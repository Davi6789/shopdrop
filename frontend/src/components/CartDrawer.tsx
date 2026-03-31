// src/components/CartDrawer.tsx

import { useCart } from '../context/CartContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <>
      {/* Dunkler Hintergrund */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-green-800 text-white">
          <h2 className="text-lg font-bold">🛒 Warenkorb</h2>
          <button onClick={onClose} className="text-2xl hover:text-green-200">✕</button>
        </div>

        {/* Produkte */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center mt-16">Dein Warenkorb ist leer 🌱</p>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-3 items-center border-b pb-4">
                <div className="flex-1">
                  <p className="font-semibold text-green-900 text-sm">{item.product.name}</p>
                  <p className="text-green-700 text-sm">{parseFloat(String(item.product.price)).toFixed(2)} €</p>
                </div>
                {/* Menge */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-green-100 text-green-800 font-bold hover:bg-green-200"
                  >−</button>
                  <span className="w-5 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-green-100 text-green-800 font-bold hover:bg-green-200"
                  >+</button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >🗑</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t">
            <div className="flex justify-between font-bold text-green-900 mb-4">
              <span>Gesamt</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors">
              Zur Kasse →
            </button>
          </div>
        )}
      </div>
    </>
  );
}