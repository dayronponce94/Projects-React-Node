
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getSpecialties } from '../../services/specialtyService';
import Spinner from '../../components/common/Spinner';
const EditDoctorModal = ({ doctorId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(true);
    const [specialties, setSpecialties] = useState([]);
    const [loadingSpecialties, setLoadingSpecialties] = useState(true);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const data = await getSpecialties();
                setSpecialties(data);
            } catch (err) {
                console.error('Failed to load specialties', err);
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialties();
    }, []);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get(`/api/v1/admin/doctors/${doctorId}`);
                setFormData(res.data);
            } catch (err) {
                console.error('Failed to load doctor', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [doctorId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/v1/admin/doctors/${doctorId}`, formData);
            onSave(formData);
        } catch (err) {
            console.error('Failed to update doctor', err);
        }
    };

    if (loading || loadingSpecialties) return <Spinner />;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4">Edit Doctor</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <input
                            name="phone"
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Specialty</label>
                        <select
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Select a specialty</option>
                            {specialties.map((spec) => (
                                <option key={spec._id} value={spec.name}>
                                    {spec.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDoctorModal;
