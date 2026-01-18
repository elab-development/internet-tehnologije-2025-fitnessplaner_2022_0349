import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import PageCard from "../components/PageCard";

function toYoutubeEmbed(url) {
  if (!url) return null;
  // podrška za youtu.be i youtube.com/watch?v=
  const m1 = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  const m2 = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  const id = m1?.[1] || m2?.[1];
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export default function ClientExercises() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [vezbe, setVezbe] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.get("/vezbe");
      setVezbe(res.data || []);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Ne mogu da učitam vežbe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = [...vezbe].sort((a, b) => (a.naziv || "").localeCompare(b.naziv || ""));
    if (!s) return list;
    return list.filter((v) => {
      const hay = `${v.naziv || ""} ${v.opis || ""} ${v.misicna_grupa || ""} ${v.oprema || ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, vezbe]);

  const input = { padding: "10px 12px", borderRadius: 10, border: "1px solid #cfe3fb", minWidth: 260, outline: "none" };
  const card = { background: "white", borderRadius: 14, padding: 14, border: "1px solid #e6eef7" };

  return (
    <PageCard
      title="Vežbe"
      right={
        <button
          onClick={load}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #cfe3fb", background: "white", fontWeight: 800, cursor: "pointer" }}
        >
          Osveži
        </button>
      }
    >
      {msg && (
        <div style={{ marginBottom: 12, padding: 12, borderRadius: 12, border: "1px solid #cfe3fb", background: "#ffffff" }}>
          {msg}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraži vežbe..." style={input} />
      </div>

      {loading && <div style={{ marginTop: 12 }}>Učitavam...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 12, border: "1px solid #cfe3fb", background: "#f7fbff", fontWeight: 700 }}>
          Nema vežbi u bazi.
        </div>
      )}

      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        {!loading &&
          filtered.map((v) => {
            const embed = toYoutubeEmbed(v.video_url);
            return (
              <div key={v.id} style={card}>
                <div style={{ fontWeight: 900, fontSize: 18, color: "#1976d2" }}>{v.naziv}</div>
                <div style={{ marginTop: 6, opacity: 0.85 }}>{v.opis || "Nema opisa."}</div>
                <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                  Mišić: {v.misicna_grupa || "—"} • Oprema: {v.oprema || "—"}
                </div>

                {embed ? (
                  <div style={{ marginTop: 10 }}>
                    <iframe
                      width="100%"
                      height="220"
                      src={embed}
                      title={v.naziv}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: 12 }}
                    />
                  </div>
                ) : v.video_url ? (
                  <div style={{ marginTop: 10 }}>
                    <a href={v.video_url} target="_blank" rel="noreferrer" style={{ fontWeight: 800, color: "#1e88e5" }}>
                      Pogledaj video (link)
                    </a>
                  </div>
                ) : (
                  <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>Nema video linka.</div>
                )}
              </div>
            );
          })}
      </div>
    </PageCard>
  );
}
