// src/components/ConvertUsersModal.jsx
import React, { useState } from "react";
import "./ConvertUsersModal.css"; // Crea este archivo CSS

const ConvertUsersModal = ({
  isOpen,
  onClose,
  onConfirmConversion,
  selectedUserCount,
  ZONAS,
}) => {
  const [zona, setZona] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!zona) {
      setError("Por favor, selecciona una zona.");
      return;
    }
    setError("");
    onConfirmConversion(zona); // Pasa la zona seleccionada al padre
    setZona(""); // Reiniciar estado
  };

  if (!isOpen) return null;

  return (
    <div className="convert-modal-overlay">
      <div className="convert-modal-container">
        <button className="convert-modal-close-button" onClick={onClose}>
          ×
        </button>
        <h3>Convertir {selectedUserCount} Usuario(s) a Sereno</h3>
        <p>Selecciona la zona a la que se asignarán estos usuarios:</p>

        <div className="convert-modal-form-group">
          <label htmlFor="zona-select-convert" className="convert-modal-label">
            Zona:
          </label>
          <select
            id="zona-select-convert"
            className="convert-modal-select"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
          >
            <option value="">Selecciona una Zona</option>
            {ZONAS.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
          {error && <p className="convert-modal-error-message">{error}</p>}
        </div>

        <div className="convert-modal-actions">
          <button className="convert-modal-cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="convert-modal-confirm-button"
            onClick={handleConfirm}
          >
            Confirmar Conversión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertUsersModal;
