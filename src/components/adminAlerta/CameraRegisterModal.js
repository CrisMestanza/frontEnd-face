// Archivo: CameraRegisterModal.jsx
import React, { useState } from "react";
import Modal from "./Modal";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationPicker = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const CameraRegisterModal = ({ isOpen, onClose, onSave }) => {
  const [cameras, setCameras] = useState([]);

  const handleMapClick = (latlng) => {
    const newCam = {
      id: Date.now(),
      nombre: "",
      latitud: latlng.lat,
      longitud: latlng.lng,
    };
    setCameras((prev) => [...prev, newCam]);
  };

  const updateNombre = (id, value) => {
    setCameras((prev) =>
      prev.map((cam) => (cam.id === id ? { ...cam, nombre: value } : cam))
    );
  };

  const handleSave = () => {
    onSave(cameras);
    setCameras([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Cámaras">
      <div className="camera-map-modal">
        <MapContainer
          center={[-6.486, -76.373]}
          zoom={14}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationPicker onMapClick={handleMapClick} />
          {cameras.map((cam) => (
            <Marker
              key={cam.id}
              position={[cam.latitud, cam.longitud]}
              icon={defaultIcon}
            />
          ))}
        </MapContainer>
        <div className="camera-form-list">
          {cameras.map((cam, index) => (
            <div key={cam.id} className="camera-entry">
              <label>
                Cámara {index + 1}: Nombre
                <input
                  type="text"
                  value={cam.nombre}
                  onChange={(e) => updateNombre(cam.id, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
        <button className="btn-submit" onClick={handleSave}>
          Registrar todas
        </button>
      </div>
    </Modal>
  );
};

export default CameraRegisterModal;
