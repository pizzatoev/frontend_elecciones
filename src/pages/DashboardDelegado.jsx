import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { getDelegadoByCi } from '../services/DelegadoService';
import jsPDF from 'jspdf';

const DashboardDelegado = () => {
  const { ci } = useParams();
  const [delegado, setDelegado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ci) {
      loadDelegadoData();
    }
  }, [ci]);

  const loadDelegadoData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDelegadoByCi(ci);
      setDelegado(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Verificar si el CI existe en personas pero no es delegado
        try {
          // Intentar verificar si existe como jurado o veedor
          const [juradoResponse, veedorResponse] = await Promise.allSettled([
            fetch(`http://localhost:9090/api/jurados/ci/${ci}`),
            fetch(`http://localhost:9090/api/veedores/ci/${ci}`)
          ]);
          
          if (juradoResponse.status === 'fulfilled' && juradoResponse.value.ok) {
            setError('Usted no es delegado, es jurado');
          } else if (veedorResponse.status === 'fulfilled' && veedorResponse.value.ok) {
            setError('Usted no es delegado, es veedor');
          } else {
            setError('CI incorrecto');
          }
        } catch {
          setError('CI incorrecto');
        }
      } else {
        setError('Error al cargar los datos del delegado: ' + (error.response?.data?.message || error.message));
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
      doc.text('CREDENCIAL ELECTORAL - DELEGADO', 105, 30, { align: 'center' });
      
      // Línea decorativa
      doc.setDrawColor(0, 0, 0);
      doc.line(20, 35, 190, 35);
      
      // Información de la credencial
      doc.setFontSize(14);
      doc.text('Nombre:', 30, 50);
      doc.text(`${delegado.personaNombre} ${delegado.personaApellido}`, 80, 50);
      
      doc.text('CI:', 30, 60);
      doc.text(delegado.personaCi, 80, 60);
      
      doc.text('Rol:', 30, 70);
      doc.text('DELEGADO', 80, 70);
      
      doc.text('Partido:', 30, 80);
      doc.text(delegado.partidoNombre, 80, 80);
      
      doc.text('Mesa:', 30, 90);
      doc.text(delegado.mesaNumero.toString(), 80, 90);
      
      doc.text('Recinto:', 30, 100);
      doc.text(delegado.recintoNombre, 80, 100);
      
      doc.text('Estado:', 30, 110);
      doc.text(delegado.habilitado ? 'HABILITADO' : 'DESHABILITADO', 80, 110);
      
      doc.text('Fecha de Emisión:', 30, 120);
      doc.text(new Date().toLocaleDateString('es-ES'), 80, 120);
      
      // Código QR simulado
      doc.setFontSize(12);
      doc.text('Código QR:', 30, 140);
      doc.text(`QR_${delegado.personaCi}_DELEGADO_${Date.now()}`, 30, 150);
      
      // Marco decorativo
      doc.setDrawColor(0, 0, 0);
      doc.rect(15, 15, 180, 150);
      
      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Sistema de Elecciones - Credencial de Delegado', 105, 180, { align: 'center' });
      doc.text('Este documento es válido para el proceso electoral', 105, 190, { align: 'center' });
      
      // Descargar el PDF
      doc.save(`credencial_delegado_${delegado.personaCi}.pdf`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const getEstadoBadge = (habilitado) => {
    return habilitado ? (
      <Badge bg="success">Habilitado</Badge>
    ) : (
      <Badge bg="danger">Deshabilitado</Badge>
    );
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando datos del delegado...</p>
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

  if (!delegado) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>No encontrado</Alert.Heading>
          <p>Usted no es delegado</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card>
            <Card.Header className="bg-info text-white">
              <h3 className="mb-0">Dashboard del Delegado</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="text-center mb-4">
                <Alert.Heading>¡Bienvenido!</Alert.Heading>
                <p className="mb-0"><strong>Eres delegado de partido político</strong></p>
              </Alert>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5>Información Personal</h5>
                  <p><strong>CI:</strong> {delegado.personaCi}</p>
                  <p><strong>Nombre:</strong> {delegado.personaNombre}</p>
                  <p><strong>Apellido:</strong> {delegado.personaApellido}</p>
                </div>
                <div className="col-md-6">
                  <h5>Información Electoral</h5>
                  <p><strong>Partido:</strong> {delegado.partidoNombre}</p>
                  <p><strong>Mesa:</strong> {delegado.mesaNumero}</p>
                  <p><strong>Recinto:</strong> {delegado.recintoNombre}</p>
                  <p><strong>Estado:</strong> {getEstadoBadge(delegado.habilitado)}</p>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="info" 
                  size="lg"
                  onClick={handleDescargarCredencial}
                >
                  Descargar Credencial
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default DashboardDelegado;

