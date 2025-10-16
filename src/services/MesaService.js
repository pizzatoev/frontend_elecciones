import axios from "axios";

const API_URL = "http://localhost:9090/api/mesas";

// Función para obtener todas las mesas
export const getAllMesas = () => {
  return axios.get(`${API_URL}`);
};

// Función para obtener mesa por ID
export const getMesaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Función para obtener mesas por recinto
export const getMesasByRecinto = (recintoId) => {
  return axios.get(`${API_URL}/recinto/${recintoId}`);
};

// Función para crear mesa
export const createMesa = (mesa) => {
  return axios.post(`${API_URL}`, mesa);
};

// Función para actualizar mesa
export const updateMesa = (id, mesa) => {
  return axios.put(`${API_URL}/${id}`, mesa);
};

// Función para eliminar mesa
export const deleteMesa = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
