import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../aside/aside"; // Asegúrate de la ruta correcta
import styles from './extraccion.module.css';
import Modal from './modalLimpieza';


const ExtraccionMatriculas = () => {
    const idUsuario = sessionStorage.getItem('idusuario'); //Para validar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);


    const limpiarCarpetas = (e) => {
        e.preventDefault();

            axios.get(`http://192.168.100.32:8000/api/limpieza/`)
                .then(response => {
                    console.log(response.data);
                    openModal();
        
                })
                .catch(error => {
                    console.error("Error al limpiar carpetas:", error);
                });
  
  
    }
    const extraerPlacas = () => {

            axios.get(`http://192.168.100.32:8000/api/extraerPlacas/`)
                .then(response => {
                    console.log(response.data);
                    openModal();
            
                })
                .catch(error => {
                    console.error("Error al limpiar carpetas:", error);
                });

    
   
    }

    if (idUsuario === null || idUsuario === undefined) {
        window.location.href = 'http://localhost:3000/';
    } else {
        return (
            <div className={`${styles.container} ${isSidebarOpen ? '' : styles.sidebarClosed}`} >
                {/* Sidebar con la capacidad de abrir/cerrar */}
                <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <div className={styles.content}>
                    <h1>Procesamiento de los datos</h1>
                    <br></br>
                    <div style={{ display: 'flex' }}>
                        <button className={styles.buttonAdd} onClick={limpiarCarpetas}>
                            Limpiar carpetas
                        </button>
                        <button className={styles.buttonAdd} onClick={extraerPlacas}>
                            Extraer placas
                        </button>
                    </div>
                    <Modal isOpen={isOpen} closeModal={closeModal} />
                </div>
            </div>
        );
    }
};

export default ExtraccionMatriculas;
