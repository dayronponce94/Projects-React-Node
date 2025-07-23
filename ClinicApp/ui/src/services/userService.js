import api from './api';

export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/api/v1/auth/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error fetching user information';
    }
};