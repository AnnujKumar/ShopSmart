import axios from 'axios';

// Create a custom axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://shop-smart-backend.vercel.app/api' // Replace with your actual backend URL
    : 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add authentication token when available
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle common errors here
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - please check your connection or if the server is running');
    } else if (error.response && error.response.status === 401) {
      console.error('Authentication error - you may need to log in again');
      // Could add automatic logout here if needed
    }
    return Promise.reject(error);
  }
);

export default apiClient;
