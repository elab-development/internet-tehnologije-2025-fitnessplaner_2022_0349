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

  return (
    <div className="trainer-bg">
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

      <div className="trainer-container">
        <div className="trainer-hero">
          <div>
            <span className="trainer-heroBadge">✨ DOBRODOŠLI NAZAD</span>
            <h1 className="trainer-heroTitle">Trener panel</h1>
            <p className="trainer-heroText">
              Upravljaj klijentima, uredi njihove treninge i drži sve organizovano.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;

