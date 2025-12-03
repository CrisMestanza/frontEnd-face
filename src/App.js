import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Control from './components/camarasFacial/control';
import ControlMatricula from './components/camarasMatricula/controlMatriculas';
import Admin from './components/admin/admin';
import Login from './components/login/login';
import Usuarios from './components/usuarios/usuarios';
import Grafico from './components/graficos/grafico';
import GraficoMatricula from './components/graficosMatriculas/grafico';
import Extraccion from './components/extraccion/extraccion';
import ExtraccionMatriculas from './components/extraccionMatriculas/extraccionMatricula';
import Imagenes from './components/imagenes/imagenes';
import Mapa from './components/mapa/mapa';
import Persona from './components/personas/personas';
import Principal from './components/inicio/principal';
import MapaPersona from './components/personas/MapaPersona';
import MapaEstadistico from './components/mapaEstadisticoAlerta/mapaE';
import MapaEstadisticoFacial from './components/mapaEstadisticoFacial/mapFacial';
import SuperAdmin from './components/adminAlerta/superAdmin';
const AppContent = () => {

  return (
    <>
      <Routes>

        {/* Facial */}
        <Route path="/" element={<Login />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/camaras" element={<Control />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/graficos" element={<Grafico />} />
        <Route path="/extraccion" element={<Extraccion />} />
        <Route path="/imagenes" element={<Imagenes />} />
        <Route path="/personas" element={<Persona />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/MapaEstadisticoFacial" element={<MapaEstadisticoFacial />} />
        <Route path="/mapa/:idpersona" element={<MapaPersona />} />

        {/* Alerta */}
        <Route path="/mapaEstadistico" element={<MapaEstadistico />} />
        <Route path="/superAdmin" element={<SuperAdmin />} />

        {/* Matriculas */ }
        <Route path="/controlMatriculas" element={<ControlMatricula />} />
        <Route path="/extraccionMatriculas" element={<ExtraccionMatriculas />} />
        <Route path="/graficoMatricula" element={<GraficoMatricula />} />

      </Routes>

    </>
  );
};
const App = () => {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(
          "https://alerta-serenazgo-mpsm.onrender.com/api/get-csrf/",
          { credentials: "include" }
        );
        if (response.ok) {
          console.log("");
        }
      } catch (error) {
        console.error("Error al obtener CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, []);
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
