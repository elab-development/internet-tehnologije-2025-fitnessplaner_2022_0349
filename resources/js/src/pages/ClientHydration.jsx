import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function ClientHydration() {
  const [hidratacije, setHidratacije] = useState([]);
  const [danas, setDanas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHidratacije();
  }, []);

  const fetchHidratacije = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hidratacije');
      setHidratacije(response.data);
      
      const danasnjiDatum = new Date().toISOString().split('T')[0];
      const danasnjiUnos = response.data.find(h => h.datum === danasnjiDatum);
      setDanas(danasnjiUnos);
      
      setLoading(false);
    } catch (err) {
      console.error('Greška pri učitavanju:', err);
      setError('Greška pri učitavању podataka');
      setLoading(false);
    }
  };

  const kreirajDanasnjiUnos = async () => {
    try {
      const response = await api.post('/hidratacije', {
        datum: new Date().toISOString().split('T')[0],
        cilj_ml: 2000,
        uneseno_ml: 0
      });
      setDanas(response.data);
      fetchHidratacije();
    } catch (err) {
      console.error('Greška pri kreiranju:', err);
      setError('Greška pri kreiranju unosa');
    }
  };

  const dodajVodu = async (kolicina) => {
    if (!danas) return;
    
    try {
      await api.put(`/hidratacije/${danas.id}`, {
        datum: danas.datum,
        cilj_ml: danas.cilj_ml,
        uneseno_ml: danas.uneseno_ml + kolicina
      });
      fetchHidratacije();
    } catch (err) {
      console.error('Greška pri ažuriranju:', err);
      setError('Greška pri dodavanju vode');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p>Učitavanje...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ color: '#1976d2', marginTop: 0 }}>💧 Hidratacija</h2>
      
      {error && (
        <div style={{ padding: 12, background: '#fee', border: '1px solid #fcc', borderRadius: 8, marginBottom: 16, color: '#c33' }}>
          {error}
        </div>
      )}

      {!danas ? (
        <div style={{ padding: 20, background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: 12, marginBottom: 24 }}>
          <p style={{ margin: '0 0 12px 0', fontWeight: 600 }}>Nemaš unos za danas.</p>
          <button
            onClick={kreirajDanasnjiUnos}
            style={{
              padding: '10px 16px',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Kreiraj današnji unos
          </button>
        </div>
      ) : (
        <div style={{ padding: 24, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ marginTop: 0, color: '#334155' }}>Danas ({danas.datum})</h3>
          <p style={{ margin: '8px 0', color: '#64748b' }}>
            Cilj: <strong style={{ color: '#1976d2' }}>{danas.cilj_ml}ml</strong>
          </p>
          <p style={{ margin: '8px 0 16px 0', color: '#64748b' }}>
            Uneseno: <strong style={{ color: '#1976d2' }}>{danas.uneseno_ml}ml</strong> ({Math.round((danas.uneseno_ml/danas.cilj_ml)*100)}%)
          </p>
          
          <div style={{ 
            height: 30, 
            background: '#e0e0e0', 
            borderRadius: 15, 
            overflow: 'hidden',
            marginBottom: 16 
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min((danas.uneseno_ml/danas.cilj_ml)*100, 100)}%`,
              background: 'linear-gradient(90deg, #42a5f5, #1976d2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              transition: 'width 0.3s ease'
            }}>
              {danas.uneseno_ml > 0 && `${danas.uneseno_ml}ml`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => dodajVodu(100)}
              style={{
                padding: '10px 16px',
                background: '#fff',
                color: '#1976d2',
                border: '2px solid #1976d2',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                flex: 1
              }}
            >
              +100ml
            </button>
            <button
              onClick={() => dodajVodu(250)}
              style={{
                padding: '10px 16px',
                background: '#1976d2',
                color: '#fff',
                border: '2px solid #1976d2',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                flex: 1
              }}
            >
              +250ml
            </button>
            <button
              onClick={() => dodajVodu(500)}
              style={{
                padding: '10px 16px',
                background: '#2e7d32',
                color: '#fff',
                border: '2px solid #2e7d32',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                flex: 1
              }}
            >
              +500ml
            </button>
          </div>
        </div>
      )}

      <h3 style={{ color: '#334155', marginBottom: 16 }}>Istorija</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {hidratacije.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>Nema unetih podataka.</p>
        ) : (
          hidratacije.slice(0, 7).map(h => (
            <div 
              key={h.id} 
              style={{ 
                padding: 16, 
                background: '#fff', 
                border: '1px solid #e0e0e0', 
                borderRadius: 12 
              }}
            >
              <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#334155' }}>{h.datum}</p>
              <p style={{ margin: '0 0 8px 0', fontSize: 14, color: '#64748b' }}>
                {h.uneseno_ml}/{h.cilj_ml}ml
              </p>
              <div style={{ 
                height: 10, 
                background: '#e0e0e0', 
                borderRadius: 5, 
                overflow: 'hidden' 
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min((h.uneseno_ml/h.cilj_ml)*100, 100)}%`,
                  background: '#42a5f5',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}