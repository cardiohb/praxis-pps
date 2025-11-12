import axios from 'axios';

const API_BASE_URL = 'https://pps-api-290754206795.europe-west3.run.app';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Methods
export const processApi = {
  // Get all processes
  getAll: async () => {
    const response = await api.get('/api/processes');
    return response.data;
  },

  // Get single process by ID
  getById: async (id) => {
    const response = await api.get(`/api/processes/${id}`);
    return response.data;
  },

  // Create new process
  create: async (processData) => {
    const response = await api.post('/api/processes', processData);
    return response.data;
  },

  // Update existing process
  update: async (id, processData) => {
    const response = await api.put(`/api/processes/${id}`, processData);
    return response.data;
  },

  // Delete process
  delete: async (id) => {
    const response = await api.delete(`/api/processes/${id}`);
    return response.data;
  },
};

// Helper function for error messages
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || error.response.statusText || 'Server error';
  } else if (error.request) {
    // Request was made but no response received
    return 'Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung.';
  } else {
    // Something else happened
    return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
  }
};

export default api;
