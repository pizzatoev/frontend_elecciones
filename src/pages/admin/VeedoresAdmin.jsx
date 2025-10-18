import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Alert,
  Badge,
  Modal,
  Form,
  Spinner
} from 'react-bootstrap';
import { 
  getAllVeedores, 
  aprobarVeedor, 
  rechazarVeedor 
} from '../../services/VeedorService';
import { useRoleValidation } from '../../hooks/useRoleValidation';
import ErrorAlert from '../../components/ErrorAlert';

const VeedoresAdmin = () => {
  const [veedores, setVeedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error, success, handleError, handleSuccess, clearMessages } = useRoleValidation();
  
  // Estados para el modal de rechazo
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [veedorRechazar, setVeedorRechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Cargar veedores al montar el componente
  useEffect(() => {
    loadVeedores();
  }, []);

  const loadVeedores = async () => {
    try {
      setLoading(true);
      clearMessages();
      const response = await getAllVeedores();
      setVeedores(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de aprobar la solicitud de ${nombre}?`)) {
      try {
        setProcesando(true);
        clearMessages();
        
        await aprobarVeedor(id);
        handleSuccess('Veedor aprobado exitosamente');
        loadVeedores();
      } catch (error) {
        handleError(error);
      } finally {
        setProcesando(false);
      }
    }
  };

  const handleRechazarClick = (veedor) => {
    setVeedorRechazar(veedor);
    setMotivoRechazo('');
    setShowRechazoModal(true);
  };

  const handleRechazarConfirm = async () => {
    if (!motivoRechazo.trim()) {
      handleError(new Error('Debe ingresar un motivo de rechazo'));
      return;
    }

    try {
      setProcesando(true);
      clearMessages();
      
      await rechazarVeedor(veedorRechazar.id, motivoRechazo);
      handleSuccess('Veedor rechazado exitosamente');
      setShowRechazoModal(false);
      setVeedorRechazar(null);
      setMotivoRechazo('');
      loadVeedores();
    } catch (error) {
      handleError(error);
    } finally {
      setProcesando(false);
    }
  };

  const handleVerCarta = (cartaRespaldo) => {
    if (cartaRespaldo) {
      window.open(cartaRespaldo, '_blank');
    } else {
      handleError(new Error('No hay carta de respaldo disponible'));
    }
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

  const getEstadisticas = () => {
    const total = veedores.length;
    const pendientes = veedores.filter(v => v.estado === 'PENDIENTE').length;
    const aprobados = veedores.filter(v => v.estado === 'APROBADO').length;
    const rechazados = veedores.filter(v => v.estado === 'RECHAZADO').length;
    
    return { total, pendientes, aprobados, rechazados };
  };

  const estadisticas = getEstadisticas();

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Veedores</h2>
        </Col>
      </Row>

      {/* Estadísticas */}
      {veedores.length > 0 && (
        <Row className="mb-4">
          <Col md={3}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{estadisticas.total}</h5>
                <p className="card-text">Total Solicitudes</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-warning">{estadisticas.pendientes}</h5>
                <p className="card-text">Pendientes</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">{estadisticas.aprobados}</h5>
                <p className="card-text">Aprobados</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">{estadisticas.rechazados}</h5>
                <p className="card-text">Rechazados</p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Alertas */}
      <ErrorAlert 
        error={error} 
        onClose={clearMessages}
        variant="danger"
      />
      {success && <Alert variant="success" dismissible onClose={clearMessages}>{success}</Alert>}

      {/* Tabla de veedores */}
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
              {veedores.length === 0 ? (
                <Alert variant="info">
                  No hay solicitudes de veedores registradas.
                </Alert>
              ) : (
                <Table striped hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>CI</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Institución</th>
                      <th>Estado</th>
                      <th>Motivo Rechazo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {veedores.map((veedor) => (
                      <tr key={veedor.id}>
                        <td><strong>{veedor.personaCi || '-'}</strong></td>
                        <td>{veedor.personaNombre || '-'}</td>
                        <td>{veedor.personaApellido || '-'}</td>
                        <td>{veedor.institucionNombre || '-'}</td>
                        <td>{getEstadoBadge(veedor.estado)}</td>
                        <td>
                          {veedor.motivoRechazo ? (
                            <span className="text-danger">{veedor.motivoRechazo}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {veedor.estado === 'PENDIENTE' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleAprobar(veedor.id, `${veedor.personaNombre} ${veedor.personaApellido}`)}
                                  disabled={procesando}
                                >
                                  Aprobar
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleRechazarClick(veedor)}
                                  disabled={procesando}
                                >
                                  Rechazar
                                </Button>
                              </>
                            )}
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleVerCarta(veedor.cartaRespaldo)}
                              disabled={!veedor.cartaRespaldo}
                            >
                              Ver Carta
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Modal para motivo de rechazo */}
      <Modal show={showRechazoModal} onHide={() => setShowRechazoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rechazar Veedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Veedor:</strong> {veedorRechazar?.persona?.nombre} {veedorRechazar?.persona?.apellido}
          </p>
          <p>
            <strong>Institución:</strong> {veedorRechazar?.institucion?.nombre}
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Motivo de Rechazo *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Ingrese el motivo del rechazo..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowRechazoModal(false)}
            disabled={procesando}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleRechazarConfirm}
            disabled={procesando || !motivoRechazo.trim()}
          >
            {procesando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : (
              'Rechazar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VeedoresAdmin;
