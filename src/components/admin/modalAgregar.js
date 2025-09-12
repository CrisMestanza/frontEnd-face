import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function ModalAgregar({ isOpen, onClose, data, onAgregar }) {
    const [nombre, setNombre] = useState('');
    const [ip, setIp] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
    const [tipo, setTipo] = useState('');
    const [activo, setActivo] = useState('');
    const [clickExitoso, setClickExitoso] = useState(false);
    // Este useEffect se activa cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            setNombre('');
            setIp('');
            setTipo('');
            setActivo('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        const nuevaCamara = {
            nombrecamara: nombre,
            ipcamar: ip,
            corInicial: latitud,
            corFinal: longitud,
            activo: activo === "True", // convertir string a booleano
            idtipocamara: parseInt(tipo), // Asegúrate que sea un número
            estado: true,
        };
        onAgregar(nuevaCamara);
    };

    if (!isOpen) return null;

    const clickAbrirExitoso = () => {
        
        setClickExitoso(true);    // Luego abrimos el modal de éxito
    };

    const cerrarExito = () => {
        handleSubmit();          // Primero guardamos
        setClickExitoso(false);   // Cerrar el modal de éxito
        onClose();                // Cerrar el modal de editar también
    };

    const handleSuccessOverlayClick = () => {
        handleSubmit();          // Primero guardamos
        cerrarExito();            // Si hace click fuera del modal, también cerrarlo
    };
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Agregar Nueva Cámara</h2>
                <div className={styles.modalForm}>
                    <label>Nombre:</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />

                    <label>IP:</label>
                    <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} />

                    <label>Coordenada latitud:</label>
                    <input type="text" value={latitud} onChange={(e) => setLatitud(e.target.value)} />

                    <label>Coordenada longitud:</label>
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
                        <option value="">Seleccione opción</option>
                        <option value="True">Activo ✅</option>
                        <option value="False">No activo ❌</option>
                    </select>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose} className={styles.buttonCancel}>
                        Cancelar
                    </button>
                    <button onClick={clickAbrirExitoso} className={styles.buttonAdd}>
                        Agregar
                    </button>
                </div>
            </div>


            {/* Modal de éxito */}
            {clickExitoso && (
                <div className={styles.modalOverlay} onClick={handleSuccessOverlayClick}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>¡Se guardo correctamente! ✅</h2>
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
