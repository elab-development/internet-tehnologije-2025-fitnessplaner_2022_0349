export default function AdminAdmin() {
  return (
    <>
    <div
      style={{
        padding: 24,
        maxWidth: 1600,
        marginBottom: 30,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 18,
        border: "1px solid #e6eef7",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#1976d2", fontWeight: 900, marginBottom: 20 }}>
         Admin panel
      </h2>

      <p style={{ fontWeight: 700, color: "#334155", marginBottom: 12 }}>
        Dobrodošli u administratorski deo aplikacije.
      </p>

      

      <p style={{ marginTop: 16, color: "#475569", fontWeight: 600 }}>
        Koristite meni iznad za navigaciju kroz admin funkcionalnosti.
      </p>
      
    </div>



<div style={{ display: "grid", gap: 20, marginTop: 20,marginBottom: 30 }}>
  <div style={{ flex: 1, padding: 20, backgroundColor: "hsl(206, 82%, 89%)", borderRadius: 8 }}>
    <h3>Ukupno korisnika</h3>
    <p style={{ fontSize: 32, fontWeight: "bold" }}>35</p>
  </div>
  <div style={{ flex: 1, padding: 20, backgroundColor: "white", borderRadius: 8 }}>
    <h3>Aktivni treneri</h3>
    <p style={{ fontSize: 32, fontWeight: "bold" }}>3</p>
  </div>
</div>


<div style={{ display: "flex", gap: 40, marginTop: 20 }}>
  <div style={{ flex: 1, padding: 20, backgroundColor: "hsl(206, 82%, 89%)", borderRadius: 8 }}>
    <img 
      src="https://plus.unsplash.com/premium_photo-1746192629748-df428e96a3e0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
      alt="Korisnici"
      style={{ 
        width: 400, 
        height: 320, 
        marginBottom: 15,
        borderRadius: "30%" 
      }}
    />
    <h3>Zadovoljni korisnici</h3>
   
  </div>
  <div style={{ flex: 1, padding: 20, backgroundColor: "hsl(206, 82%, 89%)", borderRadius: 8 }}>
     <img 
      src="https://images.unsplash.com/photo-1758875569286-109f63a93a8f?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
      alt="Korisnici"
      style={{ 
        width: 400, 
        height: 320, 
        marginBottom: 15,
        borderRadius: "30%" 
      }}
    />
    <h3>Treneri i njihov rad</h3>

  </div>
</div>


</>
  );
}
