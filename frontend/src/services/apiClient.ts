import axios from 'axios';

/**
 * Axios API client — single instance with interceptors for auth.
 * All API calls go through this client to ensure consistent
 * error handling and authentication headers.
 */
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* --- Request Interceptor: Attach auth token --- */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vrindashiki_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* --- Response Interceptor: Normalize errors --- */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vrindashiki_token');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
