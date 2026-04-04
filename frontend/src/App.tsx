import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const navigate = useNavigate();
  const { totalItems, clearCart } = useCart();
  const { isLoggedIn, email, logout, isAdmin } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const handleOrderSuccess = (id: number) => {
    setOrderId(id);
    clearCart();
    setCartOpen(false);
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer hover:text-green-200 transition-colors"
        >
          🌱 ShopDrop — Pflanzenshop
        </h1>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-green-200 text-sm hidden sm:block">
                👤 {email}
              </span>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors"
              >
                👤 Profil
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-sm bg-amber-600 hover:bg-amber-500 px-3 py-2 rounded-xl transition-colors"
                >
                  ⚙️ Admin
                </button>
              )}
              <button
                onClick={() => navigate("/orders")}
                className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors"
              >
                📦 Bestellungen
              </button>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors"
            >
              Login
            </button>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
          >
            <span>🛒</span>
            <motion.span
              key={totalItems}
              initial={{ scale: 1.5, color: "#4ade80" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="font-semibold"
            >
              {totalItems}
            </motion.span>
          </button>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/auth" element={<Auth onSuccess={() => navigate("/")} />} />
          <Route path="/checkout" element={<Checkout onSuccess={handleOrderSuccess} onBack={() => navigate("/")} />} />
          <Route path="/success" element={orderId ? <OrderSuccess orderId={orderId} onBackToShop={() => navigate("/")} /> : <Home />} />
          <Route path="/orders" element={<Orders onBack={() => navigate("/")} />} />
          <Route path="/profile" element={<Profile onBack={() => navigate("/")} />} />
          <Route path="/admin" element={<Admin onBack={() => navigate("/")} />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-green-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ShopDrop Pflanzenshop. Alle Rechte vorbehalten. 🌱
          </p>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); navigate("/checkout"); }}
      />
    </div>
  );
}

export default App;
