import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { useRoleValidation } from '../hooks/useRoleValidation';
import ErrorAlert from './ErrorAlert';
import RoleInfo from './RoleInfo';

const RoleValidationDemo = () => {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { error, success, handleError, handleSuccess, clearMessages } = useRoleValidation();

  const personas = [
    { id: 1, ci: '12345678', nombre: 'Juan', apellido: 'Pérez', roles: [] },
    { id: 2, ci: '87654321', nombre: 'María', apellido: 'González', roles: ['Jurado'] },
    { id: 3, ci: '11223344', nombre: 'Carlos', apellido: 'López', roles: ['Veedor'] },
    { id: 4, ci: '44332211', nombre: 'Ana', apellido: 'Martínez', roles: ['Delegado'] }
  ];

  const roles = ['Jurado', 'Veedor', 'Delegado'];

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setSelectedRole('');
    clearMessages();
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    clearMessages();
  };

  const simulateRoleAssignment = async () => {
    if (!selectedPersona || !selectedRole) {
      handleError(new Error('Debe seleccionar una persona y un rol'));
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar si la persona ya tiene roles
      if (selectedPersona.roles.length > 0) {
        const existingRole = selectedPersona.roles[0];
        throw new Error(`Esta persona ya tiene un rol asignado (${existingRole}) y no puede ser registrada nuevamente como ${selectedRole}.`);
      }

      // Si no tiene roles, simular asignación exitosa
      handleSuccess(`${selectedRole} asignado exitosamente a ${selectedPersona.nombre} ${selectedPersona.apellido}`);
      
      // Actualizar la persona con el nuevo rol
      setSelectedPersona({
        ...selectedPersona,
        roles: [...selectedPersona.roles, selectedRole]
      });

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getPersonaStatus = (persona) => {
    if (persona.roles.length === 0) {
      return { status: 'success', text: 'Sin roles asignados', icon: '✅' };
    } else {
      return { status: 'warning', text: `Rol: ${persona.roles[0]}`, icon: '⚠️' };
    }
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Demostración de Validación de Roles</h2>
          <p className="text-muted">
            Esta demostración muestra cómo funciona la validación de roles exclusivos.
            Intenta asignar roles a personas que ya tienen roles asignados para ver los errores.
          </p>
        </Col>
      </Row>

      {/* Alertas */}
      <ErrorAlert 
        error={error} 
        onClose={clearMessages}
        variant="danger"
      />
      {success && <Alert variant="success" dismissible onClose={clearMessages}>{success}</Alert>}

      <Row>
        {/* Lista de Personas */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Seleccionar Persona</h5>
            </Card.Header>
            <Card.Body>
              {personas.map((persona) => {
                const status = getPersonaStatus(persona);
                return (
                  <div 
                    key={persona.id}
                    className={`p-3 mb-2 border rounded cursor-pointer ${
                      selectedPersona?.id === persona.id ? 'border-primary bg-light' : 'border-secondary'
                    }`}
                    onClick={() => handlePersonaSelect(persona)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{persona.nombre} {persona.apellido}</strong>
                        <br />
                        <small className="text-muted">CI: {persona.ci}</small>
                      </div>
                      <div className="text-end">
                        <span className={`badge bg-${status.status === 'success' ? 'success' : 'warning'}`}>
                          {status.icon} {status.text}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Col>

        {/* Selección de Rol */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Asignar Rol</h5>
            </Card.Header>
            <Card.Body>
              {selectedPersona ? (
                <>
                  <div className="mb-3">
                    <strong>Persona seleccionada:</strong><br />
                    {selectedPersona.nombre} {selectedPersona.apellido} (CI: {selectedPersona.ci})
                  </div>

                  {selectedPersona.roles.length > 0 && (
                    <RoleInfo 
                      persona={selectedPersona}
                      existingRole={selectedPersona.roles[0]}
                      className="mb-3"
                    />
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Seleccionar Rol</Form.Label>
                    <Form.Select 
                      value={selectedRole} 
                      onChange={(e) => handleRoleSelect(e.target.value)}
                      disabled={selectedPersona.roles.length > 0}
                    >
                      <option value="">Seleccionar rol...</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    onClick={simulateRoleAssignment}
                    disabled={!selectedRole || selectedPersona.roles.length > 0 || loading}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Asignando rol...
                      </>
                    ) : (
                      'Asignar Rol'
                    )}
                  </Button>

                  {selectedPersona.roles.length > 0 && (
                    <Alert variant="warning" className="mt-3">
                      <strong>Nota:</strong> Esta persona ya tiene un rol asignado y no puede recibir otro rol.
                    </Alert>
                  )}
                </>
              ) : (
                <div className="text-center text-muted">
                  <p>Selecciona una persona para continuar</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Información sobre la validación */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>¿Cómo funciona la validación?</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li><strong>Personas sin roles:</strong> Pueden recibir cualquier rol (Jurado, Veedor, Delegado)</li>
                <li><strong>Personas con roles:</strong> No pueden recibir roles adicionales</li>
                <li><strong>Validación en backend:</strong> Se verifica en las tablas de Jurados, Veedores y Delegados</li>
                <li><strong>Mensajes de error:</strong> Se muestran alertas específicas cuando hay conflictos</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RoleValidationDemo;
