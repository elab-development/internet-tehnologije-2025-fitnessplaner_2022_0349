import React from "react";

export default function AppButton({
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
  children,
}) {
  const cls =
    variant === "ghost" ? "btn btnGhost" : "btn btnPrimary";

  return (
    <button className={cls} disabled={disabled} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
