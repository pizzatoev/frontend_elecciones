import React from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { PersonCheck, PersonX } from 'react-bootstrap-icons';

const RoleInfo = ({ persona, existingRole, className = '' }) => {
  if (!persona || !existingRole) return null;

  return (
    <Alert variant="warning" className={`d-flex align-items-center ${className}`}>
      <PersonX className="me-2" size={20} />
      <div className="flex-grow-1">
        <strong>Advertencia:</strong> Esta persona ya tiene un rol asignado.
        <br />
        <small className="text-muted">
          <strong>Rol actual:</strong> <Badge bg="warning" className="ms-1">{existingRole}</Badge>
        </small>
      </div>
    </Alert>
  );
};

export default RoleInfo;
