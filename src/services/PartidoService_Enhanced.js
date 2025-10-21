import axios from "axios";

/**
 * Servicio mejorado para gestión de partidos con módulo Infraestructura
 * Responsabilidad: Waldir Trancoso
 * Mejoras: Subida de logos, cambio de estado
 */
const API_URL = "http://localhost:9090/api/partidos";

// Función para obtener todos los partidos
export const getAllPartidos = () => {
  return axios.get(`${API_URL}`);
};

// Función para obtener partido por ID
export const getPartidoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Función para obtener partido por sigla
export const getPartidoBySigla = (sigla) => {
  return axios.get(`${API_URL}/sigla/${sigla}`);
};

// Función para obtener partidos por estado
export const getPartidosByEstado = (estado) => {
  return axios.get(`${API_URL}/estado/${estado}`);
};

// Función para crear partido
export const createPartido = (partido) => {
  return axios.post(`${API_URL}`, partido);
};

// Función para actualizar partido
export const updatePartido = (id, partido) => {
  return axios.put(`${API_URL}/${id}`, partido);
};

// Función para eliminar partido
export const deletePartido = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Función para subir logo de partido - Módulo Infraestructura
export const uploadPartidoLogo = (id, logoUrl) => {
  return axios.post(`${API_URL}/upload-logo/${id}`, null, {
    params: { logoUrl }
  });
};

// Función para cambiar estado de partido - Módulo Infraestructura
export const changePartidoEstado = (id, nuevoEstado) => {
  return axios.put(`${API_URL}/${id}/estado`, null, {
    params: { nuevoEstado }
  });
};

// Función para subir archivo de logo (si se implementa subida de archivos)
export const uploadLogoFile = (id, file) => {
  const formData = new FormData();
  formData.append('logo', file);
  
  return axios.post(`${API_URL}/upload-logo-file/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
