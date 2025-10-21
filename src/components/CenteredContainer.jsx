/**
 * COMPONENTE CONTENEDOR CENTRADO
 * Diseñador: Waldir Trancoso
 * Especialización: React + Vite + Bootstrap
 * Fecha: 20 de Octubre, 2025
 * 
 * Propósito: Asegurar el centrado perfecto del contenido
 * en todas las pantallas y dispositivos
 */

import React from 'react';
import { Container } from 'react-bootstrap';

const CenteredContainer = ({ children, className = '', maxWidth = '420px' }) => {
  return (
    <div className="app-container">
      <Container 
        className={`card-central ${className}`}
        style={{ maxWidth }}
      >
        {children}
      </Container>
    </div>
  );
};

export default CenteredContainer;
