import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/register", formData);
      setMessage("Registracija uspešna! Sada se možete prijaviti.");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setMessage("Greška prilikom registracije.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1 className="auth-title">Registracija</h1>
        <p className="auth-subtitle">Kreiraj svoj Fitness planer nalog</p>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">Ime i prezime</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Unesi ime"
            className="auth-input"
          />

          <label className="auth-label">Email adresa</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            className="auth-input"
          />

          <label className="auth-label">Lozinka</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="auth-input"
          />

          <label className="auth-label">Potvrdite lozinku</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            placeholder="Ponovi lozinku"
            className="auth-input"
          />

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Registrujem..." : "Registruj se"}
          </button>
        </form>

        <div className="auth-linkrow">
          Već imaš nalog?{" "}
          <span className="auth-link" onClick={() => navigate("/")}>
            Prijavi se ovde
          </span>
        </div>
      </div>
    </div>
  );
}
