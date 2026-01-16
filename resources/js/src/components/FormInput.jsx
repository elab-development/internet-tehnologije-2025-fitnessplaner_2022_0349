import React from "react";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  helper,
}) {
  return (
    <div className="formRow">
      {label && <label className="label">{label}</label>}
      <input
        className="input"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={type === "password" ? "current-password" : "on"}
      />
      {helper && !error && <div className="helper">{helper}</div>}
      {error && <div className="errorText">{error}</div>}
    </div>
  );
}
