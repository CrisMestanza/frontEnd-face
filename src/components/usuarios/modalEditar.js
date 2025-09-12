import React, { useState, useEffect } from 'react';
import styles from './usuarios.module.css';

export default function ModalEditar({ isOpen, onClose, data, dataEditar, onEditar }) {
    const [nombreusuario, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [dniusuario, setDniusuario] = useState('');
    const [admin, setAdmin] = useState('');
    const [clickExitoso, setClickExitoso] = useState(false);

    useEffect(() => {
        if (isOpen && dataEditar) {
            setNombre(dataEditar.nombreusuario || '');
            setUsuario(dataEditar.usuario || '');
            setContrasena(dataEditar.contrasena  ||'');
            setDniusuario(dataEditar.dniusuario);
            setAdmin(dataEditar.admin );
        }
    }, [isOpen, dataEditar]);

    const handleSubmit = () => {
        const camaraActualizada = {
            idusuario: dataEditar.idusuario,
            nombreusuario: nombreusuario,
            usuario: usuario,
            contrasena: contrasena,
            dniusuario: parseInt(dniusuario), // Asegúrate que sea un número
            admin: admin, // convertir string a booleano
            estado: true,
        };
        onEditar(camaraActualizada);
    };

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

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Editar Cámara</h2>
                <div className={styles.modalForm}>
                    <label>NOMBRE:</label>
                    <input type="text" value={nombreusuario} onChange={(e) => setNombre(e.target.value)} />

                    <label>DNI:</label>
                    <input type="text" value={dniusuario} onChange={(e) => setDniusuario(e.target.value)} />

                    <label>USUARIO:</label>
                    <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} />

                    <label>CONTRASEÑA:</label>
                    <input type="text" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />


                    <label>Activo:</label>
                    <select value={admin} onChange={(e) => setAdmin(e.target.value)}>
                        {admin === "true" ? (
                            <>
                                <option value="true">ADMIN ✅</option>
                                <option value="false">NO ADMIN  ❌</option>
                            </>
                        ) : (
                            <>
                                <option value="false">NO ADMIN ❌</option>
                                <option value="true">ADMIN ✅</option>
                            </>
                        )}
                    </select>
                </div>

                <div className={styles.modalActions}>
                    <button onClick={onClose} className={styles.buttonCancel}>
                        Cancelar
                    </button>
                    <button onClick={clickAbrirExitoso} className={styles.buttonAdd}>
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {/* Modal de éxito */}
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
