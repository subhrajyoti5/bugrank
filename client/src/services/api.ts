import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add demo auth token to requests (now optional since we removed auth)
apiClient.interceptors.request.use(
  async (config) => {
    // Optional: Add demo token if user exists in localStorage
    try {
      const user = localStorage.getItem('bugrank_user');
      if (user) {
        const parsedUser = JSON.parse(user);
        config.headers.Authorization = `Bearer demo-token-${parsedUser.id}`;
      }
    } catch (e) {
      // Ignore errors - auth is optional now
      console.log('No auth token added (optional)');
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
