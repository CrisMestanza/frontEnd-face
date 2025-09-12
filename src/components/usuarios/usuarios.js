import React, { useState, useEffect } from "react";
import Sidebar from "../aside/aside";
import axios from "axios";
import styles from './usuarios.module.css';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ModalAgregar from "./modalAgregar";
import ModalEditar from "./modalEditar";
import ModalEliminar from "./modalEliminar";
import useAlertas from "../newAlerta/useAlertas";
import { ToastContainer } from 'react-toastify';

const Usuarios = () => {
    const alertas = useAlertas();
    const idUsuario = sessionStorage.getItem('idusuario'); //Para validar
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [dataEditar, setDataEditar] = useState({});


    useEffect(() => {
        cargarCamaras();
    }, []);

//Lógica obtener usuarios
    const cargarCamaras = () => {
        axios.get('http://127.0.0.1:8000/api/usuarios/')
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error("Error al obtener cámaras:", error);
            });
    };
//Lógica para eliminar camara
    const eliminar = (id) => {
        axios.put(`http://127.0.0.1:8000/api/usuariosDelete/${id}/`)
            .then(() => {
                setUsuarios(usuarios.filter(usuario => usuario.idusuario !== id));
            })
            .catch(error => {
                console.error("Error al eliminar cámara:", error);
            });
    };


    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
    const [idCamaraEliminar, setIdCamaraEliminar] = useState(null);

    const confirmarEliminacion = () => {
        if (idCamaraEliminar) {
            eliminar(idCamaraEliminar);
            setModalEliminarOpen(false);
            setIdCamaraEliminar(null);
        }
    };

//Lógica para agregar camara
    const agregarCamara = (nuevaCamara) => {
        axios.post(`http://127.0.0.1:8000/api/usuariosPost/`, nuevaCamara)
            .then(response => {
                setUsuarios([...usuarios, response.data]);
                setIsModalOpen(false);
                console.log("Cámara agregada", response.data);
            })
            .catch(error => {
                console.error("Error al agregar cámara:", error);
            });
    };
    //Logica para editar camara
    const clickEditar = (idcamara) => {
        axios.get(`http://127.0.0.1:8000/api/usuario/${idcamara}/`)
            .then(response => {
                setDataEditar(response.data);
                setModalEditarOpen(true);
            })
            .catch(error => {
                console.error("Error al obtener datos de la cámara:", error);
            });
    };

    const editarCamara = (camaraActualizada) => {
        axios.put(`http://127.0.0.1:8000/api/usuariosPut/${camaraActualizada.idusuario}/`, camaraActualizada)
            .then(response => {
                const nuevasCamaras = usuarios.map(camara =>
                    camara.idusuario === camaraActualizada.idusuario ? response.data : camara
                );
                setUsuarios(nuevasCamaras);
                setModalEditarOpen(false);
                console.log("Cámara editada", response.data);
            })
            .catch(error => {
                console.error("Error al editar cámara:", error);
            });
    };
    if ( idUsuario === null || idUsuario === undefined) {
        window.location.href = 'http://localhost:3000/';
    }else{
    return (
        <div className={styles.container}>
            <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className={styles.content}>
                <h1 className={styles.title}>Gestión de usuarios</h1>
                <div className={styles.formContainer}>
                    <button onClick={() => setIsModalOpen(true)} className={styles.buttonAdd}>
                        Agregar usuario
                    </button>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>NOMBRE</th>
                            <th>DNI </th>
                            <th>USUARIOS</th>
                            <th>CONTRASEÑA</th>
                            <th>ADMIN </th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.idusuario} className={styles.row}>
                                <td>{index + 1}</td>
                                <td>{usuario.nombreusuario}</td>
                                <td>{usuario.dniusuario}</td>
                                <td>{usuario.usuario}</td>
                                <td>{usuario.contrasena}</td>
                                <td>{usuario.admin == true?"Admin":"No admin" }</td>
                              
                                <td className={styles.actions}>
                                    <button onClick={() => clickEditar(usuario.idusuario)} className={styles.buttonEdit}>
                                        <FaRegEdit style={{ fontSize: '2rem' }} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIdCamaraEliminar(usuario.idusuario);
                                            setModalEliminarOpen(true);
                                        }}
                                        className={styles.buttonDelete}
                                    >
                                        <FaRegTrashAlt style={{ fontSize: '2rem' }} />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ModalAgregar
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                   
                    onAgregar={agregarCamara}
                />

                <ModalEditar
                    isOpen={modalEditarOpen}
                    onClose={() => setModalEditarOpen(false)}
                  
                    dataEditar={dataEditar}
                    onEditar={editarCamara}
                />
                <ModalEliminar
                    isOpen={modalEliminarOpen}
                    onClose={() => setModalEliminarOpen(false)}
                    onConfirm={confirmarEliminacion}
                />

            </div>
            <ToastContainer toastStyle={{ marginTop: '80px' }} />
        </div>

    );}
};

export default Usuarios;
