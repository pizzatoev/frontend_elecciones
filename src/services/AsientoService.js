import axios from "axios";

const API_URL = "http://localhost:9090/api/asientos";

export const getAllAsientos = () => {
  return axios.get(`${API_URL}`);
};

export const getAsientoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getAsientosByMunicipio = (municipioId) => {
  return axios.get(`${API_URL}/municipio/${municipioId}`);
};

export const createAsiento = (data) => {
  return axios.post(`${API_URL}`, data);
};

export const updateAsiento = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteAsiento = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
