import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDnevnikByDate } from "../api";

/** helpers */
function addDays(dateStr, days) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function startOfWeek(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay(); // 0=ned
  const diff = day === 0 ? -6 : 1 - day; // pon kao start
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}
function inWeek(dateStr, weekStart) {
  const end = addDays(weekStart, 6);
  return dateStr >= weekStart && dateStr <= end;
}
function fmtShort(dateStr) {
  const [, m, d] = dateStr.split("-");
  return `${m}-${d}`;
}
function round2(x) {
  return Math.round((Number(x) || 0) * 100) / 100;
}

const COLORS = {
  uh: "#ff4da6",
  p: "#0b2a7a",
  m: "#7c3aed",
};

/** mini pie */
function Pie({ p = 0, uh = 0, m = 0, size = 150 }) {
  const total = p + uh + m;
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;

  const parts =
    total > 0
      ? [
          { key: "uh", v: uh, color: COLORS.uh },
          { key: "p", v: p, color: COLORS.p },
          { key: "m", v: m, color: COLORS.m },
        ]
      : [];

  let offset = 0;

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#e5e7eb"
        strokeWidth="12"
        fill="none"
      />
      {parts.map((part) => {
        const frac = part.v / total;
        const dash = c * frac;
        const el = (
          <circle
            key={part.key}
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={part.color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += dash;
        return el;
      })}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontWeight: 900, fill: "#0f172a", fontSize: 14 }}
      >
        {total > 0 ? `${Math.round(total)}g` : "0g"}
      </text>
    </svg>
  );
}

/** anim bar */
function AnimatedBar({ value, maxValue, color, label }) {
  const hMax = 110;
  const target =
    maxValue > 0 ? Math.max(6, Math.round((value / maxValue) * hMax)) : 6;
  const [h, setH] = useState(6);

  useEffect(() => {
    setH(6);
    const t = requestAnimationFrame(() => setH(target));
    return () => cancelAnimationFrame(t);
  }, [target, value, maxValue]);

  return (
    <div style={{ display: "grid", gap: 4, justifyItems: "center" }}>
      {/* broj iznad stubica */}
      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800 }}>
        {Math.round(value)}g
      </div>

      <div
        style={{
          width: 16,
          height: h,
          background: color,
          borderRadius: 10,
          transition: "height 420ms cubic-bezier(.2,.8,.2,1)",
        }}
        title={`${label}: ${Math.round(value)}g`}
      />

      <div style={{ fontSize: 10, fontWeight: 900, color: "#64748b" }}>
        {label}
      </div>
    </div>
  );
}

export default function ClientMealsStats() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const initialDate = params.get("date") || today;

  const [mode, setMode] = useState("day"); // day | week

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [weekStart, setWeekStart] = useState(startOfWeek(initialDate));

  const [dayTotals, setDayTotals] = useState({
    kalorije: 0,
    proteini: 0,
    ugljeni_hidrati: 0,
    masti: 0,
  });

  const [weekData, setWeekData] = useState([]); // [{date,p,uh,m}]

  // kad se promeni selectedDate, osiguraj da weekStart prati selekciju
  useEffect(() => {
    const ws = startOfWeek(selectedDate);
    if (ws !== weekStart) setWeekStart(ws);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // učitaj dnevne totale
  useEffect(() => {
    (async () => {
      const d = await getDnevnikByDate(selectedDate);
      setDayTotals(
        d?.totali ?? { kalorije: 0, proteini: 0, ugljeni_hidrati: 0, masti: 0 }
      );
    })();
  }, [selectedDate]);

  // učitaj 7 dana kad treba
  useEffect(() => {
    if (mode !== "week") return;

    (async () => {
      const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      const all = await Promise.all(days.map((d) => getDnevnikByDate(d)));

      const mapped = days.map((d, idx) => {
        const t = all[idx]?.totali ?? {};
        return {
          date: d,
          p: Number(t.proteini || 0),
          uh: Number(t.ugljeni_hidrati || 0),
          m: Number(t.masti || 0),
        };
      });

      setWeekData(mapped);
    })();
  }, [mode, weekStart]);

  const p = Number(dayTotals.proteini || 0);
  const uh = Number(dayTotals.ugljeni_hidrati || 0);
  const m = Number(dayTotals.masti || 0);

  // procenat za legendu (P/UH/M)
  const totalG = p + uh + m;
  const pct = (x) => (totalG > 0 ? Math.round((x / totalG) * 100) : 0);

  const maxWeek = weekData.length
    ? Math.max(1, ...weekData.map((x) => Math.max(x.p, x.uh, x.m)))
    : 1;

  // dan napred/nazad: pomeri selectedDate i automatski će useEffect pomeriti weekStart
  function moveDay(delta) {
    const next = addDays(selectedDate, delta);
    setSelectedDate(next);
  }

  // nedelja napred/nazad: pomeri weekStart i zadrži selektovan dan u toj nedelji
  function moveWeek(deltaWeeks) {
    const nextWeekStart = addDays(weekStart, deltaWeeks * 7);
    setWeekStart(nextWeekStart);

    // ako selektovan datum ispadne iz nedelje, prebaci na prvi dan te nedelje
    if (!inWeek(selectedDate, nextWeekStart)) {
      setSelectedDate(nextWeekStart);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Statistika ishrane</div>
          <div style={styles.sub}>Pregled makroa po danu i po nedelji</div>
        </div>

        <div style={styles.topActions}>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/korisnik/ishrana")}
          >
            ← Nazad
          </button>

          <div style={styles.segment}>
            <button
              style={mode === "day" ? styles.segBtnActive : styles.segBtn}
              onClick={() => setMode("day")}
            >
              Dan
            </button>
            <button
              style={mode === "week" ? styles.segBtnActive : styles.segBtn}
              onClick={() => setMode("week")}
            >
              7 dana
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>
      </div>

      <div style={styles.navRow}>
        <button style={styles.navBtn} onClick={() => moveDay(-1)}>
          ← Dan
        </button>
        <button style={styles.navBtn} onClick={() => moveDay(1)}>
          Dan →
        </button>
        <button style={styles.navBtn} onClick={() => moveWeek(-1)}>
          ← Nedelja
        </button>
        <button style={styles.navBtn} onClick={() => moveWeek(1)}>
          Nedelja →
        </button>
      </div>

      {mode === "day" ? (
        <div style={styles.dayGrid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Makroi (dan)</div>
            <Pie p={p} uh={uh} m={m} />

            {/* legenda: tackica levo, samo P/UH/M i procenat */}
            <div style={styles.legendRow}>
              <LegendPct color={COLORS.p} label="P" percent={pct(p)} />
              <LegendPct color={COLORS.uh} label="UH" percent={pct(uh)} />
              <LegendPct color={COLORS.m} label="M" percent={pct(m)} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Detalji</div>
            <div style={styles.kpiRow}>
              <Kpi label="Kalorije" value={`${round2(dayTotals.kalorije)} kcal`} />
              <Kpi label="Proteini" value={`${round2(p)} g`} />
              <Kpi label="UH" value={`${round2(uh)} g`} />
              <Kpi label="Masti" value={`${round2(m)} g`} />
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.weekRow}>
          {weekData.map((d) => (
            <div
              key={d.date}
              style={{
                ...styles.weekCard,
                outline: d.date === selectedDate ? "2px solid #93c5fd" : "none",
              }}
              onClick={() => setSelectedDate(d.date)}
              role="button"
              tabIndex={0}
            >
              <div style={styles.weekTop}>
                <div style={styles.weekDate}>{fmtShort(d.date)}</div>
                <div style={styles.weekGram}>
                  {Math.round(d.p + d.uh + d.m)} g
                </div>
              </div>

              <div style={styles.barsRow}>
                <AnimatedBar
                  value={d.uh}
                  maxValue={maxWeek}
                  color={COLORS.uh}
                  label="UH"
                />
                <AnimatedBar
                  value={d.p}
                  maxValue={maxWeek}
                  color={COLORS.p}
                  label="P"
                />
                <AnimatedBar
                  value={d.m}
                  maxValue={maxWeek}
                  color={COLORS.m}
                  label="M"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LegendPct({ color, label, percent }) {
  return (
    <div style={styles.legendItem}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
        }}
      />
      <span style={{ fontWeight: 950, color: "#334155", fontSize: 12 }}>
        {label}
      </span>
      <span style={{ fontWeight: 900, color: "#94a3b8", fontSize: 12 }}>
        {percent}%
      </span>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div style={styles.kpi}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: { padding: 20, maxWidth: 1200, margin: "0 auto", color: "#0f172a" },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: 950, letterSpacing: -0.5 },
  sub: { color: "#64748b", fontWeight: 700, marginTop: 4 },

  topActions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  backBtn: {
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },

  segment: {
    display: "flex",
    gap: 8,
    padding: 6,
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    background: "#f8fafc",
  },
  segBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid transparent",
    background: "transparent",
    fontWeight: 950,
    cursor: "pointer",
    color: "#334155",
  },
  segBtnActive: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    fontWeight: 950,
    cursor: "pointer",
    color: "#1d4ed8",
  },

  dateInput: {
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px solid #dbeafe",
    outline: "none",
    fontWeight: 900,
  },

  navRow: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  navBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },

  dayGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 },
  card: {
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 34px rgba(15, 23, 42, 0.06)",
    padding: 16,
  },
  cardTitle: { fontWeight: 950, fontSize: 16, marginBottom: 12 },

  // legenda pored kruga
  legendRow: { display: "grid", gap: 10, marginTop: 12 },
  legendItem: { display: "flex", alignItems: "center", gap: 8 },

  kpiRow: { display: "grid", gap: 10 },
  kpi: { padding: 12, borderRadius: 16, border: "1px solid #eef2f7", background: "#fff" },
  kpiLabel: { fontSize: 12, fontWeight: 900, color: "#64748b" },
  kpiValue: { fontSize: 16, fontWeight: 950, marginTop: 4 },

  // svih 7 dana bez skrola
  weekRow: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 12,
    marginTop: 14,
  },
  weekCard: {
    border: "1px solid #eef2f7",
    borderRadius: 22,
    padding: 14,
    background: "#fff",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    minWidth: 0,
  },

  weekTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 },
  weekDate: { fontWeight: 950 },
  weekGram: { fontWeight: 900, color: "#64748b", fontSize: 12 },
  barsRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, height: 150 },
};
