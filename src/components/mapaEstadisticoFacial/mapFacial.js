import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import Sidebar from "../aside/aside";
import styles from "./mapae.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MapaEstadisticoFacial = () => {
  const idUsuario = sessionStorage.getItem("idusuario");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  // Datos procesados
  const [detecciones, setDetecciones] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    camaras: 0,
    personas: 0,
    horasPico: [],
  });

  // Filtros
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedFecha, setSelectedFecha] = useState("Todas");
  const [selectedPersona, setSelectedPersona] = useState("Todas");
  const [selectedCamara, setSelectedCamara] = useState("Todas");
  const [intensidad, setIntensidad] = useState(0.8);

  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAside = () => setIsAsideOpen(!isAsideOpen);

  // ===============================
  // 1️⃣ Cargar detecciones del backend
  // ===============================
 const loadDetecciones = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/datosMapa/");
    const data = res.data;
    console.log("✅ Datos recibidos desde API:", data);

    const lista = [];

    // Recorrer toda la estructura
    Object.entries(data).forEach(([fecha, personas]) => {
      if (!personas || Object.keys(personas).length === 0) return;

      Object.entries(personas).forEach(([persona, camaras]) => {
        Object.entries(camaras).forEach(([camara, infoCamara]) => {
          const coords = infoCamara.coordenadas || {};
          const lat = parseFloat(coords.corInicial);
          const lng = parseFloat(coords.corFinal);

          if (isNaN(lat) || isNaN(lng)) return; // evitar valores inválidos

          Object.entries(infoCamara.horas || {}).forEach(([hora, imagenes]) => {
            lista.push({
              fecha,
              persona,
              camara,
              hora,
              cantidad: Array.isArray(imagenes) ? imagenes.length : 0,
              lat,
              lng,
            });
          });
        });
      });
    });

    console.log("📊 Detecciones procesadas:", lista.length, "registros");
    setDetecciones(lista);
  } catch (err) {
    console.error("❌ Error cargando detecciones:", err.message);
    if (err.response) {
      console.error("🔴 Respuesta del servidor:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("🟡 Sin respuesta del servidor:", err.request);
    } else {
      console.error("⚠️ Error desconocido:", err);
    }
    toast.error("No se pudieron cargar las detecciones faciales");
  }
};


  useEffect(() => {
    loadDetecciones();
    const interval = setInterval(loadDetecciones, 10000);
    return () => clearInterval(interval);
  }, []);

  // ===============================
  // 2️⃣ Inicializar mapa base
  // ===============================
  useEffect(() => {
    if (!mapRef.current && document.getElementById("map")) {
      mapRef.current = L.map("map").setView([-6.5, -76.36], 13);
      L.tileLayer("http://127.0.0.1:8000/api/getMapa/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© Cristian Mestanza Ortiz",
      }).addTo(mapRef.current);
    }
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // ===============================
  // 3️⃣ Estadísticas generales
  // ===============================
  useEffect(() => {
    if (detecciones.length === 0) return;

    const total = detecciones.reduce((acc, d) => acc + d.cantidad, 0);
    const camaras = new Set(detecciones.map((d) => d.camara)).size;
    const personas = new Set(detecciones.map((d) => d.persona)).size;

    const horas = {};
    detecciones.forEach((d) => {
      const horaSolo = d.hora.split("-")[0];
      horas[horaSolo] = (horas[horaSolo] || 0) + d.cantidad;
    });

    const horasPico = Object.entries(horas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([h, cant]) => `${h}:00 (${cant})`);

    setStats({ total, camaras, personas, horasPico });
  }, [detecciones]);

  // ===============================
  // 4️⃣ Mapa de calor con coordenadas reales
  // ===============================
  useEffect(() => {
    const map = mapRef.current;
    if (!map || detecciones.length === 0) return;

    // limpiar capa previa
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (showHeatmap) {
      let filtered = detecciones;
      if (selectedFecha !== "Todas")
        filtered = filtered.filter((d) => d.fecha === selectedFecha);
      if (selectedPersona !== "Todas")
        filtered = filtered.filter((d) => d.persona === selectedPersona);
      if (selectedCamara !== "Todas")
        filtered = filtered.filter((d) => d.camara === selectedCamara);

      const heatData = filtered
        .filter((d) => d.lat && d.lng)
        .map((d) => [d.lat, d.lng, Math.min(1, 0.3 + d.cantidad * intensidad)]);

      if (heatData.length > 0) {
        heatLayerRef.current = L.heatLayer(heatData, {
          radius: 28,
          blur: 18,
          maxZoom: 17,
          gradient: { 0.2: "blue", 0.5: "yellow", 0.8: "red" },
        }).addTo(map);
      }
    }
  }, [detecciones, showHeatmap, selectedFecha, selectedPersona, selectedCamara, intensidad]);

  // ===============================
  // 5️⃣ Filtros dinámicos
  // ===============================
  const fechas = ["Todas", ...new Set(detecciones.map((d) => d.fecha))];
  const personas = ["Todas", ...new Set(detecciones.map((d) => d.persona))];
  const camaras = ["Todas", ...new Set(detecciones.map((d) => d.camara))];

  useEffect(() => {
    if (!idUsuario) window.location.href = "http://localhost:3000/";
  }, [idUsuario]);
  if (!idUsuario) return null;

  // ===============================
  // 6️⃣ Renderizado
  // ===============================
  return (
    <div
      className={`${styles.mainContainer} ${isSidebarOpen ? "" : styles.sidebarClosed}`}
      style={{ height: "100vh", width: "100vw", display: "flex", position: "relative" }}
    >
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Botón panel derecho */}
      <button
        onClick={toggleAside}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "#2563EB",
          border: "none",
          borderRadius: "6px",
          fontSize: "20px",
          color: "#fff",
          cursor: "pointer",
          zIndex: 1000,
          padding: "6px 12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
        title="Panel Estadístico"
      >
        📊
      </button>

      {/* Panel derecho */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "360px",
          backgroundColor: "#f8f9fa",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
          overflowY: "auto",
          transform: isAsideOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          padding: "25px",
          zIndex: 999,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2563EB" }}>
          📍 Análisis de Detecciones Faciales
        </h2>

        <div style={{ display: "grid", gap: "12px" }}>
          <div style={statCardStyle}>📷 Cámaras activas <strong>{stats.camaras}</strong></div>
          <div style={statCardStyle}>👤 Personas detectadas <strong>{stats.personas}</strong></div>
          <div style={statCardStyle}>🖼️ Cantidad de imagenes registradas <strong>{stats.total}</strong></div>
        </div>

        <hr style={{ margin: "15px 0" }} />
        <h3>🕒 Horas pico</h3>
        <ul>
          {stats.horasPico.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>

        <hr style={{ margin: "15px 0" }} />
        <h3>🎛️ Filtros</h3>

        <label style={filterLabel}>Fecha:</label>
        <select style={selectStyle} value={selectedFecha} onChange={(e) => setSelectedFecha(e.target.value)}>
          {fechas.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <label style={filterLabel}>Persona:</label>
        <select style={selectStyle} value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)}>
          {personas.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label style={filterLabel}>Cámara:</label>
        <select style={selectStyle} value={selectedCamara} onChange={(e) => setSelectedCamara(e.target.value)}>
          {camaras.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label style={filterLabel}>Intensidad mapa: {intensidad.toFixed(1)}</label>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={intensidad}
          onChange={(e) => setIntensidad(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />

        <label style={{ ...filterLabel, marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
          />{" "}
          🔥 Mostrar mapa de calor
        </label>

        <p style={{ fontSize: "12px", marginTop: "20px", color: "#555" }}>
          * Datos actualizados automáticamente cada 10 segundos.
        </p>
      </aside>

      {/* Mapa */}
      <div className={styles.content} style={{ flex: 1 }}>
        <div id="map" style={{ height: "100%", width: "100%" }} />
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

// ======= ESTILOS AUXILIARES =======
const statCardStyle = {
  background: "#fff",
  borderRadius: "10px",
  padding: "10px 15px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "15px",
};

const filterLabel = {
  display: "block",
  marginTop: "10px",
  marginBottom: "5px",
  fontWeight: "bold",
};

const selectStyle = {
  width: "100%",
  padding: "5px 8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "10px",
};

export default MapaEstadisticoFacial;
