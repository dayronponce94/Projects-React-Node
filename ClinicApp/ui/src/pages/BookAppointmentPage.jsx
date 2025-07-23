import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoctorAvailability } from '../services/appointmentService';
import { getUserById } from '../services/userService';
import BookingCalendar from '../components/appointments/BookingCalendar';
import Spinner from '../components/common/Spinner';

const BookAppointmentPage = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctor = async () => {
            try {

                const doctorData = await getUserById(doctorId);

                if (doctorData.role !== 'doctor') {
                    throw new Error('User is not a doctor');
                }

                setDoctor(doctorData);
                await getDoctorAvailability(doctorId);
            } catch (err) {
                setError(err.message || 'Error loading doctor information');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24" />

                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
                        <p className="text-indigo-600 font-medium text-lg">{doctor.specialty}</p>
                        <p className="text-gray-600 mt-2">{doctor.email}</p>
                        {doctor.phone && (
                            <p className="text-gray-600">{doctor.phone}</p>
                        )}
                    </div>
                </div>
            </div>

            <BookingCalendar doctorId={doctorId} />
        </div>
    );
};

export default BookAppointmentPage;