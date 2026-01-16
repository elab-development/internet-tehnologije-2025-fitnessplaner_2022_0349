import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ isAuthed, onLogoutClick }) {
  const { pathname } = useLocation();

  const linkStyle = (path) => ({
    background: pathname === path ? "rgba(37,99,235,0.08)" : "transparent",
    borderColor: pathname === path ? "#c7d2fe" : "transparent",
  });

  return (
    <div className="navbar">
      <div className="container">
        <div className="navInner">
          <div className="brand">Fitness planer</div>

          <div className="navLinks">
            {!isAuthed ? (
              <>
                <Link className="navLink" style={linkStyle("/")} to="/">
                  Prijava
                </Link>
                <Link className="navLink" style={linkStyle("/register")} to="/register">
                  Registracija
                </Link>
              </>
            ) : (
              <>
                <Link className="navLink" style={linkStyle("/")} to="/">
                  Home
                </Link>
                <Link className="navLink" style={linkStyle("/gallery")} to="/gallery">
                  Galerija
                </Link>
                <Link className="navLink" style={linkStyle("/contact")} to="/contact">
                  Kontakt
                </Link>

                <button className="navLink" onClick={onLogoutClick}>
                  Odjavi se
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
