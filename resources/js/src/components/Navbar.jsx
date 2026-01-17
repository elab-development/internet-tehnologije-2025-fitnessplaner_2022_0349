import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [uloga, setUloga] = useState(null);

  useEffect(() => {
    api
      .get("/me")
      .then((res) => {
        setUloga(res.data?.uloga || null);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        onLogout?.();
        navigate("/", { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #cfe3fb",
    background: isActive ? "#1e88e5" : "#fff",
    color: isActive ? "#fff" : "#0f172a",
    fontWeight: 800,
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "#f7fbff",
        borderBottom: "1px solid #e6eef7",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 900, color: "#1976d2" }}>FitnessPlaner</span>

          {uloga === "admin" && (
            <>
              <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
              <NavLink to="/admin/treneri" style={linkStyle}>Treneri</NavLink>
            </>
          )}

          {uloga === "trener" && (
            <NavLink to="/trener" style={linkStyle}>Trener</NavLink>
          )}

          {uloga === "klijent" && (
            <NavLink to="/korisnik" style={linkStyle}>Korisnik</NavLink>
          )}
        </div>

        <button
          onClick={() => {
            onLogout?.();
            navigate("/", { replace: true });
          }}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #cfe3fb",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
