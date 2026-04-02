// frontend/src/pages/Profile.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onBack: () => void;
}

interface UserProfile {
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  created_at: string;
}

export default function Profile({ onBack }: Props) {
  const { token, email } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Deutschland');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [addressMsg, setAddressMsg] = useState('');
  const [addressError, setAddressError] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setStreet(data.street || '');
        setCity(data.city || '');
        setZip(data.zip || '');
        setCountry(data.country || 'Deutschland');
      });
  }, [token]);

  const saveAddress = async () => {
    setAddressMsg('');
    setAddressError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ street, city, zip, country }),
      });
      const data = await res.json();
      if (!res.ok) setAddressError(data.error);
      else setAddressMsg('✓ Adresse gespeichert');
    } catch {
      setAddressError('Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Neue Passwörter stimmen nicht überein');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error);
      } else {
        setPasswordMsg('✓ Passwort erfolgreich geändert');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordError('Fehler beim Ändern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="text-green-700 hover:text-green-900 mb-6 flex items-center gap-1"
      >
        ← Zurück zum Shop
      </button>

      <h1 className="text-2xl font-bold text-green-800 mb-2">👤 Mein Profil</h1>
      <p className="text-gray-400 text-sm mb-8">
        Mitglied seit {profile ? new Date(profile.created_at).toLocaleDateString('de-DE', {
          day: '2-digit', month: 'long', year: 'numeric'
        }) : '...'}
      </p>

      <div className="space-y-6">

        {/* Email */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-green-900 text-lg mb-4">📧 Email</h2>
          <p className="text-gray-600 bg-gray-50 rounded-xl px-4 py-3">{email}</p>
        </div>

        {/* Adresse */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-green-900 text-lg mb-4">📍 Lieferadresse</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Straße und Hausnummer</label>
              <input
                type="text"
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="Musterstraße 1"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">PLZ</label>
                <input
                  type="text"
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                  placeholder="10115"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Stadt</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Berlin"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Land</label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Deutschland"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
            {addressMsg && <p className="text-green-600 text-sm">{addressMsg}</p>}

            <button
              onClick={saveAddress}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 rounded-xl font-semibold transition-colors"
            >
              Adresse speichern
            </button>
          </div>
        </div>

        {/* Passwort */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-green-900 text-lg mb-4">🔒 Passwort ändern</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Aktuelles Passwort</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Neues Passwort</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Neues Passwort bestätigen</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {passwordMsg && <p className="text-green-600 text-sm">{passwordMsg}</p>}

            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 rounded-xl font-semibold transition-colors"
            >
              Passwort ändern
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}