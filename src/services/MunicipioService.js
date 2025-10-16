import axios from "axios";

const API_URL = "http://localhost:9090/api/municipios";

export const getAllMunicipios = () => {
  return axios.get(`${API_URL}`);
};

export const getMunicipioById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getMunicipiosByProvincia = (provinciaId) => {
  return axios.get(`${API_URL}/provincia/${provinciaId}`);
};

export const createMunicipio = (data) => {
  return axios.post(`${API_URL}`, data);
};

export const updateMunicipio = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteMunicipio = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
