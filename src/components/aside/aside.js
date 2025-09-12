import React from 'react';
import { FaServicestack, FaUsers } from 'react-icons/fa';
import { ImStatsBars } from "react-icons/im";
import { GiCctvCamera } from "react-icons/gi";
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Importamos el archivo CSS Module
import { GiExitDoor } from "react-icons/gi";
import { GiNotebook } from "react-icons/gi";
import { LuMapPinned } from "react-icons/lu";
import { IoIosImages } from "react-icons/io";
import { MdOutlinePersonSearch } from "react-icons/md";

const Sidebar = ({ toggleSidebar, isSidebarOpen }) => {
  // Usuario con avatar por defecto
  const usuario = sessionStorage.getItem('nombre');
  const user = {
    name: usuario,
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/5663/5663914.png'
  };

  const exit = () => {
    sessionStorage.clear();
  };

  
  const admin = sessionStorage.getItem('admin') === 'true';

  return (
    <div className={styles.sidebarContainer}>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <h4 style={{marginLeft:"25px"}}>BIENVENIDO</h4>

        <div className={styles.userInfo}>
          <img src={user.avatarUrl} alt="User Avatar" className={styles.avatar} />
          <p className={styles.userName}>{user.name}</p>
        </div>

        {admin && (
          <div className={styles.sidebarNav}>
            <ul>
              <li>
                <Link to="/mapa">
                  <LuMapPinned className={styles.sidebarIcon} />
                  Mapa
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
                  <MdOutlinePersonSearch  className={styles.sidebarIcon} />
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
              <li>
                <Link to="/" onClick={exit}>
                  <GiExitDoor className={styles.sidebarIcon} />
                  Salir
                </Link>
              </li>
            </ul>
          </div>
        )}

        {!admin && (
          <div className={styles.sidebarNav}>
            <ul>
              <li>
                <Link to="/mapa">
                  <LuMapPinned className={styles.sidebarIcon} />
                  Mapa
                </Link>
              </li>
              <li>
                <Link to="/imagenes">
                  <IoIosImages className={styles.sidebarIcon} />
                  Imágenes
                </Link>
              </li>
              <li>
                <Link to="/camaras">
                  <GiCctvCamera className={styles.sidebarIcon} />
                  Cámaras
                </Link>
              </li>
              <li>
                <Link to="/" onClick={exit}>
                  <GiExitDoor className={styles.sidebarIcon} />
                  Salir
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
