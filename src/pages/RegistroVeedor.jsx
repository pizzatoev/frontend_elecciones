import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { getPersonaByCi } from '../services/PersonaService';
import { getAllInstituciones } from '../services/InstitucionService';
import { createVeedor } from '../services/VeedorService';

const RegistroVeedor = () => {
  const { ci } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState(null);
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    institucionId: '',
    cartaRespaldo: null,
    fotoCarnet: null
  });

  useEffect(() => {
    if (ci) {
      loadData();
    }
  }, [ci]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar datos de la persona y instituciones en paralelo
      const [personaResponse, institucionesResponse] = await Promise.all([
        getPersonaByCi(ci),
        getAllInstituciones()
      ]);
      
      setPersona(personaResponse.data);
      setInstituciones(institucionesResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('CI no válido');
      } else {
        setError('Error al cargar los datos: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.institucionId) {
      setError('Debe seleccionar una institución');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      // Crear objeto para enviar
      const veedorData = {
        idPersona: persona.id,
        idInstitucion: parseInt(formData.institucionId),
        estado: 'PENDIENTE'
      };

      await createVeedor(veedorData);
      setSuccess('Solicitud enviada exitosamente');
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate(`/dashboard-veedor/${ci}`);
      }, 2000);

    } catch (error) {
      setError('Error al enviar la solicitud: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando datos...</p>
        </div>
      </Container>
    );
  }

  if (error && !persona) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h3 className="mb-0">Solicitud de Veedor</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Información Personal (Readonly) */}
                <h5 className="mb-3">Información Personal</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CI</Form.Label>
                      <Form.Control
                        type="text"
                        value={persona?.ci || ''}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        value={persona?.nombre || ''}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        value={persona?.apellido || ''}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Control
                        type="text"
                        value={persona?.ciudad || ''}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Nacimiento</Form.Label>
                      <Form.Control
                        type="text"
                        value={persona?.fechaNacimiento || ''}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Información de la Solicitud */}
                <h5 className="mb-3 mt-4">Información de la Solicitud</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Institución *</Form.Label>
                  <Form.Select
                    name="institucionId"
                    value={formData.institucionId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar institución...</option>
                    {instituciones.map((institucion) => (
                      <option key={institucion.id} value={institucion.id}>
                        {institucion.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Carta de Respaldo (PDF o Imagen)</Form.Label>
                  <Form.Control
                    type="file"
                    name="cartaRespaldo"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Form.Text className="text-muted">
                    Formatos aceptados: PDF, JPG, JPEG, PNG
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Foto de Carnet</Form.Label>
                  <Form.Control
                    type="file"
                    name="fotoCarnet"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                  />
                  <Form.Text className="text-muted">
                    Formatos aceptados: JPG, JPEG, PNG
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistroVeedor;

