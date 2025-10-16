import axios from "axios";

const API_URL = "http://localhost:9090/api/departamentos";

export const getAllDepartamentos = () => {
  return axios.get(`${API_URL}`);
};

export const getDepartamentoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createDepartamento = (data) => {
  return axios.post(`${API_URL}`, data);
};

export const updateDepartamento = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteDepartamento = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
