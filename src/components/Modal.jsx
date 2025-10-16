import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';

const Modal = ({ 
  show, 
  onHide, 
  title, 
  children, 
  size = 'md',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  showFooter = true,
  confirmVariant = 'primary',
  loading = false
}) => {
  return (
    <BootstrapModal show={show} onHide={onHide} size={size} centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      
      <BootstrapModal.Body>
        {children}
      </BootstrapModal.Body>
      
      {showFooter && (
        <BootstrapModal.Footer>
          <Button 
            variant="secondary" 
            onClick={onCancel || onHide}
            disabled={loading}
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button 
              variant={confirmVariant} 
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Procesando...' : confirmText}
            </Button>
          )}
        </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
};

export default Modal;

