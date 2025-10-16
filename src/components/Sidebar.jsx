import React from 'react';
import { Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userType }) => {
  const location = useLocation();

  const getMenuItems = () => {
    switch (userType) {
      case 'admin':
        return [
          { path: '/dashboard-admin', label: 'Dashboard', icon: '🏠' },
          { path: '/usuarios', label: 'Usuarios', icon: '👥' },
          { path: '/elecciones', label: 'Elecciones', icon: '🗳️' },
          { path: '/reportes', label: 'Reportes', icon: '📊' },
          { path: '/configuracion', label: 'Configuración', icon: '⚙️' }
        ];
      case 'jurado':
        return [
          { path: '/dashboard-jurado', label: 'Dashboard', icon: '🏠' },
          { path: '/votaciones', label: 'Votaciones', icon: '🗳️' },
          { path: '/resultados', label: 'Resultados', icon: '📊' },
          { path: '/perfil', label: 'Perfil', icon: '👤' }
        ];
      case 'veedor':
        return [
          { path: '/dashboard-veedor', label: 'Dashboard', icon: '🏠' },
          { path: '/supervision', label: 'Supervisión', icon: '👁️' },
          { path: '/reportes', label: 'Reportes', icon: '📊' },
          { path: '/perfil', label: 'Perfil', icon: '👤' }
        ];
      case 'delegado':
        return [
          { path: '/dashboard-delegado', label: 'Dashboard', icon: '🏠' },
          { path: '/mesa', label: 'Mi Mesa', icon: '🏛️' },
          { path: '/votantes', label: 'Votantes', icon: '👥' },
          { path: '/perfil', label: 'Perfil', icon: '👤' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar bg-light" style={{ minHeight: '100vh', width: '250px' }}>
      <Container fluid className="p-0">
        <Nav className="flex-column p-3">
          {menuItems.map((item, index) => (
            <Nav.Item key={index}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={`d-flex align-items-center ${
                  location.pathname === item.path ? 'active' : ''
                }`}
                style={{
                  padding: '10px 15px',
                  marginBottom: '5px',
                  borderRadius: '5px',
                  backgroundColor: location.pathname === item.path ? '#007bff' : 'transparent',
                  color: location.pathname === item.path ? 'white' : 'black'
                }}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Container>
    </div>
  );
};

export default Sidebar;

