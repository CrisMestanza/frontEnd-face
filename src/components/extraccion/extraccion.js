import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../aside/aside"; // Ajusta la ruta correcta
import styles from "./extraccion.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../nabvar/Navbar";
const Extraccion = () => {
  const idUsuario = sessionStorage.getItem("idusuario");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setFile(null);
    setIsModalOpen(false);
  };

  const extractPersonas = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/extraerPersonas/`);
      console.log(response.data);
      toast.success("Personas extraídas correctamente");
    } catch (error) {
      console.error("Error al extraer personas:", error);
      toast.error("Error al extraer personas");
    }
  };

  const extraerEmbdding = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/extraerEmbdding/`);
      console.log(response.data);
      toast.success("Embeddings generados correctamente");
    } catch (error) {
      console.error("Error al generar embeddings:", error);
      toast.error("Error al generar embeddings");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const subirZip = async () => {
    if (!file) {
      toast.error("Debes seleccionar un archivo ZIP con imágenes.");
      return;
    }

    setSubiendo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload-zip/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      setShowSuccessModal(true); // 👉 abrir modal de éxito
      closeModal();
    } catch (error) {
      console.error("Error al subir el ZIP:", error);
      toast.error("Error al subir el archivo ZIP");
    } finally {
      setSubiendo(false);
    }
  };

  if (!idUsuario) {
    window.location.href = "http://localhost:3000/";
    return null;
  }

  return (
    <div className={`${styles.container} ${isSidebarOpen ? "" : styles.sidebarClosed}`}>
      <Navbar />
      {/* Sidebar */}
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className={styles.content}>
        <h1>Procesamiento de los datos</h1>
        <br />
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.buttonAdd} onClick={extraerEmbdding}>
            Extraer características
          </button>
          <button className={styles.buttonAdd} onClick={extractPersonas}>
            Extraer personas
          </button>
          <button className={styles.buttonAdd} onClick={openModal}>
            Agregar personas
          </button>
        </div>

        {/* Modal para subir ZIP */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeBtn} onClick={closeModal}>
                ✖
              </button>
              <h2>Subir carpeta de imágenes (ZIP)</h2>

              <div
                className={styles.dropzone}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files.length > 0) {
                    setFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <p>Arrastra aquí tu archivo .zip o selecciona uno</p>
                <input type="file" accept=".zip" onChange={handleFileChange} />
                {file && (
                  <p>
                    Archivo seleccionado: <strong>{file.name}</strong>
                  </p>
                )}
              </div>

              <br />
              <button
                className={styles.buttonAdd}
                onClick={subirZip}
                disabled={!file || subiendo}
              >
                {subiendo ? "Subiendo..." : "Subir ZIP"}
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmación de éxito */}
        {showSuccessModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeBtn} onClick={() => setShowSuccessModal(false)}>
                ✖
              </button>
              <h2>✅ Operación exitosa</h2>
              <p>La carpeta se subió y descomprimió correctamente.</p>
              <button className={styles.buttonAdd} onClick={() => setShowSuccessModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer toastStyle={{ marginTop: "80px" }} />
    </div>
  );
};

export default Extraccion;
