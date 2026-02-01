import React from 'react';
import './TrainerHome.css';

export default function TrainerHome() {
  // Poruke dana - različita poruka svaki dan u nedelji
  const motivationalQuotes = [
    "Uspeh je suma malih napora, ponovljenih iz dana u dan.",
    "Tvoje telo može sve - um je taj koji treba ubediti.",
    "Ne pitaj se šta možeš, nego šta ćeš danas postići!",
    "Svaki trening te čini jačim - fizički i mentalno.",
    "Bol koji osećaš danas biće snaga sutra.",
    "Nema skraćenica - rad je jedini put do uspeha.",
    "Prestani da sanjaš, počni da radiš!"
  ];

  const dayOfWeek = new Date().getDay();
  const dailyQuote = motivationalQuotes[dayOfWeek];

  return (
    <div className="trainer-container">
      
      {/* Dobrodošli Nazad Badge */}
      <div className="welcome-badge">
        <span className="badge-icon">✨</span>
        <span className="badge-text">DOBRODOŠLI NAZAD</span>
      </div>

      {/* Naslov */}
      <h1 className="main-title">Trener Panel</h1>
      <p className="subtitle">Upravljaj klijentima i vežbama, uredi njihove treninge i drži sve organizovano.</p>

      {/* Poruka Dana Kartica */}
      <div className="quote-card">
        <div className="quote-decoration-1"></div>
        <div className="quote-decoration-2"></div>
        
        <div className="quote-content">
          <h3 className="quote-label">💬 Poruka dana</h3>
          <p className="quote-text">"{dailyQuote}"</p>
        </div>
      </div>

      {/* Slika o Treningu */}
      <div className="training-card">
        <img 
          src="https://media.istockphoto.com/id/503393204/photo/dumbbells-and-yoga-mat-on-wood-table.jpg?s=2048x2048&w=is&k=20&c=3y5PE35tQytutps7nSf2W6dz1lq5vryGIvnDMi6HKGA=" 
          alt="Trening motivacija"
          className="training-image"
        />
        <div className="training-overlay">
          <div className="training-content">
            <h3 className="training-title">Fokusiraj se na kontinuitet</h3>
            <p className="training-text">
              Mali koraci svaki dan donose velike rezultate. Tvoja posvećenost je ključ uspeha! 💪
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}