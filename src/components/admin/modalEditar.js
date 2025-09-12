import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function ModalEditar({ isOpen, onClose, data, dataEditar, onEditar }) {
  const [nombre, setNombre] = useState('');
  const [ip, setIp] = useState('');
  const [tipo, setTipo] = useState('');
  const [activo, setActivo] = useState('');
  const [clickExitoso, setClickExitoso] = useState(false);
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');

  useEffect(() => {
    if (isOpen && dataEditar) {
      setNombre(dataEditar.nombrecamara || '');
      setIp(dataEditar.ipcamar || '');
      setTipo(dataEditar.tipoCamara ? dataEditar.tipoCamara.idtipocamara : '');
      setActivo(dataEditar.activo ? "True" : "False");
      setLatitud(dataEditar.corInicial || '');
      setLongitud(dataEditar.corFinal || '');
    }
  }, [isOpen, dataEditar]);

  const handleSubmit = () => {
    const camaraActualizada = {
      idcamara: dataEditar.idcamara,
      nombrecamara: nombre,
      ipcamar: ip,
      activo: activo === "True",
      idtipocamara: parseInt(tipo),
      estado: true,
      corInicial: latitud,
      corFinal: longitud,
    };
    onEditar(camaraActualizada);
  };

  const abrirExito = () => {
    setClickExitoso(true);
  };

  const cerrarExito = () => {
    handleSubmit();
    setClickExitoso(false);
    onClose();
  };

  const handleSuccessOverlayClick = () => {
    cerrarExito();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Editar Cámara</h2>
        <div className={styles.modalForm}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />

          <label>IP:</label>
          <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} />

          <label>Latitud:</label>
          <input type="text" value={latitud} onChange={(e) => setLatitud(e.target.value)} />

          <label>Longitud:</label>
          <input type="text" value={longitud} onChange={(e) => setLongitud(e.target.value)} />

          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Seleccione un tipo</option>
            {data.map((tipo) => (
              <option key={tipo.idtipocamara} value={tipo.idtipocamara}>
                {tipo.nombretipocamara}
              </option>
            ))}
          </select>

          <label>Activo:</label>
          <select value={activo} onChange={(e) => setActivo(e.target.value)}>
            {activo === "True" ? (
              <>
                <option value="True">Activo ✅</option>
                <option value="False">No activo ❌</option>
              </>
            ) : (
              <>
                <option value="False">No activo ❌</option>
                <option value="True">Activo ✅</option>
              </>
            )}
          </select>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.buttonCancel}>
            Cancelar
          </button>
          <button onClick={abrirExito} className={styles.buttonAdd}>
            Guardar Cambios
          </button>
        </div>
      </div>

      {clickExitoso && (
        <div className={styles.modalOverlay} onClick={handleSuccessOverlayClick}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>¡Se editó correctamente! ✅</h2>
            <div className={styles.modalActions} style={{ justifyContent: 'center' }}>
              <button onClick={cerrarExito} className={styles.buttonAdd}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
