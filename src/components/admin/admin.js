import React, { useState, useEffect } from "react";
import Sidebar from "../aside/aside";
import axios from "axios";
import styles from './admin.module.css';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ModalAgregar from "./modalAgregar";
import ModalEditar from "./modalEditar";
import ModalEliminar from "./modalEliminar";
import useAlertas from "../newAlerta/useAlertas";
import { ToastContainer } from 'react-toastify';
import Navbar from "../nabvar/Navbar";
const Admin = () => {
    const alertas = useAlertas();
    const idUsuario = sessionStorage.getItem('idusuario'); //Para validar
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [tipoCamaras, setTipoCamaras] = useState([]);
    const [camaras, setCamaras] = useState([]);
    const [dataEditar, setDataEditar] = useState({});

//Lógica para obtener tipos de cámara
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/tipoCamara/`)
            .then(response => {
                setTipoCamaras(response.data);
            })
            .catch(error => {
                console.error("Error al obtener tipos de cámara:", error);
            });
    }, []);

//Lógica para cargar camaras
    useEffect(() => {
        cargarCamaras();
    }, []);
    const cargarCamaras = () => {
        axios.get('http://127.0.0.1:8000/api/camaras/')
            .then(response => {
                setCamaras(response.data);
            })
            .catch(error => {
                console.error("Error al obtener cámaras:", error);
            });
    };
    //Lógica para eliminar camara
    const eliminar = (id) => {
        axios.put(`http://127.0.0.1:8000/api/camarasDelete/${id}/`)
            .then(() => {
                setCamaras(camaras.filter(camara => camara.idcamara !== id));
                console.log("Cámara eliminada");
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
        axios.post(`http://127.0.0.1:8000/api/camarasPost/`, nuevaCamara)
            .then(response => {
                setCamaras([...camaras, response.data]);
                setIsModalOpen(false);
                console.log("Cámara agregada", response.data);
            })
            .catch(error => {
                console.error("Error al agregar cámara:", error);
            });
    };
    //Logica para editar camara
    const clickEditar = (idcamara) => {
        axios.get(`http://127.0.0.1:8000/api/camara/${idcamara}/`)
            .then(response => {
                setDataEditar(response.data);
                setModalEditarOpen(true);
            })
            .catch(error => {
                console.error("Error al obtener datos de la cámara:", error);
            });
    };

    const editarCamara = (camaraActualizada) => {
        axios.put(`http://127.0.0.1:8000/api/camarasPut/${camaraActualizada.idcamara}/`, camaraActualizada)
            .then(response => {
                const nuevasCamaras = camaras.map(camara =>
                    camara.idcamara === camaraActualizada.idcamara ? response.data : camara
                );
                setCamaras(nuevasCamaras);
                setModalEditarOpen(false);
                console.log("Cámara editada", response.data);
            })
            .catch(error => {
                console.error("Error al editar cámara:", error);
            });
    };
    if ( idUsuario === null || idUsuario === undefined) {
        window.location.href = '192.168.20.105:8000/';
    }else{

    return (
        <div className={styles.container}>
            <Navbar />
            <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className={styles.content}>
                <h1 className={styles.title}>Gestión de Cámaras</h1>
                <div className={styles.formContainer}>
                    <button onClick={() => setIsModalOpen(true)} className={styles.buttonAdd}>
                        Agregar Cámara
                    </button>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Nombre</th>
                            <th>Latitud</th>
                            <th>Longitud</th>
                            <th>IP Cámara</th>
                            <th>Activo</th>
                            <th>Tipo Cámara</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camaras.map((camara, index) => (
                            <tr key={camara.idcamara} className={styles.row}>
                                <td>{index + 1}</td>
                                <td>{camara.nombrecamara}</td>
                                <td>{camara.corInicial}</td>
                                <td>{camara.corFinal}</td>
                                <td>{camara.ipcamar}</td>
                                <td>{camara.activo ? 'Sí ✅' : 'No ❌'}</td>
                                <td>
                                    {camara.tipoCamara ? (
                                        camara.tipoCamara.nombretipocamara === "Wifi" ?
                                            `${camara.tipoCamara.nombretipocamara} 🌐`
                                            : `${camara.tipoCamara.nombretipocamara} 🖧`
                                    ) : "No hay"}
                                </td>
                                <td className={styles.actions}>
                                    <button onClick={() => clickEditar(camara.idcamara)} className={styles.buttonEdit}>
                                        <FaRegEdit style={{ fontSize: '2rem' }} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIdCamaraEliminar(camara.idcamara);
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
                    data={tipoCamaras}
                    onAgregar={agregarCamara}
                />

                <ModalEditar
                    isOpen={modalEditarOpen}
                    onClose={() => setModalEditarOpen(false)}
                    data={tipoCamaras}
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

export default Admin;
