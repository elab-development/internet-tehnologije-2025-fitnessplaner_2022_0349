import React, { createContext, useContext, useState } from "react";

// inicijalizacija context-a
const AuthContext = createContext();

// provider koji obavija celu aplikaciju
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // login - čuvamo korisnika u state i localStorage
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  // logout - čistimo sve
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook da se koristi bilo gde u projektu
export const useAuth = () => {
  return useContext(AuthContext);
};