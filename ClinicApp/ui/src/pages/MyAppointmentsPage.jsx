import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatientAppointments, cancelAppointment } from '../services/appointmentService';
import AppointmentCard from '../components/appointments/AppointmentCard';
import Spinner from '../components/common/Spinner';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getPatientAppointments();
                setAppointments(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const openConfirmationModal = (appointmentId) => {
        setAppointmentToCancel(appointmentId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAppointmentToCancel(null);
    };

    const handleCancelAppointment = async () => {
        if (!appointmentToCancel) return;

        try {
            await cancelAppointment(appointmentToCancel);

            setAppointments(appointments.map(app =>
                app._id === appointmentToCancel ? { ...app, status: 'cancelled' } : app
            ));

            setSuccess('Appointment successfully cancelled');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err);
        } finally {
            closeModal();
        }
    };

    const upcomingAppointments = appointments.filter(
        app => ['pending', 'confirmed'].includes(app.status)
    );

    const pastAppointments = appointments.filter(
        app => ['cancelled', 'completed'].includes(app.status)
    );

    if (loading) return <Spinner />;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleCancelAppointment}
                title="Confirm cancellation"
                message="Are you sure you want to cancel this appointment?"
            />
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    My Medical Appointments
                </h1>
                <p className="text-gray-600">
                    Here you can manage all your scheduled appointments
                </p>
            </div>

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

            <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Upcoming Appointments ({upcomingAppointments.length})
                </h2>

                {upcomingAppointments.length === 0 ? (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <p className="text-blue-700">
                            You have no appointments scheduled.
                            <Link to="/doctors" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                                Reserve one now!
                            </Link>
                        </p>
                    </div>
                ) : (
                    upcomingAppointments.map(appointment => (
                        <AppointmentCard
                            key={appointment._id}
                            appointment={appointment}
                            onCancel={openConfirmationModal}
                        />
                    ))
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Appointment History ({pastAppointments.length})
                </h2>

                {pastAppointments.length === 0 ? (
                    <p className="text-gray-600 text-center py-6">
                        You don't have any appointments in your history yet.
                    </p>
                ) : (
                    pastAppointments.map(appointment => (
                        <AppointmentCard
                            key={appointment._id}
                            appointment={appointment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAppointmentsPage;