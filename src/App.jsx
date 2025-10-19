import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './App.css';
import logo from "./assets/logo_MiVoto2.png";


// Importar páginas
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
      {/* Navbar simple con enlaces de navegación */}
      <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                <img
                    src={logo}
                    alt="Logo del Sistema"
                    height="50"
                    className="d-inline-block align-top me-2"
                />
            </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Soy Voluntario</Nav.Link>
              <Nav.Link as={Link} to="/login-admin">Soy Administrador</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<LoginVoluntario />} />
        
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
  );
}

export default App;
