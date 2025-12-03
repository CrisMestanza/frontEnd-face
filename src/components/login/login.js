import React, { useState } from 'react';
import axios from 'axios';

import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import miImagen from '../../images/loginPersona.png';
import { PiSecurityCameraBold } from "react-icons/pi";

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const editUsuario = (usuario) => {
        setUsuario(usuario);
    }
    
    const editContrasena = (contrasena) => {
        setContrasena(contrasena);
    }

    // Función para obtener tokenalerta en segundo plano
    const obtenerTokenAlerta = async () => {
        try {
            console.log("🔐 Obteniendo tokenalerta en segundo plano...");

            // 1️⃣ Obtener CSRF token
            const csrfRes = await fetch("https://alerta-serenazgo-mpsm.onrender.com/api/get-csrf/", {
                method: "GET",
                credentials: "include",
            });

            if (!csrfRes.ok) {
                console.warn("⚠️ No se pudo obtener el CSRF token para tokenalerta");
                return;
            }

            const csrfToken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("csrftoken="))
                ?.split("=")[1];

            console.log("✅ CSRF token obtenido para tokenalerta");

            // 2️⃣ Hacer login con credenciales fijas para obtener tokenalerta
            const loginRes = await fetch("https://alerta-serenazgo-mpsm.onrender.com/api/loginsereno/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include",
                body: JSON.stringify({
                    sereno_dni: "76165017",
                    sereno_password: "Jere@eck19652003@@$&@",
                }),
            });

            const loginData = await loginRes.json().catch(() => ({}));

            if (!loginRes.ok) {
                console.warn("⚠️ No se pudo obtener tokenalerta:", loginData.detail);
                return;
            }

            const token = loginData.token || loginData.access || null;

            if (token) {
                localStorage.setItem("tokenalerta", token);
                console.log("✅ tokenalerta obtenido y guardado correctamente");
            } else {
                console.warn("⚠️ No se recibió token en la respuesta de tokenalerta");
            }
        } catch (err) {
            console.error("❌ Error al obtener tokenalerta:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { usuario, contrasena };

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/usuarioLogin/`, data);
            
            // Guardar datos del usuario en sessionStorage
            sessionStorage.setItem('idusuario', response.data.idusuario);
            sessionStorage.setItem('usuario', data.usuario);
            sessionStorage.setItem('contrasena', data.contrasena);
            sessionStorage.setItem('nombre', response.data.nombreusuario);
            sessionStorage.setItem('admin', response.data.admin);

            // 🔐 Guardar también en localStorage un objeto con rol (para SuperAdmin.js)
            localStorage.setItem("user", JSON.stringify({
                idusuario: response.data.idusuario,
                nombreusuario: response.data.nombreusuario,
                usuario: data.usuario,
                dniusuario: response.data.dniusuario || "76165017",
                rol: "superadmin", // 👈 fuerza el rol para permitir el dashboard
            }));

            // 🔥 Obtener tokenalerta en segundo plano después del login exitoso
            await obtenerTokenAlerta();


            // Redirigir después de que todo esté listo
            window.location.href = 'http://localhost:3000/principal';
            
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("Error de login:", error.response.data.error);
                setMensajeError("Usuario o contraseña incorrectos.");
            } else {
                console.log("Otro error:", error);
                setMensajeError("Ocurrió un error inesperado.");
            }
        }
    };

    return (
        <Container fluid className="vh-100" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
            <Row className="h-100">
                {/* Image Section */}
                <Col md={6} className="d-none d-md-block p-0">
                    <Image
                        src={miImagen}
                        alt="Background"
                        fluid
                        className="h-100 w-100"
                    />
                </Col>

                {/* Login Section */}
                <Col md={5} className="d-flex flex-column justify-content-center align-items-center p-5">
                    <div className="text-center mb-5">
                        <span role="img" aria-label="logo" style={{ fontSize: '4rem', color: '#007bff', boxShadow: '0 4px 6px rgba(0, 123, 255, 0.3)', padding: '10px', borderRadius: '50%' }}>
                            <PiSecurityCameraBold />
                        </span>
                    </div>

                    <h3 className="mb-4 text-center" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#343a40' }}>
                        Iniciar sesión
                    </h3>
                    <p style={{color:"red"}}>{mensajeError ? mensajeError : ""}</p>
                    <Form style={{ width: '100%', maxWidth: '500px', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', backgroundColor: '#f8f9fa' }}>
                        <Form.Group className="mb-4" controlId="formEmail">
                            <Form.Label style={{ fontSize: '1.2rem', fontWeight: '500', color: '#007bff' }}>Usuario</Form.Label>
                            <Form.Control
                                onChange={(e) => editUsuario(e.target.value)}
                                type="text"
                                placeholder="Usuario"
                                style={{ padding: '12px', fontSize: '1.2rem', borderRadius: '10px', border: '2px solid #007bff', boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formPassword">
                            <Form.Label style={{ fontSize: '1.2rem', fontWeight: '500', color: '#007bff' }}>Contraseña</Form.Label>
                            <Form.Control
                                onChange={(e) => editContrasena(e.target.value)}
                                type="password"
                                placeholder="Contraseña"
                                style={{ padding: '12px', fontSize: '1.2rem', borderRadius: '10px', border: '2px solid #007bff', boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)' }}
                            />
                        </Form.Group>

                        <div className="d-grid mb-4">
                            <Button onClick={handleSubmit} variant="info" className="text-white" type="submit" style={{ fontSize: '1.3rem', padding: '15px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 123, 255, 0.3)' }}>
                                Ingresar
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <button className="btn btn-link text-muted">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <div className="text-center mt-3" style={{ fontSize: '1.1rem', fontWeight: '400' }}>
                            ¿No tienes una cuenta? <button style={{ fontWeight: '500', color: '#007bff', background: 'none', border: 'none' }}>
                                Regístrate aquí
                            </button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;