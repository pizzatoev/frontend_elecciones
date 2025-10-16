import axios from "axios";

const API_URL = "http://localhost:9090/api/jurados";

export const getJuradoByCi = (ci) => {
  return axios.get(`${API_URL}/ci/${ci}`);
};

export const getAllJurados = () => {
  return axios.get(API_URL);
};

export const getJuradoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createJurado = (jurado) => {
  return axios.post(API_URL, jurado);
};

export const updateJurado = (id, jurado) => {
  return axios.put(`${API_URL}/${id}`, jurado);
};

export const deleteJurado = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const getJuradosByMesa = (mesaId) => {
  return axios.get(`${API_URL}/mesa/${mesaId}`);
};

export const sortearJurados = () => {
  return axios.post(`${API_URL}/sortear`);
};

export const eliminarSorteo = () => {
  return axios.delete(`${API_URL}/eliminar-sorteo`);
};