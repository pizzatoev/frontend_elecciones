/**SEBASTIAN FERNANDEZ**/

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Alert,
  Badge,
  Spinner
} from 'react-bootstrap';
import { 
  getAllJurados, 
  sortearJurados, 
  eliminarSorteo 
} from '../../../services/JuradoService.js';
import './JuradosAdmin.css';

const JuradosAdmin = () => {
  const [jurados, setJurados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar jurados al montar el componente
  useEffect(() => {
    loadJurados();
  }, []);

  const loadJurados = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllJurados();
      setJurados(response.data);
    } catch (error) {
      setError('Error al cargar los jurados: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSortear = async () => {
    if (window.confirm('¿Está seguro de realizar el sorteo de jurados? Esto asignará nuevos jurados a todas las mesas.')) {
      try {
        setSorteando(true);
        setError('');
        setSuccess('');
        
        const response = await sortearJurados();
        setSuccess(`Sorteo realizado exitosamente. Se asignaron ${response.data.length} jurados.`);
        loadJurados();
      } catch (error) {
        setError('Error al realizar el sorteo: ' + (error.response?.data?.message || error.message));
      } finally {
        setSorteando(false);
      }
    }
  };

  const handleEliminarSorteo = async () => {
    if (window.confirm('¿Está seguro de eliminar el sorteo actual? Esto eliminará todas las asignaciones de jurados.')) {
      try {
        setEliminando(true);
        setError('');
        setSuccess('');
        
        await eliminarSorteo();
        setSuccess('Sorteo eliminado exitosamente.');
        loadJurados();
      } catch (error) {
        setError('Error al eliminar el sorteo: ' + (error.response?.data?.message || error.message));
      } finally {
        setEliminando(false);
      }
    }
  };

  const getCargoBadge = (cargo) => {
    const badgeConfig = {
      'PRESIDENTE': { bg: 'primary', text: 'Presidente' },
      'SECRETARIO': { bg: 'success', text: 'Secretario' },
      'VOCAL': { bg: 'info', text: 'Vocal' },
      'SUPLENTE': { bg: 'warning', text: 'Suplente' }
    };
    
    const config = badgeConfig[cargo] || { bg: 'secondary', text: cargo };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getVerificadoBadge = (verificado) => {
    return verificado ? 
      <Badge bg="success">Verificado</Badge> : 
      <Badge bg="secondary">Pendiente</Badge>;
  };

  // Agrupar jurados por mesa para mejor visualización
  const juradosPorMesa = jurados.reduce((acc, jurado) => {
    const mesaId = jurado.idMesa || 'Sin mesa';
    const mesaNumero = jurado.mesaNumero || 'N/A';
    const recintoNombre = jurado.recintoNombre || 'Sin recinto';
    
    if (!acc[mesaId]) {
      acc[mesaId] = {
        mesa: {
          id: mesaId,
          numero: mesaNumero,
          recinto: recintoNombre
        },
        jurados: []
      };
    }
    acc[mesaId].jurados.push(jurado);
    return acc;
  }, {});

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Jurados</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="success" 
            onClick={handleSortear}
            disabled={sorteando || eliminando}
            className="me-2"
          >
            {sorteando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Realizando sorteo...
              </>
            ) : (
              'Realizar sorteo de jurados'
            )}
          </Button>
          <Button 
            variant="danger" 
            onClick={handleEliminarSorteo}
            disabled={sorteando || eliminando || jurados.length === 0}
          >
            {eliminando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar sorteo'
            )}
          </Button>
        </Col>
      </Row>

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de jurados */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {Object.keys(juradosPorMesa).length === 0 ? (
                <Alert variant="info">
                  No hay jurados asignados. Use el botón "Realizar sorteo de jurados" para asignar jurados a las mesas.
                </Alert>
              ) : (
                Object.values(juradosPorMesa).map((grupo, index) => (
                  <div key={index} className="mb-4">
                    <h5 className="mb-3">
                      Mesa {grupo.mesa.numero} - {grupo.mesa.recinto}
                    </h5>
                    <Table striped hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>CI</th>
                          <th>Nombre Completo</th>
                          <th>Cargo</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grupo.jurados.map((jurado) => (
                          <tr key={jurado.id}>
                            <td><strong>{jurado.personaCi || '-'}</strong></td>
                            <td>
                              {jurado.personaNombre || '-'} {jurado.personaApellido || '-'}
                            </td>
                            <td>{getCargoBadge(jurado.cargo)}</td>
                            <td>{getVerificadoBadge(jurado.verificado)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ))
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Resumen de estadísticas */}
      {jurados.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Alert variant="info">
              <h6>Resumen del Sorteo</h6>
              <p className="mb-1">
                <strong>Total de jurados asignados:</strong> {jurados.length}
              </p>
              <p className="mb-1">
                <strong>Mesas con jurados:</strong> {Object.keys(juradosPorMesa).length}
              </p>
              <p className="mb-0">
                <strong>Jurados verificados:</strong> {jurados.filter(j => j.verificado).length}
              </p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default JuradosAdmin;
