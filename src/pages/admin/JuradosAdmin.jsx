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
} from '../../services/JuradoService';
import { useRoleValidation } from '../../hooks/useRoleValidation';
import ErrorAlert from '../../components/ErrorAlert';

const JuradosAdmin = () => {
  const [jurados, setJurados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const { error, success, handleError, handleSuccess, clearMessages } = useRoleValidation();

  // Cargar jurados al montar el componente
  useEffect(() => {
    loadJurados();
  }, []);

  const loadJurados = async () => {
    try {
      setLoading(true);
      clearMessages();
      const response = await getAllJurados();
      setJurados(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortear = async () => {
    if (window.confirm('¿Está seguro de realizar el sorteo de jurados? Esto asignará nuevos jurados a todas las mesas.')) {
      try {
        setSorteando(true);
        clearMessages();
        
        const response = await sortearJurados();
        handleSuccess(`Sorteo realizado exitosamente. Se asignaron ${response.data.length} jurados.`);
        loadJurados();
      } catch (error) {
        handleError(error);
      } finally {
        setSorteando(false);
      }
    }
  };

  const handleEliminarSorteo = async () => {
    if (window.confirm('¿Está seguro de eliminar el sorteo actual? Esto eliminará todas las asignaciones de jurados.')) {
      try {
        setEliminando(true);
        clearMessages();
        
        await eliminarSorteo();
        handleSuccess('Sorteo eliminado exitosamente.');
        loadJurados();
      } catch (error) {
        handleError(error);
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
      <ErrorAlert 
        error={error} 
        onClose={clearMessages}
        variant="danger"
      />
      {success && <Alert variant="success" dismissible onClose={clearMessages}>{success}</Alert>}

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
