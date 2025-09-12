import React, { useState } from 'react';
import axios from 'axios';

import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import miImagen from '../../images/loginPersona.png';
import { PiSecurityCameraBold } from "react-icons/pi";



<Image
    src={miImagen} // Usas la variable importada
    alt="Imagen"
    fluid
    className="h-100 w-100"
/>

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { usuario, contrasena }

        axios.post(`http://127.0.0.1:8000/api/usuarioLogin/`, data)
        .then(response => {
            sessionStorage.setItem('idusuario', response.data.idusuario);
            sessionStorage.setItem('usuario', data.usuario);
            sessionStorage.setItem('contrasena', data.contrasena);
            sessionStorage.setItem('nombre',  response.data.nombreusuario);
            sessionStorage.setItem('admin',  response.data.admin);

            
            // Redirigir o hacer algo más
            window.location.href = 'http://localhost:3000/camaras';
            
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                console.log("Error de login:", error.response.data.error);
                setMensajeError("Usuario o contraseña incorrectos.");
            } else {
                console.log("Otro error:", error);
                alert("Ocurrió un error inesperado.");
            }
        });
    


    }

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
                    <p style={{color:"red"}}>{mensajeError? mensajeError: ""}</p>
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
                            ¿No tienes una cuenta? <button  style={{ fontWeight: '500', color: '#007bff', background: 'none', border: 'none' }}>
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
