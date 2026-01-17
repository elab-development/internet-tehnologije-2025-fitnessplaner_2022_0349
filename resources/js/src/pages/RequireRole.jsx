import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api";

export default function RequireRole({ allow, children }) {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/me");
        const uloga = res.data?.uloga;

        // allow može biti npr. ["admin"] ili ["admin","trener"]
        setState({ loading: false, ok: allow.includes(uloga) });
      } catch {
        setState({ loading: false, ok: false });
      }
    };
    run();
  }, [allow]);

  if (state.loading) return <div style={{ padding: 20 }}>Provera pristupa...</div>;
  if (!state.ok) return <Navigate to="/redirect" replace />;
  return children;
}
