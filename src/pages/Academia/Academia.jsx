import React from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Content from './content';
import Section from './section';
import Flag from './flag';
import './academia.css';

const Academia = () => {
  const navigate = useNavigate();

  return (
    <div className="academia-container">
      <Flag />
      <Section />
      <Content />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Card className="border-0 shadow">
              <Card.Body className="p-5">
                <h3 className="mb-4">Capacitación Electoral</h3>
                <p className="lead mb-4">
                  Accede a los materiales de capacitación para cada rol electoral. 
                  Aprende sobre tus responsabilidades y procedimientos para garantizar 
                  elecciones transparentes y democráticas.
                </p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate('/login-voluntario')}
                  >
                    Volver al Login
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="lg"
                    onClick={() => navigate('/')}
                  >
                    Ir al Inicio
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Academia;
