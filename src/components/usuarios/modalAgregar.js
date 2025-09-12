import React, { useState, useEffect } from 'react';
import styles from './usuarios.module.css';

export default function ModalAgregar({ isOpen, onClose, onAgregar }) {
    const [nombreusuario, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [dniusuario, setDniusuario] = useState('');
    const [admin, setAdmin] = useState('');
    const [clickExitoso, setClickExitoso] = useState(false);
    // Este useEffect se activa cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            setNombre('');
            setUsuario('');
            setDniusuario('');
            setAdmin('');
            setContrasena('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        const nuevaCamara = {
            nombreusuario: nombreusuario,
            usuario: usuario,
            contrasena: contrasena,
            dniusuario: parseInt(dniusuario), // Asegúrate que sea un número
            admin: admin, // convertir string a booleano
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
                <h2>Agregar nuevo usuario</h2>
                <div className={styles.modalForm}>
                    <label>NOMBRE:</label>
                    <input type="text" value={nombreusuario} onChange={(e) => setNombre(e.target.value)} />

                    <label>DNI:</label>
                    <input type="text" value={dniusuario} onChange={(e) => setDniusuario(e.target.value)} />

                    <label>USUARIO:</label>
                    <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} />

                    <label>CONTRASEÑA:</label>
                    <input type="text" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />


                    <label>ADMIN:</label>
                    <select value={admin} onChange={(e) => setAdmin(e.target.value)}>
                        <option value="">Seleccione opción</option>
                        <option value="True">SI ✅</option>
                        <option value="False">No ❌</option>
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
