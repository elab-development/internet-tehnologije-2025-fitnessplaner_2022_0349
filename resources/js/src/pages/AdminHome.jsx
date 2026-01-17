import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

export default function AdminHome() {
  const [mode, setMode] = useState("list"); // list | add | edit
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [treneri, setTreneri] = useState([]);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.get("/admin/users?uloga=trener");
      setTreneri(res.data || []);
    } catch {
      setMsg("Greška pri učitavanju trenera.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return treneri;
    return treneri.filter((t) => `${t.name} ${t.email}`.toLowerCase().includes(s));
  }, [q, treneri]);

  const resetForm = () => {
    setForm({ name: "", email: "", password: "" });
    setEditId(null);
  };

  const startAdd = () => {
    resetForm();
    setMode("add");
  };

  const startEdit = (t) => {
    setMsg("");
    setEditId(t.id);
    setForm({ name: t.name || "", email: t.email || "", password: "" });
    setMode("edit");
  };

  const remove = async (id) => {
    if (!confirm("Da li ste sigurni da želite da obrišete trenera?")) return;
    setLoading(true);
    setMsg("");
    try {
      await api.delete(`/admin/users/${id}`);
      setMsg("Trener uspešno obrisan.");
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Brisanje nije uspelo.");
    } finally {
      setLoading(false);
    }
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.post("/admin/users", { ...form, uloga: "trener" });
      setMsg("Uspešno dodat trener.");
      await load();
      setMode("list");
      resetForm();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška: proveri podatke / email.");
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password?.trim()) payload.password = form.password;

      await api.put(`/admin/users/${editId}`, payload);
      setMsg("Izmena uspešna.");
      await load();
      setMode("list");
      resetForm();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Izmena nije uspela.");
    } finally {
      setLoading(false);
    }
  };

  const page = { padding: 24 };
  const card = {
    maxWidth: 1100,
    margin: "0 auto",
    background: "#f7fbff",
    borderRadius: 18,
    padding: 22,
    border: "1px solid #e6eef7",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  };
  const header = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 };
  const title = { fontSize: 28, fontWeight: 800, color: "#1976d2", margin: 0, display: "flex", gap: 10, alignItems: "center" };
  const actionsRow = { display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" };
  const input = { padding: "10px 12px", borderRadius: 10, border: "1px solid #cfe3fb", minWidth: 260, outline: "none" };
  const btn = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#1e88e5",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  };
  const btnGhost = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #cfe3fb",
    background: "white",
    fontWeight: 700,
    cursor: "pointer",
  };
  const tableWrap = { marginTop: 16, borderRadius: 14, overflow: "hidden", background: "white", border: "1px solid #e6eef7" };
  const th = { background: "#1e88e5", color: "white", padding: 12, textAlign: "left", fontWeight: 800 };
  const td = { padding: 12, borderBottom: "1px solid #eef3fb" };
  const iconBtn = { cursor: "pointer", fontSize: 18, padding: "6px 10px", borderRadius: 10, border: "1px solid #e6eef7", background: "#fff" };

  return (
    <div style={page}>
      <div style={card}>
        <div style={header}>
          <h1 style={title}>🦷 Spisak trenera</h1>
        </div>

        <div style={actionsRow}>
          {mode === "list" && (
            <>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraži trenera..." style={input} />
              <button style={btn} onClick={() => setQ(q)}>Pretraži</button>
              <button style={btn} onClick={startAdd}>+ Dodaj trenera</button>
            </>
          )}

          {mode !== "list" && (
            <button style={btnGhost} onClick={() => { setMode("list"); resetForm(); }}>
              ← Nazad
            </button>
          )}
        </div>

        {msg && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 12, border: "1px solid #cfe3fb", background: "#ffffff" }}>
            {msg}
          </div>
        )}

        {mode === "list" && (
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Ime</th>
                  <th style={th}>Email</th>
                  <th style={th}>Kreiran</th>
                  <th style={th}>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {loading && (<tr><td style={td} colSpan={4}>Učitavam...</td></tr>)}

                {!loading && filtered.map((t) => (
                  <tr key={t.id}>
                    <td style={td}>{t.name}</td>
                    <td style={td}>{t.email}</td>
                    <td style={td}>{new Date(t.created_at).toLocaleString()}</td>
                    <td style={td}>
                      <span title="Izmeni" style={iconBtn} onClick={() => startEdit(t)}>✏️</span>{" "}
                      <span title="Obriši" style={iconBtn} onClick={() => remove(t.id)}>🗑️</span>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (<tr><td style={td} colSpan={4}>Nema trenera.</td></tr>)}
              </tbody>
            </table>
          </div>
        )}

        {(mode === "add" || mode === "edit") && (
          <div style={{ marginTop: 16, background: "white", borderRadius: 14, padding: 16, border: "1px solid #e6eef7" }}>
            <h3 style={{ marginTop: 0, color: "#1976d2" }}>
              {mode === "add" ? "Dodaj trenera" : "Izmeni trenera"}
            </h3>

            <form onSubmit={mode === "add" ? submitAdd : submitEdit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
              <input style={input} placeholder="Ime i prezime" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input style={input} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input style={input} type="password" placeholder={mode === "add" ? "Lozinka" : "Nova lozinka (opciono)"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={mode === "add"} />

              <button style={btn} type="submit" disabled={loading}>
                {loading ? "Čuvam..." : mode === "add" ? "Dodaj trenera" : "Sačuvaj izmene"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
