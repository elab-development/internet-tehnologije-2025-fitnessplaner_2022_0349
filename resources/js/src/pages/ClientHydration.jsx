import React, { useEffect, useState } from 'react';
import { api } from '../api';
import './ClientHydration.css';

export default function ClientHydration() {
  const [hidratacije, setHidratacije] = useState([]);
  const [danas, setDanas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [noviCilj, setNoviCilj] = useState(2000);
  const [showStats, setShowStats] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHidratacije();
  }, []);

  const formatDatum = (date) =>
    new Date(date).toLocaleDateString('bs-BA', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const fetchHidratacije = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/hidratacije');
      setHidratacije(res.data);
      const danasnji = res.data.find((h) => {
        const d = new Date(h.datum).toISOString().split('T')[0];
        return d === today;
      });
      setDanas(danasnji || null);
    } catch {
      setError('Greška pri učitavanju hidratacije');
    } finally {
      setLoading(false);
    }
  };

  const kreirajDanasnjiUnos = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const res = await api.post('/hidratacije', {
        datum: today,
        cilj_ml: 2000,
        uneseno_ml: 0,
      });
      setDanas(res.data);
    } catch (e) {
      if (e.response?.status === 409) fetchHidratacije();
      else setError('Greška pri kreiranju unosa');
    } finally {
      setIsSaving(false);
    }
  };

  const dodajVodu = async (kolicina) => {
    if (!danas) return;
    try {
      await api.put(`/hidratacije/${danas.id}`, {
        ...danas,
        uneseno_ml: danas.uneseno_ml + kolicina,
      });
      fetchHidratacije();
    } catch {
      setError('Greška pri dodavanju vode');
    }
  };

  const promijeniCilj = async () => {
    if (!danas || noviCilj < 500 || noviCilj > 5000) {
      setError('Cilj mora biti između 500 i 5000 ml');
      return;
    }
    try {
      await api.put(`/hidratacije/${danas.id}`, {
        ...danas,
        cilj_ml: noviCilj,
      });
      setShowGoalInput(false);
      fetchHidratacije();
    } catch {
      setError('Greška pri promjeni cilja');
    }
  };

  const resetujUnos = async () => {
    if (!danas || !window.confirm('Da li si siguran da želiš resetovati današnji unos?')) return;
    try {
      await api.put(`/hidratacije/${danas.id}`, {
        ...danas,
        uneseno_ml: 0,
      });
      fetchHidratacije();
    } catch {
      setError('Greška pri resetovanju unosa');
    }
  };

  if (loading) {
    return (
      <div className="hydration-container">
        <div className="loading-wrapper">
          <div className="water-drop-loader"></div>
          <p>Učitavanje...</p>
        </div>
      </div>
    );
  }

  const progress = danas ? Math.min((danas.uneseno_ml / danas.cilj_ml) * 100, 100) : 0;
  const preostalo = danas ? Math.max(danas.cilj_ml - danas.uneseno_ml, 0) : 0;
  
  const message =
    progress >= 100 ? '🎉 Bravo! Cilj ispunjen!' :
    progress >= 75 ? '💪 Još malo!' :
    progress >= 40 ? '🚰 Dobar tempo' :
    '🥤 Vrijeme je za vodu';

  // 📈 Statistika
  const ukupnoUneseno = hidratacije.reduce((sum, h) => sum + h.uneseno_ml, 0);
  const prosjek = hidratacije.length ? Math.round(ukupnoUneseno / hidratacije.length) : 0;
  const max = Math.max(...hidratacije.map(h => h.uneseno_ml || 0));
  const daniSaCiljem = hidratacije.filter(h => h.uneseno_ml >= h.cilj_ml).length;

  return (
    <div className="hydration-container">
      <div className="hydration-header">
        <h1>💧 Hidratacija Tracker</h1>
        <p className="subtitle">Prati svoj dnevni unos vode</p>
      </div>

      {error && (
        <div className="hydration-error">
          <span className="error-icon">⚠️</span>
          {error}
          <button className="error-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {!danas ? (
        <div className="hydration-empty">
          <div className="empty-animation">
            <div className="water-drop"></div>
            <div className="water-drop delay-1"></div>
            <div className="water-drop delay-2"></div>
          </div>
          <h2>Nema unosa za danas</h2>
          <p>Započni praćenje hidratacije i postani zdraviji! 💪</p>
          <button className="btn-create" onClick={kreirajDanasnjiUnos} disabled={isSaving}>
            {isSaving ? '⏳ Kreiram...' : '✨ Započni danas'}
          </button>
        </div>
      ) : (
        <>
          <div className="hydration-card">
            <div className="card-header">
              <p className="date">📅 {formatDatum(danas.datum)}</p>
              <div className="streak-badge">
                <span className="streak-icon">🔥</span>
                <span className="streak-count">{hidratacije.length}</span>
              </div>
            </div>

            {/* Animirana čaša */}
            <div className="glass-wrapper">
              <div className="glass">
                <div className="water animated" style={{ height: `${progress}%` }}>
                  <div className="water-shine"></div>
                  <div className="bubbles">
                    <span className="bubble"></span>
                    <span className="bubble"></span>
                    <span className="bubble"></span>
                  </div>
                </div>
                <div className="glass-glare"></div>
              </div>
              <span className="percent">{Math.round(progress)}%</span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-modern">
              <div className="progress-fill-modern" style={{ width: `${progress}%` }}>
                <div className="progress-shine"></div>
              </div>
            </div>

            {/* Info boxes */}
            <div className="info-grid">
              <div className="info-box primary">
                <div className="info-icon">💧</div>
                <div className="info-content">
                  <span className="info-label">Unos</span>
                  <span className="info-value">{danas.uneseno_ml} ml</span>
                </div>
              </div>
              <div className="info-box secondary">
                <div className="info-icon">🎯</div>
                <div className="info-content">
                  <span className="info-label">Cilj</span>
                  <span className="info-value">{danas.cilj_ml} ml</span>
                </div>
              </div>
              <div className="info-box accent">
                <div className="info-icon">⏳</div>
                <div className="info-content">
                  <span className="info-label">Preostalo</span>
                  <span className="info-value">{preostalo} ml</span>
                </div>
              </div>
            </div>

            <p className="message">{message}</p>

            {/* Akcije */}
            <div className="hydration-actions">
              <button className="btn-water small" onClick={() => dodajVodu(100)}>
                <span className="btn-icon">💧</span>
                <span className="btn-text">100 ml</span>
              </button>
              <button className="btn-water medium" onClick={() => dodajVodu(250)}>
                <span className="btn-icon">🥤</span>
                <span className="btn-text">250 ml</span>
              </button>
              <button className="btn-water large" onClick={() => dodajVodu(500)}>
                <span className="btn-icon">🍶</span>
                <span className="btn-text">500 ml</span>
              </button>
            </div>

            {/* Postavke */}
            <div className="settings">
              <button className="settings-btn" onClick={() => setShowGoalInput(v => !v)}>
                <span>🎯</span> Promijeni cilj
              </button>
              <button className="settings-btn danger" onClick={resetujUnos}>
                <span>🔄</span> Resetuj unos
              </button>
            </div>

            {/* Goal editor */}
            {showGoalInput && (
              <div className="goal-editor">
                <div className="goal-input-wrapper">
                  <label>Novi cilj (ml)</label>
                  <input
                    type="number"
                    value={noviCilj}
                    onChange={(e) => setNoviCilj(Number(e.target.value))}
                    min="500"
                    max="5000"
                    step="100"
                  />
                </div>
                <div className="goal-actions">
                  <button className="btn-save" onClick={promijeniCilj}>
                    ✓ Sačuvaj
                  </button>
                  <button className="btn-cancel" onClick={() => setShowGoalInput(false)}>
                    × Otkaži
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Statistika */}
          {hidratacije.length > 1 && (
            <div className="stats-section">
              <button 
                className="stats-toggle"
                onClick={() => setShowStats(!showStats)}
              >
                <span>📊 Statistika</span>
                <span className="toggle-arrow">{showStats ? '▲' : '▼'}</span>
              </button>

              {showStats && (
                <div className="hydration-summary">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📅</div>
                      <div className="stat-info">
                        <span className="stat-value">{hidratacije.length}</span>
                        <span className="stat-label">Ukupno dana</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💧</div>
                      <div className="stat-info">
                        <span className="stat-value">{prosjek} ml</span>
                        <span className="stat-label">Prosječno</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🏆</div>
                      <div className="stat-info">
                        <span className="stat-value">{max} ml</span>
                        <span className="stat-label">Najbolji dan</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🎯</div>
                      <div className="stat-info">
                        <span className="stat-value">{daniSaCiljem}</span>
                        <span className="stat-label">Ispunjeni ciljevi</span>
                      </div>
                    </div>
                  </div>

                  <div className="success-rate">
                    <div className="success-bar">
                      <div 
                        className="success-fill" 
                        style={{ width: `${hidratacije.length ? (daniSaCiljem / hidratacije.length * 100) : 0}%` }}
                      ></div>
                    </div>
                    <p className="success-text">
                      Stopa uspjeha: <strong>{hidratacije.length ? Math.round(daniSaCiljem / hidratacije.length * 100) : 0}%</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}