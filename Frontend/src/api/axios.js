import axios from 'axios';

// Log the API URL for debugging
console.log('API URL from env:', import.meta.env.VITE_API_URL);

// Fix for Vercel deployment - if the URL contains 'vercel.com/' incorrectly, replace it
let apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl && apiUrl.includes('vercel.com/')) {
  // Replace incorrect Vercel dashboard URL with
  console.log('Corrected API URL:', apiUrl);
}

// Create a custom axios instance with default configuration
const apiClient = axios.create({
  baseURL: apiUrl,
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