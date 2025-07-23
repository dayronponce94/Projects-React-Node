import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSpecialties } from '../services/specialtyService';
import Spinner from '../components/common/Spinner';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: ''
    });
    const [specialties, setSpecialties] = useState([]);
    const [loadingSpecialties, setLoadingSpecialties] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchSpecialties = async () => {
            if (user?.role === 'doctor') {
                setLoadingSpecialties(true);
                try {
                    const data = await getSpecialties();
                    setSpecialties(data);
                } catch (err) {
                    console.error('Failed to load specialties', err);
                } finally {
                    setLoadingSpecialties(false);
                }
            }
        };

        fetchSpecialties();

        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                specialty: user.specialty || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await updateProfile(formData);

            if (result.success) {
                setSuccess('Profile updated successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || 'Update failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                        <p className="text-green-700">{success}</p>
                    </div>
                )}

                <div className="md:flex md:items-start">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                            <p className="text-indigo-600">
                                {user.role === 'doctor'
                                    ? user.specialty
                                    : user.role === 'admin'
                                        ? 'Administrator'
                                        : 'Patient'}
                            </p>
                            <p className="text-gray-600 mt-2">{user.email}</p>
                            {user.phone && <p className="text-gray-600">{user.phone}</p>}
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
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
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {user.role === 'doctor' && (
                                    <div>
                                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                                            Specialty
                                        </label>
                                        {loadingSpecialties ? (
                                            <Spinner small={true} />
                                        ) : (
                                            <select
                                                id="specialty"
                                                name="specialty"
                                                value={formData.specialty}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;