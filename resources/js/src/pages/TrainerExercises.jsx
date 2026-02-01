import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import PageCard from "../components/PageCard";

export default function TrainerExercises() {
  const [mode, setMode] = useState("list"); // list | add | edit
  const [loading, setLoading] = useState(false);

  const [msgAction, setMsgAction] = useState("");
  const [vezbe, setVezbe] = useState([]);

  const [q, setQ] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    naziv: "",
    opis: "",
    misicna_grupa: "",
    oprema: "",
    video_url: "",
  });

  // ====== LOAD ======
  const loadVezbe = async () => {
    setMsgAction("");
    try {
      const res = await api.get("/vezbe");
      setVezbe(res.data || []);
    } catch (e) {
      setMsgAction(e?.response?.data?.message || "Ne mogu da učitam vežbe.");
    }
  };

  useEffect(() => {
    setLoading(true);
    loadVezbe().finally(() => setLoading(false));
  }, []);

  const filteredVezbe = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return vezbe;
    return vezbe.filter((v) => {
      const hay = `${v.naziv || ""} ${v.misicna_grupa || ""} ${v.oprema || ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, vezbe]);

  const resetForm = () => {
    setEditId(null);
    setForm({ naziv: "", opis: "", misicna_grupa: "", oprema: "", video_url: "" });
  };

  const startAdd = () => {
    resetForm();
    setMsgAction("");
    setMode("add");
  };

  const startEdit = (v) => {
    setEditId(v.id);
    setForm({
      naziv: v.naziv || "",
      opis: v.opis || "",
      misicna_grupa: v.misicna_grupa || "",
      oprema: v.oprema || "",
      video_url: v.video_url || "",
    });
    setMsgAction("");
    setMode("edit");
  };

  const removeVezba = async (id) => {
    if (!confirm("Da li ste sigurni da želite da obrišete vežbu?")) return;
    setLoading(true);
    setMsgAction("");
    try {
      await api.delete(`/vezbe/${id}`);
      setMsgAction("Vežba obrisana.");
      await loadVezbe();
      setMode("list");
      resetForm();
    } catch (e) {
      setMsgAction(e?.response?.data?.message || "Brisanje nije uspelo.");
    } finally {
      setLoading(false);
    }
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsgAction("");
    try {
      await api.post("/vezbe", form);
      setMsgAction("Vežba kreirana.");
      await loadVezbe();
      setMode("list");
      resetForm();
    } catch (e2) {
      setMsgAction(e2?.response?.data?.message || "Greška: proveri podatke.");
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsgAction("");
    try {
      await api.put(`/vezbe/${editId}`, form);
      setMsgAction("Vežba izmenjena.");
      await loadVezbe();
      setMode("list");
      resetForm();
    } catch (e2) {
      setMsgAction(e2?.response?.data?.message || "Izmena nije uspela.");
    } finally {
      setLoading(false);
    }
  };

  // ===== STIL (isti vajb kao ClientTrainings) =====
  const input = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #cfe3fb",
    minWidth: 260,
    outline: "none",
  };
  const btn = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#1e88e5",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  };
  const btnGhost = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #cfe3fb",
    background: "white",
    fontWeight: 800,
    cursor: "pointer",
  };
  const tableWrap = {
    marginTop: 16,
    borderRadius: 14,
    overflow: "hidden",
    background: "white",
    border: "1px solid #e6eef7",
  };
  const th = { background: "#1e88e5", color: "white", padding: 12, textAlign: "left", fontWeight: 900 };
  const td = { padding: 12, borderBottom: "1px solid #eef3fb", verticalAlign: "top" };

  const headerRight =
    mode === "list" ? (
      <button style={btn} onClick={startAdd}>
        + Nova vežba
      </button>
    ) : (
      <button
        style={btnGhost}
        onClick={() => {
          setMode("list");
          resetForm();
          setMsgAction("");
        }}
      >
        ← Nazad
      </button>
    );

  return (
    <PageCard title="Vežbe" right={headerRight}>
      {msgAction && (
        <div
          style={{
            marginBottom: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #cfe3fb",
            background: "#ffffff",
          }}
        >
          <b>Akcija:</b> {msgAction}
        </div>
      )}

      {/* LIST */}
      {mode === "list" && (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraga vežbi..." style={input} />
            <button style={btnGhost} onClick={() => setQ(q)}>
              Pretraži
            </button>
          </div>

          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Naziv</th>
                  <th style={th}>Mišićna grupa</th>
                  <th style={th}>Oprema</th>
                  <th style={th}>Video</th>
                  <th style={th}>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td style={td} colSpan={5}>
                      Učitavam...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredVezbe.map((v) => (
                    <tr key={v.id}>
                      <td style={td}>
                        <div style={{ fontWeight: 900 }}>{v.naziv}</div>
                        <div style={{ color: "#475569", marginTop: 4 }}>{v.opis || "-"}</div>
                      </td>
                      <td style={td}>{v.misicna_grupa || "-"}</td>
                      <td style={td}>{v.oprema || "-"}</td>
                      <td style={td}>
                        {v.video_url ? (
                          <a href={v.video_url} target="_blank" rel="noreferrer">
                            Link
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={td}>
                        <button style={btnGhost} onClick={() => startEdit(v)}>
                          ✏️ Izmeni
                        </button>{" "}
                        <button style={btnGhost} onClick={() => removeVezba(v.id)}>
                          🗑️ Obriši
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && filteredVezbe.length === 0 && (
                  <tr>
                    <td style={td} colSpan={5}>
                      Nema vežbi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ADD / EDIT */}
      {(mode === "add" || mode === "edit") && (
        <div style={{ marginTop: 16, background: "white", borderRadius: 14, padding: 16, border: "1px solid #e6eef7" }}>
          <h3 style={{ marginTop: 0, color: "#1976d2" }}>{mode === "add" ? "Nova vežba" : "Izmena vežbe"}</h3>

          <form onSubmit={mode === "add" ? submitAdd : submitEdit} style={{ display: "grid", gap: 12 }}>
            <input
              style={input}
              placeholder="Naziv"
              value={form.naziv}
              onChange={(e) => setForm({ ...form, naziv: e.target.value })}
              required
            />

            <input
              style={input}
              placeholder="Mišićna grupa (npr. Grudi, Core...)"
              value={form.misicna_grupa}
              onChange={(e) => setForm({ ...form, misicna_grupa: e.target.value })}
            />

            <input
              style={input}
              placeholder="Oprema (npr. Bodyweight, Barbell...)"
              value={form.oprema}
              onChange={(e) => setForm({ ...form, oprema: e.target.value })}
            />

            <input
              style={input}
              placeholder="Video URL (YouTube link)"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            />

            <textarea
              style={{ ...input, minWidth: "100%", minHeight: 110 }}
              placeholder="Opis (opciono)"
              value={form.opis}
              onChange={(e) => setForm({ ...form, opis: e.target.value })}
            />

            <button style={btn} type="submit" disabled={loading}>
              {loading ? "Čuvam..." : mode === "add" ? "Kreiraj vežbu" : "Sačuvaj izmene"}
            </button>
          </form>
        </div>
      )}
    </PageCard>
  );
}
