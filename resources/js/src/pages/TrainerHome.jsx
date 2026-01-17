import React from "react";

export default function TrainerHome({ onLogout }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Trainer dashboard</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
