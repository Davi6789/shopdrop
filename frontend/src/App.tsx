// src/App.tsx

import { useState } from 'react';
import Home from './pages/Home';
import { useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

function App() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 ShopDrop — Pflanzenshop</h1>
        <button
          onClick={() => setCartOpen(true)}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
        >
          <span>🛒</span>
          <span className="font-semibold">{totalItems}</span>
        </button>       
      </nav>

      <main>
        <Home />
      </main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;