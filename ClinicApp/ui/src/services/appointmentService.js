import api from './api';

export const getDoctorsBySpecialty = async (specialty) => {
    try {
        const response = await api.get('/api/v1/users/doctors', {
            params: { specialty }
        });

        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching doctors:', error.response?.data || error.message);
        throw error.response?.data?.error || 'Error fetching doctors';
    }
};

export const getDoctorAvailability = async (doctorId) => {
    try {
        const response = await api.get(`/api/v1/appointments/availability/${doctorId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error fetching availability';
    }
};


export const getAvailableSlots = async (doctorId, date) => {
    try {
        const utcDate = new Date(date).toISOString().split('T')[0];

        const response = await api.get('/api/v1/appointments/slots', {
            params: { doctorId, date: utcDate }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error fetching available slots';
    }
};

export const bookAppointment = async (appointmentData) => {
    try {
        const payload = {
            doctorId: appointmentData.doctorId,
            date: new Date(appointmentData.date).toISOString().split('T')[0],
            startTime: appointmentData.startTime,
            endTime: appointmentData.endTime
        };

        const response = await api.post('/api/v1/appointments', payload);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error booking appointment';
        throw new Error(errorMessage);
    }
};

export const getPatientAppointments = async () => {
    try {
        const response = await api.get('/api/v1/appointments/patient');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error fetching appointments';
    }
};

export const cancelAppointment = async (appointmentId) => {
    try {
        const response = await api.put(`/api/v1/appointments/${appointmentId}/cancel`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error cancelling appointment';
    }
};


export const getDoctorAppointments = async (date) => {
    try {
        const response = await api.get('/api/v1/appointments/doctor', {
            params: { date: date.toISOString().split('T')[0] }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error fetching doctor appointments';
    }
};


export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const response = await api.put(`/api/v1/appointments/${appointmentId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Error updating appointment status';
    }
};
