import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageCard from "../components/PageCard";

function AutoScrollTestimonials({ items, speed = 32 }) {
  const loop = useMemo(() => [...items, ...items], [items]);

  const wrap = {
    overflow: "hidden",
    borderRadius: 16,
    border: "1px solid #e6eef7",
    background: "#ffffff",
  };

  const track = {
    display: "flex",
    gap: 16,
    width: "max-content",
    animation: `scrollX ${speed}s linear infinite`,
    padding: "10px 10px",
  };

  const itemStyle = {
    width: 320,
    minHeight: 140,
    border: "1px solid #eef4fb",
    borderRadius: 16,
    padding: 16,
    background: "#f7fbff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  return (
    <>
      <style>{`
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .pause-on-hover:hover .track { animation-play-state: paused; }
      `}</style>

      <div style={wrap} className="pause-on-hover">
        <div className="track" style={track}>
          {loop.map((t, idx) => (
            <div key={idx} style={itemStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900, color: "#0f172a" }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{t.role}</div>
                </div>
                <div style={{ fontWeight: 900, color: "#1976d2" }}>{t.stars}</div>
              </div>
              <p style={{ margin: 0, color: "#0f172a", lineHeight: 1.45 }}>{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function UserHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user.name ? user.name.split(" ")[0] : "Korisniče";

  const hero = {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 18,
    alignItems: "stretch",
  };

  const heroLeft = {
    background: "linear-gradient(135deg, #e8f2ff, #ffffff)",
    border: "1px solid #e6eef7",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 10px 26px rgba(0,0,0,0.04)",
  };

  const heroRight = {
    borderRadius: 18,
    border: "1px solid #e6eef7",
    overflow: "hidden",
    minHeight: 260,
    background: "#ffffff",
  };

  const badge = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 800,
    fontSize: 12,
  };

  const h2 = { margin: "10px 0 8px", fontSize: 30, fontWeight: 900, color: "#0f172a" };
  const p = { margin: 0, color: "#334155", lineHeight: 1.55, fontSize: 14.5 };

  const ctaRow = { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 };

  const btnPrimary = {
    background: "#1976d2",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  };

  const btnGhost = {
    background: "white",
    color: "#0f172a",
    border: "1px solid #e6eef7",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  };

  const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 16 };

  const featureCard = {
    border: "1px solid #e6eef7",
    borderRadius: 18,
    padding: 16,
    background: "#ffffff",
    boxShadow: "0 8px 22px rgba(0,0,0,0.04)",
  };

  const sectionTitle = { margin: "22px 0 10px", fontSize: 18, fontWeight: 900, color: "#0f172a" };

  const testimonials = [
    { name: "Marija", role: "Klijent", stars: "★★★★★", text: "Najzad imam pregled treninga i ishrane na jednom mestu. Jednostavno i brzo." },
    { name: "Nikola", role: "Klijent", stars: "★★★★★", text: "Plan treninga mi je jasniji, a video vežbe pomažu za tehniku." },
    { name: "Ana", role: "Klijent", stars: "★★★★☆", text: "Praćenje hidratacije mi je promenilo navike. Super stvar." },
    { name: "Jovana", role: "Klijent", stars: "★★★★★", text: "Beleženje obroka i kalorija je praktično, pogotovo kad žurim." },
  ];

  // Motivacione poruke (menjaju se same)
  const messages = useMemo(
    () => [
      `Hej ${name}, doslednost pobeđuje motivaciju.`,
      "Mali koraci svaki dan daju velike rezultate.",
      "Ne traži savršen trening — traži kontinuitet.",
      "Zabeleži danas: trening, obrok, voda. To je napredak.",
    ],
    [name]
  );

  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 4500);
    return () => clearInterval(id);
  }, [messages.length]);

  // Slike (nema dupliranja)
  const imgHero =
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=60";
  const imgWorkout =
    "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1200&q=60";
  const imgFood =
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=60";

  return (
    <PageCard title="Fitness planer">
      <div style={hero}>
        <div style={heroLeft}>
          <div style={badge}>{messages[msgIdx]}</div>

          <h2 style={h2}>Planiraj trening, prati ishranu i drži kontinuitet.</h2>
          <p style={p}>
            Kreiraj treninge izborom vežbi, gledaj video demonstracije i vodi dnevnik ishrane (sastojci, kalorije) i hidratacije.
            Sve što ti treba za organizovan fitnes napredak.
          </p>

          <div style={ctaRow}>
            <button style={btnPrimary} onClick={() => navigate("/korisnik/treninzi")}>
              Moji treninzi
            </button>
            <button style={btnGhost} onClick={() => navigate("/korisnik/vezbe")}>
              Katalog vežbi
            </button>
          </div>

          <div style={grid3}>
            <div style={featureCard}>
              <div style={{ fontWeight: 900, color: "#0f172a" }}>Treninzi</div>
              <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.5, fontSize: 13.8 }}>
                Dodaj raspored, kreiraj trening i prati napredak po danima.
              </div>
            </div>

            <div style={featureCard}>
              <div style={{ fontWeight: 900, color: "#0f172a" }}>Vežbe + video</div>
              <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.5, fontSize: 13.8 }}>
                Izaberi vežbe i pogledaj demonstracije za pravilnu tehniku izvođenja.
              </div>
            </div>

            <div style={featureCard}>
              <div style={{ fontWeight: 900, color: "#0f172a" }}>Ishrana & voda</div>
              <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.5, fontSize: 13.8 }}>
                Beleži sastojke, kalorije i nivo hidriranosti tokom dana.
              </div>
            </div>
          </div>
        </div>

        <div style={heroRight}>
          <img src={imgHero} alt="Fitness" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>

      <div style={sectionTitle}>Inspiracija za danas</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ border: "1px solid #e6eef7", borderRadius: 18, overflow: "hidden", background: "#fff" }}>
          <img src={imgWorkout} alt="Trening" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, color: "#0f172a" }}>Trening fokus</div>
            <div style={{ marginTop: 8, color: "#475569", fontSize: 13.8, lineHeight: 1.5 }}>
              Izaberi trening, uradi ga kako treba i upiši šta si odradio. Sistem radi za tebe.
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #e6eef7", borderRadius: 18, overflow: "hidden", background: "#fff" }}>
          <img src={imgFood} alt="Zdrava hrana" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, color: "#0f172a" }}>Ishrana fokus</div>
            <div style={{ marginTop: 8, color: "#475569", fontSize: 13.8, lineHeight: 1.5 }}>
              Beleži obroke i kalorije i prati hidrataciju. Rezultat dolazi iz rutine.
            </div>
          </div>
        </div>
      </div>

      <div style={sectionTitle}>Šta korisnici kažu</div>
      <AutoScrollTestimonials items={testimonials} speed={34} />
    </PageCard>
  );
}
