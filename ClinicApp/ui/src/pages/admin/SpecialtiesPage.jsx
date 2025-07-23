import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import EditSpecialtyModal from './EditSpecialtyModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';


const SpecialtiesPage = () => {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);


    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await api.get('/api/v1/admin/specialties');
                setSpecialties(response.data);
            } catch (err) {
                setError('Failed to load specialties');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, []);

    const handleCreateSpecialty = async (e) => {
        e.preventDefault();
        if (!newSpecialty.trim()) return;

        try {
            const response = await api.post('/api/v1/admin/specialties', {
                name: newSpecialty,
                description: newDescription
            });

            setSpecialties([...specialties, response.data]);
            setNewSpecialty('');
            setNewDescription('');
        } catch (err) {
            setError('Failed to create specialty');
        }
    };

    const handleEditSpecialty = (specialty) => {
        setSelectedSpecialty(specialty);
        setShowEditModal(true);
    };

    const handleSaveSpecialty = async (updatedSpecialty) => {
        try {
            const response = await api.put(`/api/v1/admin/specialties/${updatedSpecialty._id}`, updatedSpecialty);
            const updatedList = specialties.map(s =>
                s._id === response.data._id ? response.data : s
            );
            setSpecialties(updatedList);
            setShowEditModal(false);
        } catch (err) {
            setError('Failed to update specialty');
        }
    };


    const confirmDeleteSpecialty = (specialty) => {
        setSelectedSpecialty(specialty);
        setShowDeleteModal(true);
    };


    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <p>Loading specialties...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Specialties</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Specialty</h2>
                    <form onSubmit={handleCreateSpecialty}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialty Name
                            </label>
                            <input
                                type="text"
                                value={newSpecialty}
                                onChange={(e) => setNewSpecialty(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description (Optional)
                            </label>
                            <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows="3"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                        >
                            Add Specialty
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Specialties</h2>
                    {specialties.length === 0 ? (
                        <p className="text-gray-600">No specialties found</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {specialties.map((specialty) => (
                                <li key={specialty._id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-gray-900">{specialty.name}</div>
                                        {specialty.description && (
                                            <div className="text-sm text-gray-500 mt-1">{specialty.description}</div>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditSpecialty(specialty)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => confirmDeleteSpecialty(specialty)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {showEditModal && selectedSpecialty && (
                    <EditSpecialtyModal
                        specialty={selectedSpecialty}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleSaveSpecialty}
                    />
                )}

                <ConfirmationModal
                    isOpen={showDeleteModal && selectedSpecialty !== null}
                    title="Delete Specialty"
                    message={`Are you sure you want to delete the specialty "${selectedSpecialty?.name}"? This action cannot be undone.`}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedSpecialty(null);
                    }}
                    onConfirm={async () => {
                        try {
                            await api.delete(`/api/v1/admin/specialties/${selectedSpecialty._id}`);
                            setSpecialties(specialties.filter(s => s._id !== selectedSpecialty._id));
                        } catch (err) {
                            setError('Failed to delete specialty');
                        } finally {
                            setShowDeleteModal(false);
                            setSelectedSpecialty(null);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default SpecialtiesPage;