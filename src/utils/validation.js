/**
 * Utilidades de validación para el módulo Infraestructura
 * Responsabilidad: Waldir Trancoso
 */

// Validaciones para CI
export const validateCI = (ci) => {
  if (!ci || ci.trim() === '') {
    return { isValid: false, message: 'El CI es obligatorio' };
  }
  
  if (!/^\d+$/.test(ci.trim())) {
    return { isValid: false, message: 'El CI debe contener solo números' };
  }
  
  if (ci.trim().length > 20) {
    return { isValid: false, message: 'El CI no puede exceder 20 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

// Validaciones para nombre
export const validateNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') {
    return { isValid: false, message: 'El nombre es obligatorio' };
  }
  
  if (nombre.trim().length > 100) {
    return { isValid: false, message: 'El nombre no puede exceder 100 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

// Validaciones para apellido
export const validateApellido = (apellido) => {
  if (!apellido || apellido.trim() === '') {
    return { isValid: false, message: 'El apellido es obligatorio' };
  }
  
  if (apellido.trim().length > 100) {
    return { isValid: false, message: 'El apellido no puede exceder 100 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

// Validaciones para correo
export const validateCorreo = (correo) => {
  if (!correo || correo.trim() === '') {
    return { isValid: true, message: '' }; // Correo es opcional
  }
  
  const emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailPattern.test(correo.trim())) {
    return { isValid: false, message: 'El formato del correo electrónico no es válido' };
  }
  
  if (correo.trim().length > 100) {
    return { isValid: false, message: 'El correo no puede exceder 100 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

// Validaciones para teléfono
export const validateTelefono = (telefono) => {
  if (!telefono || telefono.trim() === '') {
    return { isValid: true, message: '' }; // Teléfono es opcional
  }
  
  if (telefono.trim().length > 20) {
    return { isValid: false, message: 'El teléfono no puede exceder 20 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

// Validaciones para ciudad
export const validateCiudad = (ciudad) => {
  if (!ciudad || ciudad.trim() === '') {
    return { isValid: true, message: '' }; // Ciudad es opcional
  }
  
  if (ciudad.trim().length > 100) {
    return { isValid: false, message: 'La ciudad no puede exceder 100 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

// Validación completa del formulario
export const validatePersonaForm = (formData) => {
  const errors = [];
  
  const ciValidation = validateCI(formData.ci);
  if (!ciValidation.isValid) errors.push(ciValidation.message);
  
  const nombreValidation = validateNombre(formData.nombre);
  if (!nombreValidation.isValid) errors.push(nombreValidation.message);
  
  const apellidoValidation = validateApellido(formData.apellido);
  if (!apellidoValidation.isValid) errors.push(apellidoValidation.message);
  
  const correoValidation = validateCorreo(formData.correo);
  if (!correoValidation.isValid) errors.push(correoValidation.message);
  
  const telefonoValidation = validateTelefono(formData.telefono);
  if (!telefonoValidation.isValid) errors.push(telefonoValidation.message);
  
  const ciudadValidation = validateCiudad(formData.ciudad);
  if (!ciudadValidation.isValid) errors.push(ciudadValidation.message);
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
