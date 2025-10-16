import axios from "axios";

const API_URL = "http://localhost:9090/api/asistencias";

// Función para obtener asistencia por mesa
export const getAsistenciaByMesa = (idMesa) => {
  return axios.get(`${API_URL}/mesa/${idMesa}`);
};

// Función para obtener todas las asistencias
export const getAllAsistencia = () => {
  return axios.get(`${API_URL}`);
};

// Función para obtener asistencia por ID
export const getAsistenciaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Función para crear asistencia
export const createAsistencia = (asistencia) => {
  return axios.post(`${API_URL}`, asistencia);
};

// Función para actualizar asistencia
export const updateAsistencia = (id, asistencia) => {
  return axios.put(`${API_URL}/${id}`, asistencia);
};

// Función para eliminar asistencia
export const deleteAsistencia = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Función para marcar como presente
export const marcarPresente = (idAsistencia) => {
  return axios.put(`${API_URL}/${idAsistencia}/presente`);
};

// Función para marcar como ausente
export const marcarAusente = (idAsistencia) => {
  return axios.put(`${API_URL}/${idAsistencia}/ausente`);
};

// Función para crear registros de asistencia para una mesa
export const crearAsistenciasParaMesa = (mesaId) => {
  return axios.post(`${API_URL}/mesa/${mesaId}/crear`);
};
