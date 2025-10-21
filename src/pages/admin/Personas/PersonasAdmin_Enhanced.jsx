/**
 * Componente mejorado para gestión de personas con módulo Infraestructura
 * Responsabilidad: Waldir Trancoso
 * Mejoras: Campo estado, validaciones, historial, SweetAlert2
 */
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Alert, 
  InputGroup,
  Badge,
  Spinner
} from 'react-bootstrap';
import { 
  getAllPersonas, 
  getPersonaByCi, 
  createPersona, 
  updatePersona, 
  deletePersona 
} from '../../../services/PersonaService.js';
import EstadoBadge from '../../../components/EstadoBadge.jsx';
import HistorialPersona from '../../../components/HistorialPersona.jsx';
import { validatePersonaForm } from '../../../utils/validation.js';
import { 
  showSuccess, 
  showConfirmation, 
  handleError,
  showLoading,
  closeLoading
} from '../../../utils/alerts.js';

const PersonasAdmin = () => {
  const [personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estados para el formulario (incluyendo estado)
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    ciudad: '',
    estado: 'VIVO' // Valor por defecto
  });
  
  // Estados para búsqueda y filtros
  const [searchCi, setSearchCi] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  
  // Estados para historial
  const [showHistorial, setShowHistorial] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);

  // Cargar personas al montar el componente
  useEffect(() => {
    loadPersonas();
  }, []);

  // Aplicar filtros cuando cambien los datos
  useEffect(() => {
    applyFilters();
  }, [personas, filtroEstado]);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllPersonas();
      setPersonas(response.data);
    } catch (error) {
      setError('Error al cargar las personas: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = personas;
    
    if (filtroEstado !== 'TODOS') {
      filtered = filtered.filter(persona => persona.estado === filtroEstado);
    }
    
    setFilteredPersonas(filtered);
  };

  const handleSearch = async () => {
    if (!searchCi.trim()) {
      setFilteredPersonas(personas);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setError('');
      const response = await getPersonaByCi(searchCi);
      setFilteredPersonas([response.data]);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('No se encontró una persona con el CI: ' + searchCi);
        setFilteredPersonas([]);
      } else {
        setError('Error al buscar persona: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchCi('');
    setFilteredPersonas(personas);
    setIsSearching(false);
    setError('');
  };

  const handleOpenModal = (persona = null) => {
    if (persona) {
      setIsEditing(true);
      setEditingId(persona.id);
      setFormData({
        ci: persona.ci || '',
        nombre: persona.nombre || '',
        apellido: persona.apellido || '',
        fechaNacimiento: persona.fechaNacimiento || '',
        correo: persona.correo || '',
        telefono: persona.telefono || '',
        ciudad: persona.ciudad || '',
        estado: persona.estado || 'VIVO'
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        ci: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        correo: '',
        telefono: '',
        ciudad: '',
        estado: 'VIVO'
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      ci: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      correo: '',
      telefono: '',
      ciudad: '',
      estado: 'VIVO'
    });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones del frontend
    const validation = validatePersonaForm(formData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      showLoading(isEditing ? 'Actualizando persona...' : 'Creando persona...');
      
      if (isEditing) {
        await updatePersona(editingId, formData);
        await showSuccess('Éxito', 'Persona actualizada exitosamente');
      } else {
        await createPersona(formData);
        await showSuccess('Éxito', 'Persona creada exitosamente');
      }
      
      handleCloseModal();
      loadPersonas();
    } catch (error) {
      closeLoading();
      await handleError(error);
    }
  };

  const handleDelete = async (id, nombre, apellido) => {
    const result = await showConfirmation(
      'Confirmar eliminación',
      `¿Está seguro de eliminar a ${nombre} ${apellido}?`
    );
    
    if (result.isConfirmed) {
      try {
        setError('');
        showLoading('Eliminando persona...');
        await deletePersona(id);
        await showSuccess('Éxito', 'Persona eliminada exitosamente');
        loadPersonas();
      } catch (error) {
        closeLoading();
        await handleError(error);
      }
    }
  };

  const handleShowHistorial = (persona) => {
    setSelectedPersona(persona);
    setShowHistorial(true);
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Personas</h2>
          <p className="text-muted">Módulo Infraestructura - Responsabilidad: Waldir Trancoso</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            Nueva Persona
          </Button>
        </Col>
      </Row>

      {/* Filtros y búsqueda */}
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar por CI..."
              value={searchCi}
              onChange={(e) => setSearchCi(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="outline-secondary" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
            {searchCi && (
              <Button 
                variant="outline-danger" 
                onClick={handleClearSearch}
              >
                Limpiar
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="VIVO">Vivo</option>
            <option value="FALLECIDO">Fallecido</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de personas */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>CI</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Estado</th>
                  <th>Fecha Nacimiento</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Ciudad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPersonas.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      {isSearching ? 'No se encontraron resultados' : 'No hay personas registradas'}
                    </td>
                  </tr>
                ) : (
                  filteredPersonas.map((persona) => (
                    <tr key={persona.id}>
                      <td>{persona.ci}</td>
                      <td>{persona.nombre}</td>
                      <td>{persona.apellido}</td>
                      <td>
                        <EstadoBadge estado={persona.estado} />
                      </td>
                      <td>{persona.fechaNacimiento || '-'}</td>
                      <td>{persona.correo || '-'}</td>
                      <td>{persona.telefono || '-'}</td>
                      <td>{persona.ciudad || '-'}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-1"
                          onClick={() => handleShowHistorial(persona)}
                          title="Ver historial"
                        >
                          📋
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-1"
                          onClick={() => handleOpenModal(persona)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(persona.id, persona.nombre, persona.apellido)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Modal para crear/editar persona */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Persona' : 'Nueva Persona'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CI *</Form.Label>
                  <Form.Control
                    type="text"
                    name="ci"
                    value={formData.ci}
                    onChange={handleInputChange}
                    required
                    placeholder="Solo números"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado *</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="VIVO">Vivo</option>
                    <option value="FALLECIDO">Fallecido</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido *</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    placeholder="ejemplo@email.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
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

      {/* Modal de historial */}
      <HistorialPersona
        personaId={selectedPersona?.id}
        personaNombre={selectedPersona ? `${selectedPersona.nombre} ${selectedPersona.apellido}` : ''}
        show={showHistorial}
        onHide={() => setShowHistorial(false)}
      />
    </Container>
  );
};

export default PersonasAdmin;
