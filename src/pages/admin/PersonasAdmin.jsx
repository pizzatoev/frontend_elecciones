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
  Badge
} from 'react-bootstrap';
import { 
  getAllPersonas, 
  getPersonaByCi, 
  createPersona, 
  updatePersona, 
  deletePersona 
} from '../../services/PersonaService';

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
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    ciudad: ''
  });
  
  // Estado para búsqueda
  const [searchCi, setSearchCi] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Cargar personas al montar el componente
  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllPersonas();
      setPersonas(response.data);
      setFilteredPersonas(response.data);
    } catch (error) {
      setError('Error al cargar las personas: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
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
        ciudad: persona.ciudad || ''
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
        ciudad: ''
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
      ciudad: ''
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

  const validateForm = () => {
    if (!formData.ci.trim()) {
      setError('El CI es obligatorio');
      return false;
    }
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es obligatorio');
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
        await updatePersona(editingId, formData);
        setSuccess('Persona actualizada exitosamente');
      } else {
        await createPersona(formData);
        setSuccess('Persona creada exitosamente');
      }
      
      handleCloseModal();
      loadPersonas();
    } catch (error) {
      setError('Error al guardar persona: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, nombre, apellido) => {
    if (window.confirm(`¿Está seguro de eliminar a ${nombre} ${apellido}?`)) {
      try {
        setError('');
        await deletePersona(id);
        setSuccess('Persona eliminada exitosamente');
        loadPersonas();
      } catch (error) {
        setError('Error al eliminar persona: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Personas</h2>
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

      {/* Búsqueda por CI */}
      <Row className="mb-3">
        <Col md={6}>
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
      </Row>

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de personas */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>CI</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
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
                    <td colSpan="8" className="text-center">
                      {isSearching ? 'No se encontraron resultados' : 'No hay personas registradas'}
                    </td>
                  </tr>
                ) : (
                  filteredPersonas.map((persona) => (
                    <tr key={persona.id}>
                      <td>{persona.ci}</td>
                      <td>{persona.nombre}</td>
                      <td>{persona.apellido}</td>
                      <td>{persona.fechaNacimiento || '-'}</td>
                      <td>{persona.correo || '-'}</td>
                      <td>{persona.telefono || '-'}</td>
                      <td>{persona.ciudad || '-'}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
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
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formData.correo}
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

export default PersonasAdmin;
