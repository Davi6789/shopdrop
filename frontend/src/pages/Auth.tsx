// frontend/src/pages/Auth.tsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: Props) {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:3001/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Fehler aufgetreten");
        return;
      }

      login(data.token, data.email, data.role || "user");
      onSuccess();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-4xl">🌱</span>
          <h1 className="text-xl font-bold text-green-800 mt-2">ShopDrop</h1>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-green-50 p-1 mb-6">
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === "login"
                ? "bg-white text-green-800 shadow-sm"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === "register"
                ? "bg-white text-green-800 shadow-sm"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            Registrieren
          </button>
        </div>

        {/* Formular */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="antonio@email.de"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            {loading
              ? "Wird verarbeitet..."
              : mode === "login"
                ? "Einloggen"
                : "Registrieren"}
          </button>
        </div>
      </div>
    </div>
  );
}
