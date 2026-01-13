import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateLocation: (coordinates) => api.put('/auth/update-location', { coordinates })
};

// Medical Shops API
export const medicalShopsAPI = {
  getNearby: (latitude, longitude, maxDistance) => 
    api.get('/medical-shops/nearby', { params: { latitude, longitude, maxDistance } }),
  getAll: () => api.get('/medical-shops'),
  getById: (id) => api.get(`/medical-shops/${id}`),
  addReview: (shopId, review) => api.post(`/medical-shops/${shopId}/reviews`, review),
  getMyShop: () => api.get('/medical-shops/my-shop'),
  createShop: (shopData) => api.post('/medical-shops', shopData),
  updateShop: (id, shopData) => api.put(`/medical-shops/${id}`, shopData),
  updateMedicines: (id, medicines) => api.put(`/medical-shops/${id}/medicines`, { medicines })
};

// Hospitals API
export const hospitalsAPI = {
  getNearby: (latitude, longitude, maxDistance) => 
    api.get('/hospitals/nearby', { params: { latitude, longitude, maxDistance } }),
  getAll: () => api.get('/hospitals'),
  getById: (id) => api.get(`/hospitals/${id}`),
  getDoctors: (id, specialization) => 
    api.get(`/hospitals/${id}/doctors`, { params: { specialization } }),
  getMyHospital: () => api.get('/hospitals/my-hospital'),
  createHospital: (hospitalData) => api.post('/hospitals', hospitalData),
  updateHospital: (id, hospitalData) => api.put(`/hospitals/${id}`, hospitalData),
  updateDoctors: (id, doctors) => api.put(`/hospitals/${id}/doctors`, { doctors }),
  updateTests: (id, tests) => api.put(`/hospitals/${id}/tests`, { tests }),
  updateServices: (id, services) => api.put(`/hospitals/${id}/services`, { services })
};

// Chatbot API
// Chatbot removed

export default api;

