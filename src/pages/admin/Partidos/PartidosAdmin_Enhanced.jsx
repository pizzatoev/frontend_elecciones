/**
 * Componente mejorado para gestión de partidos con módulo Infraestructura
 * Responsabilidad: Waldir Trancoso
 * Mejoras: Subida de logos, cambio de estado, validaciones
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
  Spinner,
  Card,
  Image
} from 'react-bootstrap';
import { 
  getAllPartidos, 
  getPartidoById, 
  createPartido, 
  updatePartido, 
  deletePartido,
  uploadPartidoLogo,
  changePartidoEstado
} from '../../../services/PartidoService_Enhanced.js';
import { 
  showSuccess, 
  showConfirmation, 
  handleError,
  showLoading,
  closeLoading
} from '../../../utils/alerts.js';

const PartidosAdmin = () => {
  const [partidos, setPartidos] = useState([]);
  const [filteredPartidos, setFilteredPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    sigla: '',
    nombre: '',
    estado: 'ACTIVO',
    logoUrl: ''
  });
  
  // Estados para búsqueda y filtros
  const [searchSigla, setSearchSigla] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  
  // Estados para modal de logo
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

  // Cargar partidos al montar el componente
  useEffect(() => {
    loadPartidos();
  }, []);

  // Aplicar filtros cuando cambien los datos
  useEffect(() => {
    applyFilters();
  }, [partidos, filtroEstado]);

  const loadPartidos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllPartidos();
      setPartidos(response.data);
    } catch (error) {
      setError('Error al cargar los partidos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = partidos;
    
    if (filtroEstado !== 'TODOS') {
      filtered = filtered.filter(partido => partido.estado === filtroEstado);
    }
    
    setFilteredPartidos(filtered);
  };

  const handleSearch = async () => {
    if (!searchSigla.trim()) {
      setFilteredPartidos(partidos);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setError('');
      const response = await getPartidoById(searchSigla);
      setFilteredPartidos([response.data]);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('No se encontró un partido con la sigla: ' + searchSigla);
        setFilteredPartidos([]);
      } else {
        setError('Error al buscar partido: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchSigla('');
    setFilteredPartidos(partidos);
    setIsSearching(false);
    setError('');
  };

  const handleOpenModal = (partido = null) => {
    if (partido) {
      setIsEditing(true);
      setEditingId(partido.id);
      setFormData({
        sigla: partido.sigla || '',
        nombre: partido.nombre || '',
        estado: partido.estado || 'ACTIVO',
        logoUrl: partido.logoUrl || ''
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        sigla: '',
        nombre: '',
        estado: 'ACTIVO',
        logoUrl: ''
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      sigla: '',
      nombre: '',
      estado: 'ACTIVO',
      logoUrl: ''
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
    if (!formData.sigla.trim()) {
      setError('La sigla es obligatoria');
      return false;
    }
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
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
      
      showLoading(isEditing ? 'Actualizando partido...' : 'Creando partido...');
      
      if (isEditing) {
        await updatePartido(editingId, formData);
        await showSuccess('Éxito', 'Partido actualizado exitosamente');
      } else {
        await createPartido(formData);
        await showSuccess('Éxito', 'Partido creado exitosamente');
      }
      
      handleCloseModal();
      loadPartidos();
    } catch (error) {
      closeLoading();
      await handleError(error);
    }
  };

  const handleDelete = async (id, nombre) => {
    const result = await showConfirmation(
      'Confirmar eliminación',
      `¿Está seguro de eliminar el partido ${nombre}?`
    );
    
    if (result.isConfirmed) {
      try {
        setError('');
        showLoading('Eliminando partido...');
        await deletePartido(id);
        await showSuccess('Éxito', 'Partido eliminado exitosamente');
        loadPartidos();
      } catch (error) {
        closeLoading();
        await handleError(error);
      }
    }
  };

  const handleShowLogoModal = (partido) => {
    setSelectedPartido(partido);
    setLogoUrl(partido.logoUrl || '');
    setShowLogoModal(true);
  };

  const handleUploadLogo = async () => {
    if (!logoUrl.trim()) {
      setError('La URL del logo es obligatoria');
      return;
    }

    try {
      setError('');
      showLoading('Subiendo logo...');
      await uploadPartidoLogo(selectedPartido.id, logoUrl);
      await showSuccess('Éxito', 'Logo subido exitosamente');
      setShowLogoModal(false);
      loadPartidos();
    } catch (error) {
      closeLoading();
      await handleError(error);
    }
  };

  const handleChangeEstado = async (partido, nuevoEstado) => {
    const result = await showConfirmation(
      'Confirmar cambio de estado',
      `¿Está seguro de cambiar el estado de ${partido.nombre} a ${nuevoEstado}?`
    );
    
    if (result.isConfirmed) {
      try {
        setError('');
        showLoading('Cambiando estado...');
        await changePartidoEstado(partido.id, nuevoEstado);
        await showSuccess('Éxito', 'Estado cambiado exitosamente');
        loadPartidos();
      } catch (error) {
        closeLoading();
        await handleError(error);
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const variants = {
      'ACTIVO': 'success',
      'INACTIVO': 'warning',
      'DISUELTO': 'danger'
    };
    return variants[estado] || 'light';
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Partidos</h2>
          <p className="text-muted">Módulo Infraestructura - Responsabilidad: Waldir Trancoso</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            Nuevo Partido
          </Button>
        </Col>
      </Row>

      {/* Filtros y búsqueda */}
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar por sigla..."
              value={searchSigla}
              onChange={(e) => setSearchSigla(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="outline-secondary" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
            {searchSigla && (
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
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="DISUELTO">Disuelto</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de partidos */}
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
                  <th>Logo</th>
                  <th>Sigla</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartidos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      {isSearching ? 'No se encontraron resultados' : 'No hay partidos registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredPartidos.map((partido) => (
                    <tr key={partido.id}>
                      <td>
                        {partido.logoUrl ? (
                          <Image 
                            src={partido.logoUrl} 
                            alt={`Logo ${partido.nombre}`}
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            rounded
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              color: '#6c757d'
                            }}
                          >
                            Sin logo
                          </div>
                        )}
                      </td>
                      <td><strong>{partido.sigla}</strong></td>
                      <td>{partido.nombre}</td>
                      <td>
                        <Badge bg={getEstadoBadge(partido.estado)}>
                          {partido.estado}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-1"
                          onClick={() => handleShowLogoModal(partido)}
                          title="Gestionar logo"
                        >
                          🖼️
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-1"
                          onClick={() => handleOpenModal(partido)}
                        >
                          Editar
                        </Button>
                        {partido.estado !== 'DISUELTO' && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="me-1"
                            onClick={() => handleChangeEstado(partido, 'DISUELTO')}
                            title="Disolver partido"
                          >
                            Disolver
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(partido.id, partido.nombre)}
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

      {/* Modal para crear/editar partido */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Partido' : 'Nuevo Partido'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sigla *</Form.Label>
                  <Form.Control
                    type="text"
                    name="sigla"
                    value={formData.sigla}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: MAS, CC, etc."
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
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="DISUELTO">Disuelto</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Nombre completo del partido"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>URL del Logo</Form.Label>
                  <Form.Control
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/logo.png"
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

      {/* Modal para gestionar logo */}
      <Modal show={showLogoModal} onHide={() => setShowLogoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Gestionar Logo - {selectedPartido?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>URL del Logo</Form.Label>
            <Form.Control
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://ejemplo.com/logo.png"
            />
          </Form.Group>
          {logoUrl && (
            <div className="text-center">
              <Image 
                src={logoUrl} 
                alt="Vista previa del logo"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
                rounded
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUploadLogo}>
            Guardar Logo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PartidosAdmin;
