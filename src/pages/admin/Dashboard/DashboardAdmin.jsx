/**SEBASTIAN FERNANDEZ - MEJORADO**/

import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
  House,
  ArrowRight,
  CheckCircle,
  Clock,
  Users
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
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <div className="admin-main-card">
          <div className="admin-dashboard-header">
            <div className="admin-header-icon">
              <House size={32} />
            </div>
            <div className="admin-header-text">
              <h1 className="admin-dashboard-title">Panel de Administración Electoral</h1>
              <p className="admin-dashboard-subtitle">Sistema de Gestión Electoral de Bolivia</p>
            </div>
          </div>
          
          <div className="admin-dashboard-body">
            <div className="admin-stats-grid">
              <div className="admin-stat-card jurados-stat">
                <div className="stat-card-header">
                  <div className="stat-icon jurados-icon">
                    <PersonCheck size={24} />
                  </div>
                  <div className="stat-status">
                    <CheckCircle size={16} />
                    <span>Activos</span>
                  </div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{resumenData.jurados}</h3>
                  <p className="stat-label">Jurados Registrados</p>
                </div>
              </div>

              <div className="admin-stat-card veedores-pendientes-stat">
                <div className="stat-card-header">
                  <div className="stat-icon veedores-pendientes-icon">
                    <Clock size={24} />
                  </div>
                  <div className="stat-status pending">
                    <Clock size={16} />
                    <span>Pendientes</span>
                  </div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{resumenData.veedoresPendientes}</h3>
                  <p className="stat-label">Veedores Pendientes</p>
                </div>
              </div>

              <div className="admin-stat-card veedores-aprobados-stat">
                <div className="stat-card-header">
                  <div className="stat-icon veedores-aprobados-icon">
                    <Eye size={24} />
                  </div>
                  <div className="stat-status approved">
                    <CheckCircle size={16} />
                    <span>Aprobados</span>
                  </div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{resumenData.veedoresAprobados}</h3>
                  <p className="stat-label">Veedores Aprobados</p>
                </div>
              </div>

              <div className="admin-stat-card delegados-stat">
                <div className="stat-card-header">
                  <div className="stat-icon delegados-icon">
                    <Users size={24} />
                  </div>
                  <div className="stat-status">
                    <CheckCircle size={16} />
                    <span>Activos</span>
                  </div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{resumenData.delegados}</h3>
                  <p className="stat-label">Delegados</p>
                </div>
              </div>
            </div>
            
            <div className="admin-action-section">
              <div className="action-buttons-grid">
                <button 
                  onClick={() => navigate('/registro-veedor/LP-100023')}
                  className="admin-action-button primary-action"
                >
                  <FileText className="button-icon" />
                  <span>Registrar Nuevo Veedor</span>
                  <ArrowRight className="button-arrow" />
                </button>
                <button 
                  onClick={() => navigate('/dashboard-admin/veedores')}
                  className="admin-action-button secondary-action"
                >
                  <Eye className="button-icon" />
                  <span>Gestionar Veedores</span>
                  <ArrowRight className="button-arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <div className="logo-icon">
              <House size={28} />
            </div>
            <div className="logo-text">
              <h1 className="admin-title">Panel de Administración</h1>
              <p className="admin-subtitle">Sistema Electoral</p>
            </div>
          </div>
        </div>
        
        <nav className="admin-menu">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => handleMenuClick(item.path)}
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <div className="menu-item-content">
                  <IconComponent className="menu-icon" size={20} />
                  <span className="menu-label">{item.label}</span>
                  {isActive(item.path) && <ArrowRight className="menu-arrow" size={16} />}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="admin-content">
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
      </div>
    </div>
  );
};

export default DashboardAdmin;

