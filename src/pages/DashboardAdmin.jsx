import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Card, Badge, Button } from 'react-bootstrap';
import { 
  GeoAlt, 
  Building, 
  Bank, 
  PersonCheck, 
  Eye, 
  Person, 
  ClipboardCheck, 
  People, 
  CreditCard,
  FileText
} from 'react-bootstrap-icons';
import './DashboardAdmin.css';

// Importar subcomponentes
import UbicacionAdmin from '../components/admin/UbicacionAdmin';
import PartidosAdmin from '../components/admin/PartidosAdmin';
import InstitucionesAdmin from '../components/admin/InstitucionesAdmin';
import JuradosAdmin from '../components/admin/JuradosAdmin';
import VeedoresAdmin from '../components/admin/VeedoresAdmin';
import DelegadosAdmin from '../components/admin/DelegadosAdmin';
import AsistenciaAdmin from '../components/admin/AsistenciaAdmin';
import PersonasAdmin from '../components/admin/PersonasAdmin';
import CredencialesAdmin from '../components/admin/CredencialesAdmin';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Datos mock para el resumen
  const resumenData = {
    jurados: 45,
    veedoresPendientes: 12,
    veedoresAprobados: 28,
    delegados: 15
  };

  const menuItems = [
    { path: '/dashboard-admin/ubicacion', label: 'Ubicación Electoral', icon: GeoAlt },
    { path: '/dashboard-admin/partidos', label: 'Partidos', icon: Building },
    { path: '/dashboard-admin/instituciones', label: 'Instituciones', icon: Bank },
    { path: '/dashboard-admin/jurados', label: 'Jurados', icon: PersonCheck },
    { path: '/dashboard-admin/veedores', label: 'Veedores', icon: Eye },
    { path: '/dashboard-admin/delegados', label: 'Delegados', icon: Person },
    { path: '/dashboard-admin/asistencia', label: 'Asistencia', icon: ClipboardCheck },
    { path: '/dashboard-admin/personas', label: 'Personas', icon: People },
    { path: '/dashboard-admin/credenciales', label: 'Credenciales', icon: CreditCard }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const ResumenInicial = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Panel de Administración Electoral</h2>
        <p className="dashboard-subtitle">Sistema de Gestión Electoral de Bolivia</p>
      </div>
      
      <Row className="stats-row">
        <Col md={3} className="mb-4">
          <Card className="stat-card jurados-card">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <PersonCheck size={32} />
              </div>
              <Card.Title className="stat-title">Jurados Registrados</Card.Title>
              <h3 className="stat-number">{resumenData.jurados}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="stat-card veedores-pendientes-card">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <Eye size={32} />
              </div>
              <Card.Title className="stat-title">Veedores Pendientes</Card.Title>
              <h3 className="stat-number">{resumenData.veedoresPendientes}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="stat-card veedores-aprobados-card">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <Eye size={32} />
              </div>
              <Card.Title className="stat-title">Veedores Aprobados</Card.Title>
              <h3 className="stat-number">{resumenData.veedoresAprobados}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="stat-card delegados-card">
            <Card.Body className="text-center">
              <div className="stat-icon">
                <Person size={32} />
              </div>
              <Card.Title className="stat-title">Delegados</Card.Title>
              <h3 className="stat-number">{resumenData.delegados}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="action-buttons-row">
        <Col md={12} className="text-center">
          <div className="buttons-container">
            <Button 
              variant="success" 
              size="lg"
              onClick={() => navigate('/registro-veedor/LP-100023')}
              className="action-button primary-action"
            >
              <FileText className="button-icon" />
              Registrar Nuevo Veedor
            </Button>
            <Button 
              variant="info" 
              size="lg"
              onClick={() => navigate('/dashboard-admin/veedores')}
              className="action-button secondary-action"
            >
              <Eye className="button-icon" />
              Gestionar Veedores
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} className="admin-sidebar">
          <div className="sidebar-header">
            <div className="admin-logo">
              <h4 className="admin-title">Panel de Administración</h4>
            </div>
            <p className="admin-subtitle">Sistema Electoral</p>
          </div>
          <ListGroup variant="flush" className="admin-menu">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <ListGroup.Item
                  key={index}
                  action
                  active={isActive(item.path)}
                  onClick={() => handleMenuClick(item.path)}
                  className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <div className="menu-item-content">
                    <IconComponent className="menu-icon" size={20} />
                    <span className="menu-label">{item.label}</span>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>

        {/* Content Area */}
        <Col md={9} className="admin-content">
          <Routes>
            <Route path="/" element={<ResumenInicial />} />
            <Route path="/ubicacion" element={<UbicacionAdmin />} />
            <Route path="/partidos" element={<PartidosAdmin />} />
            <Route path="/instituciones" element={<InstitucionesAdmin />} />
            <Route path="/jurados" element={<JuradosAdmin />} />
            <Route path="/veedores" element={<VeedoresAdmin />} />
            <Route path="/delegados" element={<DelegadosAdmin />} />
            <Route path="/asistencia" element={<AsistenciaAdmin />} />
            <Route path="/personas" element={<PersonasAdmin />} />
            <Route path="/credenciales" element={<CredencialesAdmin />} />
            <Route path="*" element={<Navigate to="/dashboard-admin" replace />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardAdmin;

