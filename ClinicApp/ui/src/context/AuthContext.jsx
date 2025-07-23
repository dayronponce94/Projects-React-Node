import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user is logged in on initial load
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/api/v1/auth/me');

                    if (response.data && response.data.data) {
                        setUser(response.data.data);
                    } else {
                        console.error('Invalid user data:', response.data);
                        logout();
                    }
                }
            } catch (err) {
                console.error('Authentication check failed', err);
                logout();
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    // Login user
    const login = async (formData) => {
        try {
            const response = await api.post('/api/v1/auth/login', formData);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                const userResponse = await api.get('/api/v1/auth/me');
                const user = userResponse.data.data;
                setUser(user);

                setTimeout(() => {
                    let redirectPath = '/profile';

                    if (user.role === 'admin') {
                        redirectPath = '/admin';
                    } else if (user.role === 'doctor') {
                        redirectPath = '/doctor-schedule';
                    } else if (user.role === 'patient') {
                        redirectPath = '/my-appointments';
                    }

                    navigate(redirectPath);
                }, 100);

                return { success: true };
            } else {
                return { success: false, error: response.data.error };
            }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Login failed'
            };
        }
    };


    // Register user
    const register = async (formData) => {
        try {
            const response = await api.post('/api/v1/auth/register', formData);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                const userResponse = await api.get('/api/v1/auth/me');
                const user = userResponse.data.data;
                setUser(user);

                setTimeout(() => {
                    let redirectPath = '/profile';

                    if (user.role === 'admin') {
                        redirectPath = '/admin';
                    } else if (user.role === 'doctor') {
                        redirectPath = '/doctor-schedule';
                    } else if (user.role === 'patient') {
                        redirectPath = '/my-appointments';
                    }

                    navigate(redirectPath);
                }, 100);

                return { success: true };
            } else {
                return { success: false, error: response.data.error };
            }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Registration failed'
            };
        }
    };


    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };


    // Update user profile
    const updateProfile = async (formData) => {
        try {
            const response = await api.put('/api/v1/auth/updatedetails', formData);

            setUser(prevUser => ({
                ...prevUser,
                ...response.data.data,
                phone: response.data.data.phone
            }));

            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Update failed' };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                updateProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;