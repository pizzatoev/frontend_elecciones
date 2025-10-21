import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importar componentes
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import LoginAdmin from './pages/LoginAdmin/LoginAdmin.jsx';
import LoginVoluntario from './pages/LoginVoluntario/LoginVoluntario.jsx';
import DashboardAdmin from './pages/admin/Dashboard/DashboardAdmin.jsx';
import DashboardJurado from './pages/DashboardJurado/DashboardJurado.jsx';
import DashboardVeedor from './pages/DashboardVeedor/DashboardVeedor.jsx';
import DashboardDelegado from './pages/DashboradDelegado/DashboardDelegado.jsx';
import RegistroVeedor from './pages/RegistroVeedor/RegistroVeedor.jsx';
import CreateUsuario from "./pages/CreateUsuario/CreateUsuario.jsx";
import Academia from './pages/Academia/Academia';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Routes>
          {/* Ruta principal - Pantalla inicial del sistema electoral */}
          <Route path="/" element={<Home />} />
        
        {/* Ruta de login voluntario */}
        <Route path="/login-voluntario" element={<LoginVoluntario />} />
        
        {/* Rutas de login */}
        <Route path="/login-admin" element={<LoginAdmin />} />
        
        {/* Rutas de registro */}
        <Route path="/registro-veedor/:ci" element={<RegistroVeedor />} />
        
        {/* Rutas de dashboard */}
        <Route path="/dashboard-admin/*" element={<DashboardAdmin />} />
        <Route path="/dashboard-jurado/:ci" element={<DashboardJurado />} />
        <Route path="/dashboard-veedor/:ci" element={<DashboardVeedor />} />
        <Route path="/dashboard-delegado/:ci" element={<DashboardDelegado />} />
        <Route path="/create-usuario" element={<CreateUsuario />} />
        
        {/* Ruta de Academia */}
        <Route path="/academia/content" element={<Academia />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
