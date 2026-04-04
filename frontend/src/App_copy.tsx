// frontend/src/App.tsx

import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth"; // neu für login
import { useAuth } from "./context/AuthContext"; // neu für login
import { useCart } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import Orders from "./pages/Orders"; // ← neu für bestellhistory und  | 'orders'
import Profile from "./pages/Profile"; // ← neu Profile
import Admin from "./pages/Admin"; // ← neu Admin
import ProductDetail from "./pages/ProductDetail"; // 1. Import nicht vergessen!

/* type Page =
  | "home"
  | "checkout"
  | "success"
  | "auth"
  | "orders"
  | "profile"
  | "admin"; */

function App() {
  const navigate = useNavigate(); // Stelle sicher, dass dies existiert!
  const { totalItems, clearCart } = useCart();
  const { isLoggedIn, email, logout, isAdmin } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [page, setPage] = useState<Page>("home");

  const handleOrderSuccess = (id: number) => {
    setOrderId(id);
    clearCart();
    setCartOpen(false);
    setPage("success");
    navigate("/success"); // Nutze NUR noch navigate
  };

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1
          onClick={() => setPage("home")}
          className="text-xl font-bold cursor-pointer hover:text-green-200 transition-colors"
        >
          🌱 ShopDrop — Pflanzenshop
        </h1>

        <div className="flex items-center gap-3">
          {/* Login/Logout Bereich */}
          {isLoggedIn ? (
            <>
              <span className="text-green-200 text-sm hidden sm:block">
                👤 {email}
              </span>
              <button
                onClick={() => setPage("profile")} // Hier: NUR die Seite wechseln!
                className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                👤 Profil
              </button>
              {/* Admin Button — nur wenn role admin */}
              {isAdmin && (
                <button
                  onClick={() => setPage("admin")}
                  className="text-sm bg-amber-600 hover:bg-amber-500 px-3 py-2 rounded-xl transition-colors"
                >
                  ⚙️ Admin
                </button>
              )}
              <button
                onClick={() => setPage("orders")}
                className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors"
              >
                {/* Meine Bestellungen Bereich */}
                📦 Bestellungen
              </button>
              <button
                onClick={() => {
                  logout();
                  setPage("home");
                }}
                className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              /* onClick={() => setPage("auth")} */
              onClick={() => navigate("/auth")}
              className="text-sm bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors"
            >
              Login
            </button>
          )}

          {/* Stelle sicher, dass dieser Block HIER steht, außerhalb der isLoggedIn-Abfrage */}
          {page === "home" && (
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
            >
              <span>🛒</span>
              {/* Wir animieren die Zahl */}
              <motion.span
                key={totalItems} // Wichtig: Bei jeder Änderung der Zahl wird die Animation neu getriggert
                initial={{ scale: 1.5, color: "#4ade80" }}
                animate={{ scale: 1, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="font-semibold"
              >
                {totalItems}
              </motion.span>
            </button>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          {/* 1. Die Startseite */}
          <Route path="/" element={<Home />} />

          {/* 2. Die neue Produktdetail-Seite */}
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* 3. Authentifizierung */}
          <Route
            path="/auth"
            element={
              <Auth
                onSuccess={() => {
                  setPage("home");
                  navigate("/");
                }}
              />
            }
          />

          {/* 4. Checkout & Erfolg */}
          <Route
            path="/checkout"
            element={
              <Checkout
                onSuccess={handleOrderSuccess}
                onBack={() => {
                  setPage("home");
                  navigate("/");
                }}
              />
            }
          />

          <Route
            path="/success"
            element={
              orderId ? (
                <OrderSuccess
                  orderId={orderId}
                  onBackToShop={() => {
                    setPage("home");
                    navigate("/");
                  }}
                />
              ) : (
                <Home />
              )
            }
          />

          {/* 5. Benutzerbereich */}
          <Route
            path="/orders"
            element={
              <Orders
                onBack={() => {
                  setPage("home");
                  navigate("/");
                }}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                onBack={() => {
                  setPage("home");
                  navigate("/");
                }}
              />
            }
          />

          {/* 6. Admin Bereich */}
          <Route
            path="/admin"
            element={
              <Admin
                onBack={() => {
                  setPage("home");
                  navigate("/");
                }}
              />
            }
          />
        </Routes>
      </main>
      {/* --- HIER BEGINN DIE FUSSZEILE --- */}
      <footer className="bg-white border-t border-green-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} David — ShopDrop Pflanzenshop. Alle
            Rechte vorbehalten. 🌱
          </p>
        </div>
      </footer>
      {/* ----------------------------------- */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false); // Warenkorb schließen
          setPage("checkout"); // Zur Kasse wechseln
        }}
      />
    </div>
  );
}

export default App;
