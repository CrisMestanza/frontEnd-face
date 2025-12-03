import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

// Importamos los mismos iconos que en Sidebar
import { FaServicestack, FaUsers } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { GiCctvCamera, GiExitDoor, GiNotebook } from "react-icons/gi";
import { LuMapPinned } from "react-icons/lu";
import { IoIosImages } from "react-icons/io";
import { MdOutlinePersonSearch } from "react-icons/md";

const Navbar = () => {
  const usuario = sessionStorage.getItem("nombre");
  const admin = sessionStorage.getItem("admin") === "true";

  const exit = () => {
    sessionStorage.clear();
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.logo}>Falcon Eye</span>
      </div>

      <div className={styles.center}>
        <ul className={styles.navList}>
          <li>
            <Link to="/mapa">
              <LuMapPinned />
            </Link>
          </li>
          <li>
            <Link to="/imagenes">
              <IoIosImages />
            </Link>
          </li>
          {admin && (
            <>
              <li>
                <Link to="/personas">
                  <MdOutlinePersonSearch />
                </Link>
              </li>
              <li>
                <Link to="/camaras">
                  <GiCctvCamera />
                </Link>
              </li>
              <li>
                <Link to="/admin">
                  <FaServicestack />
                </Link>
              </li>
              <li>
                <Link to="/usuarios">
                  <FaUsers />
                </Link>
              </li>
              <li>
                <Link to="/graficos">
                  <ImStatsBars />
                </Link>
              </li>
              <li>
                <Link to="/extraccion">
                  <GiNotebook />
                </Link>
              </li>
            </>
          )}
          {!admin && (
            <li>
              <Link to="/camaras">
                <GiCctvCamera />
              </Link>
            </li>
          )}
          <li>
            <Link to="/" onClick={exit}>
              <GiExitDoor />
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.right}>
        <span className={styles.user}>{usuario}</span>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5663/5663914.png"
          alt="avatar"
          className={styles.avatar}
        />
      </div>
    </div>
  );
};

export default Navbar;
