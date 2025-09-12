import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../aside/aside"; // Asegúrate de la ruta correcta
import styles from './graficos.module.css'; // Importamos el archivo CSS Module
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useAlertas from "../newAlerta/useAlertas";
import { ToastContainer } from 'react-toastify';


const Grafico = () => {
    const alertas = useAlertas();

    const idUsuario = sessionStorage.getItem('idusuario'); //Para validar
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    console.log(idUsuario)
    const [usuariosActivos, setUsuariosActivos] = useState([]);
    const [camaraMasUsada, setCamaraMasUsada] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/usuarioActivo/')
            .then(res => setUsuariosActivos(res.data))
            .catch(err => console.error(err));

        axios.get('http://127.0.0.1:8000/api/camarUsada/')
            .then(res => setCamaraMasUsada(res.data))
            .catch(err => console.error(err));
    }, []);

    const [horasPico, setHorasPico] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/horaPico/')
            .then(res => setHorasPico(res.data))
            .catch(err => console.error('Error al obtener horas pico:', err));
    }, []);


    const colores = ['#0b5cb8', '#3498db', '#c9302c', '#c9302c', '#c9302c'];
    const renderCustomLabel = ({ name, value, percent }) => {
        return `${name} (${value})`; // Muestra: "NombreCamara (Cantidad)"
    };

    if (idUsuario === null || idUsuario === undefined) {
        window.location.href = 'http://localhost:3000/';
    } else {
        return (
            <div className={`${styles.mainContainer} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
                {/* Sidebar con la capacidad de abrir/cerrar */}
                <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                <div className={styles.content}>
                    <h1 style={{
                        color: '#3498db', /* Azul vibrante */
                        fontSize: '3.5rem', /* Aumento del tamaño */
                        fontWeight: '700', /* Mayor peso para hacerlo más prominente */
                        textAlign: 'center', /* Centrado */
                        letterSpacing: '2px', /* Espaciado entre letras */
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', /* Sombra sutil para resaltar */
                        padding: '20px', /* Espaciado alrededor */
                        borderBottom: '4px solid #3498db', /* Borde inferior azul para resaltar */
                        fontFamily: "'Poppins', sans-serif" /* Fuente elegante */
                    }}>
                        Resumen de gráficos
                    </h1>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2" style={{ textAlign: "center" }} > Usuarios más activos</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={usuariosActivos}>
                                    <XAxis dataKey="idusuario__nombreusuario" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total_usos" fill="#0b5cb8" label={{ position: 'top', fill: '#333', fontSize: 12 }} />

                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2" style={{ textAlign: "center" }}>Horas pico de uso de cámaras</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={horasPico}>
                                    <XAxis
                                        dataKey="hora_extraida"
                                        tickFormatter={(tick) => `${tick}:00`}
                                        label={{ value: "Hora del día", position: "insideBottom", offset: -5 }}
                                    />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} usos`, "Total"]} />
                                    <Bar dataKey="total" fill="#ff7300" label={{ position: 'top', fill: '#333', fontSize: 12 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2" style={{ textAlign: "center" }}>Cámara más usada</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={camaraMasUsada}
                                        dataKey="total_usos"
                                        nameKey="idcamara__nombrecamara"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#82ca9d"
                                        label={renderCustomLabel}
                                    >
                                        {camaraMasUsada.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                                        ))}
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                    </div>

                </div>
                      <ToastContainer toastStyle={{ marginTop: '80px' }} />

            </div>
        );
    }
};

export default Grafico;
