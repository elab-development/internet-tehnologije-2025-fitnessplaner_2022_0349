import React from "react";

export default function UserHome({ onLogout }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>User dashboard</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
