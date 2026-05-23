import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8084/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for centralized error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        console.error('[API Error]:', message);
        
        // You could trigger a toast or global alert here
        if (error.response?.status === 404) {
            alert(`Resource not found: ${message}`);
        } else if (error.response?.status >= 500) {
            alert('Server error. Please try again later.');
        } else if (error.response?.status === 400) {
            // Validation errors are usually handled in the component, but we log them here
            console.warn('[Validation Error]:', error.response.data);
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
