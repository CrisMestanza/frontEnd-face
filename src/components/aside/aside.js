import React, { useState } from 'react';
import { FaServicestack, FaUsers } from 'react-icons/fa';
import { ImStatsBars } from "react-icons/im";
import { GiCctvCamera, GiExitDoor, GiNotebook } from "react-icons/gi";
import { LuMapPinned } from "react-icons/lu";
import { IoIosImages } from "react-icons/io";
import { MdOutlinePersonSearch } from "react-icons/md";
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ toggleSidebar, isSidebarOpen }) => {
  const usuario = sessionStorage.getItem('nombre');
  const admin = sessionStorage.getItem('admin') === 'true';

  const [openFacial, setOpenFacial] = useState(false);
  const [openAlerta, setOpenAlerta] = useState(false);
  const [openMatricula, setOpenMatricula] = useState(false);

  const user = {
    name: usuario,
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/5663/5663914.png'
  };

  const exit = () => {
    sessionStorage.clear();
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <h4 style={{ marginLeft: "25px" }}>BIENVENIDO</h4>

        <div className={styles.userInfo}>
          <img src={user.avatarUrl} alt="User Avatar" className={styles.avatar} />
          <p className={styles.userName}>{user.name}</p>
        </div>

        <div className={styles.sidebarNav}>
          <ul>
            {/* =======================
                MENÚ FACIAL
            ======================= */}
            <li className={styles.dropdown}>
              <div onClick={() => setOpenFacial(!openFacial)} className={styles.dropdownToggle}>
                <GiCctvCamera className={styles.sidebarIcon} />
                Facial
                <span className={styles.arrow}>{openFacial ? "▲" : "▼"}</span>
              </div>
              {openFacial && (
                <ul className={styles.submenu}>
                  <li>
                    <Link to="/mapa">
                      <LuMapPinned className={styles.sidebarIcon} />
                      Mapa
                    </Link>
                  </li>
                  <li>
                    <Link to="/MapaEstadisticoFacial">
                      <LuMapPinned className={styles.sidebarIcon} />
                      Mapa facial
                    </Link>
                  </li>
                  <li>
                    <Link to="/imagenes">
                      <IoIosImages className={styles.sidebarIcon} />
                      Imágenes
                    </Link>
                  </li>
                  <li>
                    <Link to="/personas">
                      <MdOutlinePersonSearch className={styles.sidebarIcon} />
                      Personas
                    </Link>
                  </li>
                  <li>
                    <Link to="/camaras">
                      <GiCctvCamera className={styles.sidebarIcon} />
                      Cámaras
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin">
                      <FaServicestack className={styles.sidebarIcon} />
                      CRUD Cámaras
                    </Link>
                  </li>
                  <li>
                    <Link to="/usuarios">
                      <FaUsers className={styles.sidebarIcon} />
                      Usuarios
                    </Link>
                  </li>
                  <li>
                    <Link to="/graficos">
                      <ImStatsBars className={styles.sidebarIcon} />
                      Gráficos
                    </Link>
                  </li>
                  <li>
                    <Link to="/extraccion">
                      <GiNotebook className={styles.sidebarIcon} />
                      Extracción
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* =======================
                MENÚ ALERTA
            ======================= */}
            <li className={styles.dropdown}>
              <div onClick={() => setOpenAlerta(!openAlerta)} className={styles.dropdownToggle}>
                <LuMapPinned className={styles.sidebarIcon} />
                Alerta
                <span className={styles.arrow}>{openAlerta ? "▲" : "▼"}</span>
              </div>
              {openAlerta && (
                <ul className={styles.submenu}>
                  <li>
                    <Link to="/mapaEstadistico">
                      <LuMapPinned className={styles.sidebarIcon} />
                      Mapa alerta
                    </Link>
                  </li>
                  <li>
                    <Link to="/mapa">
                      <LuMapPinned className={styles.sidebarIcon} />
                      Mapa
                    </Link>
                  </li>
                  <li>
                    <Link to="/superAdmin">
                      <LuMapPinned className={styles.sidebarIcon} />
                      Super Admin 
                    </Link>
                  </li>
                </ul>
              )}
            </li>

           {/* =======================
    MENÚ MATRÍCULA
======================= */}
<li className={styles.dropdown}>
  <div onClick={() => setOpenMatricula(!openMatricula)} className={styles.dropdownToggle}>
    <LuMapPinned className={styles.sidebarIcon} />
    Matrícula
    <span className={styles.arrow}>{openMatricula ? "▲" : "▼"}</span>
  </div>
  {openMatricula && (
    <ul className={styles.submenu}>
      <li>
        <Link to="/controlMatriculas">
          <GiCctvCamera className={styles.sidebarIcon} />
          Cámaras
        </Link>
      </li>
      <li>
        <Link to="/extraccionMatriculas">
          <GiNotebook className={styles.sidebarIcon} />
          Extracción
        </Link>
      </li>
      <li>
        <Link to="/graficoMatricula">
          <ImStatsBars className={styles.sidebarIcon} />
          Gráficos
        </Link>
      </li>
    </ul>
  )}
</li>

            

            {/* SALIR */}
            <li>
              <Link to="/" onClick={exit}>
                <GiExitDoor className={styles.sidebarIcon} />
                Salir
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
