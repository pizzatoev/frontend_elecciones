import axios from "axios";

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
