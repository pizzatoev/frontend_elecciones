import axios from "axios";

/**
 * Servicio para gestionar el historial de personas
 * Módulo Infraestructura - Responsabilidad: Waldir Trancoso
 */
const API_URL = "http://localhost:9090/api/historial";

// Función para obtener historial por persona
export const getHistorialByPersona = (personaId) => {
  return axios.get(`${API_URL}/persona/${personaId}`);
};

// Función para crear nuevo registro de historial
export const createHistorial = (historial) => {
  return axios.post(API_URL, historial);
};

// Función para obtener todos los registros de historial
export const getAllHistorial = () => {
  return axios.get(API_URL);
};

// Función para actualizar registro de historial
export const updateHistorial = (id, historial) => {
  return axios.put(`${API_URL}/${id}`, historial);
};

// Función para eliminar registro de historial
export const deleteHistorial = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
