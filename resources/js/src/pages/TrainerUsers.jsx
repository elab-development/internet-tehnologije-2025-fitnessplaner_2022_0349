import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import PageCard from "../components/PageCard";

export default function TrainerUsers() {
  const [mode, setMode] = useState("list"); // list | view
  const [loading, setLoading] = useState(false);

  const [msgAction, setMsgAction] = useState("");
  const [clients, setClients] = useState([]);

  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  // ====== LOAD ======
  const loadClients = async () => {
    setMsgAction("");
    try {
      const res = await api.get("/trener/users");
      setClients(res.data || []);
    } catch (e) {
      setMsgAction(e?.response?.data?.message || "Ne mogu da učitam klijente.");
    }
  };

  useEffect(() => {
    setLoading(true);
    loadClients().finally(() => setLoading(false));
  }, []);

  const filteredClients = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;

    return clients.filter((c) => {
      const hay = `${c.ime_i_prezime || ""} ${c.email || ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, clients]);

  const startView = (c) => {
    setSelected(c);
    setMode("view");
    setMsgAction("");
  };

  const backToList = () => {
    setSelected(null);
    setMode("list");
    setMsgAction("");
  };

  // ===== STIL (isti vajb) =====
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
      <button style={btnGhost} onClick={() => loadClients()} disabled={loading}>
        ⟳ Osveži
      </button>
    ) : (
      <button style={btnGhost} onClick={backToList}>
        ← Nazad
      </button>
    );

  return (
    <PageCard title="Moji klijenti" right={headerRight}>
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
          <b>Info:</b> {msgAction}
        </div>
      )}

      {/* LIST */}
      {mode === "list" && (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pretraga klijenata (ime ili email)..."
              style={input}
            />
            <button style={btnGhost} onClick={() => setQ(q)}>
              Pretraži
            </button>
          </div>

          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Klijent</th>
                  <th style={th}>Email</th>
                  <th style={th}>Datum kreiranja</th>
                  <th style={th}>Akcije</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td style={td} colSpan={4}>
                      Učitavam...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredClients.map((c) => (
                    <tr key={c.id}>
                      <td style={td}>
                        <div style={{ fontWeight: 900 }}>{c.ime_i_prezime || "-"}</div>
                        <div style={{ color: "#475569", marginTop: 4 }}>ID: {c.id}</div>
                      </td>

                      <td style={td}>{c.email || "-"}</td>

                      <td style={td}>
                        {c.created_at ? new Date(c.created_at).toLocaleString() : "-"}
                      </td>

                      <td style={td}>
                        <button style={btnGhost} onClick={() => startView(c)}>
                          👁️ Pogledaj
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && filteredClients.length === 0 && (
                  <tr>
                    <td style={td} colSpan={4}>
                      Nema klijenata.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW */}
      {mode === "view" && selected && (
        <div style={{ marginTop: 16, background: "white", borderRadius: 14, padding: 16, border: "1px solid #e6eef7" }}>
          <h3 style={{ marginTop: 0, color: "#1976d2" }}>Detalji klijenta</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <b>Ime i prezime:</b> {selected.ime_i_prezime || "-"}
            </div>
            <div>
              <b>Email:</b> {selected.email || "-"}
            </div>
            <div>
              <b>ID:</b> {selected.id}
            </div>
            <div>
              <b>Trener ID:</b> {selected.trener_id ?? "-"}
            </div>
            <div>
              <b>Kreiran:</b> {selected.created_at ? new Date(selected.created_at).toLocaleString() : "-"}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <button style={btn} onClick={backToList}>
              ← Nazad na listu
            </button>
          </div>
        </div>
      )}
    </PageCard>
  );
}
