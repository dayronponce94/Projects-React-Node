import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { getAvailableSlots, bookAppointment } from '../../services/appointmentService';
import Spinner from '../common/Spinner';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingCalendar = ({ doctorId }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [success, setSuccess] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dates = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

    useEffect(() => {
        const fetchSlots = async () => {
            if (!doctorId) return;

            setLoading(true);
            setError('');
            setSlots([]);
            setSelectedSlot(null);

            try {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const data = await getAvailableSlots(doctorId, formattedDate);
                setSlots(data);
            } catch (err) {
                setError(err.message || 'Error loading available slots');
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [doctorId, selectedDate]);

    const handleBookAppointment = async () => {
        if (!selectedSlot || !user) return;

        setLoading(true);
        setError('');

        try {
            const appointmentData = {
                doctorId,
                date: selectedDate.toISOString(),
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime
            };

            const result = await bookAppointment(appointmentData);

            if (result) {
                setSuccess('Appointment booked successfully!');
                setTimeout(() => {
                    navigate('/my-appointments');
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'Error booking appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Date & Time</h3>

            {/* Date selector */}
            <div className="flex overflow-x-auto pb-4 mb-6 -mx-2 px-2">
                {dates.map((date) => (
                    <button
                        key={date.toString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center p-3 mx-1 rounded-lg min-w-[70px] ${isSameDay(date, selectedDate)
                            ? 'bg-indigo-100 border-2 border-indigo-500'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <span className="text-sm font-medium">
                            {format(date, 'EEE')}
                        </span>
                        <span className="text-lg font-bold">
                            {format(date, 'd')}
                        </span>
                        <span className="text-xs text-gray-500">
                            {format(date, 'MMM')}
                        </span>
                    </button>
                ))}
            </div>

            {/* Available slots */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Available Times for {format(selectedDate, 'PPPP', { timeZone: 'UTC' })}
                </h4>

                {loading && <Spinner />}

                {!loading && error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!loading && success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <p className="text-green-700">{success}</p>
                    </div>
                )}

                {!loading && slots.length === 0 && !error && (
                    <p className="text-gray-600">No available time slots for this date</p>
                )}

                {!loading && slots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {slots.map((slot) => (
                            <button
                                key={slot.startTime}
                                onClick={() => slot.available && setSelectedSlot(slot)}
                                disabled={!slot.available}
                                className={`p-3 rounded-lg text-center transition-all ${selectedSlot?.startTime === slot.startTime
                                    ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                    : slot.available
                                        ? 'bg-gray-100 hover:bg-gray-200'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                {slot.startTime}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking button */}
            <button
                onClick={handleBookAppointment}
                disabled={!selectedSlot || loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${selectedSlot && !loading
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {loading
                    ? 'Booking...'
                    : selectedSlot
                        ? `Book Appointment at ${selectedSlot.startTime}`
                        : 'Select a time slot'}
            </button>
        </div>
    );
};

export default BookingCalendar;