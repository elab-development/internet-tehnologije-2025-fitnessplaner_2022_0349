import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import PageCard from "../components/PageCard";

export default function ClientTrainings() {
  const [mode, setMode] = useState("list"); // list | add | edit | view | workout
  const [loading, setLoading] = useState(false);

  // poruke
  const [msgTreninzi, setMsgTreninzi] = useState("");
  const [msgVezbe, setMsgVezbe] = useState("");
  const [msgAction, setMsgAction] = useState("");

  const [treninzi, setTreninzi] = useState([]);
  const [vezbe, setVezbe] = useState([]);

  const [q, setQ] = useState("");
  const [editId, setEditId] = useState(null);

  // trening osnovno
  const [form, setForm] = useState({
    naziv: "",
    trajanje_minuta: "",
    tezina: "",
  });

  // STAVKE = izvodjenja (za add/edit)
  const [items, setItems] = useState([]); // [{rb, vezba_id, serije, ponavljanja, pauza_sekundi, napomena}]
  const [selectedRb, setSelectedRb] = useState(null);

  // “Dodaj stavku” forma (combo + polja) + NOVO tip
  const [stavka, setStavka] = useState({
    vezba_id: "",
    tip: "reps", // reps | time
    serije: "3",
    ponavljanja: "10",
    vreme_sekundi: "50",
    pauza_sekundi: "60",
    napomena: "",
  });

  const allowNumberOrEmpty = (v) => v === "" || /^\d+$/.test(v);

  // ====== VIEW/WORKOUT state ======
  const [selectedTraining, setSelectedTraining] = useState(null); // full trening sa izvodjenjima
  const [videoUrl, setVideoUrl] = useState(null); // modal video

  // workout state
  const [wIndex, setWIndex] = useState(0); // index izvodjenja
  const [wSeries, setWSeries] = useState(1); // trenutna serija
  const [wPhase, setWPhase] = useState("work"); // work | rest
  const [wTimer, setWTimer] = useState(null); // sekundi preostalo
  const [wTimerTotal, setWTimerTotal] = useState(null); // ukupno (za krug)

  // ===== helpers (naziv + youtube embed) =====
  const getVezbaName = (v) => v?.naziv || v?.ime || v?.name || v?.title || "";

  const parseTimedSeconds = (napomena) => {
    if (!napomena) return null;
    const m = String(napomena).match(/time\s*=\s*(\d+)/i);
    return m ? Number(m[1]) : null;
  };

  const getYoutubeId = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      const idxEmbed = parts.indexOf("embed");
      if (idxEmbed >= 0 && parts[idxEmbed + 1]) return parts[idxEmbed + 1];
      const idxShorts = parts.indexOf("shorts");
      if (idxShorts >= 0 && parts[idxShorts + 1]) return parts[idxShorts + 1];
      return null;
    } catch {
      return null;
    }
  };

  const toYoutubeEmbed = (url) => {
    const id = getYoutubeId(url);
    if (!id) return null;
    return `https://www.youtube-nocookie.com/embed/${id}`;
  };

  const isVideoFile = (url) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(url || ""));
  const isYoutube = (url) => /youtube\.com|youtu\.be/i.test(String(url || ""));

  // ===== LOAD =====
  const loadTreninzi = async () => {
    setMsgTreninzi("");
    try {
      const res = await api.get("/treninzi");
      setTreninzi(res.data || []);
    } catch (e) {
      setMsgTreninzi(e?.response?.data?.message || "Ne mogu da učitam treninge.");
    }
  };

  const loadVezbe = async () => {
    setMsgVezbe("");
    try {
      const res = await api.get("/vezbe");
      setVezbe(res.data || []);
    } catch (e) {
      setMsgVezbe(e?.response?.data?.message || "Ne mogu da učitam vežbe (proveri API / token).");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setMsgAction("");
    await loadTreninzi();
    await loadVezbe();
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTreninzi = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return treninzi;
    return treninzi.filter((t) => (t.naziv || "").toLowerCase().includes(s));
  }, [q, treninzi]);

  const sortedVezbe = useMemo(() => {
    return [...vezbe].sort((a, b) => getVezbaName(a).localeCompare(getVezbaName(b)));
  }, [vezbe]);

  const resetForm = () => {
    setForm({ naziv: "", trajanje_minuta: "", tezina: "" });
    setItems([]);
    setSelectedRb(null);
    setStavka({
      vezba_id: "",
      tip: "reps",
      serije: "3",
      ponavljanja: "10",
      vreme_sekundi: "50",
      pauza_sekundi: "60",
      napomena: "",
    });
    setEditId(null);
  };

  const resetViewWorkout = () => {
    setSelectedTraining(null);
    setVideoUrl(null);
    setWIndex(0);
    setWSeries(1);
    setWPhase("work");
    setWTimer(null);
    setWTimerTotal(null);
  };

  const startAdd = () => {
    resetForm();
    setMode("add");
    setMsgAction("");
  };

  const startEdit = async (trening) => {
    setLoading(true);
    setMsgAction("");
    try {
      const res = await api.get(`/treninzi/${trening.id}`);
      const full = res.data;

      setEditId(full.id);
      setForm({
        naziv: full.naziv || "",
        trajanje_minuta: full.trajanje_minuta ?? "",
        tezina: full.tezina ?? "",
      });

      const iz = (full.izvodjenja || []).slice().sort((a, b) => (a.redosled ?? 0) - (b.redosled ?? 0));
      setItems(
        iz.map((i, idx) => ({
          rb: idx + 1,
          vezba_id: i.vezba_id,
          serije: i.serije ?? "",
          ponavljanja: i.ponavljanja ?? "",
          pauza_sekundi: i.pauza_sekundi ?? "",
          napomena: i.napomena ?? "",
        }))
      );
      setSelectedRb(null);
      setMode("edit");
    } catch (e) {
      setMsgAction("Ne mogu da učitam trening za izmenu.");
    } finally {
      setLoading(false);
    }
  };

  const removeTraining = async (id) => {
    if (!confirm("Da li ste sigurni da želite da obrišete trening?")) return;
    setLoading(true);
    setMsgAction("");
    try {
      await api.delete(`/treninzi/${id}`);
      setMsgAction("Trening obrisan.");
      await loadTreninzi();
      setMode("list");
      resetForm();
      resetViewWorkout();
    } catch (e) {
      setMsgAction(e?.response?.data?.message || "Brisanje nije uspelo.");
    } finally {
      setLoading(false);
    }
  };

  // ====== Detalji ======
  const openDetails = async (trening) => {
    setLoading(true);
    setMsgAction("");
    try {
      const res = await api.get(`/treninzi/${trening.id}`);
      setSelectedTraining(res.data);
      setMode("view");
    } catch (e) {
      setMsgAction("Ne mogu da učitam detalje treninga.");
    } finally {
      setLoading(false);
    }
  };

  // ====== Workout start ======
  const startWorkout = async (trening) => {
    setLoading(true);
    setMsgAction("");
    try {
      const res = await api.get(`/treninzi/${trening.id}`);
      const full = res.data;
      setSelectedTraining(full);
      setWIndex(0);
      setWSeries(1);
      setWPhase("work");
      setWTimer(null);
      setWTimerTotal(null);
      setMode("workout");
    } catch (e) {
      setMsgAction("Ne mogu da pokrenem trening.");
    } finally {
      setLoading(false);
    }
  };

  // ====== TIMER TICK ======
  useEffect(() => {
    if (mode !== "workout") return;
    if (wTimer === null) return;
    if (wTimer <= 0) return;

    const id = setInterval(() => setWTimer((t) => (t === null ? null : t - 1)), 1000);
    return () => clearInterval(id);
  }, [mode, wTimer]);

  const workoutGetCurrent = () => {
    const iz = selectedTraining?.izvodjenja || [];
    const current = iz[wIndex];
    if (!current) return null;
    const v = vezbe.find((x) => Number(x.id) === Number(current.vezba_id));
    const timed = parseTimedSeconds(current.napomena);
    return { current, v, timed };
  };

  const workoutStartRest = (seconds) => {
    const s = seconds ?? 60;
    setWTimerTotal(s);
    setWTimer(s);
    setWPhase("rest");
  };

  const workoutContinueAfterRest = () => {
    const pack = workoutGetCurrent();
    if (!pack) return;
    const { current } = pack;
    const totalSeries = Number(current.serije || 1);

    if (wSeries < totalSeries) {
      setWSeries((s) => s + 1);
      setWPhase("work");
      setWTimer(null);
      setWTimerTotal(null);
      return;
    }

    const iz = selectedTraining?.izvodjenja || [];
    if (wIndex < iz.length - 1) {
      setWIndex((i) => i + 1);
      setWSeries(1);
      setWPhase("work");
      setWTimer(null);
      setWTimerTotal(null);
      return;
    }

    setMode("view");
    setWTimer(null);
    setWTimerTotal(null);
    setWPhase("work");
  };

  // ===== timed: automatsko smenjivanje RAD/PAUZA =====
  useEffect(() => {
    if (mode !== "workout") return;
    if (wTimer !== 0) return;

    const pack = workoutGetCurrent();
    if (!pack) return;

    const { current, timed } = pack;
    const isTimed = Boolean(timed);
    if (!isTimed) return;

    const restSeconds = Number(current.pauza_sekundi || 60);
    const totalSeries = Number(current.serije || 1);
    const dur = timed ?? 30;

    // kad istekne RAD -> start PAUZA
    if (wPhase === "work") {
      workoutStartRest(restSeconds);
      return;
    }

    // kad istekne PAUZA -> sledeća serija ili sledeća vežba (i odmah start RAD)
    if (wPhase === "rest") {
      if (wSeries < totalSeries) {
        setWSeries((s) => s + 1);
        setWTimerTotal(dur);
        setWTimer(dur);
        setWPhase("work");
        return;
      }

      const iz = selectedTraining?.izvodjenja || [];
      if (wIndex < iz.length - 1) {
        setWIndex((i) => i + 1);
        setWSeries(1);
        setWTimer(null);
        setWTimerTotal(null);
        setWPhase("work");
        return;
      }

      setMode("view");
      setWTimer(null);
      setWTimerTotal(null);
      setWPhase("work");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, wTimer]);

  // ===== CRUD stavki (add/edit) =====
  const addStavka = () => {
    setMsgAction("");

    const vezbaId = Number(stavka.vezba_id);
    if (!vezbaId) return setMsgAction("Izaberite vežbu iz liste.");
    if (items.some((it) => Number(it.vezba_id) === vezbaId)) return setMsgAction("Ta vežba je već dodata u trening.");

    const nextRb = items.length + 1;

    const tip = stavka.tip || "reps";
    const vreme = tip === "time" ? Number(stavka.vreme_sekundi || 0) : null;

    // korisnik ne vidi "time=xx", ali sistem ga koristi
    const napomenaBase = (stavka.napomena || "").replace(/time\s*=\s*\d+/i, "").trim();
    const napomenaFinal =
      tip === "time"
        ? `${napomenaBase ? napomenaBase + " " : ""}time=${vreme || 30}`.trim()
        : napomenaBase;

    setItems((prev) => [
      ...prev,
      {
        rb: nextRb,
        vezba_id: vezbaId,
        serije: stavka.serije,
        ponavljanja: tip === "reps" ? stavka.ponavljanja : "",
        pauza_sekundi: stavka.pauza_sekundi,
        napomena: napomenaFinal,
      },
    ]);

    setSelectedRb(nextRb);
  };

  const deleteStavka = () => {
    setMsgAction("");
    if (!selectedRb) {
      setMsgAction("Izaberite stavku (klik na red u tabeli) pa onda Obriši stavku.");
      return;
    }

    setItems((prev) => {
      const next = prev.filter((x) => x.rb !== selectedRb);
      return next.map((x, idx) => ({ ...x, rb: idx + 1 }));
    });
    setSelectedRb(null);
  };

  const updateItem = (rb, patch) => {
    setItems((prev) => prev.map((x) => (x.rb === rb ? { ...x, ...patch } : x)));
  };

  const toPayload = () => ({
    naziv: form.naziv,
    trajanje_minuta: form.trajanje_minuta ? Number(form.trajanje_minuta) : null,
    tezina: form.tezina || null,
    izvodjenja: items.map((it) => ({
      vezba_id: Number(it.vezba_id),
      redosled: Number(it.rb),
      serije: it.serije === "" ? null : Number(it.serije),
      ponavljanja: it.ponavljanja === "" ? null : Number(it.ponavljanja),
      pauza_sekundi: it.pauza_sekundi === "" ? null : Number(it.pauza_sekundi),
      napomena: it.napomena || null,
    })),
  });

  const submitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsgAction("");
    try {
      if (items.length === 0) {
        setMsgAction("Dodajte bar jednu stavku treninga (vežbu).");
        setLoading(false);
        return;
      }

      await api.post("/treninzi", toPayload());
      setMsgAction("Trening kreiran.");
      await loadTreninzi();
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
      if (items.length === 0) {
        setMsgAction("Trening mora imati bar jednu stavku (izvođenje vežbe).");
        setLoading(false);
        return;
      }

      await api.put(`/treninzi/${editId}`, toPayload());
      setMsgAction("Trening izmenjen.");
      await loadTreninzi();
      setMode("list");
      resetForm();
    } catch (e2) {
      setMsgAction(e2?.response?.data?.message || "Izmena nije uspela.");
    } finally {
      setLoading(false);
    }
  };

  // STIL
  const input = { padding: "10px 12px", borderRadius: 10, border: "1px solid #cfe3fb", minWidth: 260, outline: "none" };
  const btn = { padding: "10px 16px", borderRadius: 10, border: "none", background: "#1e88e5", color: "white", fontWeight: 800, cursor: "pointer" };
  const btnGhost = { padding: "10px 14px", borderRadius: 10, border: "1px solid #cfe3fb", background: "white", fontWeight: 800, cursor: "pointer" };
  const tableWrap = { marginTop: 16, borderRadius: 14, overflow: "hidden", background: "white", border: "1px solid #e6eef7" };
  const th = { background: "#1e88e5", color: "white", padding: 12, textAlign: "left", fontWeight: 900 };
  const td = { padding: 12, borderBottom: "1px solid #eef3fb", verticalAlign: "top" };

  // progress za krug
  const circle = (total, left) => {
    if (!total || total <= 0) return { dash: "0 999" };
    const pct = Math.max(0, Math.min(1, left / total));
    return { dash: `${pct * 100} 100` };
  };

  const headerRight =
    mode === "list" ? (
      <button style={btn} onClick={startAdd}>+ Novi trening</button>
    ) : (
      <button
        style={btnGhost}
        onClick={() => {
          setMode("list");
          resetForm();
          resetViewWorkout();
          setMsgAction("");
        }}
      >
        ← Nazad
      </button>
    );

  const renderVideoModal = () => {
    if (!videoUrl) return null;

    const overlay = {
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: 18,
    };

    const modal = {
      width: "min(980px, 100%)",
      background: "white",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      border: "1px solid rgba(255,255,255,0.2)",
    };

    const top = {
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#0b1220",
      color: "white",
      fontWeight: 900,
    };

    const embed = isYoutube(videoUrl) ? toYoutubeEmbed(videoUrl) : null;

    return (
      <div style={overlay} onClick={() => setVideoUrl(null)}>
        <div style={modal} onClick={(e) => e.stopPropagation()}>
          <div style={top}>
            <div>Video demonstracija</div>
            <button
              onClick={() => setVideoUrl(null)}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.35)", color: "white", borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontWeight: 900 }}
            >
              ✕
            </button>
          </div>

          <div style={{ background: "#000" }}>
            {embed ? (
              <iframe
                title="video"
                src={embed}
                style={{ width: "100%", height: "520px", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                style={{ width: "100%", height: "520px", background: "#000" }}
              />
            )}

            {!embed && !isVideoFile(videoUrl) && (
              <div style={{ padding: 12, background: "#111827", color: "white", fontWeight: 800 }}>
                Ako link nije mp4/webm ili YouTube, embed možda neće raditi. Najsigurnije: mp4 fajl ili YouTube link.
              </div>
            )}
          </div>
        </div>
      </div>
    );
      }; // <- ZATVARA renderVideoModal

  return (
    <PageCard title="Moji treninzi" right={headerRight}>
      {renderVideoModal()}

      {/* poruke */}
      {(msgTreninzi || msgVezbe || msgAction) && (
        <div
          style={{
            marginBottom: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #cfe3fb",
            background: "#ffffff",
          }}
        >
          {msgTreninzi && (
            <div>
              <b>Treninzi:</b> {msgTreninzi}
            </div>
          )}
          {msgVezbe && (
            <div>
              <b>Vežbe:</b> {msgVezbe}
            </div>
          )}
          {msgAction && (
            <div>
              <b>Akcija:</b> {msgAction}
            </div>
          )}
        </div>
      )}

      {/* LIST */}
      {mode === "list" && (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pretraži trening..."
              style={input}
            />
            <button style={btn} onClick={() => setQ(q)}>
              Pretraži
            </button>
          </div>

          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Naziv</th>
                  <th style={th}>Trajanje</th>
                  <th style={th}>Težina</th>
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
                  filteredTreninzi.map((t) => (
                    <tr key={t.id}>
                      <td style={td}>{t.naziv}</td>
                      <td style={td}>{t.trajanje_minuta ?? "-"}</td>
                      <td style={td}>{t.tezina ?? "-"}</td>
                      <td style={td}>
                        <button style={btnGhost} onClick={() => openDetails(t)}>
                          🔎 Detalji
                        </button>{" "}
                        <button style={btnGhost} onClick={() => startWorkout(t)}>
                          ▶ Započni
                        </button>{" "}
                        <button style={btnGhost} onClick={() => startEdit(t)}>
                          ✏️ Izmeni
                        </button>{" "}
                        <button style={btnGhost} onClick={() => removeTraining(t.id)}>
                          🗑️ Obriši
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && filteredTreninzi.length === 0 && (
                  <tr>
                    <td style={td} colSpan={4}>
                      Nema treninga.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* VIEW */}
      {mode === "view" && selectedTraining && (
        <div style={{ marginTop: 6 }}>
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>{selectedTraining.naziv}</h3>

          <div style={{ color: "#475569", fontWeight: 800, marginBottom: 10 }}>
            ⏱ {selectedTraining.trajanje_minuta ?? "-"} min · 💪 {selectedTraining.tezina ?? "-"}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btn} onClick={() => startWorkout({ id: selectedTraining.id })}>
              ▶ Započni trening
            </button>
            <button style={btnGhost} onClick={() => startEdit({ id: selectedTraining.id })}>
              ✏️ Izmeni
            </button>
          </div>

          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Vežba</th>
                  <th style={th}>Serije</th>
                  <th style={th}>Ponavljanja / Vreme</th>
                  <th style={th}>Pauza</th>
                  <th style={th}>Napomena</th>
                  <th style={th}>Video</th>
                </tr>
              </thead>
              <tbody>
                {(selectedTraining.izvodjenja || []).map((iz) => {
                  const v = vezbe.find((x) => Number(x.id) === Number(iz.vezba_id));
                  const timed = parseTimedSeconds(iz.napomena);

                  return (
                    <tr key={iz.id ?? `${iz.vezba_id}-${iz.redosled}`}>
                      <td style={td}>{v ? getVezbaName(v) : `#${iz.vezba_id}`}</td>
                      <td style={td}>{iz.serije ?? "-"}</td>
                      <td style={td}>{timed ? `${timed}s` : iz.ponavljanja ?? "-"}</td>
                      <td style={td}>{iz.pauza_sekundi != null ? `${iz.pauza_sekundi}s` : "-"}</td>
                      <td style={td}>{(iz.napomena || "").replace(/time\s*=\s*\d+/i, "").trim() || "-"}</td>
                      <td style={td}>
                        {v?.video_url ? (
                          <button style={btnGhost} onClick={() => setVideoUrl(v.video_url)}>
                            ▶ Pusti
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })}

                {(selectedTraining.izvodjenja || []).length === 0 && (
                  <tr>
                    <td style={td} colSpan={6}>
                      Trening nema stavki.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WORKOUT */}
      {mode === "workout" &&
        selectedTraining &&
        (() => {
          const pack = workoutGetCurrent();
          if (!pack) return <div style={{ padding: 12 }}>Nema stavki u treningu.</div>;

          const { current, v, timed } = pack;
          const totalSeries = Number(current.serije || 1);
          const restSeconds = Number(current.pauza_sekundi || 60);
          const isTimed = Boolean(timed);

          const total = wTimerTotal || 0;
          const left = wTimer ?? 0;
          const c = circle(total, left);

          const card = {
            background: "#ffffff",
            border: "1px solid #e6eef7",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
          };

          const phaseLabel = wPhase === "work" ? "RAD" : "PAUZA";
          const phaseColor = wPhase === "work" ? "#16a34a" : "#ef4444";

          return (
            <div style={card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#64748b" }}>
                    Stavka {wIndex + 1} / {(selectedTraining.izvodjenja || []).length}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                    {v ? getVezbaName(v) : `Vežba #${current.vezba_id}`}
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900, color: "#1976d2" }}>
                    Serija {wSeries} / {totalSeries}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {v?.video_url && (
                    <button style={btnGhost} onClick={() => setVideoUrl(v.video_url)}>
                      ▶ Video
                    </button>
                  )}
                  <button
                    style={btnGhost}
                    onClick={() => {
                      setMode("view");
                      setWTimer(null);
                      setWTimerTotal(null);
                      setWPhase("work");
                    }}
                  >
                    ⟵ Detalji
                  </button>
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "1fr 320px",
                  gap: 18,
                  alignItems: "center",
                }}
              >
                {/* LEFT */}
                <div style={{ textAlign: "left" }}>
                  {!isTimed && (
                    <>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>Ponavljanja</div>
                      <div style={{ fontSize: 46, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
                        {current.ponavljanja ?? "-"}
                      </div>
                      <div style={{ marginTop: 10, color: "#475569", fontWeight: 900 }}>Pauza: {restSeconds}s</div>

                      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {wPhase === "work" && (
                          <button style={btn} onClick={() => workoutStartRest(restSeconds)}>
                            Završi seriju
                          </button>
                        )}

                        {wPhase === "rest" && wTimer !== null && wTimer > 0 && (
                          <button style={btnGhost} disabled>
                            Pauza traje...
                          </button>
                        )}

                        {wPhase === "rest" && wTimer === 0 && (
                          <button
                            style={btn}
                            onClick={() => {
                              setWTimer(null);
                              setWTimerTotal(null);
                              workoutContinueAfterRest();
                            }}
                          >
                            Nastavi
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {isTimed && (
                    <>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>Vremenska vežba</div>
                      <div style={{ marginTop: 8, color: "#475569", fontWeight: 900 }}>
                        RAD: {timed}s · PAUZA: {restSeconds}s (automatski)
                      </div>

                      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {wTimer === null && wPhase === "work" && (
                          <button
                            style={btn}
                            onClick={() => {
                              const dur = timed ?? 30;
                              setWTimerTotal(dur);
                              setWTimer(dur);
                              setWPhase("work");
                            }}
                          >
                            Start
                          </button>
                        )}

                        {wTimer !== null && wTimer > 0 && (
                          <button style={btnGhost} disabled>
                            {phaseLabel}...
                          </button>
                        )}

                        {wTimer === 0 && (
                          <button style={btnGhost} disabled>
                            Prebacujem...
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {wTimer !== null ? (
                    <div style={{ width: 240, height: 240, position: "relative" }}>
                      <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%" }}>
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e6eef7"
                          strokeWidth="3.6"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={phaseColor}
                          strokeWidth="3.6"
                          strokeDasharray={c.dash}
                          strokeLinecap="round"
                        />
                      </svg>

                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div style={{ fontSize: 56, fontWeight: 900, color: "#0f172a" }}>{wTimer}s</div>
                        <div style={{ marginTop: 2, fontWeight: 900, color: phaseColor }}>{phaseLabel}</div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 240,
                        height: 240,
                        borderRadius: 18,
                        border: "1px dashed #cfe3fb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        fontWeight: 900,
                      }}
                    >
                      Spremno
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      {/* ADD / EDIT */}
      {(mode === "add" || mode === "edit") && (
        <div style={{ marginTop: 16, background: "white", borderRadius: 14, padding: 16, border: "1px solid #e6eef7" }}>
          <h3 style={{ marginTop: 0, color: "#1976d2" }}>
            {mode === "add" ? "Kreiranje treninga" : "Izmena treninga"}
          </h3>

          <form onSubmit={mode === "add" ? submitAdd : submitEdit} style={{ display: "grid", gap: 12 }}>
            <input
              style={input}
              placeholder="Naziv treninga"
              value={form.naziv}
              onChange={(e) => setForm({ ...form, naziv: e.target.value })}
              required
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                style={input}
                placeholder="Trajanje (min) - opciono"
                value={form.trajanje_minuta}
                onChange={(e) => {
                  const v = e.target.value;
                  if (allowNumberOrEmpty(v)) setForm({ ...form, trajanje_minuta: v });
                }}
              />

              <select style={input} value={form.tezina} onChange={(e) => setForm({ ...form, tezina: e.target.value })}>
                <option value="">-- Izaberi težinu (opciono) --</option>
                <option value="lako">Lako</option>
                <option value="srednje">Srednje</option>
                <option value="tesko">Teško</option>
              </select>
            </div>

            <div style={{ fontWeight: 900, color: "#1976d2" }}>Stavke treninga (izvođenja)</div>

            {vezbe.length === 0 ? (
              <div style={{ padding: 12, borderRadius: 12, border: "1px solid #cfe3fb", background: "#f7fbff", fontWeight: 800 }}>
                Nema vežbi u bazi. Dodajte vežbe kao trener/admin.
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 160px 180px 160px", gap: 10 }}>
                  <select
                    style={{ ...input, minWidth: "100%" }}
                    value={stavka.vezba_id}
                    onChange={(e) => setStavka({ ...stavka, vezba_id: e.target.value })}
                  >
                    <option value="">— Izaberi vežbu —</option>
                    {sortedVezbe.map((v) => (
                      <option key={v.id} value={v.id}>
                        {getVezbaName(v)}
                      </option>
                    ))}
                  </select>

                  <input
                    style={{ ...input, minWidth: "100%" }}
                    placeholder="Serije"
                    value={stavka.serije}
                    onChange={(e) => allowNumberOrEmpty(e.target.value) && setStavka({ ...stavka, serije: e.target.value })}
                  />

                  <select
                    style={{ ...input, minWidth: "100%" }}
                    value={stavka.tip}
                    onChange={(e) => setStavka({ ...stavka, tip: e.target.value })}
                  >
                    <option value="reps">Ponavljanja</option>
                    <option value="time">Vreme (sek)</option>
                  </select>

                  {stavka.tip === "reps" ? (
                    <input
                      style={{ ...input, minWidth: "100%" }}
                      placeholder="Ponavljanja"
                      value={stavka.ponavljanja}
                      onChange={(e) => allowNumberOrEmpty(e.target.value) && setStavka({ ...stavka, ponavljanja: e.target.value })}
                    />
                  ) : (
                    <input
                      style={{ ...input, minWidth: "100%" }}
                      placeholder="Vreme rada (sek)"
                      value={stavka.vreme_sekundi}
                      onChange={(e) => allowNumberOrEmpty(e.target.value) && setStavka({ ...stavka, vreme_sekundi: e.target.value })}
                    />
                  )}

                  <input
                    style={{ ...input, minWidth: "100%" }}
                    placeholder="Pauza (sek)"
                    value={stavka.pauza_sekundi}
                    onChange={(e) => allowNumberOrEmpty(e.target.value) && setStavka({ ...stavka, pauza_sekundi: e.target.value })}
                  />
                </div>

                <input
                  style={{ ...input, minWidth: "100%" }}
                  placeholder="Napomena (opciono)"
                  value={stavka.napomena}
                  onChange={(e) => setStavka({ ...stavka, napomena: e.target.value })}
                />

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" style={btn} onClick={addStavka} disabled={loading}>
                    Dodaj stavku
                  </button>
                  <button type="button" style={btnGhost} onClick={deleteStavka} disabled={loading}>
                    Obriši stavku
                  </button>
                </div>
              </>
            )}

            {/* tabela stavki */}
            <div style={tableWrap}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>RB</th>
                    <th style={th}>Vežba</th>
                    <th style={th}>Serije</th>
                    <th style={th}>Ponavljanja / Vreme</th>
                    <th style={th}>Pauza (s)</th>
                    <th style={th}>Napomena</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td style={td} colSpan={6}>
                        Nema stavki. Dodajte prvu stavku iznad.
                      </td>
                    </tr>
                  )}

                  {items.map((it) => {
                    const v = vezbe.find((x) => Number(x.id) === Number(it.vezba_id));
                    const timed = parseTimedSeconds(it.napomena);
                    const active = selectedRb === it.rb;

                    return (
                      <tr
                        key={it.rb}
                        onClick={() => setSelectedRb(it.rb)}
                        style={{ background: active ? "#eef6ff" : "white", cursor: "pointer" }}
                      >
                        <td style={td}>{it.rb}</td>
                        <td style={td}>{v ? getVezbaName(v) : `#${it.vezba_id}`}</td>

                        <td style={td}>
                          <input
                            style={{ ...input, minWidth: 110 }}
                            value={it.serije}
                            placeholder="-"
                            onChange={(e) => allowNumberOrEmpty(e.target.value) && updateItem(it.rb, { serije: e.target.value })}
                          />
                        </td>

                        <td style={td}>
                          {timed ? (
                            <input
                              style={{ ...input, minWidth: 140 }}
                              value={String(timed)}
                              placeholder="sek"
                              onChange={(e) => {
                                const v = e.target.value;
                                if (!allowNumberOrEmpty(v)) return;

                                const sec = v === "" ? "" : Number(v);
                                const old = it.napomena || "";
                                const cleaned = old.replace(/time\s*=\s*\d+/gi, "").trim();

                                const nextNapomena =
                                  sec === ""
                                    ? cleaned
                                    : `${cleaned}${cleaned ? " " : ""}time=${sec}`;

                                updateItem(it.rb, { napomena: nextNapomena });
                              }}
                            />
                          ) : (
                            <input
                              style={{ ...input, minWidth: 140 }}
                              value={it.ponavljanja}
                              placeholder="-"
                              onChange={(e) =>
                                allowNumberOrEmpty(e.target.value) && updateItem(it.rb, { ponavljanja: e.target.value })
                              }
                            />
                          )}
                        </td>

                        <td style={td}>
                          <input
                            style={{ ...input, minWidth: 130 }}
                            value={it.pauza_sekundi}
                            placeholder="-"
                            onChange={(e) =>
                              allowNumberOrEmpty(e.target.value) && updateItem(it.rb, { pauza_sekundi: e.target.value })
                            }
                          />
                        </td>

                        <td style={td}>
                          <input
                            style={{ ...input, minWidth: 240 }}
                            value={it.napomena}
                            placeholder="-"
                            onChange={(e) => updateItem(it.rb, { napomena: e.target.value })}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button style={btn} type="submit" disabled={loading}>
              {loading ? "Čuvam..." : mode === "add" ? "Kreiraj trening" : "Sačuvaj izmene"}
            </button>
          </form>
        </div>
      )}
    </PageCard>
  );
}
