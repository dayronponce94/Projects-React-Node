import React, { useState, useEffect } from 'react';
import { getSpecialties } from '../../services/specialtyService';
import { getDoctorsBySpecialty } from '../../services/appointmentService';
import DoctorCard from './DoctorCard';
import Spinner from '../common/Spinner';

const DoctorList = () => {
    const [specialty, setSpecialty] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSpecialties, setLoadingSpecialties] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const data = await getSpecialties();
                setSpecialties(data);
            } catch (err) {
                setError('Failed to load specialties');
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialties();
    }, []);

    const fetchDoctors = async () => {
        if (!specialty) return;

        setLoading(true);
        setError('');

        try {
            const data = await getDoctorsBySpecialty(specialty);
            setDoctors(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (specialty) {
            fetchDoctors();
        }
    }, [specialty]);


    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find a Doctor</h2>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Specialty
                </label>
                {loadingSpecialties ? (
                    <Spinner small={true} />
                ) : (
                    <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Choose a specialty</option>
                        {specialties.map((spec) => (
                            <option key={spec._id} value={spec.name}>
                                {spec.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <Spinner />
            ) : doctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                </div>
            ) : specialty ? (
                <p className="text-gray-600 text-center py-8">
                    No doctors found for {specialty}
                </p>
            ) : (
                <p className="text-gray-600 text-center py-8">
                    Please select a specialty to find doctors
                </p>
            )}
        </div>
    );
};

export default DoctorList;