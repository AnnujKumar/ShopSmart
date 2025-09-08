import axios from 'axios';

// Log the API URL for debugging
console.log('API URL from env:', import.meta.env.VITE_API_URL);

// Fix for Vercel deployment - handle the API URL correctly
let apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl && apiUrl.includes('vercel.com/')) {
  // Replace incorrect Vercel dashboard URL with the actual API URL
  apiUrl = 'https://shop-smart-12g9.vercel.app/api';
  console.log('Corrected API URL:', apiUrl);
}

// Create a custom axios instance with default configuration
const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Be careful with this when dealing with CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Increase timeout for slower connections
  timeout: 10000
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
      console.error('Attempted URL:', error.config?.url);
      console.error('Full Config:', error.config);
    } else if (error.response) {
      console.error(`Server Error (${error.response.status}):`, error.response.data);
      
      if (error.response.status === 401) {
        console.error('Authentication error - you may need to log in again');
        // Could add automatic logout here if needed
      } else if (error.response.status === 403) {
        console.error('CORS or permission issue - check server CORS configuration');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;