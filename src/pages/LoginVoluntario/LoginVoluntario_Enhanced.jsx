/**
 * MEJORA VISUAL FRONTEND - SISTEMA ELECTORAL
 * Diseñador: Waldir Trancoso
 * Especialización: UI/UX con React + Bootstrap + CSS moderno
 * Fecha: 20 de Octubre, 2025
 * 
 * Mejoras implementadas:
 * - Esquema amarillo y blanco institucional (#F1C40F)
 * - Fondo con degradado sutil
 * - Bordes suaves y sombras sutiles
 * - Transiciones suaves
 * - Diseño responsive
 * - Fuente moderna (Poppins)
 * - Centrado visual perfecto
 * - Animaciones de entrada
 * - Efectos de hover mejorados
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    Person,
    Eye,
    Building,
    FileText,
    GraduationCap,
    UserPlus
} from 'react-bootstrap-icons';
import './LoginVoluntario_Enhanced.css';

const LoginVoluntario = () => {
    const [ci, setCi] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Efecto para limpiar errores cuando el usuario escriba
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleCiChange = (e) => {
        setCi(e.target.value);
        setError(''); // Limpiar error cuando el usuario escriba
    };

    const validateCi = () => {
        if (!ci || ci.trim() === '') {
            setError('Debe ingresar un CI válido');
            return false;
        }
        
        // Validación básica de formato CI
        const ciPattern = /^[0-9]+$/;
        if (!ciPattern.test(ci.trim())) {
            setError('El CI debe contener solo números');
            return false;
        }
        
        if (ci.trim().length < 6) {
            setError('El CI debe tener al menos 6 dígitos');
            return false;
        }
        
        return true;
    };

    const handleAction = async (actionType) => {
        if (!validateCi()) {
            return;
        }

        setIsLoading(true);
        
        // Simular un pequeño delay para mejor UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
            switch (actionType) {
                case 'jurado':
                    navigate(`/dashboard-jurado/${encodeURIComponent(ci)}`);
                    break;
                case 'veedor':
                    navigate(`/dashboard-veedor/${encodeURIComponent(ci)}`);
                    break;
                case 'delegado':
                    navigate(`/dashboard-delegado/${encodeURIComponent(ci)}`);
                    break;
                case 'solicitar':
                    navigate(`/registro-veedor/${encodeURIComponent(ci)}`);
                    break;
                case 'academia':
                    navigate('/academia/content');
                    break;
                default:
                    break;
            }
        } catch (error) {
            setError('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConsultarJurado = () => handleAction('jurado');
    const handleConsultarVeedor = () => handleAction('veedor');
    const handleConsultarDelegado = () => handleAction('delegado');
    const handleSolicitarVeedor = () => handleAction('solicitar');
    const handleAcademia = () => handleAction('academia');

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
                                {error && (
                                    <Alert variant="danger" className="alert-custom">
                                        {error}
                                    </Alert>
                                )}

                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="form-label-custom">
                                            Cédula de Identidad
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese su CI (ej: 12345678)"
                                            value={ci}
                                            onChange={handleCiChange}
                                            className="form-control-custom"
                                            required
                                            disabled={isLoading}
                                        />
                                    </Form.Group>

                                    <div className="buttons-grid">
                                        {/* Fila 1: Jurado y Veedor */}
                                        <div className="button-pair">
                                            <Button 
                                                onClick={handleConsultarJurado} 
                                                className="action-button"
                                                disabled={isLoading}
                                                title="Consultar si eres jurado"
                                            >
                                                <Person className="button-icon" />
                                                Jurado
                                            </Button>
                                            <Button 
                                                onClick={handleConsultarVeedor} 
                                                className="action-button"
                                                disabled={isLoading}
                                                title="Consultar si eres veedor"
                                            >
                                                <Eye className="button-icon" />
                                                Veedor
                                            </Button>
                                        </div>

                                        {/* Fila 2: Delegado (centrado) */}
                                        <div className="button-single">
                                            <Button 
                                                onClick={handleConsultarDelegado} 
                                                className="action-button"
                                                disabled={isLoading}
                                                title="Consultar si eres delegado"
                                            >
                                                <Building className="button-icon" />
                                                Delegado
                                            </Button>
                                        </div>

                                        {/* Fila 3: Solicitar y Academia */}
                                        <div className="button-pair">
                                            <Button 
                                                onClick={handleSolicitarVeedor} 
                                                className="action-button"
                                                disabled={isLoading}
                                                title="Solicitar ser veedor"
                                            >
                                                <UserPlus className="button-icon" />
                                                Solicitar
                                            </Button>
                                            <Button 
                                                onClick={handleAcademia} 
                                                className="action-button"
                                                disabled={isLoading}
                                                title="Acceder a la academia electoral"
                                            >
                                                <GraduationCap className="button-icon" />
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
