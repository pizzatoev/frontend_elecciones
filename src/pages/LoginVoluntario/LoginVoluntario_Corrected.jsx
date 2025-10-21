/**
 * COMPONENTE LOGIN VOLUNTARIO CORREGIDO
 * Diseñador: Waldir Trancoso
 * Especialización: React + Vite + Bootstrap
 * Fecha: 20 de Octubre, 2025
 * 
 * Correcciones implementadas:
 * - Centrado perfecto vertical y horizontal
 * - Fondo gris suave con degradado
 * - Card centrada con sombras suaves
 * - Fuente Poppins
 * - Diseño responsive
 * - Altura completa de ventana
 */

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    Person,
    Eye,
    Building,
    FileText,
    GraduationCap,
    UserPlus
} from 'react-bootstrap-icons';
import CenteredContainer from '../../components/CenteredContainer.jsx';

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
        <CenteredContainer>
            {/* Título principal */}
            <h1 className="main-title">Sistema Electoral</h1>
            <p className="subtitle">Consulta tu rol en las elecciones</p>

            {/* Alertas de error */}
            {error && (
                <Alert variant="danger" className="alert-danger">
                    {error}
                </Alert>
            )}

            {/* Formulario principal */}
            <Form>
                <div className="form-group">
                    <label className="form-label">Cédula de Identidad</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese su CI (ej: 12345678)"
                        value={ci}
                        onChange={handleCiChange}
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Grid de botones */}
                <div className="buttons-grid" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    alignItems: 'center',
                    width: '100%'
                }}>
                    {/* Fila 1: Jurado y Veedor */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'center', 
                        width: '100%' 
                    }}>
                        <Button 
                            onClick={handleConsultarJurado} 
                            className="action-button"
                            disabled={isLoading}
                            title="Consultar si eres jurado"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '140px',
                                height: '140px',
                                padding: '1rem'
                            }}
                        >
                            <Person size={24} />
                            Jurado
                        </Button>
                        <Button 
                            onClick={handleConsultarVeedor} 
                            className="action-button"
                            disabled={isLoading}
                            title="Consultar si eres veedor"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '140px',
                                height: '140px',
                                padding: '1rem'
                            }}
                        >
                            <Eye size={24} />
                            Veedor
                        </Button>
                    </div>

                    {/* Fila 2: Delegado (centrado) */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        width: '100%' 
                    }}>
                        <Button 
                            onClick={handleConsultarDelegado} 
                            className="action-button"
                            disabled={isLoading}
                            title="Consultar si eres delegado"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '140px',
                                height: '140px',
                                padding: '1rem'
                            }}
                        >
                            <Building size={24} />
                            Delegado
                        </Button>
                    </div>

                    {/* Fila 3: Solicitar y Academia */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'center', 
                        width: '100%' 
                    }}>
                        <Button 
                            onClick={handleSolicitarVeedor} 
                            className="action-button"
                            disabled={isLoading}
                            title="Solicitar ser veedor"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '140px',
                                height: '140px',
                                padding: '1rem'
                            }}
                        >
                            <UserPlus size={24} />
                            Solicitar
                        </Button>
                        <Button 
                            onClick={handleAcademia} 
                            className="action-button"
                            disabled={isLoading}
                            title="Acceder a la academia electoral"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '140px',
                                height: '140px',
                                padding: '1rem'
                            }}
                        >
                            <GraduationCap size={24} />
                            Academia
                        </Button>
                    </div>
                </div>
            </Form>
        </CenteredContainer>
    );
};

export default LoginVoluntario;
