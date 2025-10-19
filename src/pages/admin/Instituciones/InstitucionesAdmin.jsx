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
  Alert
} from 'react-bootstrap';
import { 
  getAllInstituciones, 
  createInstitucion, 
  updateInstitucion, 
  deleteInstitucion 
} from '../../../services/InstitucionService.js';
import './InstitucionesAdmin.css';

const InstitucionesAdmin = () => {
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    sigla: ''
  });

  // Cargar instituciones al montar el componente
  useEffect(() => {
    loadInstituciones();
  }, []);

  const loadInstituciones = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllInstituciones();
      setInstituciones(response.data);
    } catch (error) {
      setError('Error al cargar las instituciones: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (institucion = null) => {
    if (institucion) {
      setIsEditing(true);
      setEditingId(institucion.id);
      setFormData({
        nombre: institucion.nombre || '',
        sigla: institucion.sigla || ''
      });
    } else {
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        nombre: '',
        sigla: ''
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nombre: '',
      sigla: ''
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
        await updateInstitucion(editingId, formData);
        setSuccess('Institución actualizada exitosamente');
      } else {
        await createInstitucion(formData);
        setSuccess('Institución creada exitosamente');
      }
      
      handleCloseModal();
      loadInstituciones();
    } catch (error) {
      setError('Error al guardar institución: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar la institución "${nombre}"?`)) {
      try {
        setError('');
        await deleteInstitucion(id);
        setSuccess('Institución eliminada exitosamente');
        loadInstituciones();
      } catch (error) {
        setError('Error al eliminar institución: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Instituciones / ONGs</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            Nueva Institución
          </Button>
        </Col>
      </Row>

      {/* Alertas */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabla de instituciones */}
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
              <thead className="table-primary">
                <tr>
                  <th>Nombre</th>
                  <th>Sigla</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {instituciones.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay instituciones registradas
                    </td>
                  </tr>
                ) : (
                  instituciones.map((institucion) => (
                    <tr key={institucion.id}>
                      <td>
                        <strong>{institucion.nombre}</strong>
                      </td>
                      <td>
                        {institucion.sigla ? (
                          <span className="badge bg-secondary">{institucion.sigla}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenModal(institucion)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(institucion.id, institucion.nombre)}
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

      {/* Modal para crear/editar institución */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Institución' : 'Nueva Institución'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre completo de la institución"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sigla</Form.Label>
              <Form.Control
                type="text"
                name="sigla"
                value={formData.sigla}
                onChange={handleInputChange}
                placeholder="Sigla de la institución (opcional)"
                maxLength={10}
              />
              <Form.Text className="text-muted">
                Sigla opcional de la institución (máximo 10 caracteres)
              </Form.Text>
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

export default InstitucionesAdmin;
