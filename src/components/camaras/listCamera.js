import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './ListCamera.module.css';  // Importamos el archivo CSS Module
import { BsCamera } from "react-icons/bs";
import { FaBars, FaTimes } from 'react-icons/fa';

const ListCamera = ({ handleCameraChange }) => {
  const [camaras, setCamaras] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (inputValue === '') {
      cargarCamaras();
    } else {
      chargeValue(inputValue);
    }
  }, [inputValue]);

  const cargarCamaras = () => {
    axios.get('http://127.0.0.1:8000/api/camaras/')
      .then(response => {
        setCamaras(response.data);
      })
      .catch(error => {
        console.error("Error al obtener cámaras:", error);
      });
  };

  const chargeValue = (value) => {
    axios.get(`http://127.0.0.1:8000/api/camaraSearch/${value}/`)
      .then(response => {
        setCamaras(response.data);
      })
      .catch(error => {
        console.error("Error al obtener cámaras:", error);
      });
  };

  if (!isSidebarOpen) {
    return (
      <div className={styles.ClaseCamara}>
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FaTimes className={styles.toggleIcon} />
        </button>

        <h1 style={{ fontSize: '25px', textAlign: 'center', color: 'white', marginTop: '50px' }}>
          Listado de cámaras
        </h1>

        <input
          className={styles.inputBuscar}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Buscar"
        />

        <div className={styles.Central} style={{ marginTop: '30px' }}>
          {camaras.map((camara, index) => (
            <button
              key={camara.idcamara}
              onClick={() => handleCameraChange(camara.ipcamar, camara.nombrecamara, camara.idcamara)}
              className={styles.cameraBtn}
            >
              <BsCamera /> {camara.nombrecamara}
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FaBars className={styles.toggleIcon} />
        </button>
      </div>
    );
  }
};

export default ListCamera;
