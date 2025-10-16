import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './App.css';

// Importar páginas
import LoginAdmin from './pages/LoginAdmin';
import LoginVoluntario from './pages/LoginVoluntario';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardJurado from './pages/DashboardJurado';
import DashboardVeedor from './pages/DashboardVeedor';
import DashboardDelegado from './pages/DashboardDelegado';
import RegistroVeedor from './pages/RegistroVeedor';
import CreateUsuario from "./pages/CreateUsuario";
import Academia from './pages/Academia/Academia';


function App() {
  return (
    <div className="App">
      {/* Navbar simple con enlaces de navegación */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Sistema de Elecciones</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Login Voluntario</Nav.Link>
              <Nav.Link as={Link} to="/login-admin">Login Admin</Nav.Link>
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
