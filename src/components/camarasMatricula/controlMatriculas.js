import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../aside/aside";
import ListCamera from "./listCameraMatriculas";
import styles from './control.module.css';
import { useNavigate } from 'react-router-dom';
import useAlertas from "../newAlerta/useAlertas";
import { ToastContainer } from 'react-toastify';
import Navbar from "../nabvar/Navbar";
const ControlMatricula = () => {
  const alertas = useAlertas();
  const idUsuario = sessionStorage.getItem('idusuario');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCameras, setSelectedCameras] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCameraChange = (camera, nombre, idCamara) => {
    const idusuario = sessionStorage.getItem('idusuario');
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0];

    const datos = {
      idusuario: idusuario,
      idcamara: idCamara,
      fecha: fecha,
      hora: hora,
    };

    const isSelected = selectedCameras.some(cam => cam.id === camera);

    if (isSelected) {
      setSelectedCameras(prev => prev.filter(cam => cam.id !== camera));

      axios.post(`http://192.168.100.32:8000/api/deseleccionar_camara/${camera}/`)

        .then(response => {
          console.log("Cámara deseleccionada", response.data);
        })
        .catch(error => {
          console.error("Error al deseleccionar cámara:", error);
        });
    } else {
      setSelectedCameras(prev => [...prev, { id: camera, nombre }]);

      axios.post('http://192.168.100.32:8000/api/usuariosLogueado/', datos)
        .then(response => {
          console.log("Respuesta del backend:", response.data);
        })
        .catch(error => {
          console.error("Error en el login:", error);
        });
    }
  };

  const getGridClass = () => {
    return styles.twoColumns;
  };

  // Redirección antes del return
  if (!idUsuario) {
    window.location.href = 'http://localhost:3000/';
    return null;
  }

  return (
    <div className={`${styles.mainContainer} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
      <Navbar />
      <div style={{display: 'flex'}}> 
        <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <ListCamera handleCameraChange={handleCameraChange} />
      </div>

      <div className={styles.content}>
        <h1 style={{
          color: '#3498db',
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          letterSpacing: '2px',
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          borderBottom: '4px solid #3498db',
          fontFamily: "'Poppins', sans-serif"
        }}>
          Video de Cámaras
        </h1>

        <div className={`${styles.cameraContainer} ${getGridClass()}`}>
          {selectedCameras.map(({ id, nombre }) => (
            <div className={styles.cameraBox} key={id}>
              <p>Cámara {nombre}</p>
              <img
                // src={`http://192.168.100.32:8000/api/camera_feed/${id}/${nombre}/`}
                src={`http://192.168.100.32:8000/api/camera_feed/${id}/`}
                alt={`Cámara ${id}`}
                style={{ width: "100%", maxWidth: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
      <ToastContainer toastStyle={{ marginTop: '80px' }} />
    </div>
  );
};

export default ControlMatricula;
