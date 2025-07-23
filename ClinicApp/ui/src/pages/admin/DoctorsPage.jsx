import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import DoctorFormModal from './DoctorFormModal';
import { Pencil, CalendarClock, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import EditDoctorModal from './EditDoctorModal';


const DoctorsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleDeleteDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/v1/admin/doctors/${selectedDoctor._id}`);
            setDoctors(doctors.filter(d => d._id !== selectedDoctor._id));
            setSuccessMessage(`Doctor ${selectedDoctor.name} and all associated data deleted successfully`);
            setTimeout(() => setSuccessMessage(''), 3000);

            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting doctor:', error);
            setError('Failed to delete doctor and associated data');
        }
    };


    const fetchDoctors = async () => {
        try {
            const response = await api.get('/api/v1/users/doctors');
            setDoctors(response.data);
        } catch (err) {
            setError('Failed to load doctors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    const handleEditClick = (id) => {
        setSelectedDoctorId(id);
    };

    const handleModalClose = () => {
        setSelectedDoctorId(null);
    };

    const handleDoctorUpdated = (updatedDoctor) => {
        setSelectedDoctorId(null);
    };


    useEffect(() => {
        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <p>Loading doctors...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                    Add New Doctor
                </button>
            </div>

            {showModal && (
                <DoctorFormModal
                    onClose={() => setShowModal(false)}
                    onDoctorAdded={() => {
                        setShowModal(false);
                        fetchDoctors();
                    }}
                />
            )}

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                    <p className="text-green-700">{successMessage}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {doctors.map((doctor) => (
                            <tr key={doctor._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialty}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {doctor.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 flex items-center">
                                    <button
                                        onClick={() => handleEditClick(doctor._id)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Edit Doctor"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/admin/doctors/${doctor._id}/availability`)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Availability"
                                    >
                                        <CalendarClock size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDoctor(doctor)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete Doctor"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete Dr. ${selectedDoctor?.name}?`}
                    warning="This action will also delete all associated availability and appointments!"
                />
                {selectedDoctorId && (
                    <EditDoctorModal
                        doctorId={selectedDoctorId}
                        onClose={handleModalClose}
                        onSave={(updatedDoctor) => {
                            handleDoctorUpdated(updatedDoctor);
                            fetchDoctors();
                        }}
                    />
                )}

            </div>
        </div>
    );
};

export default DoctorsPage;
