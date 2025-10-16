import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/UsuarioService';
import { 
  Building, 
  Person, 
  Lock, 
  ArrowRight 
} from 'react-bootstrap-icons';
import './LoginAdmin.css';

const LoginAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar que ambos campos no estén vacíos
    if (!username.trim() || !password.trim()) {
      setError('Por favor, complete todos los campos');
      return;
    }

    setLoading(true);

    try {
      const response = await login(username, password);
      if (response.status === 200) {
        navigate('/dashboard-admin');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404)) {
        setError('Usuario o contraseña inválidos');
      } else {
        setError('Error al iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-admin-container">
      <div className="background-pattern"></div>
      <Container className="login-container">
        <Row className="justify-content-center">
          <Col lg={6} xl={5}>
            <Card className="main-card shadow-lg">
              <Card.Header className="card-header-custom">
                <div className="text-center">
                  
                  <h2 className="main-title">Panel de Administración</h2>
                  <p className="subtitle">Sistema Electoral de Bolivia</p>
                </div>
              </Card.Header>
              <Card.Body className="card-body-custom">
                {error && <Alert variant="danger" className="alert-custom">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">
                      <Person className="label-icon" />
                      Usuario Administrador
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su nombre de usuario"
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-custom">
                      <Lock className="label-icon" />
                      Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese su contraseña"
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button
                      variant="success"
                      type="submit"
                      size="lg"
                      className="login-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Iniciando sesión...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="button-icon" />
                          Iniciar Sesión
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
                
                <div className="login-footer">
                  <p className="footer-text">
                    Acceso exclusivo para administradores del sistema electoral
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginAdmin;

