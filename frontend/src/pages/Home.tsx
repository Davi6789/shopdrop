import { useEffect, useState } from "react";
import { getProducts } from "../api/client";
import type { Product } from "../types/index";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Alle", "Zimmerpflanzen", "Sukkulenten", "Blumen", "Zubehör"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Produkte konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Alle" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Pflanzen werden geladen... 🌱</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Suchfeld */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pflanze suchen..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Kategorie Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium transition-all text-sm ${
              selectedCategory === cat
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200"
            }`}
          >
            {cat === "Alle" && "🌿 "}
            {cat === "Zimmerpflanzen" && "🪴 "}
            {cat === "Sukkulenten" && "🌵 "}
            {cat === "Blumen" && "🌸 "}
            {cat === "Zubehör" && "🪣 "}
            {cat}
          </button>
        ))}
      </div>

      {/* Ergebnis Info */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          {selectedCategory === "Alle" ? "🌿 Unsere Pflanzen" : `${selectedCategory}`}
        </h1>
        <span className="text-sm text-gray-400">
          {filtered.length} {filtered.length === 1 ? "Pflanze" : "Pflanzen"}
        </span>
      </div>

      {/* Kein Ergebnis */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-4xl mb-3">🪴</p>
          <p className="text-gray-500">
            {searchQuery
              ? `Keine Pflanze namens "${searchQuery}" gefunden.`
              : `Keine Pflanzen in dieser Kategorie.`}
          </p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("Alle"); }}
            className="mt-4 text-green-600 hover:text-green-800 underline text-sm"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
