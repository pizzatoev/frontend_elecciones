import axios from "axios";

const API_URL = "http://localhost:9090/api/veedores";

export const getVeedorByCi = (ci) => {
  return axios.get(`${API_URL}/ci/${ci}`);
};

export const getAllVeedores = () => {
  return axios.get(API_URL);
};

export const getVeedorById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createVeedor = (veedor) => {
  return axios.post(API_URL, veedor);
};

export const updateVeedor = (id, veedor) => {
  return axios.put(`${API_URL}/${id}`, veedor);
};

export const deleteVeedor = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const getVeedoresByInstitucion = (institucionId) => {
  return axios.get(`${API_URL}/institucion/${institucionId}`);
};

export const getVeedoresByEstado = (estado) => {
  return axios.get(`${API_URL}/estado/${estado}`);
};

export const aprobarVeedor = (id) => {
  return axios.put(`${API_URL}/${id}/aprobar`);
};

export const rechazarVeedor = (id, motivo) => {
  return axios.put(`${API_URL}/${id}/rechazar`, { motivo });
};