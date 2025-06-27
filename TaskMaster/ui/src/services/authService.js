import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth',  // Connect to backend
});

// Register new user
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        // Handle specific error messages from backend
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
};

// Login existing user
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        throw new Error('Logout failed. Please try again.');
    }
};