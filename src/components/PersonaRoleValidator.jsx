import React, { useState, useEffect } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { PersonaService } from '../services/PersonaService';
import RoleInfo from './RoleInfo';

const PersonaRoleValidator = ({ 
  personaId, 
  onRoleCheck, 
  onValidationChange,
  disabled = false 
}) => {
  const [persona, setPersona] = useState(null);
  const [existingRole, setExistingRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (personaId) {
      checkPersonaRole();
    } else {
      setPersona(null);
      setExistingRole(null);
      setError('');
    }
  }, [personaId]);

  const checkPersonaRole = async () => {
    if (!personaId) return;

    try {
      setLoading(true);
      setError('');
      
      // Obtener información de la persona
      const personaResponse = await PersonaService.getPersonaById(personaId);
      setPersona(personaResponse.data);

      // Verificar si tiene roles existentes
      const roleInfo = await checkExistingRoles(personaId);
      setExistingRole(roleInfo.role);
      
      // Notificar al componente padre
      if (onRoleCheck) {
        onRoleCheck(roleInfo);
      }
      
      if (onValidationChange) {
        onValidationChange(!roleInfo.hasRole);
      }

    } catch (error) {
      console.error('Error checking persona role:', error);
      setError('Error al verificar los roles de la persona');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingRoles = async (personaId) => {
    try {
      // Verificar en todos los servicios de roles
      const [juradosResponse, veedoresResponse, delegadosResponse] = await Promise.allSettled([
        PersonaService.getPersonaById(personaId).then(() => 
          // Aquí podrías hacer una llamada específica para verificar roles
          // Por ahora, asumimos que no hay roles si no hay error
          Promise.resolve({ data: [] })
        ),
        PersonaService.getPersonaById(personaId).then(() => 
          Promise.resolve({ data: [] })
        ),
        PersonaService.getPersonaById(personaId).then(() => 
          Promise.resolve({ data: [] })
        )
      ]);

      // Esta es una implementación simplificada
      // En un caso real, necesitarías endpoints específicos para verificar roles
      return {
        hasRole: false,
        role: null
      };
    } catch (error) {
      return {
        hasRole: false,
        role: null
      };
    }
  };

  if (loading) {
    return (
      <Alert variant="info" className="d-flex align-items-center">
        <Spinner animation="border" size="sm" className="me-2" />
        Verificando roles de la persona...
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (existingRole) {
    return (
      <RoleInfo 
        persona={persona} 
        existingRole={existingRole}
        className="mb-3"
      />
    );
  }

  return null;
};

export default PersonaRoleValidator;
