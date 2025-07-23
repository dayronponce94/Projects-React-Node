import React, { useState, useEffect, useContext } from 'react';
import { addDays } from 'date-fns';
import { getDoctorAppointments, updateAppointmentStatus } from '../services/appointmentService';
import DoctorAppointmentCard from '../components/appointments/DoctorAppointmentCard';
import Spinner from '../components/common/Spinner';
import AuthContext from '../context/AuthContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { toZonedTime, format } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';


const DoctorSchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const zonedSelectedDate = toZonedTime(selectedDate, 'UTC');
    const formattedSelectedDate = format(zonedSelectedDate, "EEEE, MMMM d, yyyy", {
        timeZone: 'UTC',
        locale: enUS
    });



    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user || user.role !== 'doctor') return;

            setLoading(true);
            setError('');

            try {
                const data = await getDoctorAppointments(selectedDate);
                setAppointments(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [selectedDate, user]);

    const openConfirmationModal = (appointmentId, status) => {
        setCurrentAppointment(appointmentId);
        setNewStatus(status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentAppointment(null);
        setNewStatus('');
    };

    const handleStatusChange = async () => {
        if (!currentAppointment || !newStatus) return;

        try {
            await updateAppointmentStatus(currentAppointment, newStatus);

            setAppointments(appointments.map(app =>
                app._id === currentAppointment ? { ...app, status: newStatus } : app
            ));

            setSuccess('Successfully updated status');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err);
        } finally {
            closeModal();
        }
    };

    const changeDate = (days) => {
        setSelectedDate(addDays(selectedDate, days));
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleStatusChange}
                title="Confirm status change"
                message={`Are you sure you want to change the status to "${newStatus === 'confirmed' ? 'Confirmed' : 'Cancelled'}"?`}
            />
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    My Medical Schedule
                </h1>
                <p className="text-gray-600">
                    Here you can manage your scheduled appointments
                </p>
            </div>

            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => changeDate(-1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                    &larr; Previous
                </button>

                <h2 className="text-xl font-semibold text-gray-800">
                    {formattedSelectedDate}
                </h2>

                <button
                    onClick={() => changeDate(1)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                    Next &rarr;
                </button>
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

            {loading ? (
                <Spinner />
            ) : appointments.length === 0 ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="text-blue-700">
                        You have no appointments scheduled for this day.
                    </p>
                </div>
            ) : (
                <div>
                    {appointments.map(appointment => (
                        <DoctorAppointmentCard
                            key={appointment._id}
                            appointment={appointment}
                            onStatusChange={openConfirmationModal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedulePage;