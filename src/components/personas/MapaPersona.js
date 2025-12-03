import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../aside/aside";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useAlertas from "../newAlerta/useAlertas";
import { ToastContainer } from "react-toastify";

const MapaPersona = () => {
  const alertas = useAlertas();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { idpersona } = useParams();
  const [detalles, setDetalles] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/getPersonasRqPk/${idpersona}`)
      .then((res) => {
        const detallesNumerados = res.data.map((d, idx) => ({
          ...d,
          numero: idx + 1,
        }));
        setDetalles(detallesNumerados);
      })
      .catch((err) => console.error("❌ Error en la petición Axios:", err));
  }, [idpersona]);

  const createIcon = (number) =>
    L.divIcon({
      html: `<div style="
        background: #3498db;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      ">${number}</div>`,
      className: "",
      iconSize: [30, 30],
    });

  if (detalles.length === 0) return <p>Cargando...</p>;

  // Agrupar coordenadas
  const groupedCoords = {};
  detalles.forEach((d) => {
    const key = `${parseFloat(d.camaras.corInicial).toFixed(6)}_${parseFloat(
      d.camaras.corFinal
    ).toFixed(6)}`;
    if (!groupedCoords[key]) groupedCoords[key] = [];
    groupedCoords[key].push(d);
  });

  const firstCoord = detalles[0];
  const center = [
    parseFloat(firstCoord.camaras.corInicial),
    parseFloat(firstCoord.camaras.corFinal),
  ];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Sidebar fijo a la izquierda */}
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Contenedor del mapa */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: "80px",
            left: "20px",
            zIndex: 1000,
            background: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
          title="Volver"
        >
          ←
        </button>

        {/* Mapa */}
        <MapContainer center={center} zoom={16} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {Object.entries(groupedCoords).map(([key, group]) =>
            group.map((detalle, idx) => {
              const baseLat = parseFloat(detalle.camaras.corInicial);
              const baseLng = parseFloat(detalle.camaras.corFinal);

              const radius = 0.0001;
              const angle = (idx * 360) / group.length;
              const radian = (angle * Math.PI) / 180;

              const offsetLat = baseLat + radius * Math.cos(radian);
              const offsetLng = baseLng + radius * Math.sin(radian);

              return (
                <Marker
                  key={`${detalle.iddetallepc}_${idx}`}
                  position={[offsetLat, offsetLng]}
                  icon={createIcon(detalle.numero)}
                >
                  <Popup>
                    <strong>N°:</strong> {detalle.numero}
                    <br />
                    <strong>Fecha:</strong> {detalle.fecha}
                    <br />
                    <strong>Hora:</strong> {detalle.hora}
                  </Popup>
                </Marker>
              );
            })
          )}
        </MapContainer>
        <ToastContainer toastStyle={{ marginTop: "80px" }} />
      </div>
    </div>
  );
};

export default MapaPersona;
