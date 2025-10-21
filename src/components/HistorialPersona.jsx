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
  Badge,
  Spinner
} from 'react-bootstrap';
import { 
  getHistorialByPersona, 
  createHistorial 
} from '../services/HistorialService.js';
import Swal from 'sweetalert2';

/**
 * Componente para gestionar el historial de una persona
 * Módulo Infraestructura - Responsabilidad: Waldir Trancoso
 */
const HistorialPersona = ({ personaId, personaNombre, show, onHide }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para el modal de nuevo registro
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipoEvento: '',
    descripcion: '',
    fechaEvento: '',
    usuarioResponsable: ''
  });

  // Cargar historial cuando se abre el modal
  useEffect(() => {
    if (show && personaId) {
      loadHistorial();
    }
  }, [show, personaId]);

  const loadHistorial = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getHistorialByPersona(personaId);
      setHistorial(response.data);
    } catch (error) {
      setError('Error al cargar el historial: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      tipoEvento: '',
      descripcion: '',
      fechaEvento: new Date().toISOString().split('T')[0],
      usuarioResponsable: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      tipoEvento: '',
      descripcion: '',
      fechaEvento: '',
      usuarioResponsable: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.tipoEvento.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'El tipo de evento es obligatorio',
        confirmButtonText: 'Entendido'
      });
      return false;
    }
    if (!formData.descripcion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'La descripción es obligatoria',
        confirmButtonText: 'Entendido'
      });
      return false;
    }
    if (!formData.fechaEvento.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'La fecha del evento es obligatoria',
        confirmButtonText: 'Entendido'
      });
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
      const historialData = {
        ...formData,
        personaId: personaId
      };
      
      await createHistorial(historialData);
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Registro de historial creado exitosamente',
        confirmButtonText: 'Entendido'
      });
      
      handleCloseModal();
      loadHistorial();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || error.message,
        confirmButtonText: 'Entendido'
      });
    }
  };

  const getTipoEventoBadge = (tipo) => {
    const variants = {
      'ASIGNACION': 'primary',
      'CAMBIO_ROL': 'warning',
      'ELIMINACION': 'danger',
      'ACTUALIZACION': 'info',
      'OTRO': 'secondary'
    };
    return variants[tipo] || 'light';
  };

  return (
    <>
      {/* Modal principal del historial */}
      <Modal show={show} onHide={onHide} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Historial de {personaNombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Button 
                variant="primary" 
                onClick={handleOpenModal}
                disabled={loading}
              >
                Nuevo Registro
              </Button>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

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
                  <th>Tipo Evento</th>
                  <th>Descripción</th>
                  <th>Fecha Evento</th>
                  <th>Usuario Responsable</th>
                  <th>Fecha Registro</th>
                </tr>
              </thead>
              <tbody>
                {historial.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <Alert variant="info">
                        No hay registros de historial para esta persona
                      </Alert>
                    </td>
                  </tr>
                ) : (
                  historial.map((registro) => (
                    <tr key={registro.id}>
                      <td>
                        <Badge bg={getTipoEventoBadge(registro.tipoEvento)}>
                          {registro.tipoEvento}
                        </Badge>
                      </td>
                      <td>{registro.descripcion}</td>
                      <td>{new Date(registro.fechaEvento).toLocaleDateString()}</td>
                      <td>{registro.usuarioResponsable || '-'}</td>
                      <td>{new Date(registro.creadoEn).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para nuevo registro */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Registro de Historial</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Evento *</Form.Label>
              <Form.Select
                name="tipoEvento"
                value={formData.tipoEvento}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="ASIGNACION">Asignación</option>
                <option value="CAMBIO_ROL">Cambio de Rol</option>
                <option value="ELIMINACION">Eliminación</option>
                <option value="ACTUALIZACION">Actualización</option>
                <option value="OTRO">Otro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                placeholder="Describe el evento o cambio realizado..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha del Evento *</Form.Label>
              <Form.Control
                type="date"
                name="fechaEvento"
                value={formData.fechaEvento}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usuario Responsable</Form.Label>
              <Form.Control
                type="text"
                name="usuarioResponsable"
                value={formData.usuarioResponsable}
                onChange={handleInputChange}
                placeholder="Nombre del usuario que realizó la acción"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default HistorialPersona;
