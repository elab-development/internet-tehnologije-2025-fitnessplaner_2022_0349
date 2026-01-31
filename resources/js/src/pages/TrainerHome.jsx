import React, { useState } from 'react';
import './TrainerHome.css';


const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('treninzi');
  const [checkedItems, setCheckedItems] = useState([true, true, false, false]);

  const toggleCheck = (index) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  const treninzi = [
    { naziv: 'Upper A • Ana Mijić', izmenjeno: 'danas' },
    { naziv: 'Lower A • Marko Marković', izmenjeno: 'juče' },
    { naziv: 'Full Body • Test Korisnik', izmenjeno: 'pre 3 dana' }
  ];

  const vezbe = [
    { naziv: 'Bench Press', grupa: 'Grudi', tip: 'Compound', oprema: 'Barbell' },
    { naziv: 'Squat', grupa: 'Noge', tip: 'Compound', oprema: 'Barbell' },
    { naziv: 'Deadlift', grupa: 'Leđa', tip: 'Compound', oprema: 'Barbell' }
  ];

  const checklistItems = [
    'Kreiraj kategorije vežbi',
    'Dodaj tagove za lakše pretraživanje',
    'Grupiši treninge po tipu (Push/Pull/Legs)',
    'Postavi šablone za brže kreiranje'
  ];

  return (
    <div className="trainer-bg">
      {/* TOPBAR */}
      <div className="trainer-topbar">
        <div className="trainer-brand">
          <div className="trainer-brandTitle">FitnessPlaner</div>
          <div className="trainer-pill">TRENER</div>
        </div>
        
        <div className="trainer-tabs">
          <div 
            className={`trainer-tab ${activeTab === 'klijenti' ? 'active' : ''}`}
            onClick={() => setActiveTab('klijenti')}
          >
            Moji klijenti
          </div>
          <div 
            className={`trainer-tab ${activeTab === 'treninzi' ? 'active' : ''}`}
            onClick={() => setActiveTab('treninzi')}
          >
            Treninzi
          </div>
          <div 
            className={`trainer-tab ${activeTab === 'katalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('katalog')}
          >
            Katalog vežbi
          </div>
        </div>
        
        <div className="trainer-right">
          <div className="trainer-user">
            <div className="trainer-avatar">TK</div>
            <div className="trainer-userMeta">
              <div className="trainer-userName">Trener Korisnik</div>
              <div className="trainer-userRole">Personal Trainer</div>
            </div>
          </div>
          <button className="trainer-logout">Logout</button>
        </div>
      </div>

      {/* CONTAINER */}
      <div className="trainer-container">
        
        {/* HERO SECTION */}
        <div className="trainer-hero">
          <div>
            <span className="trainer-heroBadge">✨ DOBRODOŠLI NAZAD</span>
            <h1 className="trainer-heroTitle">Trener panel</h1>
            <p className="trainer-heroText">
              Upravljaj klijentima, uredi njihove treninge i drži sve organizovano. 
              Poenta: korisnici kreiraju lične treninge izborom vežbi — ti im pripremaš kvalitetan katalog i plan.
            </p>
            
            <div className="trainer-heroActions">
              <button className="trainer-btn primary">+ Dodaj klijenta</button>
              <button className="trainer-btn">+ Novi trening</button>
              <button className="trainer-btn">+ Nova vežba</button>
            </div>
            
            <div className="trainer-stats">
              <div className="trainer-stat">
                <div className="trainer-statLabel">Klijenata</div>
                <div className="trainer-statValue">3</div>
              </div>
              <div className="trainer-stat">
                <div className="trainer-statLabel">Aktivnih</div>
                <div className="trainer-statValue">2</div>
              </div>
              <div className="trainer-stat">
                <div className="trainer-statLabel">Treninga</div>
                <div className="trainer-statValue">3</div>
              </div>
            </div>
          </div>
          
          <div className="trainer-heroImage">
            <div className="trainer-heroImageInner">
              <div className="trainer-miniCard">
                <div className="trainer-miniTitle">⚡ Brze akcije</div>
                <p className="trainer-note">Dodaj novog klijenta ili kreiraj custom trening plan</p>
                <button className="trainer-miniBtn">Dodaj klijenta</button>
                <button className="trainer-miniBtn">Kreiraj plan</button>
              </div>
            </div>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="trainer-grid">
          
          {/* TRENINZI CARD */}
          <div className="trainer-card">
            <div className="trainer-cardHeader">
              <div>
                <div className="trainer-cardTitle">💪 Treninzi</div>
                <div className="trainer-cardSub">Šabloni i treninzi po klijentima</div>
              </div>
            </div>
            <div className="trainer-cardBody">
              <div className="trainer-list">
                {treninzi.map((trening, index) => (
                  <div key={index} className="trainer-row">
                    <div className="trainer-rowLeft">{trening.naziv}</div>
                    <div className="trainer-rowRight">
                      <span className="trainer-rowMeta">izmenjeno: {trening.izmenjeno}</span>
                      <button className="trainer-rowBtn">Uredi</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="trainer-btn primary" style={{ width: '100%', marginTop: '16px' }}>
                + Dodaj trening
              </button>
            </div>
          </div>

          {/* KATALOG VEŽBI CARD */}
          <div className="trainer-card">
            <div className="trainer-cardHeader">
              <div>
                <div className="trainer-cardTitle">📚 Katalog vežbi</div>
                <div className="trainer-cardSub">12 dostupnih vežbi</div>
              </div>
            </div>
            <div className="trainer-cardBody">
              <div className="trainer-search">
                <input type="text" className="trainer-input" placeholder="🔍 Pretraži vežbe..." />
                <button className="trainer-btn">Filter</button>
              </div>
              
              <div className="trainer-table">
                <div className="trainer-th">Naziv</div>
                <div className="trainer-th">Grupa</div>
                <div className="trainer-th">Tip</div>
                <div className="trainer-th">Oprema</div>
                <div className="trainer-th">Akcije</div>
                
                {vezbe.map((vezba, index) => (
                  <React.Fragment key={index}>
                    <div className="trainer-td">{vezba.naziv}</div>
                    <div className="trainer-td">{vezba.grupa}</div>
                    <div className="trainer-td">{vezba.tip}</div>
                    <div className="trainer-td">{vezba.oprema}</div>
                    <div className="trainer-td">
                      <button className="trainer-rowBtn">Uredi</button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* KAKO DA BUDE PREGLEDNIJE CARD */}
          <div className="trainer-card">
            <div className="trainer-cardHeader">
              <div>
                <div className="trainer-cardTitle">📋 Kako da bude preglednije</div>
                <div className="trainer-cardSub">Saveti za organizaciju</div>
              </div>
            </div>
            <div className="trainer-cardBody">
              <div className="trainer-checklist">
                {checklistItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="trainer-check"
                    onClick={() => toggleCheck(index)}
                  >
                    <div className={`trainer-dot ${checkedItems[index] ? 'done' : ''}`}></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NAPOMENE CARD */}
          <div className="trainer-card">
            <div className="trainer-cardHeader">
              <div>
                <div className="trainer-cardTitle">⚠️ Da se ne pogubite kasnije</div>
                <div className="trainer-cardSub">Važne napomene</div>
              </div>
            </div>
            <div className="trainer-cardBody">
              <ul className="trainer-bullets">
                <li>Trening pripada klijentu (`user_id`) i ima listu vežbi (pivot).</li>
                <li>Trener pravi trening kroz editor: dodaj vežbu → setovi/ponavljanja/odmor.</li>
                <li>Korisnik može da "kopira" trening i prilagodi sebi (vaša poenta).</li>
              </ul>
              
              <div style={{ 
                marginTop: '16px', 
                padding: '16px', 
                background: 'linear-gradient(135deg, #fef3f8 0%, #eef2ff 100%)', 
                borderRadius: '14px', 
                border: '2px solid rgba(99, 102, 241, 0.2)' 
              }}>
                <p className="trainer-note" style={{ margin: 0 }}>
                  💡 <strong>Pro tip:</strong> Koristi šablone za standardne treninge (Upper/Lower/PPL) i prilagodi ih svakom klijentu pojedinačno!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;