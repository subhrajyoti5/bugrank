import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add authentication tokens to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Add JWT token if available
    const token = localStorage.getItem('bugrank_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add session token if available
    const sessionToken = localStorage.getItem('bugrank_session');
    if (sessionToken) {
      config.headers['x-session-token'] = sessionToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Network error';
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('bugrank_token');
      localStorage.removeItem('bugrank_session');
      localStorage.removeItem('bugrank_user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: errorMessage,
      data: error.response?.data
    });
    
    // Return a more helpful error object
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).status = error.response?.status;
    (enhancedError as any).data = error.response?.data;
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
