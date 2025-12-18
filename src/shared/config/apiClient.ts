import axios, { type AxiosError } from 'axios';
import config from './env.config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.apiUrl || 'https://financialproyect.free.beeceptor.com',
  timeout: config.apiTimeout || 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  responseType: 'json',
});

// Request interceptor - Add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
   
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
  
    
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data: any = error.response.data;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
          break;
        
        case 403:
          console.error('❌ Forbidden:', data.message);
          break;
        
        case 404:
          console.error('❌ Not Found:', error.config?.url);
          break;
        
        case 500:
          console.error('❌ Server Error:', data.message);
          break;
        
        default:
          console.error('❌ HTTP Error:', status, data.message);
      }
      
      // Return custom error with message from API
      return Promise.reject(new Error(data.message || `HTTP Error ${status}`));
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default apiClient;
