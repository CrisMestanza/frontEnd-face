import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from "../aside/aside";
import styles from './graficos.module.css';



import { ToastContainer, toast } from 'react-toastify'; // Si quieres aviso emergente
import 'react-toastify/dist/ReactToastify.css';
const Mapa = () => {
  const idUsuario = sessionStorage.getItem('idusuario');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [camaras, setCamaras] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [bandas, setBandas] = useState([]);
  const [tarapoto, setTarapoto] = useState([]);
  const [morales, setMorales] = useState([]);
  const mapRef = useRef(null);

  const markersRef = useRef({
    camaraMarkers: [],
    bandaMarkers: {},    // clave: numberPlate o id
    tarapotoMarkers: {},
    moralesMarkers: {},
    alertaMarker: null
  });


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAside = () => setIsAsideOpen(!isAsideOpen);

  // Cargar alertas
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/getListSerenos/')
      .then(res => setAlertas(res.data))
      .catch(err => console.error("Error cargando alertas:", err));
  }, []);

  // Cargar cámaras
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/getCamarasSinEstado/')
      .then(res => setCamaras(res.data))
      .catch(err => console.error("Error cargando cámaras:", err));
  }, []);

  // Cargar bandas principales
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://127.0.0.1:8000/api/getBanda/')
        .then(res => setBandas(res.data))
        .catch(err => console.error("Error actualizando bandas:", err));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://127.0.0.1:8000/api/getTarapoto/')
        .then(res => setTarapoto(res.data))
        .catch(err => console.error("Error actualizando tarapoto:", err));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://127.0.0.1:8000/api/getMorales/')
        .then(res => setMorales(res.data))
        .catch(err => console.error("Error actualizando morales:", err));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current && document.getElementById('map')) {
      mapRef.current = L.map('map').setView([-6.5, -76.36], 14);

      L.tileLayer('http://127.0.0.1:8000/api/getMapa/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© Cristian Mestanza Ortiz'
}).addTo(mapRef.current);

    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Renderizar cámaras
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.camaraMarkers.forEach(m => map.removeLayer(m));
    markersRef.current.camaraMarkers = [];

    const cameraIcon = L.icon({
      iconUrl: '/images/camara2.png',
      iconSize: [25, 25],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
    
    const cameraIconRojo = L.icon({
      iconUrl: '/images/camaraRoja.png',
      iconSize: [25, 25],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });

    camaras.forEach(c => {
      const { corInicial: lat, corFinal: lon, nombrecamara, idcamara, activo } = c;
      if (lat != null && lon != null) {
        const icono = activo === true ? cameraIcon : cameraIconRojo;
        const marker = L.marker([lat, lon], { icon : icono }).addTo(map);
        markersRef.current.camaraMarkers.push(marker);

        marker.bindTooltip(`<b>${nombrecamara}</b>`, {
          direction: 'top',
          opacity: 0.9
        });

        marker.bindPopup(`<b>${nombrecamara}</b>`);

        marker.on('click', () => {
          axios.post(`http://127.0.0.1:8000/api/seleccionar_camara/${idcamara}/`)
            .then(() => alert(`Cámara ${nombrecamara} seleccionada.`))
            .catch(() => alert("Error al seleccionar la cámara."));
        });
      }
    });
  }, [camaras]);

  // Renderizar bandas principales
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    bandas.forEach(banda => {
      const { latitude, longitude, icon, numberPlate, description } = banda;

      if (latitude != null && longitude != null) {
        const key = numberPlate; // usa id si prefieres

        if (markersRef.current.bandaMarkers[key]) {
          // Actualiza coordenadas
          markersRef.current.bandaMarkers[key].setLatLng([latitude, longitude]);
        } else {
          // Crea nuevo marcador
          const imageUrl = icon === 5 ? '/images/carrosMoto/motoBanda.png' : '/images/carrosMoto/carroBanda.png';

          const bandaIcon = L.icon({
            iconUrl: imageUrl,
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [0, -35]
          });

          const marker = L.marker([latitude, longitude], { icon: bandaIcon }).addTo(map);

          marker.bindTooltip(`<b>${numberPlate}</b><br/>${description || ''}`, {
            direction: 'top',
            opacity: 0.9
          });

          markersRef.current.bandaMarkers[key] = marker;
        }
      }
    });
  }, [bandas]);


  // Renderizar tarapoto
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    tarapoto.forEach(item => {
      const { latitude, longitude, icon, numberPlate, description } = item;

      if (latitude != null && longitude != null) {
        const key = numberPlate;

        if (markersRef.current.tarapotoMarkers[key]) {
          markersRef.current.tarapotoMarkers[key].setLatLng([latitude, longitude]);
        } else {
          const imageUrl = icon === 5 ? '/images/carrosMoto/motoTpp.png' : '/images/carrosMoto/carroTp.png';

          const tppIcon = L.icon({
            iconUrl: imageUrl,
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [0, -35]
          });

          const marker = L.marker([latitude, longitude], { icon: tppIcon }).addTo(map);

          marker.bindTooltip(`<b>${numberPlate}</b><br/>${description || ''}`, {
            direction: 'top',
            opacity: 0.9
          });

          markersRef.current.tarapotoMarkers[key] = marker;
        }
      }
    });
  }, [tarapoto]);


  // Renderizar morales
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    morales.forEach(item => {
      const { latitude, longitude, icon, numberPlate, description } = item;

      if (latitude != null && longitude != null) {
        const key = numberPlate;

        if (markersRef.current.moralesMarkers[key]) {
          markersRef.current.moralesMarkers[key].setLatLng([latitude, longitude]);
        } else {
          const imageUrl = icon === 5 ? '/images/carrosMoto/motoMorales.png' : '/images/carrosMoto/carroMorales.png';

          const moralesIcon = L.icon({
            iconUrl: imageUrl,
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [0, -35]
          });

          const marker = L.marker([latitude, longitude], { icon: moralesIcon }).addTo(map);

          marker.bindTooltip(`<b>${numberPlate}</b><br/>${description || ''}`, {
            direction: 'top',
            opacity: 0.9
          });

          markersRef.current.moralesMarkers[key] = marker;
        }
      }
    });
  }, [morales]);


  // Click en alerta
  const handleAlertaClick = (alerta) => {
    const map = mapRef.current;
    if (!map || !map.getCenter) return;

    const { latitude, longitude, emergency_type, description } = alerta;

    if (markersRef.current.alertaMarker) {
      map.removeLayer(markersRef.current.alertaMarker);
    }

    const alertaIcon = L.icon({
      iconUrl: '/images/alerta.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35]
    });

    const marker = L.marker([latitude, longitude], { icon: alertaIcon }).addTo(map);
    marker.bindPopup(`<b>${emergency_type}</b><br/>${description}`).openPopup();

    markersRef.current.alertaMarker = marker;

    try {
      map.setView([latitude, longitude], 17);
    } catch (e) {
      console.error("Error al hacer setView:", e);
    }
  };


  const prevAlertasRef = useRef([]); // Guárdalo arriba de tu componente

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://127.0.0.1:8000/api/getListSerenos/')
        .then(res => {
          const nuevas = res.data.filter(nueva =>
            !alertas.some(existente => existente.id === nueva.id)
          );

          if (nuevas.length > 0) {
            nuevas.forEach(nueva => {
              // Opcional: Toast emergente
              toast.info(`🚨 Nueva alerta: ${nueva.emergency_type}`, {
                position: "top-right",
                autoClose: 5000
              });

              // Reproduce sonido
              const audio = new Audio('/sounds/alert.mp3');
              audio.play();
              handleAlertaClick(nueva);
            });

            // Agrega nuevas al estado
            setAlertas(prev => [...nuevas, ...prev]);
          }
        })
        .catch(err => console.error("Error revisando nuevas alertas:", err));
    }, 5000);

    return () => clearInterval(interval);
  }, [alertas]);


  if (!idUsuario) {
    window.location.href = 'http://localhost:3000/';
    return null;
  }

  return (
    <div className={`${styles.mainContainer} ${isSidebarOpen ? '' : styles.sidebarClosed}`} style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative' }}>
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <button
        onClick={toggleAside}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#2563EB',
          border: 'none',
          borderRadius: '4px',
          fontSize: '24px',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          padding: '5px 10px'
        }}
        title="Ver alertas"
      >
        &#8942;
      </button>

      <aside style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: '320px',
        backgroundColor: '#f8f9fa',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.2)',
        overflowY: 'auto',
        transition: 'transform 0.3s ease',
        transform: isAsideOpen ? 'translateX(0)' : 'translateX(100%)',
        padding: '20px',
        zIndex: 999
      }}>
        <br />
        <h3 style={{ marginBottom: '20px' }}>🚨 Alertas Activas</h3>
        {alertas.length === 0 && <p>No hay alertas</p>}

        {[...alertas].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(alerta => {
          const fecha = new Date(alerta.timestamp);
          const fechaStr = fecha.toLocaleDateString();
          const horaStr = fecha.toLocaleTimeString();

          const isAtendida = alerta.status === "Atendido" || alerta.status === "Atendida";
          const bgColor = isAtendida ? '#2563EB' : '#f03e3e';
          const textColor = '#fff';

          return (
            <div
              key={alerta.id}
              onClick={() => handleAlertaClick(alerta)}
              style={{
                marginBottom: '15px',
                padding: '10px',
                background: bgColor,
                color: textColor,
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <strong>{alerta.emergency_type}</strong>
              <p><b>Usuario:</b> {alerta.user_nombre}</p>
              <p><b>Descripción:</b> {alerta.description}</p>
              <p><b>Estado:</b> {alerta.status}</p>
              <p style={{ fontSize: '12px' }}>
                📅 {fechaStr} 🕒 {horaStr}
              </p>
            </div>
          );
        })}
      </aside>


      <div className={styles.content} style={{ flex: 1 }}>
        <div id="map" style={{ height: '100%', width: '100%' }} />
      </div>
      <ToastContainer toastStyle={{ marginTop: '80px' }} />

    </div>
  );
};

export default Mapa;
