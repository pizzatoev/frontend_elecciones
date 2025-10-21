/**SEBASTIAN FERNANDEZ**/

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
  FileText,
  House
} from 'react-bootstrap-icons';
import './DashboardAdmin.css';

// Importar subcomponentes
import UbicacionAdmin from '../../../components/admin/UbicacionAdmin.jsx';
import PartidosAdmin from '../../../components/admin/PartidosAdmin.jsx';
import InstitucionesAdmin from '../../../components/admin/InstitucionesAdmin.jsx';
import JuradosAdmin from '../../../components/admin/JuradosAdmin.jsx';
import VeedoresAdmin from '../../../components/admin/VeedoresAdmin.jsx';
import DelegadosAdmin from '../../../components/admin/DelegadosAdmin.jsx';
import AsistenciaAdmin from '../../../components/admin/AsistenciaAdmin.jsx';
import PersonasAdmin from '../../../components/admin/PersonasAdmin.jsx';
import CredencialesAdmin from '../../../components/admin/CredencialesAdmin.jsx';

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
    { path: '/dashboard-admin', label: 'Dashboard', icon: House },
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
        <h1 className="dashboard-title">Panel de Administración Electoral</h1>
        <p className="dashboard-subtitle">Sistema de Gestión Electoral de Bolivia</p>
      </div>
      
      <Row className="stats-row">
  <Col md={3} className="mb-4">
    <div className="stat-card jurados-card">
      <div className="stat-card-body">
        <div className="stat-icon">
          <PersonCheck size={32} />
        </div>
        <div className="stat-title">Jurados Registrados</div>
        <h3 className="stat-number">{resumenData.jurados}</h3>
      </div>
    </div>
  </Col>
  <Col md={3} className="mb-4">
    <div className="veedores-pendientes-card">
      <div className="stat-card-body">
        <div className="stat-icon">
          <Eye size={32} />
        </div>
        <div className="stat-title">Veedores Pendientes</div>
        <h3 className="stat-number">{resumenData.veedoresPendientes}</h3>
      </div>
    </div>
  </Col>
  <Col md={3} className="mb-4">
    <div className="veedores-aprobados-card">
      <div className="stat-card-body">
        <div className="stat-icon">
          <Eye size={32} />
        </div>
        <div className="stat-title">Veedores Aprobados</div>
        <h3 className="stat-number">{resumenData.veedoresAprobados}</h3>
      </div>
    </div>
  </Col>
  <Col md={3} className="mb-4">
    <div className="delegados-card">
      <div className="stat-card-body">
        <div className="stat-icon">
          <Person size={32} />
        </div>
        <div className="stat-title">Delegados</div>
        <h3 className="stat-number">{resumenData.delegados}</h3>
      </div>
    </div>
  </Col>
</Row>
      
      <Row className="action-buttons-row">
        <Col md={12} className="text-center">
          <div className="buttons-container">
            <Button 
              onClick={() => navigate('/registro-veedor/LP-100023')}
              className="action-button primary-action"
            >
              <FileText className="button-icon" />
              Registrar Nuevo Veedor
            </Button>
            <Button 
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
              <h1 className="admin-title">Panel de Administración</h1>
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

