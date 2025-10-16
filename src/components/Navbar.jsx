import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const getBrandText = () => {
    if (location.pathname.includes('dashboard-admin')) return 'Admin - Sistema de Elecciones';
    if (location.pathname.includes('dashboard-jurado')) return 'Jurado - Sistema de Elecciones';
    if (location.pathname.includes('dashboard-veedor')) return 'Veedor - Sistema de Elecciones';
    if (location.pathname.includes('dashboard-delegado')) return 'Delegado - Sistema de Elecciones';
    return 'Sistema de Elecciones';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {getBrandText()}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login-admin">
                  Login Admin
                </Nav.Link>
                <Nav.Link as={Link} to="/login-voluntario">
                  Login Voluntario
                </Nav.Link>
                <Nav.Link as={Link} to="/registro-veedor">
                  Registro Veedor
                </Nav.Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to={`/dashboard-${userType}`}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil">
                  Perfil
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            ) : (
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

