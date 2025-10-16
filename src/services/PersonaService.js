import axios from "axios";

const API_URL = "http://localhost:9090/api/personas";

export const getPersonaByCi = (ci) => {
  return axios.get(`${API_URL}/ci/${ci}`);
};

export const getAllPersonas = () => {
  return axios.get(API_URL);
};

export const getPersonaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createPersona = (persona) => {
  return axios.post(API_URL, persona);
};

export const updatePersona = (id, persona) => {
  return axios.put(`${API_URL}/${id}`, persona);
};

export const deletePersona = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};