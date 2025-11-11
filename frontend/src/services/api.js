// src/services/api.js
import axios from 'axios';

// HINWEIS: Diese URL muss nach dem ersten Deployment (Prompt #12)
// durch die echte URL des pps-api Service ersetzt werden.
const API_URL = 'https://pps-api-XXXXX-ew.a.run.app';

// Diese Funktion muss implementiert werden, um das gcloud-Token abzurufen.
// Im Browser ist dies komplex. 
// LOKALE ENTWICKLUNG: 'gcloud auth print-identity-token' manuell ausführen und Token setzen.
// PRODUKTION: Benötigt einen Mechanismus, um das Token des angemeldeten Google-Users zu nutzen.
const getAuthToken = async () => {
  // Placeholder für die Token-Logik
  // z.B. aus dem Local Storage für manuelle Tests
  return localStorage.getItem('gcloud-token'); 
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ✅ Interceptor für IAM-Token
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API-Funktionen, wie im Master-Konzept beschrieben
export const processesApi = {
  create: (data) => api.post('/api/processes', data),
  list: () => api.get('/api/processes'),
  get: (id) => api.get(`/api/processes/${id}`),
  update: (id, data) => api.put(`/api/processes/${id}`, data),
  gemini: (id) => api.post(`/api/processes/${id}/gemini`),
  export: (id) => api.post(`/api/processes/${id}/export`, 
    {}, 
    { responseType: 'blob' }
  )
};
