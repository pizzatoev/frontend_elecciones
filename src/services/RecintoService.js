import axios from "axios";

const API_URL = "http://localhost:9090/api/recintos";

export const getAllRecintos = () => {
  return axios.get(`${API_URL}`);
};

export const getRecintoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getRecintosByAsiento = (asientoId) => {
  return axios.get(`${API_URL}/asiento/${asientoId}`);
};

export const createRecinto = (data) => {
  return axios.post(`${API_URL}`, data);
};

export const updateRecinto = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteRecinto = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
