import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../aside/aside";
import styles from './graficos.module.css';
import useAlertas from "../newAlerta/useAlertas";
import { ToastContainer } from 'react-toastify';
const Imagenes = () => {
  const alertas = useAlertas();
  const idUsuario = sessionStorage.getItem('idusuario');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [estructura, setEstructura] = useState({});
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechasAbiertas, setFechasAbiertas] = useState({});
  const [camarasAbiertas, setCamarasAbiertas] = useState({});

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/verImagen/")
      .then(response => setEstructura(response.data))
      .catch(error => console.error("Error al cargar estructura:", error));
  }, []);

  const toggleFecha = (fecha) => {
    setFechasAbiertas(prev => ({
      ...prev,
      [fecha]: !prev[fecha]
    }));
  };

  const toggleCamara = (camaraKey) => {
    setCamarasAbiertas(prev => ({
      ...prev,
      [camaraKey]: !prev[camaraKey]
    }));
  };

  if (!idUsuario) {
    window.location.href = 'http://localhost:3000/';
    return null;
  }

  return (
    <div className={`${styles.mainContainer} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
      <Sidebar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <div className={styles.content} style={{ display: 'flex', height: '100vh' }}>
        {/* Panel izquierdo */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
          <h1 style={{
            color: '#3498db',
            fontSize: '2rem',
            fontWeight: '700',
            textAlign: 'center',
            letterSpacing: '2px',
            borderBottom: '4px solid #3498db',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Listado de Imágenes
          </h1>

          <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '1rem' }}>
            {Object.entries(estructura).map(([fecha, nombres]) => (
              <div key={fecha} style={{ marginBottom: '1rem' }}>
                <div
                  onClick={() => toggleFecha(fecha)}
                  style={{
                    cursor: 'pointer',
                    background: '#3498db',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  📅 {fecha}
                </div>

                {fechasAbiertas[fecha] && (
                  <div style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                    {Object.entries(nombres).map(([nombre, camaras]) => (
                      <div key={nombre} style={{ marginBottom: '1rem' }}>
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          marginBottom: '0.3rem',
                          color: '#34495e'
                        }}>
                          👤 {nombre}
                        </div>

                        {Object.entries(camaras).map(([camara, horas]) => {
                          const camaraKey = `${fecha}-${nombre}-${camara}`;
                          return (
                            <div key={camara} style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
                              <div
                                onClick={() => toggleCamara(camaraKey)}
                                style={{
                                  fontWeight: '500',
                                  color: '#555',
                                  cursor: 'pointer',
                                  background: '#ecf0f1',
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '6px',
                                  display: 'inline-block'
                                }}
                              >
                                📷 Cámara: {camara}
                              </div>

                              {camarasAbiertas[camaraKey] && (
                                <>
                                  {Object.entries(horas).map(([hora, imagenes]) => (
                                    <div key={hora} style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                                      <div style={{ fontStyle: 'italic', color: '#555' }}>
                                        🕒 Hora: {hora}
                                      </div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.3rem' }}>
                                        {Array.isArray(imagenes) && imagenes.length > 0 ? (
                                          imagenes.map((url, i) => (
                                            <img
                                              key={i}
                                              src={url}
                                              alt={`img-${i}`}
                                              width="100"
                                              style={{
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.2s',
                                              }}
                                              onClick={() => setImagenSeleccionada(url)}
                                              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                          ))
                                        ) : (
                                          <span style={{ color: 'red' }}>No hay imágenes</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho fijo */}
        {imagenSeleccionada && (
          <div style={{
            width: '50%',
            height: '100vh',
            padding: '1rem',
            borderLeft: '2px solid #ccc',
            background: '#f9f9f9',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setImagenSeleccionada(null)}
              style={{
                marginBottom: '1rem',
                marginTop: '5rem',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cerrar visualización
            </button>
            <img
              src={imagenSeleccionada}
              alt="Imagen grande"
              style={{
                width: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                cursor: 'zoom-in'
              }}
              onClick={() => setMostrarModal(true)}
            />
          </div>
        )}

        {/* Modal imagen fullscreen */}
        {mostrarModal && (
          <div
            onClick={() => setMostrarModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              cursor: 'zoom-out'
            }}
          >
            <img
              src={imagenSeleccionada}
              alt="Vista completa"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
              }}
            />
          </div>
        )}
      </div>
                            <ToastContainer toastStyle={{ marginTop: '80px' }} />
      
    </div>
  );
};

export default Imagenes;
