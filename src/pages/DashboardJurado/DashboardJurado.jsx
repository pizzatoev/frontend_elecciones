import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJuradoByCi } from '../../services/JuradoService.js';
import { 
  Person, 
  Heart, 
  ExclamationTriangle, 
  XCircle,
  FileEarmarkArrowDown,
  CheckCircle
} from 'react-bootstrap-icons';
import jsPDF from 'jspdf';
import './DashboardJurado.css';

const DashboardJurado = () => {
  const { ci } = useParams();
  const [jurado, setJurado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ci) {
      loadJuradoData();
    }
  }, [ci]);

  const loadJuradoData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getJuradoByCi(ci);
      setJurado(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const [veedorResponse, delegadoResponse] = await Promise.allSettled([
            fetch(`http://localhost:9090/api/veedores/ci/${ci}`),
            fetch(`http://localhost:9090/api/delegados/ci/${ci}`)
          ]);
          
          if (veedorResponse.status === 'fulfilled' && veedorResponse.value.ok) {
            setError('Usted no es jurado, es veedor');
          } else if (delegadoResponse.status === 'fulfilled' && delegadoResponse.value.ok) {
            setError('Usted no es jurado, es delegado');
          } else {
            setError('CI incorrecto');
          }
        } catch {
          setError('CI incorrecto');
        }
      } else {
        setError('Error al cargar los datos del jurado: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarCredencial = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('CREDENCIAL ELECTORAL - JURADO', 105, 30, { align: 'center' });
      
      doc.setDrawColor(0, 0, 0);
      doc.line(20, 35, 190, 35);
      
      doc.setFontSize(14);
      doc.text('Nombre:', 30, 50);
      doc.text(`${jurado.personaNombre} ${jurado.personaApellido}`, 80, 50);
      
      doc.text('CI:', 30, 60);
      doc.text(jurado.personaCi, 80, 60);
      
      doc.text('Rol:', 30, 70);
      doc.text('JURADO', 80, 70);
      
      doc.text('Cargo:', 30, 80);
      doc.text(jurado.cargo, 80, 80);
      
      doc.text('Mesa:', 30, 90);
      doc.text(jurado.mesaNumero.toString(), 80, 90);
      
      doc.text('Recinto:', 30, 100);
      doc.text(jurado.recintoNombre, 80, 100);
      
      doc.text('Fecha de Emisión:', 30, 110);
      doc.text(new Date().toLocaleDateString('es-ES'), 80, 110);
      
      doc.setFontSize(12);
      doc.text('Código QR:', 30, 130);
      doc.text(`QR_${jurado.personaCi}_JURADO_${Date.now()}`, 30, 140);
      
      doc.setDrawColor(0, 0, 0);
      doc.rect(15, 15, 180, 140);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Sistema de Elecciones - Credencial de Jurado', 105, 170, { align: 'center' });
      doc.text('Este documento es válido para el proceso electoral', 105, 180, { align: 'center' });
      
      doc.save(`credencial_jurado_${jurado.personaCi}.pdf`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const getEstadoBadge = (verificado) => {
    return (
      <span className={`estado-badge ${verificado ? 'verificado' : 'pendiente'}`}>
        {verificado ? 'Verificado' : 'Pendiente'}
      </span>
    );
  };

  const getCargoBadge = (cargo) => {
    const cargoText = {
      'PRESIDENTE': 'Presidente',
      'SECRETARIO': 'Secretario',
      'VOCAL': 'Vocal',
      'SUPLENTE': 'Suplente'
    };
    
    return (
      <span className={`cargo-badge ${cargo.toLowerCase()}`}>
        {cargoText[cargo] || cargo}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h3 className="loading-text">Cargando información del jurado...</h3>
          <p className="loading-subtitle">Verificando datos en el sistema electoral</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="error-card">
            <div className="error-icon">
              <ExclamationTriangle size={48} />
            </div>
            <h3 className="error-title">Error de Acceso</h3>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!jurado) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="not-found-card">
            <div className="not-found-icon">
              <XCircle size={48} />
            </div>
            <h3 className="not-found-title">No Encontrado</h3>
            <p className="not-found-message">Usted no está registrado como jurado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="main-dashboard-card">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="role-icon">
                <img 
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=90&h=90&fit=crop&crop=center" 
                  alt="Jurado Electoral" 
                  className="icon-image"
                />
              </div>
              <div className="header-text">
                <h2 className="dashboard-title">Dashboard del Jurado</h2>
                <p className="dashboard-subtitle">Sistema Electoral de Bolivia</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-body">
            <div className="success-alert">
              <div className="success-content">
                <div className="success-icon">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h4 className="success-title">¡Felicitaciones!</h4>
                  <p className="success-message">Fuiste seleccionado como jurado electoral</p>
                </div>
              </div>
            </div>
            
            <div className="info-sections">
              <div className="info-section">
                <div className="info-card personal-info">
                  <h5 className="info-title">
                    <Person className="info-icon" />
                    Información Personal
                  </h5>
                  <div className="info-content">
                    <div className="info-item">
                      <span className="info-label">Cédula de Identidad:</span>
                      <span className="info-value">{jurado.personaCi}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Nombre:</span>
                      <span className="info-value">{jurado.personaNombre}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Apellido:</span>
                      <span className="info-value">{jurado.personaApellido}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <div className="info-card electoral-info">
                  <h5 className="info-title">
                    <Heart className="info-icon" />
                    Información Electoral
                  </h5>
                  <div className="info-content">
                    <div className="info-item">
                      <span className="info-label">Mesa:</span>
                      <span className="info-value">{jurado.mesaNumero}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Recinto:</span>
                      <span className="info-value">{jurado.recintoNombre}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Cargo:</span>
                      <span className="info-value">{getCargoBadge(jurado.cargo)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estado:</span>
                      <span className="info-value">{getEstadoBadge(jurado.verificado)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="action-section">
              <button 
                onClick={handleDescargarCredencial}
                className="download-button"
              >
                <FileEarmarkArrowDown className="button-icon" />
                Descargar Credencial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardJurado;