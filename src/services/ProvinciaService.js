import axios from "axios";

const API_URL = "http://localhost:9090/api/provincias";

export const getAllProvincias = () => {
  return axios.get(`${API_URL}`);
};

export const getProvinciaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getProvinciasByDepartamento = (departamentoId) => {
  return axios.get(`${API_URL}/departamento/${departamentoId}`);
};

export const createProvincia = (data) => {
  return axios.post(`${API_URL}`, data);
};

export const updateProvincia = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteProvincia = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
