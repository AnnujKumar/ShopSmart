import axios from 'axios';

// Log the API URL for debugging
console.log('API URL from env:', import.meta.env.VITE_API_URL);

// Fix for Vercel deployment - handle the API URL correctly
let apiUrl = import.meta.env.VITE_API_URL;
// For deployment URLs specifically correcting the URL
if (apiUrl && apiUrl.includes('i2g9.vercel.app')) {
  apiUrl = 'https://shop-smart-i2g9.vercel.app/api';
  console.log('Using API URL:', apiUrl);
}

// Create a custom axios instance with default configuration
const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: false, // Disable withCredentials to avoid CORS preflight issues
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Increase timeout for slower connections
  timeout: 15000
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
    // Log all request details to help debugging
    console.error('API Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      headers: error.config?.headers,
      withCredentials: error.config?.withCredentials,
      errorCode: error.code,
      errorName: error.name,
      errorMessage: error.message
    });
    
    // Handle common errors here
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - please check your connection or if the server is running');
    } else if (error.response) {
      console.error(`Server Error (${error.response.status}):`, error.response.data);
      
      if (error.response.status === 401) {
        console.error('Authentication error - you may need to log in again');
      } else if (error.response.status === 403) {
        console.error('CORS or permission issue - check server CORS configuration');
      }
    }
    
    // Log specific CORS-related information if available
    if (error.message && error.message.includes('CORS')) {
      console.error('CORS ERROR DETECTED - Check that your backend CORS settings allow your frontend origin');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;