import React, { useState } from "react";
import "./floating.css";

const FloatingLabelInput = ({ label, type = "text", value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`form-group ${focused || value ? "focused" : ""}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        placeholder=" "
      />
      <label>{label}</label>
    </div>
  );
};

export default FloatingLabelInput;
