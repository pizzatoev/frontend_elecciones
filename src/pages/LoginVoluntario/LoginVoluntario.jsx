import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    Person,
    Eye,
    Building,
    FileText,
    Book
} from 'react-bootstrap-icons';
import './LoginVoluntario.css';

const LoginVoluntario = () => {
    const [ci, setCi] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCiChange = (e) => {
        setCi(e.target.value);
        setError(''); // Limpiar error cuando el usuario escriba
    };

    const validateCi = () => {
        if (!ci || ci.trim() === '') {
            setError('Debe ingresar un CI válido');
            return false;
        }
        return true;
    };

    const handleConsultarJurado = () => {
        if (validateCi()) {
            navigate(`/dashboard-jurado/${encodeURIComponent(ci)}`);
        }
    };

    const handleConsultarVeedor = () => {
        if (validateCi()) {
            navigate(`/dashboard-veedor/${encodeURIComponent(ci)}`);
        }
    };

    const handleConsultarDelegado = () => {
        if (validateCi()) {
            navigate(`/dashboard-delegado/${encodeURIComponent(ci)}`);
        }
    };

    const handleSolicitarVeedor = () => {
        if (validateCi()) {
            navigate(`/registro-veedor/${encodeURIComponent(ci)}`);
        }
    };

    const handleAcademia = () => {
        navigate('/academia/content');
    };

    return (
        <div className="login-voluntario-container">
            <Container className="login-container">
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        <Card className="main-card shadow-lg">
                            <Card.Header className="card-header-custom">
                                <div className="text-center">
                                    <h2 className="main-title">Sistema Electoral</h2>
                                    <p className="subtitle">Consulta tu rol en las elecciones</p>
                                </div>
                            </Card.Header>
                            <Card.Body className="card-body-custom">
                                {error && <Alert variant="danger" className="alert-custom">{error}</Alert>}

                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="form-label-custom">Cédula de Identidad</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese su CI (ej: LP-1234567)"
                                            value={ci}
                                            onChange={handleCiChange}
                                            className="form-control-custom"
                                            required
                                        />
                                    </Form.Group>

                                    <div className="buttons-grid">
                                        {/* Fila 1: Jurado y Veedor */}
                                        <div className="button-pair">
                                            <Button onClick={handleConsultarJurado} className="action-button">
                                                <Person className="button-icon" />
                                                Jurado
                                            </Button>
                                            <Button onClick={handleConsultarVeedor} className="action-button">
                                                <Eye className="button-icon" />
                                                Veedor
                                            </Button>
                                        </div>

                                        {/* Fila 2: Delegado (centrado) */}
                                        <div className="button-single">
                                            <Button onClick={handleConsultarDelegado} className="action-button">
                                                <Building className="button-icon" />
                                                Delegado
                                            </Button>
                                        </div>

                                        {/* Fila 3: Solicitar y Academia */}
                                        <div className="button-pair">
                                            <Button onClick={handleSolicitarVeedor} className="action-button">
                                                <FileText className="button-icon" />
                                                Solicitar
                                            </Button>
                                            <Button onClick={handleAcademia} className="action-button">
                                                <Book className="button-icon" />
                                                Academia
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginVoluntario;