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
import ClientMeals from "./src/pages/ClientMeals";
import ClientMealsStats from "./src/pages/ClientMealsStats";


import AdminClients from "./src/pages/AdminClients";
import AdminAdmin from "./src/pages/AdminAdmin";

import TrainerExercises from "./src/pages/TrainerExercises";
import TrainerUsers from "./src/pages/TrainerUsers";

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
          <Route
            path="/"
            element={<Login onAuth={() => setToken(localStorage.getItem("token"))} />}
          />
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
            <Route
              path="/korisnik"
              element={
                <RequireRole allow={["klijent"]}>
                  <UserHome onLogout={handleLogout} />
                </RequireRole>
              }
            />

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

            <Route
            path="/korisnik/ishrana"
            element={
            <RequireRole allow={["klijent"]}>
              <ClientMeals />
            </RequireRole>
            }
          />

            <Route
              path="/korisnik/ishrana/statistika"
              element={
                <RequireRole allow={["klijent"]}>
                  <ClientMealsStats />
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

            <Route
              path="/trener/vezbe"
              element={
                <RequireRole allow={["trener", "admin"]}>
                  <TrainerExercises/>
                </RequireRole>
              }

            />
                  
            <Route
              path="/trener/users"
              element={
                <RequireRole allow={["trener"]}>
                  <TrainerUsers/>
                </RequireRole>
              }

            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <RequireRole allow={["admin"]}>
                  <AdminAdmin/>
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
              <Route
              path="/admin/users"
              element={
                <RequireRole allow={["admin"]}>
                  <AdminClients/>
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
