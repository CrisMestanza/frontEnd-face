import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import Sidebar from "../aside/aside";
import styles from "./mapae.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MapaEstadistico = () => {
  const idUsuario = sessionStorage.getItem("idusuario");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [alertas, setAlertas] = useState([]);

  // Estadísticas
  const [stats, setStats] = useState({
    totalAlertas: 0,
    pendientes: 0,
    atendidas: 0,
  });

  // Filtros
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  const [intensidad, setIntensidad] = useState(0.8);

  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAside = () => setIsAsideOpen(!isAsideOpen);

  // ===========================
  // CARGA DE ALERTAS
  // ===========================
  const loadAlertas = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/getListSerenos/");
      setAlertas(res.data);
    } catch (err) {
      console.error("Error cargando alertas:", err);
      toast.error("No se pudieron cargar las alertas");
    }
  };

  useEffect(() => {
    loadAlertas();
    const interval = setInterval(loadAlertas, 5000);
    return () => clearInterval(interval);
  }, []);

  // ===========================
  // MAPA PRINCIPAL
  // ===========================
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

  // ===========================
  // MAPA DE CALOR DE ALERTAS
  // ===========================
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (showHeatmap && alertas.length > 0) {
      // Aplicar filtros
      let filtered = alertas;

      if (selectedTipo !== "Todos") {
        filtered = filtered.filter((a) => a.emergency_type === selectedTipo);
      }
      if (selectedEstado !== "Todos") {
        filtered = filtered.filter((a) => a.status === selectedEstado);
      }

      const heatData = filtered
        .filter((a) => a.latitude && a.longitude)
        .map((a) => [a.latitude, a.longitude, intensidad]);

      if (heatData.length > 0) {
        heatLayerRef.current = L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: { 0.2: "blue", 0.5: "yellow", 0.8: "red" },
        }).addTo(map);
      }
    }
  }, [alertas, showHeatmap, selectedTipo, selectedEstado, intensidad]);

  // ===========================
  // ESTADÍSTICAS
  // ===========================
  useEffect(() => {
    const pendientes = alertas.filter((a) => a.status === "Pendiente").length;
    const atendidas = alertas.filter((a) => a.status === "Atendida").length;
    setStats({
      totalAlertas: alertas.length,
      pendientes,
      atendidas,
    });
  }, [alertas]);

  // ===========================
  // LISTADO DE TIPOS PARA FILTRO
  // ===========================
  const tipos = ["Todos", ...new Set(alertas.map((a) => a.emergency_type))];
  const estados = ["Todos", "Pendiente", "Atendida"];

  if (!idUsuario) {
    window.location.href = "http://localhost:3000/";
    return null;
  }

  // ===========================
  // RENDERIZADO
  // ===========================
  return (
    <div
      className={`${styles.mainContainer} ${isSidebarOpen ? "" : styles.sidebarClosed}`}
      style={{ height: "100vh", width: "100vw", display: "flex", position: "relative" }}
    >
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* BOTÓN PANEL DERECHO */}
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

      {/* PANEL DERECHO */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "340px",
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
          📍 Panel de Control
        </h2>

        {/* Tarjetas estadísticas */}
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={statCardStyle}>🚨 Total Alertas <strong>{stats.totalAlertas}</strong></div>
          <div style={{ ...statCardStyle, background: "#f03e3e", color: "white" }}>
            Pendientes <strong>{stats.pendientes}</strong>
          </div>
          <div style={{ ...statCardStyle, background: "#2563EB", color: "white" }}>
            Atendidas <strong>{stats.atendidas}</strong>
          </div>
        </div>

        <hr style={{ margin: "20px 0" }} />
        <h3>🎛️ Filtros de Visualización</h3>

        {/* Filtro tipo de emergencia */}
        <label style={filterLabel}>Tipo de emergencia:</label>
        <select
          style={selectStyle}
          value={selectedTipo}
          onChange={(e) => setSelectedTipo(e.target.value)}
        >
          {tipos.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* Filtro estado */}
        <label style={filterLabel}>Estado:</label>
        <select
          style={selectStyle}
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
        >
          {estados.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        {/* Intensidad */}
        <label style={filterLabel}>
          Intensidad del mapa de calor: {intensidad.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={intensidad}
          onChange={(e) => setIntensidad(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />

        {/* Switch del mapa */}
        <label style={{ ...filterLabel, marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
          />{" "}
          🔥 Mostrar mapa de calor
        </label>

        <p style={{ fontSize: "12px", marginTop: "20px", color: "#555" }}>
          * Los datos se actualizan automáticamente cada 5 segundos.
        </p>
      </aside>

      {/* MAPA */}
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

export default MapaEstadistico;
