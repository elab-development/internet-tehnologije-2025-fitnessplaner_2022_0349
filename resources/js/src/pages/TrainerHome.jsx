import React, { useState } from 'react';
import './TrainerHome.css';  // ← ovde importuj CS

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
              Tii im pripremaš kvalitetan katalog i plan.
            </p>
            
            <div className="trainer-heroActions">
              <button className="trainer-btn primary">+ Dodaj klijenta</button>
              <button className="trainer-btn">+ Novi trening</button>
              <button className="trainer-btn">+ Nova vežba</button>
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

         
              

          

        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;