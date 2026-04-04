import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  stock: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  user_email: string;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token, isLoggedIn } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          fetch(`http://localhost:3001/products/${id}`),
          fetch(`http://localhost:3001/products/${id}/reviews`),
        ]);
        setProduct(await pRes.json());
        setReviews(await rRes.json());
      } catch (err) {
        console.error("Fehler beim Laden", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSendReview = async () => {
    if (!newComment.trim()) {
      setSubmitError("Bitte schreibe einen Kommentar!");
      return;
    }
    setSubmitError("");
    try {
      const res = await fetch(`http://localhost:3001/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Fehler beim Speichern");
        return;
      }
      setReviews([data, ...reviews]);
      setNewComment("");
      setNewRating(5);
      setSubmitMsg("✓ Bewertung gespeichert!");
      setTimeout(() => setSubmitMsg(""), 3000);
    } catch {
      setSubmitError("Fehler beim Speichern der Bewertung");
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Lade Pflanze... 🌱</p>
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Pflanze nicht gefunden 🌵</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-green-700 hover:text-green-900 font-medium"
      >
        ← Zurück zur Auswahl
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-md overflow-hidden p-8 mb-10">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-80 object-cover rounded-2xl"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-green-900 mb-2">{product.name}</h1>

          {avgRating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-400 text-lg">
                {"★".repeat(Math.round(Number(avgRating)))}
                {"☆".repeat(5 - Math.round(Number(avgRating)))}
              </span>
              <span className="text-gray-500 text-sm">
                {avgRating} / 5 ({reviews.length} Bewertungen)
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-green-600">
              {parseFloat(product.price).toFixed(2)} €
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              product.stock === 0
                ? "bg-red-100 text-red-700"
                : product.stock < 5
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}>
              {product.stock === 0 ? "Ausverkauft" : `${product.stock} auf Lager`}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
              added
                ? "bg-green-400 text-white"
                : product.stock === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {added ? "✓ Hinzugefügt!" : "🛒 In den Warenkorb"}
          </button>
        </div>
      </div>

      {/* Bewertungen */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-green-900 mb-6">
          Kundenbewertungen ✨
          {reviews.length > 0 && (
            <span className="text-base font-normal text-gray-400 ml-2">
              ({reviews.length})
            </span>
          )}
        </h2>

        {isLoggedIn ? (
          <div className="bg-green-50 p-6 rounded-2xl mb-8">
            <h3 className="font-semibold text-green-800 mb-4">Eigene Bewertung schreiben</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setNewRating(num)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    newRating >= num ? "text-amber-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Wie gefällt dir diese Pflanze?"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4 resize-none"
              rows={3}
            />
            {submitError && <p className="text-red-500 text-sm mb-3">{submitError}</p>}
            {submitMsg && <p className="text-green-600 text-sm mb-3">{submitMsg}</p>}
            <button
              onClick={handleSendReview}
              className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors"
            >
              Abschicken
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-xl text-gray-500 mb-8 text-center">
            <button
              onClick={() => navigate("/auth")}
              className="text-green-600 hover:text-green-800 underline"
            >
              Einloggen
            </button>{" "}
            um eine Bewertung zu schreiben.
          </div>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Noch keine Bewertungen — sei der Erste! 🌿
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-amber-400">
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(rev.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-gray-700 italic mb-1">"{rev.comment}"</p>
                <span className="text-xs text-gray-400">{rev.user_email}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
