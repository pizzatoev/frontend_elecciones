import { useState } from 'react';

export const useRoleValidation = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleError = (error) => {
    console.error('Error:', error);
    
    // Verificar si es un error de rol duplicado
    if (error.response?.status === 409) {
      setError(error.response.data.message || 'Esta persona ya tiene un rol asignado y no puede ser registrada nuevamente.');
    } else if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else if (error.message) {
      setError(error.message);
    } else {
      setError('Ha ocurrido un error inesperado. Por favor, intente nuevamente.');
    }
    
    setSuccess(''); // Limpiar mensaje de éxito
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setError(''); // Limpiar mensaje de error
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const isDuplicateRoleError = (error) => {
    return error.response?.status === 409;
  };

  const getDuplicateRoleMessage = (error) => {
    if (isDuplicateRoleError(error)) {
      return error.response.data.message || 'Esta persona ya tiene un rol asignado y no puede ser registrada nuevamente.';
    }
    return null;
  };

  return {
    error,
    success,
    handleError,
    handleSuccess,
    clearMessages,
    isDuplicateRoleError,
    getDuplicateRoleMessage
  };
};
