import axiosInstance from '../api/axiosInstance';

const AuthService = {
    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosInstance.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    },

    isAuthenticated: () => {
        try {
            return !!localStorage.getItem('user');
        } catch {
            return false;
        }
    },

    getRole: () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user.role : null;
        } catch {
            return null;
        }
    }
};

export default AuthService;
