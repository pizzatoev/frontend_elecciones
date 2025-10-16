import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Alert,
  Badge,
  Form,
  Spinner,
  Card
} from 'react-bootstrap';
import { 
  getAsistenciaByMesa,
  marcarPresente,
  marcarAusente,
  crearAsistenciasParaMesa
} from '../../services/AsistenciaService';
import { getAllMesas } from '../../services/MesaService';

const AsistenciaAdmin = () => {
  const [mesas, setMesas] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar mesas al montar el componente
  useEffect(() => {
    loadMesas();
  }, []);

  const loadMesas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllMesas();
      setMesas(response.data);
    } catch (error) {
      setError('Error al cargar las mesas: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadAsistencia = async (mesaId) => {
    try {
      setLoading(true);
      setError('');
      const response = await getAsistenciaByMesa(mesaId);
      setAsistencias(response.data);
    } catch (error) {
      setError('Error al cargar la asistencia: ' + (error.response?.data?.message || error.message));
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMesaChange = (e) => {
    const mesaId = e.target.value;
    setMesaSeleccionada(mesaId);
    if (mesaId) {
      loadAsistencia(mesaId);
    } else {
      setAsistencias([]);
    }
  };

  const handleMarcarPresente = async (idAsistencia, nombre) => {
    try {
      setError('');
      setSuccess('');
      await marcarPresente(idAsistencia);
      setSuccess(`${nombre} marcado como presente`);
      // Recargar asistencia para actualizar la tabla
      if (mesaSeleccionada) {
        loadAsistencia(mesaSeleccionada);
      }
    } catch (error) {
      setError('Error al marcar como presente: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleMarcarAusente = async (idAsistencia, nombre) => {
    try {
      setError('');
      setSuccess('');
      await marcarAusente(idAsistencia);
      setSuccess(`${nombre} marcado como ausente`);
      // Recargar asistencia para actualizar la tabla
      if (mesaSeleccionada) {
        loadAsistencia(mesaSeleccionada);
      }
    } catch (error) {
      setError('Error al marcar como ausente: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCrearAsistencias = async () => {
    if (!mesaSeleccionada) {
      setError('Por favor seleccione una mesa primero');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const response = await crearAsistenciasParaMesa(mesaSeleccionada);
      setSuccess(response.data);
      // Recargar asistencia
      loadAsistencia(mesaSeleccionada);
    } catch (error) {
      setError('Error al crear asistencias: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badgeConfig = {
      'PRESENTE': { bg: 'success', text: 'Presente' },
      'AUSENTE': { bg: 'danger', text: 'Ausente' },
      'PENDIENTE': { bg: 'warning', text: 'Pendiente' }
    };
    
    const config = badgeConfig[estado] || { bg: 'secondary', text: estado };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };


  const getEstadisticas = () => {
    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === 'PRESENTE').length;
    const ausentes = asistencias.filter(a => a.estado === 'AUSENTE').length;
    const pendientes = asistencias.filter(a => a.estado === 'PENDIENTE').length;
    
    return { total, presentes, ausentes, pendientes };
  };

  const estadisticas = getEstadisticas();
  const mesaActual = mesas.find(m => m.id.toString() === mesaSeleccionada);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Control de Asistencia</h2>
        </Col>
      </Row>

      {/* Selección de Mesa */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Seleccionar Mesa</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Mesa</Form.Label>
                <Form.Select
                  value={mesaSeleccionada}
                  onChange={handleMesaChange}
                  disabled={loading}
                >
                  <option value="">Seleccionar una mesa...</option>
                  {mesas.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.numero} - {mesa.recinto?.nombre || 'Sin recinto'}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {mesaActual && (
                <div className="mt-3">
                  <p className="mb-1">
                    <strong>Recinto:</strong> {mesaActual.recinto?.nombre || 'Sin recinto'}
                  </p>
                  <p className="mb-3">
                    <strong>Dirección:</strong> {mesaActual.recinto?.direccion || 'Sin dirección'}
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={handleCrearAsistencias}
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? 'Creando...' : 'Crear Registros de Asistencia'}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estadísticas */}
      {asistencias.length > 0 && (
        <Row className="mb-4">
          <Col md={3}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{estadisticas.total}</h5>
                <p className="card-text">Total Jurados</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">{estadisticas.presentes}</h5>
                <p className="card-text">Presentes</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-danger">{estadisticas.ausentes}</h5>
                <p className="card-text">Ausentes</p>
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
        </Row>
      )}

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de asistencia */}
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
              {!mesaSeleccionada ? (
                <Alert variant="info">
                  Seleccione una mesa para ver el control de asistencia.
                </Alert>
              ) : asistencias.length === 0 ? (
                <Alert variant="warning">
                  No hay jurados asignados a esta mesa o no se ha registrado asistencia.
                </Alert>
              ) : (
                <Table bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>CI</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencias.map((asistencia) => (
                      <tr key={asistencia.id}>
                        <td><strong>{asistencia.personaCi || '-'}</strong></td>
                        <td>{asistencia.personaNombre || '-'}</td>
                        <td>{asistencia.personaApellido || '-'}</td>
                        <td>{getEstadoBadge(asistencia.estado)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleMarcarPresente(
                                asistencia.id, 
                                `${asistencia.personaNombre} ${asistencia.personaApellido}`
                              )}
                              disabled={asistencia.estado === 'PRESENTE'}
                            >
                              Presente
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleMarcarAusente(
                                asistencia.id, 
                                `${asistencia.personaNombre} ${asistencia.personaApellido}`
                              )}
                              disabled={asistencia.estado === 'AUSENTE'}
                            >
                              Ausente
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
    </Container>
  );
};

export default AsistenciaAdmin;
