import api from './api';

export const getSpecialties = async () => {
    try {
        const response = await api.get('/api/v1/users/specialties');
        return response.data;
    } catch (error) {
        console.error('Error fetching specialties:', error);
        throw error.response?.data?.error || 'Error fetching specialties';
    }
};