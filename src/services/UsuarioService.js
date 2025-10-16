import axios from "axios";

const API_URL = "http://localhost:9090/api/usuarios";

// Función para login
export const login = (username, password) => {
    console.log("Login body enviado:", { username, password });
  return axios.post(`${API_URL}/login`, { username, password });
};

export const createAdminUsuario = (usuario) => {
    return axios.post(API_URL, usuario);
};

// Función para obtener todos los usuarios
export const getUsuarios = () => {
  return axios.get(`${API_URL}`);
};

// Función para obtener usuario por ID
export const getUsuarioById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Función para obtener usuario por username
export const getUsuarioByUsername = (username) => {
  return axios.get(`${API_URL}/username/${username}`);
};

// Función para crear usuario
export const createUsuario = (usuario) => {
  return axios.post(`${API_URL}`, usuario);
};

// Función para actualizar usuario
export const updateUsuario = (id, usuario) => {
  return axios.put(`${API_URL}/${id}`, usuario);
};

// Función para eliminar usuario
export const deleteUsuario = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};



