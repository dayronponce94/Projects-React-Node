import React, { useState, useEffect } from 'react';
import { getSpecialties } from '../../services/specialtyService';
import Spinner from '../common/Spinner';

const RegisterForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        specialty: '',
        adminSecret: ''
    });
    const [specialties, setSpecialties] = useState([]);
    const [loadingSpecialties, setLoadingSpecialties] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (formData.role === 'doctor') {
            setLoadingSpecialties(true);
            getSpecialties()
                .then(data => {
                    setSpecialties(data);
                    setLoadingSpecialties(false);
                })
                .catch(err => {
                    setError('Failed to load specialties');
                    setLoadingSpecialties(false);
                });
        }
    }, [formData.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I am a
                </label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {formData.role === 'doctor' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Specialty
                    </label>
                    {loadingSpecialties ? (
                        <Spinner small={true} />
                    ) : (
                        <select
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            required={formData.role === 'doctor'}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">Select a specialty</option>
                            {specialties.map(spec => (
                                <option key={spec._id} value={spec.name}>
                                    {spec.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {formData.role === 'admin' && (
                <div>
                    <label htmlFor="adminSecret" className="block text-sm font-medium text-gray-700">
                        Admin Secret Code
                    </label>
                    <input
                        type="password"
                        id="adminSecret"
                        name="adminSecret"
                        value={formData.adminSecret}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default RegisterForm;