/**RUSSELL RIOS**/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { getVeedorByCi } from '../../services/VeedorService.js';
import jsPDF from 'jspdf';

const DashboardVeedor = () => {
  const { ci } = useParams();
  const navigate = useNavigate();
  const [veedor, setVeedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ci) {
      loadVeedorData();
    }
  }, [ci]);

  const loadVeedorData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getVeedorByCi(ci);
      setVeedor(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Verificar si el CI existe en personas pero no es veedor
        try {
          // Intentar verificar si existe como jurado o delegado
          const [juradoResponse, delegadoResponse] = await Promise.allSettled([
            fetch(`http://localhost:9090/api/jurados/ci/${ci}`),
            fetch(`http://localhost:9090/api/delegados/ci/${ci}`)
          ]);
          
          if (juradoResponse.status === 'fulfilled' && juradoResponse.value.ok) {
            setError('Usted no es veedor, es jurado');
          } else if (delegadoResponse.status === 'fulfilled' && delegadoResponse.value.ok) {
            setError('Usted no es veedor, es delegado');
          } else {
            setError('CI incorrecto');
          }
        } catch {
          setError('CI incorrecto');
        }
      } else {
        setError('Error al cargar los datos del veedor: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarCredencial = () => {
    try {
      // Crear PDF real usando jsPDF
      const doc = new jsPDF();
      
      // Configurar fuente y colores
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      
      // Título principal
      doc.text('CREDENCIAL ELECTORAL - VEEDOR', 105, 30, { align: 'center' });
      
      // Línea decorativa
      doc.setDrawColor(0, 0, 0);
      doc.line(20, 35, 190, 35);
      
      // Información de la credencial
      doc.setFontSize(14);
      doc.text('Nombre:', 30, 50);
      doc.text(`${veedor.personaNombre} ${veedor.personaApellido}`, 80, 50);
      
      doc.text('CI:', 30, 60);
      doc.text(veedor.personaCi, 80, 60);
      
      doc.text('Rol:', 30, 70);
      doc.text('VEEDOR', 80, 70);
      
      doc.text('Institución:', 30, 80);
      doc.text(veedor.institucionNombre, 80, 80);
      
      doc.text('Estado:', 30, 90);
      doc.text(veedor.estado, 80, 90);
      
      if (veedor.ubicacionAsignada) {
        doc.text('Ubicación:', 30, 100);
        doc.text(veedor.ubicacionAsignada, 80, 100);
      }
      
      doc.text('Fecha de Emisión:', 30, 110);
      doc.text(new Date().toLocaleDateString('es-ES'), 80, 110);
      
      // Código QR simulado
      doc.setFontSize(12);
      doc.text('Código QR:', 30, 130);
      doc.text(`QR_${veedor.personaCi}_VEEDOR_${Date.now()}`, 30, 140);
      
      // Marco decorativo
      doc.setDrawColor(0, 0, 0);
      doc.rect(15, 15, 180, 140);
      
      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Sistema de Elecciones - Credencial de Veedor', 105, 170, { align: 'center' });
      doc.text('Este documento es válido para el proceso electoral', 105, 180, { align: 'center' });
      
      // Descargar el PDF
      doc.save(`credencial_veedor_${veedor.personaCi}.pdf`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const handleEnviarSolicitud = () => {
    navigate(`/registro-veedor/${ci}`);
  };

  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      'PENDIENTE': { bg: 'warning', text: 'Pendiente' },
      'APROBADO': { bg: 'success', text: 'Aprobado' },
      'RECHAZADO': { bg: 'danger', text: 'Rechazado' }
    };
    
    const config = badgeConfig[estado] || { bg: 'secondary', text: estado };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando datos del veedor...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!veedor) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>No encontrado</Alert.Heading>
          <p>Usted no es veedor</p>
          <div className="mt-3">
            <Button variant="primary" onClick={handleEnviarSolicitud}>
              Enviar solicitud
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card>
            <Card.Header className="bg-success text-white">
              <h3 className="mb-0">Dashboard del Veedor</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="success" className="text-center mb-4">
                <Alert.Heading>¡Bienvenido!</Alert.Heading>
                <p className="mb-0"><strong>Eres veedor de observación electoral</strong></p>
              </Alert>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5>Información Personal</h5>
                  <p><strong>CI:</strong> {veedor.personaCi}</p>
                  <p><strong>Nombre:</strong> {veedor.personaNombre}</p>
                  <p><strong>Apellido:</strong> {veedor.personaApellido}</p>
                </div>
                <div className="col-md-6">
                  <h5>Información Electoral</h5>
                  <p><strong>Institución:</strong> {veedor.institucionNombre}</p>
                  <p><strong>Estado:</strong> {getEstadoBadge(veedor.estado)}</p>
                  {veedor.estado === 'RECHAZADO' && veedor.motivoRechazo && (
                    <p><strong>Motivo de rechazo:</strong> {veedor.motivoRechazo}</p>
                  )}
                  {veedor.estado === 'APROBADO' && veedor.ubicacionAsignada && (
                    <p><strong>Ubicación asignada:</strong> {veedor.ubicacionAsignada}</p>
                  )}
                </div>
              </div>
              
              <div className="d-grid gap-2">
                {veedor.estado === 'APROBADO' && (
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={handleDescargarCredencial}
                    className="mb-2"
                  >
                    Descargar Credencial
                  </Button>
                )}
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={handleEnviarSolicitud}
                >
                  Enviar solicitud
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default DashboardVeedor;

