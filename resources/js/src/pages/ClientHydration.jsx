import React, { useEffect, useState } from 'react';
import { api } from '../api';
import './ClientHydration.css';

export default function ClientHydration() {
  const [hidratacije, setHidratacije] = useState([]);
  const [danas, setDanas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHidratacije();
  }, []);

  // 📅 FORMAT DATUMA (HELPER)
  const formatDatum = (date) => {
    return new Date(date).toLocaleDateString('bs-BA', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // 📡 FETCH
  const fetchHidratacije = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get('/hidratacije');
      setHidratacije(res.data);

      const todayEntry = res.data.find(h => {
  const d = new Date(h.datum).toISOString().split('T')[0];
  return d === today;
});

      setDanas(todayEntry || null);
    } catch {
      setError('Greška pri učitavanju hidratacije');
    } finally {
      setLoading(false);
    }
  };

  // ➕ KREIRAJ DAN
 const kreirajDanasnjiUnos = async () => {
  try {
    setIsSaving(true);
    setError(null);

    const res = await api.post('/hidratacije', {
      datum: today,
      cilj_ml: 2000,
      uneseno_ml: 0
    });

    // odmah prikaži današnji unos
    setDanas(res.data);

  } catch (e) {
    if (e.response?.status === 409) {
      // već postoji → povuci postojeći unos
      const res = await api.get('/hidratacije');

      const todayEntry = res.data.find(h => {
        const d = new Date(h.datum).toISOString().split('T')[0];
        return d === today;
      });

      setDanas(todayEntry || null);
    } else {
      setError('Greška pri kreiranju unosa');
    }
  } finally {
    setIsSaving(false);
  }
};

  // 💧 DODAJ VODU
  const dodajVodu = async (kolicina) => {
    if (!danas) return;

    try {
      setError(null);

      await api.put(`/hidratacije/${danas.id}`, {
        ...danas,
        uneseno_ml: danas.uneseno_ml + kolicina
      });

      fetchHidratacije();
    } catch {
      setError('Greška pri dodavanju vode');
    }
  };

  if (loading) {
    return <p style={{ padding: 30 }}>Učitavanje...</p>;
  }

  // 📊 PROGRES
  const progress = danas
    ? Math.min((danas.uneseno_ml / danas.cilj_ml) * 100, 100)
    : 0;

  // 🧠 PORUKE
  const message =
    progress >= 100 ? '🎉 Bravo! Cilj ispunjen!'
    : progress >= 75 ? '💪 Još malo!'
    : progress >= 40 ? '🚰 Dobar tempo'
    : '🥤 Vrijeme je za vodu';

  return (
    <div className="hydration-container">
      <h1>💧 Hidratacija</h1>

      {error && <div className="hydration-error">{error}</div>}

      {!danas ? (
        <div className="hydration-empty">
          <p>Nema unosa za danas</p>
          <button type="button" onClick={kreirajDanasnjiUnos} disabled={isSaving}>
            {isSaving ? 'Kreiram...' : 'Kreiraj unos'}
          </button>
        </div>
      ) : (
        <div className="hydration-card">
          {/* 📅 DATUM */}
          <p className="date">{formatDatum(danas.datum)}</p>

          {/* 💧 ČAŠA */}
          <div className="glass-wrapper">
            <div className="glass">
              <div
                className="water"
                style={{ height: `${progress}%` }}
              />
            </div>
            <span className="percent">{Math.round(progress)}%</span>
          </div>

          {/* 📊 PODACI */}
          <p className="amount">
            <strong>{danas.uneseno_ml} ml</strong> / {danas.cilj_ml} ml
          </p>

          <p className="message">{message}</p>

          {/* ➕ AKCIJE */}
          <div className="hydration-actions">
  <button type="button" onClick={() => dodajVodu(100)}>+100 ml</button>
  <button type="button" className="primary" onClick={() => dodajVodu(250)}>+250 ml</button>
  <button type="button" className="success" onClick={() => dodajVodu(500)}>+500 ml</button>
</div>

        </div>
      )}
    </div>
  );
}
