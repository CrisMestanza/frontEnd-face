import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../aside/aside";
import styles from './personas.module.css';
import { useNavigate } from "react-router-dom";
import useAlertas from "../newAlerta/useAlertas";
import { ToastContainer } from 'react-toastify';

const Persona = () => {
  const alertas = useAlertas();
  const idUsuario = sessionStorage.getItem('idusuario');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [personas, setPersonas] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/getPersonasRq/')
      .then(res => setPersonas(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!idUsuario) {
    window.location.href = 'http://localhost:3000/';
    return null;
  }

  return (
    <div className={`${styles.mainContainer} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className={styles.content}>
        <h1>Personas capturadas</h1>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((persona, index) => (
                <tr key={persona.idpersona} className={styles.row}>
                  <td>{index + 1}</td>
                  <td
                    onClick={() => navigate(`/mapa/${persona.idpersona}`)}
                    style={{ cursor: 'pointer', color: '#255' }}
                  >
                    {persona.nombre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer toastStyle={{ marginTop: '80px' }} />
    </div>
  );
};

export default Persona;
