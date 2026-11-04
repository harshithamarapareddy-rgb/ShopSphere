import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch unauthorized errors or account suspensions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, optionally clean up
      if (
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes('expired')
      ) {
        localStorage.removeItem('shopsphere_token');
        localStorage.removeItem('shopsphere_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;

