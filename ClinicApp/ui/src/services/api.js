import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // adjust if your token is stored elsewhere
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                console.error('Unauthorized access');
                // Optional: redirect to login
            } else if (status === 403) {
                console.error('Forbidden access');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
