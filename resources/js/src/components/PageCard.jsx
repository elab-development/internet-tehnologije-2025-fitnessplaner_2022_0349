import React from "react";

export default function PageCard({ title, right, children }) {
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
  const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  };
  const h1 = {
    fontSize: 28,
    fontWeight: 800,
    color: "#1976d2",
    margin: 0,
    display: "flex",
    gap: 10,
    alignItems: "center",
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={header}>
          <h1 style={h1}>{title}</h1>
          <div>{right}</div>
        </div>
        {children}
      </div>
    </div>
  );
}
