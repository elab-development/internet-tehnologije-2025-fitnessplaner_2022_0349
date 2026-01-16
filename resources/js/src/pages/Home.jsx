export default function Home({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user.name ? user.name.split(" ")[0] : "Korisniče";

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1 className="auth-title">Dobrodošao, {name}!</h1>
        <p className="auth-subtitle">
          Home je za sada prazna — bitno je da login/registracija rade.
        </p>

        <button
          onClick={() => {
            localStorage.clear();
            onLogout?.();
            window.location.href = "/";
          }}
          className="auth-btn"
        >
          Odjavi se
        </button>
      </div>
    </div>
  );
}
