import React, { useState } from 'react';
import styles from './principal.module.css';
import Sidebar from "../aside/aside";

const Principal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Contenido principal */}
      <div className={`${styles.principalContainer} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            👁️ Bienvenido a <span>Falcon Eye</span>
          </h1>
          <p className={styles.subtitle}>
            Tu sistema inteligente de vigilancia y análisis en tiempo real
          </p>
          <div className={styles.loader}></div>
        </div>
      </div>
    </div>
  );
};

export default Principal;
