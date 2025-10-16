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
  FormCheck,
  Spinner
} from 'react-bootstrap';
import { 
  getAllDelegados, 
  createDelegado, 
  updateDelegado, 
  deleteDelegado,
  toggleHabilitado
} from '../../services/DelegadoService';
import { getAllPersonas } from '../../services/PersonaService';
import { getAllPartidos } from '../../services/PartidoService';
import { getAllMesas } from '../../services/MesaService';

const DelegadosAdmin = () => {
  const [delegados, setDelegados] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    idPersona: '',
    idPartido: '',
    idMesa: '',
    habilitado: true
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [delegadosRes, personasRes, partidosRes, mesasRes] = await Promise.all([
        getAllDelegados(),
        getAllPersonas(),
        getAllPartidos(),
        getAllMesas()
      ]);
      
      setDelegados(delegadosRes.data);
      setPersonas(personasRes.data);
      setPartidos(partidosRes.data);
      setMesas(mesasRes.data);
    } catch (error) {
      setError('Error al cargar los datos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (delegado = null) => {
    if (delegado) {
      setIsEditing(true);
      setEditingId(delegado.id);
      setFormData({
        idPersona: delegado.persona?.id || '',
        idPartido: delegado.partido?.id || '',
        idMesa: delegado.mesa?.id || '',
        habilitado: delegado.habilitado
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        idPersona: '',
        idPartido: '',
        idMesa: '',
        habilitado: true
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      idPersona: '',
      idPartido: '',
      idMesa: '',
      habilitado: true
    });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.idPersona) {
      setError('Debe seleccionar una persona');
      return false;
    }
    if (!formData.idPartido) {
      setError('Debe seleccionar un partido');
      return false;
    }
    if (!formData.idMesa) {
      setError('Debe seleccionar una mesa');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (isEditing) {
        await updateDelegado(editingId, formData);
        setSuccess('Delegado actualizado exitosamente');
      } else {
        await createDelegado(formData);
        setSuccess('Delegado creado exitosamente');
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      setError('Error al guardar delegado: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar al delegado ${nombre}?`)) {
      try {
        setError('');
        await deleteDelegado(id);
        setSuccess('Delegado eliminado exitosamente');
        loadData();
      } catch (error) {
        setError('Error al eliminar delegado: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleToggleHabilitado = async (id, habilitado) => {
    try {
      setError('');
      await toggleHabilitado(id, habilitado);
      setSuccess(`Delegado ${habilitado ? 'habilitado' : 'deshabilitado'} exitosamente`);
      loadData();
    } catch (error) {
      setError('Error al cambiar estado: ' + (error.response?.data?.message || error.message));
    }
  };

  const getHabilitadoBadge = (habilitado) => {
    return habilitado ? 
      <Badge bg="success">Habilitado</Badge> : 
      <Badge bg="secondary">Deshabilitado</Badge>;
  };

  const getEstadisticas = () => {
    const total = delegados.length;
    const habilitados = delegados.filter(d => d.habilitado).length;
    const deshabilitados = delegados.filter(d => !d.habilitado).length;
    
    return { total, habilitados, deshabilitados };
  };

  const estadisticas = getEstadisticas();

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Delegados</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            Nuevo Delegado
          </Button>
        </Col>
      </Row>

      {/* Estadísticas */}
      {delegados.length > 0 && (
        <Row className="mb-4">
          <Col md={4}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{estadisticas.total}</h5>
                <p className="card-text">Total Delegados</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">{estadisticas.habilitados}</h5>
                <p className="card-text">Habilitados</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-secondary">{estadisticas.deshabilitados}</h5>
                <p className="card-text">Deshabilitados</p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de delegados */}
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
              {delegados.length === 0 ? (
                <Alert variant="info">
                  No hay delegados registrados. Use el botón "Nuevo Delegado" para crear uno.
                </Alert>
              ) : (
                <Table striped hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>CI</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Partido</th>
                      <th>Mesa</th>
                      <th>Estado</th>
                      <th>Habilitado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {delegados.map((delegado) => (
                      <tr key={delegado.id}>
                        <td><strong>{delegado.personaCi || '-'}</strong></td>
                        <td>{delegado.personaNombre || '-'}</td>
                        <td>{delegado.personaApellido || '-'}</td>
                        <td>{delegado.partidoNombre || '-'}</td>
                        <td>
                          {delegado.mesaNumero ? (
                            `Mesa ${delegado.mesaNumero} - ${delegado.recintoNombre || 'Sin recinto'}`
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{getHabilitadoBadge(delegado.habilitado)}</td>
                        <td>
                          <FormCheck
                            type="switch"
                            id={`habilitado-${delegado.id}`}
                            checked={delegado.habilitado}
                            onChange={(e) => handleToggleHabilitado(delegado.id, e.target.checked)}
                          />
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleOpenModal(delegado)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(delegado.id, `${delegado.persona?.nombre} ${delegado.persona?.apellido}`)}
                            >
                              Eliminar
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

      {/* Modal para crear/editar delegado */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Delegado' : 'Nuevo Delegado'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Persona *</Form.Label>
                  <Form.Select
                    name="idPersona"
                    value={formData.idPersona}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar persona...</option>
                    {personas.map((persona) => (
                      <option key={persona.id} value={persona.id}>
                        {persona.ci} - {persona.nombre} {persona.apellido}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Partido *</Form.Label>
                  <Form.Select
                    name="idPartido"
                    value={formData.idPartido}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar partido...</option>
                    {partidos.map((partido) => (
                      <option key={partido.id} value={partido.id}>
                        {partido.sigla} - {partido.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mesa *</Form.Label>
                  <Form.Select
                    name="idMesa"
                    value={formData.idMesa}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar mesa...</option>
                    {mesas.map((mesa) => (
                      <option key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} - {mesa.recinto?.nombre || 'Sin recinto'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <FormCheck
                    type="switch"
                    id="habilitado"
                    name="habilitado"
                    label="Habilitado"
                    checked={formData.habilitado}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default DelegadosAdmin;
