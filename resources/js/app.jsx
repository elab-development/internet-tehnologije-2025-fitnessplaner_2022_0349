import "./style.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./src/pages/Login";
import Register from "./src/pages/Register";

import RoleRedirect from "./src/pages/RoleRedirect";
import RequireRole from "./src/pages/RequireRole";

import UserHome from "./src/pages/UserHome";
import TrainerHome from "./src/pages/TrainerHome";
import AdminHome from "./src/pages/AdminHome";
import ClientTrainings from "./src/pages/ClientTrainings";
import ClientExercises from "./src/pages/ClientExercises";
import ClientHydration from "./src/pages/ClientHydration";

import Navbar from "./src/components/Navbar";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  return (
    <BrowserRouter>
      {!token ? (
        <Routes>
          <Route path="/" element={<Login onAuth={() => setToken(localStorage.getItem("token"))} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <>
          <Navbar onLogout={handleLogout} />

          <Routes>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/redirect" element={<RoleRedirect />} />

            {/* KLIJENT */}
            <Route path="/korisnik" element={<UserHome onLogout={handleLogout} />} />

            <Route
              path="/korisnik/treninzi"
              element={
                <RequireRole allow={["klijent"]}>
                  <ClientTrainings />
                </RequireRole>
              }
            />

            <Route
              path="/korisnik/vezbe"
              element={
                <RequireRole allow={["klijent"]}>
                  <ClientExercises />
                </RequireRole>
              }
            />
            <Route
            path="/korisnik/hidratacija"
            element={
              <RequireRole allow={["klijent"]}>
                <ClientHydration />
              </RequireRole>
            }
          />

            {/* TRENER */}
            <Route
              path="/trener"
              element={
                <RequireRole allow={["trener", "admin"]}>
                  <TrainerHome onLogout={handleLogout} />
                </RequireRole>
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <RequireRole allow={["admin"]}>
                  <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
                    <h2 style={{ color: "#1976d2", marginTop: 0 }}>Admin</h2>
                    <p style={{ fontWeight: 700, color: "#334155" }}>
                      Klikni gore u meniju na “Treneri” da vidiš spisak trenera.
                    </p>
                  </div>
                </RequireRole>
              }
            />

            <Route
              path="/admin/treneri"
              element={
                <RequireRole allow={["admin"]}>
                  <AdminHome />
                </RequireRole>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")).render(<App />);
