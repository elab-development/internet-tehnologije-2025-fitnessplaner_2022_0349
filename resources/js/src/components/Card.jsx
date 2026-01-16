import React from "react";

export default function Card({ title, text, footer }) {
  return (
    <div className="card" style={{ padding: 16, borderRadius: 18 }}>
      <div style={{ fontWeight: 900, color: "#1e3a8a", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>
        {text}
      </div>
      {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
    </div>
  );
}
