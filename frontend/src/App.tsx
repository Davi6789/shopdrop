// src/App.tsx

import { useState } from 'react';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

type Page = 'home' | 'checkout' | 'success';

function App() {
  const { totalItems, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [orderId, setOrderId] = useState<number | null>(null);

  const handleOrderSuccess = (id: number) => {
    setOrderId(id);
    clearCart();
    setCartOpen(false);
    setPage('success');
  };

return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1
          onClick={() => setPage('home')}
          className="text-xl font-bold cursor-pointer hover:text-green-200 transition-colors"
        >
          🌱 ShopDrop — Pflanzenshop
        </h1>
        {page === 'home' && (
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
          >
            <span>🛒</span>
            <span className="font-semibold">{totalItems}</span>
          </button>
        )}
      </nav>

      <main>
        {page === 'home' && <Home />}
        {page === 'checkout' && (
          <Checkout
            onSuccess={handleOrderSuccess}
            onBack={() => setPage('home')}
          />
        )}
        {page === 'success' && orderId && (
          <OrderSuccess
            orderId={orderId}
            onBackToShop={() => setPage('home')}
          />
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);   // Warenkorb schließen
          setPage('checkout');  // Zur Kasse wechseln
        }}
      />
    </div>
  );
}

export default App;