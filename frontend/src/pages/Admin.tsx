// frontend/src/pages/Admin.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion"; // Korrekter Import motion

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  stock: number;
}

interface Props {
  onBack: () => void;
}

export default function Admin({ onBack }: Props) {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [saveMsg, setSaveMsg] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    stock: 0,
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch("http://localhost:3001/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Produkte konnten nicht geladen werden"))
      .finally(() => setLoading(false));
  }, [token]);

  const startEdit = (product: Product) => {
    setEditId(product.id);
    setEditData({ ...product });
    setSaveMsg("");
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/admin/products/${editId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(editData),
        },
      );
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === editId ? updated : p)));
      setEditId(null);
      setSaveMsg("✓ Gespeichert");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch {
      setError("Fehler beim Speichern");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Produkt wirklich löschen?")) return;
    try {
      await fetch(`http://localhost:3001/admin/products/${id}`, {
        method: "DELETE",
        headers,
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Fehler beim Löschen");
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      setError("Name und Preis sind erforderlich");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/admin/products", {
        method: "POST",
        headers,
        body: JSON.stringify(newProduct),
      });
      const created = await res.json();
      setProducts((prev) => [...prev, created]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image_url: "",
        stock: 0,
      });
      setShowAddForm(false);
      setSaveMsg("✓ Produkt hinzugefügt");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch {
      setError("Fehler beim Hinzufügen");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Lade Admin-Bereich... 🌱</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="text-green-700 hover:text-green-900 mb-6 flex items-center gap-1"
      >
        ← Zurück zum Shop
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-800">
          ⚙️ Admin — Produktverwaltung
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
        >
          {showAddForm ? "✕ Abbrechen" : "+ Produkt hinzufügen"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {saveMsg && (
        <p className="text-green-600 mb-4 font-semibold">{saveMsg}</p>
      )}

      {/* Neues Produkt Formular */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6 overflow-hidden"
          >
            <h2 className="font-semibold text-green-900 text-lg mb-4">
              Neues Produkt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Produktname"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Preis (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="9.99"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Lagerbestand
                </label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Bild URL
                </label>
                <input
                  type="text"
                  value={newProduct.image_url}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image_url: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  placeholder="Kurze Beschreibung..."
                />
              </div>
            </div>
            <button
              onClick={addProduct}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
            >
              Produkt speichern
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation für die Tabelle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-md overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-900">
            <tr>
              <th className="text-left px-4 py-3">Produkt</th>
              <th className="text-right px-4 py-3">Preis</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="text-right px-4 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-green-50 transition-colors"
              >
                {editId === product.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        value={editData.name || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <input
                        value={editData.description || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={editData.price || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, price: e.target.value })
                        }
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        value={editData.stock ?? 0}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            stock: parseInt(e.target.value),
                          })
                        }
                        className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-800 font-semibold mr-2"
                      >
                        ✓ Speichern
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-green-900">
                            {product.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {product.description?.slice(0, 40)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-green-700">
                      {parseFloat(product.price).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.stock === 0
                            ? "bg-red-100 text-red-700"
                            : product.stock < 5
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock} auf Lager
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(product)}
                        className="text-blue-500 hover:text-blue-700 mr-3 text-xs font-semibold"
                      >
                        ✏️ Bearbeiten
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold"
                      >
                        🗑 Löschen
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
