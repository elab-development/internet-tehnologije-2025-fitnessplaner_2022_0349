import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onAuth }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onAuth?.();         // <- odmah osveži token u App.jsx
      navigate("/");      // <- ide na Home jer token postoji
    } catch (err) {
      setMessage("Neispravni podaci za prijavu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h1 className="auth-title">Prijava</h1>
        <p className="auth-subtitle">
          Dobrodošli u <span>Fitness planer</span>
        </p>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Prijavljujem..." : "Prijavi se"}
          </button>
        </form>

        <div className="auth-linkrow">
          Nemaš nalog?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>
            Registruj se ovde
          </span>
        </div>
      </div>
    </div>
  );
}
