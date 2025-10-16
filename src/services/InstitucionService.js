import axios from "axios";

const API_URL = "http://localhost:9090/api/instituciones";

export const getAllInstituciones = () => {
  return axios.get(API_URL);
};

export const getInstitucionById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createInstitucion = (institucion) => {
  return axios.post(API_URL, institucion);
};

export const updateInstitucion = (id, institucion) => {
  return axios.put(`${API_URL}/${id}`, institucion);
};

export const deleteInstitucion = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};