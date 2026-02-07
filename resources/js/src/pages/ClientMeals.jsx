import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDnevnikByDate,
  addStavkaIshrane,
  deleteStavkaIshrane,
  getNamirnice,
  offSearch,
  offImport,
} from "../api";

export default function ClientMeals() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [datum, setDatum] = useState(today);

  const [data, setData] = useState(null);
  const [namirnice, setNamirnice] = useState([]);

  const [namirnicaId, setNamirnicaId] = useState("");
  const [kolicina, setKolicina] = useState(100);
  const [obrok, setObrok] = useState("dorucak");
  const [vreme, setVreme] = useState("");

  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();


  async function load() {
    const [d, n] = await Promise.all([getDnevnikByDate(datum), getNamirnice()]);
    setData(d);
    setNamirnice(n);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datum]);

  async function onAdd() {
    if (!namirnicaId) return;

    await addStavkaIshrane({
      datum,
      namirnica_id: Number(namirnicaId),
      kolicina_g: Number(kolicina),
      obrok,
      vreme: vreme ? `${vreme}:00` : null,
    });

    setNamirnicaId("");
    setKolicina(100);
    setVreme("");
    await load();
  }

  async function onDelete(id) {
    await deleteStavkaIshrane(id);
    await load();
  }

  async function onNxSearch() {
    const r = await offSearch(q);
    setResults(r || []);
  }

  async function onNxPick(item) {
    const n = item.nutriments || {};
    const payload = {
      name: item.name,
      kcal_100g: n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0,
      p_100g: n.proteins_100g ?? 0,
      carb_100g: n.carbohydrates_100g ?? 0,
      fat_100g: n.fat_100g ?? 0,
    };

    const r = await offImport(payload);
    setNamirnicaId(String(r.namirnica_id));
    await load();
  }

    const stavke = data?.stavke ?? [];

    const selected = useMemo(() => {
    const id = Number(namirnicaId);
    return namirnice.find((x) => x.id === id) || null;
    }, [namirnicaId, namirnice]);

    const amount = Number(kolicina) || 0;
    const factor = amount / 100;

    const preview = useMemo(() => {
      if (!selected || amount <= 0) {
        return { kcal: 0, p: 0, uh: 0, m: 0 };
      }

      const kcal100 = Number(selected.kalorije_na_100g) || 0;
      const p100 = Number(selected.proteini_na_100g) || 0;
      const uh100 = Number(selected.ugljeni_hidrati_na_100g) || 0;
      const m100 = Number(selected.masti_na_100g) || 0;

      return {
        kcal: kcal100 * factor,
        p: p100 * factor,
        uh: uh100 * factor,
        m: m100 * factor,
      };
    }, [selected, amount, factor]);


  return (
    <div style={styles.page}>
      <div style={styles.header}>
          <div>
            <div style={styles.title}>Dnevnik ishrane</div>
            <div style={styles.subtitle}>Dodaj obroke, pregledaj stavke i makroe po danu.</div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
            <div style={styles.dateBox}>
              <label style={styles.label}>Datum</label>
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                style={styles.dateInput}
              />
            </div>

            <button
              onClick={() => navigate(`/korisnik/ishrana/statistika?date=${datum}`)}
              style={styles.secondaryBtn}
            >
              📊 Statistika
            </button>
          </div>
        </div>


      <div style={styles.gridTop}>
        <div style={styles.card}>
          <div style={styles.cardHeaderRow}>
            <div style={styles.cardTitle}>Ukupno za dan</div>
            <div style={styles.pill}>Automatsko računanje</div>
          </div>

          <div style={styles.macroRow}>
            <Macro label="Kcal" value={data?.totali?.kalorije ?? 0} />
            <Macro label="P" value={data?.totali?.proteini ?? 0} />
            <Macro label="UH" value={data?.totali?.ugljeni_hidrati ?? 0} />
            <Macro label="M" value={data?.totali?.masti ?? 0} />
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Pretraga namirnica (OpenFoodFacts)</div>

          <div style={styles.searchRow}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="npr. banana, yogurt, kikiriki..."
              style={styles.searchInput}
            />
            <button
              onClick={onNxSearch}
              disabled={q.trim().length < 2}
              style={styles.primaryBtn}
            >
              Traži
            </button>
          </div>

          <div style={styles.results}>
            {(results || []).slice(0, 8).map((x, i) => (
              <button
                key={i}
                onClick={() => onNxPick(x)}
                style={styles.resultItem}
              >
                <div style={styles.resultName}>{x.name}</div>
                <div style={styles.resultHint}>Klikni da uvezeš u bazu</div>
              </button>
            ))}

            {(results || []).length === 0 && (
              <div style={styles.muted}>
                Nema rezultata. Unesi bar 2 slova i klikni “Traži”.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Dodaj stavku u dnevnik</div>

        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>Namirnica</label>
            <select
              value={namirnicaId}
              onChange={(e) => setNamirnicaId(e.target.value)}
              style={styles.select}
            >
              <option value="">Izaberi namirnicu</option>
              {namirnice.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.naziv}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>Količina (g)</label>
            <input
              type="number"
              min="1"
              value={kolicina}
              onChange={(e) => setKolicina(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Obrok</label>
            <select
              value={obrok}
              onChange={(e) => setObrok(e.target.value)}
              style={styles.select}
            >
              <option value="dorucak">Doručak</option>
              <option value="rucak">Ručak</option>
              <option value="vecera">Večera</option>
              <option value="uzina">Užina</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Vreme</label>
            <input
              type="time"
              value={vreme}
              onChange={(e) => setVreme(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{ display: "flex", alignItems: "end" }}>
            <button
              onClick={onAdd}
              disabled={!namirnicaId}
              style={styles.addBtn}
            >
              + Dodaj
            </button>
          </div>
        </div>

        <div style={styles.previewRow}>
          {!selected ? (
            <div style={styles.muted}>Izaberi namirnicu da vidiš preračun za količinu.</div>
          ) : (
            <>
              <div style={styles.previewLeft}>
                <div style={styles.previewName}>{selected.naziv}</div>
                <div style={styles.previewHint}>
                  Preračun za <b>{amount || 0}g</b>
                </div>
              </div>

              <div style={styles.previewMacros}>
                <span style={styles.previewChip}>Kcal: {preview.kcal.toFixed(0)}</span>
                <span style={styles.previewChip}>P: {preview.p.toFixed(1)}g</span>
                <span style={styles.previewChip}>UH: {preview.uh.toFixed(1)}g</span>
                <span style={styles.previewChip}>M: {preview.m.toFixed(1)}g</span>
              </div>
            </>
          )}
        </div>


      </div>

      <div style={styles.mealsGrid}>
        <MealCard
          title="Doručak"
          items={stavke.filter((s) => s.obrok === "dorucak")}
          onDelete={onDelete}
        />
        <MealCard
          title="Ručak"
          items={stavke.filter((s) => s.obrok === "rucak")}
          onDelete={onDelete}
        />
        <MealCard
          title="Večera"
          items={stavke.filter((s) => s.obrok === "vecera")}
          onDelete={onDelete}
        />
        <MealCard
          title="Užina"
          items={stavke.filter((s) => s.obrok === "uzina")}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

function Macro({ label, value }) {
  return (
    <div style={styles.macro}>
      <div style={styles.macroLabel}>{label}</div>
      <div style={styles.macroValue}>{Number(value).toFixed(0)}</div>
    </div>
  );
}

function MealCard({ title, items, onDelete }) {
  return (
    <div style={styles.mealCard}>
      <div style={styles.mealHeader}>
        <div style={styles.mealTitle}>{title}</div>
        <div style={styles.mealCount}>{items.length} stavki</div>
      </div>

      {items.length === 0 ? (
        <div style={styles.muted}>Nema stavki.</div>
      ) : (
        <div style={styles.mealList}>
          {items.map((s) => (
            <div key={s.id} style={styles.mealItem}>
              <div>
                <div style={styles.itemName}>
                  {s.namirnica?.naziv || "Namirnica"}
                </div>
                <div style={styles.itemMeta}>
                  {s.kolicina_g}g{" "}
                  {s.vreme ? `• ${String(s.vreme).slice(0, 5)}` : ""}
                </div>
              </div>

              <button
                onClick={() => onDelete(s.id)}
                style={styles.dangerBtn}
                title="Obriši"
              >
                Obriši
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
    page: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "18px 16px 40px",
      background: "#f7fbff",
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      gap: 16,
      alignItems: "flex-end",
      flexWrap: "wrap",
      marginBottom: 16,
    },
    title: { fontSize: 26, fontWeight: 900, color: "#0f172a" },
    subtitle: { marginTop: 6, color: "#475569", fontWeight: 600 },
    dateBox: { display: "grid", gap: 6, minWidth: 220 },
    label: { fontSize: 12, fontWeight: 800, color: "#334155" },
    dateInput: {
      border: "1px solid #dbeafe",
      borderRadius: 12,
      padding: "10px 12px",
      background: "#fff",
      fontWeight: 800,
    },

    gridTop: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
      marginBottom: 14,
    },
    card: {
      background: "#fff",
      border: "1px solid #e6eef7",
      borderRadius: 16,
      padding: 14,
      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
    },
    cardTitle: { fontWeight: 900, color: "#0f172a", marginBottom: 10 },
    cardHeaderRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
    },
    pill: {
      fontSize: 12,
      fontWeight: 900,
      padding: "6px 10px",
      borderRadius: 999,
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      color: "#1d4ed8",
    },

    macroRow: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 10,
      marginTop: 12,
    },
    macro: {
      border: "1px solid #e6eef7",
      borderRadius: 14,
      padding: 10,
      background: "#f8fbff",
    },
    macroLabel: { fontSize: 12, fontWeight: 900, color: "#475569" },
    macroValue: {
      fontSize: 18,
      fontWeight: 900,
      color: "#0f172a",
      marginTop: 6,
    },

    searchRow: { display: "flex", gap: 10, alignItems: "center" },
    searchInput: {
      flex: 1,
      border: "1px solid #dbeafe",
      borderRadius: 12,
      padding: "10px 12px",
      background: "#fff",
      fontWeight: 700,
    },
    primaryBtn: {
      border: 0,
      borderRadius: 12,
      padding: "10px 14px",
      background: "#1e88e5",
      color: "#fff",
      fontWeight: 900,
      cursor: "pointer",
      minWidth: 90,
    },

    results: { marginTop: 10, display: "grid", gap: 8 },
    resultItem: {
      textAlign: "left",
      border: "1px solid #e6eef7",
      borderRadius: 14,
      padding: 10,
      background: "#fff",
      cursor: "pointer",
    },
    resultName: { fontWeight: 900, color: "#0f172a" },
    resultHint: { fontSize: 12, fontWeight: 700, color: "#64748b", marginTop: 2 },

    formGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
      gap: 10,
      alignItems: "end",
    },
    select: {
      width: "100%",
      border: "1px solid #dbeafe",
      borderRadius: 12,
      padding: "10px 12px",
      background: "#fff",
      fontWeight: 800,
    },
    input: {
      width: "100%",
      border: "1px solid #dbeafe",
      borderRadius: 12,
      padding: "10px 12px",
      background: "#fff",
      fontWeight: 800,
    },
    addBtn: {
      border: 0,
      borderRadius: 12,
      padding: "10px 14px",
      background: "#10b981",
      color: "#fff",
      fontWeight: 900,
      cursor: "pointer",
      minWidth: 110,
    },

    mealsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 14,
      marginTop: 14,
    },
    mealCard: {
      background: "#fff",
      border: "1px solid #e6eef7",
      borderRadius: 16,
      padding: 14,
      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
    },
    mealHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    mealTitle: { fontWeight: 900, color: "#0f172a" },
    mealCount: { fontSize: 12, fontWeight: 900, color: "#64748b" },
    mealList: { display: "grid", gap: 10 },
    mealItem: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      alignItems: "center",
      border: "1px solid #eef2ff",
      borderRadius: 14,
      padding: 10,
      background: "#f8fafc",
    },
    itemName: { fontWeight: 900, color: "#0f172a" },
    itemMeta: { fontSize: 12, fontWeight: 700, color: "#64748b", marginTop: 3 },

    dangerBtn: {
      border: "1px solid #fecaca",
      borderRadius: 12,
      padding: "8px 10px",
      background: "#fff",
      color: "#b91c1c",
      fontWeight: 900,
      cursor: "pointer",
    },
    muted: { color: "#64748b", fontWeight: 700 },

  previewRow: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    border: "1px solid #e6eef7",
    background: "#f8fbff",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
    previewLeft: { display: "grid", gap: 2 },
    previewName: { fontWeight: 900, color: "#0f172a" },
    previewHint: { fontSize: 12, fontWeight: 700, color: "#64748b" },
    previewMacros: { display: "flex", gap: 8, flexWrap: "wrap" },
    previewChip: {
      fontSize: 12,
      fontWeight: 900,
      padding: "6px 10px",
      borderRadius: 999,
      background: "#ffffff",
      border: "1px solid #dbeafe",
      color: "#0f172a",
    },


    secondaryBtn: {
      padding: "10px 14px",
      borderRadius: 14,
      border: "1px solid #cfe3fb",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 900,
    },


};
