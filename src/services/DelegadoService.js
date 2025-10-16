import axios from "axios";

const API_URL = "http://localhost:9090/api/delegados";

export const getDelegadoByCi = (ci) => {
  return axios.get(`${API_URL}/ci/${ci}`);
};

export const getAllDelegados = () => {
  return axios.get(API_URL);
};

export const getDelegadoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createDelegado = (delegado) => {
  return axios.post(API_URL, delegado);
};

export const updateDelegado = (id, delegado) => {
  return axios.put(`${API_URL}/${id}`, delegado);
};

export const deleteDelegado = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const getDelegadosByMesa = (mesaId) => {
  return axios.get(`${API_URL}/mesa/${mesaId}`);
};

export const getDelegadosByPartido = (partidoId) => {
  return axios.get(`${API_URL}/partido/${partidoId}`);
};

export const getDelegadosByHabilitado = (habilitado) => {
  return axios.get(`${API_URL}/habilitado/${habilitado}`);
};

export const toggleHabilitado = (id) => {
  return axios.put(`${API_URL}/${id}/toggle-habilitado`);
};