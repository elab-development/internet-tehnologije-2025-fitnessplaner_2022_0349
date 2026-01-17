import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function RoleRedirect() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Učitavam profil...");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/me");
        const uloga = res.data?.uloga;

        // Ako backend vrati full user, sačuvaj ga (nije obavezno)
        localStorage.setItem("user", JSON.stringify(res.data));

        if (uloga === "admin") return navigate("/admin", { replace: true });
        if (uloga === "trener") return navigate("/trener", { replace: true });

        // default
        return navigate("/korisnik", { replace: true });
      } catch (e) {
        // token ne valja ili istekao
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMsg("Sesija je istekla. Preusmeravam na prijavu...");
        setTimeout(() => navigate("/", { replace: true }), 600);
      }
    };

    run();
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <p>{msg}</p>
    </div>
  );
}
