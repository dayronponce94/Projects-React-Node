import axios from 'axios';

// Create Axios instance for tasks
const taskApi = axios.create({
    baseURL: 'http://localhost:5000/api/tasks',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include the auth token
taskApi.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Create a new task
export const createTask = async (taskData) => {
    try {
        const response = await taskApi.post('/', taskData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
};

// Get all tasks for the user
export const getTasks = async () => {
    try {
        const response = await taskApi.get('/');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
};

// Update a task
export const updateTask = async (taskId, updateData) => {
    try {
        const response = await taskApi.patch(`/${taskId}`, updateData);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        const response = await taskApi.delete(`/${taskId}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
};

// Toggle task completion status
export const toggleTaskCompletion = async (taskId) => {
    try {
        const response = await taskApi.patch(`/${taskId}/toggle-completion`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
};