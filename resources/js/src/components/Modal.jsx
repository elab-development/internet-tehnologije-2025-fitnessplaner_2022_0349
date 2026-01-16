import React, { useEffect } from "react";
import AppButton from "./AppButton";

export default function Modal({ open, title, text, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modalOverlay" onMouseDown={onCancel}>
      <div className="card modalBox" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalTitle">{title}</div>
        <div className="modalText">{text}</div>
        <div className="modalActions">
          <AppButton variant="ghost" onClick={onCancel}>
            Otkaži
          </AppButton>
          <AppButton onClick={onConfirm}>Potvrdi</AppButton>
        </div>
      </div>
    </div>
  );
}
