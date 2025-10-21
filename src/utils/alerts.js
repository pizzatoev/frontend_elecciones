import Swal from 'sweetalert2';

/**
 * Utilidades de alertas con SweetAlert2 para el módulo Infraestructura
 * Responsabilidad: Waldir Trancoso
 */

// Configuración base de SweetAlert2
const swalConfig = {
  confirmButtonText: 'Entendido',
  cancelButtonText: 'Cancelar',
  showCancelButton: false,
  showConfirmButton: true,
  timer: null,
  timerProgressBar: false
};

// Función para mostrar errores de validación
export const showValidationError = (message) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'error',
    title: 'Error de Validación',
    text: message,
    confirmButtonText: 'Entendido'
  });
};

// Función para mostrar errores de servidor
export const showServerError = (error) => {
  const message = error.response?.data?.message || error.message || 'Error desconocido';
  return Swal.fire({
    ...swalConfig,
    icon: 'error',
    title: 'Error del Servidor',
    text: message,
    confirmButtonText: 'Entendido'
  });
};

// Función para mostrar éxito
export const showSuccess = (title, text) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'success',
    title: title,
    text: text,
    confirmButtonText: 'Entendido',
    timer: 3000,
    timerProgressBar: true
  });
};

// Función para mostrar confirmación
export const showConfirmation = (title, text) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'question',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  });
};

// Función para mostrar información
export const showInfo = (title, text) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'info',
    title: title,
    text: text,
    confirmButtonText: 'Entendido'
  });
};

// Función para mostrar advertencia
export const showWarning = (title, text) => {
  return Swal.fire({
    ...swalConfig,
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonText: 'Entendido'
  });
};

// Función para mostrar loading
export const showLoading = (title = 'Cargando...') => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Función para cerrar loading
export const closeLoading = () => {
  Swal.close();
};

// Función para manejar errores de forma genérica
export const handleError = (error) => {
  console.error('Error:', error);
  
  if (error.response?.status === 400) {
    // Error de validación del backend
    return showValidationError(error.response.data.message || 'Error de validación');
  } else if (error.response?.status === 404) {
    // Recurso no encontrado
    return showWarning('No encontrado', 'El recurso solicitado no existe');
  } else if (error.response?.status === 500) {
    // Error interno del servidor
    return showServerError(error);
  } else {
    // Error genérico
    return showServerError(error);
  }
};
