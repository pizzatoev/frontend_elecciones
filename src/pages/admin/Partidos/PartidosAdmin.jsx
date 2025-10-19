/**SEBASTIAN FERNANDEZ**/

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
  Badge
} from 'react-bootstrap';
import { 
  getAllPartidos, 
  createPartido, 
  updatePartido, 
  deletePartido 
} from '../../../services/PartidoService.js';
import './PartidosAdmin.css';

const PartidosAdmin = () => {
  const [partidos, setPartidos] = useState([]);
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
    estado: 'ACTIVO'
  });

  // Cargar partidos al montar el componente
  useEffect(() => {
    loadPartidos();
  }, []);

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

  const handleOpenModal = (partido = null) => {
    if (partido) {
      setIsEditing(true);
      setEditingId(partido.id);
      setFormData({
        sigla: partido.sigla || '',
        nombre: partido.nombre || '',
        estado: partido.estado || 'ACTIVO'
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        sigla: '',
        nombre: '',
        estado: 'ACTIVO'
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
      estado: 'ACTIVO'
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
      
      if (isEditing) {
        await updatePartido(editingId, formData);
        setSuccess('Partido actualizado exitosamente');
      } else {
        await createPartido(formData);
        setSuccess('Partido creado exitosamente');
      }
      
      handleCloseModal();
      loadPartidos();
    } catch (error) {
      setError('Error al guardar partido: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar el partido "${nombre}"?`)) {
      try {
        setError('');
        await deletePartido(id);
        setSuccess('Partido eliminado exitosamente');
        loadPartidos();
      } catch (error) {
        setError('Error al eliminar partido: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getEstadoBadge = (estado) => {
    return estado === 'ACTIVO' ? 
      <Badge bg="success">Activo</Badge> : 
      <Badge bg="secondary">Inactivo</Badge>;
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Partidos Políticos</h2>
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

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de partidos */}
      <Row>
        <Col>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <Table bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Sigla</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {partidos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay partidos registrados
                    </td>
                  </tr>
                ) : (
                  partidos.map((partido) => (
                    <tr key={partido.id}>
                      <td><strong>{partido.sigla}</strong></td>
                      <td>{partido.nombre}</td>
                      <td>{getEstadoBadge(partido.estado)}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenModal(partido)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Partido' : 'Nuevo Partido'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Sigla *</Form.Label>
              <Form.Control
                type="text"
                name="sigla"
                value={formData.sigla}
                onChange={handleInputChange}
                placeholder="Ej: MAS, CC, FPV"
                maxLength={10}
                required
              />
              <Form.Text className="text-muted">
                Sigla única del partido (máximo 10 caracteres)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre completo del partido"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </Form.Select>
            </Form.Group>
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

export default PartidosAdmin;
