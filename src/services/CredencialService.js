import axios from "axios";

const API_URL = "http://localhost:9090/api/credenciales";

export const getAllCredenciales = () => {
  return axios.get(API_URL);
};

export const getCredencialById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const generarCredencial = (idPersona, rol) => {
  return axios.post(`${API_URL}/generar`, { idPersona, rol });
};

export const descargarPdf = (idCredencial) => {
  return axios.get(`${API_URL}/${idCredencial}/pdf`, {
    responseType: 'blob'
  }).then(response => {
    // Crear un blob y descargarlo
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `credencial_${idCredencial}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
};

export const verQr = (idCredencial) => {
  return `${API_URL}/${idCredencial}/qr`;
};

export const getCredencialesByRol = (rol) => {
  return axios.get(`${API_URL}/rol/${rol}`);
};

export const getCredencialesByPersona = (idPersona) => {
  return axios.get(`${API_URL}/persona/${idPersona}`);
};