import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { ExclamationTriangleFill, XCircleFill } from 'react-bootstrap-icons';

const ErrorAlert = ({ 
  error, 
  onClose, 
  variant = 'danger', 
  showIcon = true,
  dismissible = true,
  className = ''
}) => {
  if (!error) return null;

  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (variant) {
      case 'danger':
        return <XCircleFill className="me-2" />;
      case 'warning':
        return <ExclamationTriangleFill className="me-2" />;
      default:
        return null;
    }
  };

  const getAlertClass = () => {
    let baseClass = 'd-flex align-items-center';
    if (className) {
      baseClass += ` ${className}`;
    }
    return baseClass;
  };

  return (
    <Alert 
      variant={variant} 
      dismissible={dismissible} 
      onClose={onClose}
      className={getAlertClass()}
    >
      {getIcon()}
      <div className="flex-grow-1">
        {error}
      </div>
    </Alert>
  );
};

export default ErrorAlert;
