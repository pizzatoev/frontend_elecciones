import React from 'react';
import { Badge } from 'react-bootstrap';

/**
 * Componente para mostrar el estado de una persona
 * Módulo Infraestructura - Responsabilidad: Waldir Trancoso
 */
const EstadoBadge = ({ estado }) => {
  const getVariant = (estado) => {
    switch (estado) {
      case 'VIVO':
        return 'success';
      case 'FALLECIDO':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const getText = (estado) => {
    switch (estado) {
      case 'VIVO':
        return 'Vivo';
      case 'FALLECIDO':
        return 'Fallecido';
      default:
        return 'No especificado';
    }
  };

  return (
    <Badge bg={getVariant(estado)} className="fs-6">
      {getText(estado)}
    </Badge>
  );
};

export default EstadoBadge;
