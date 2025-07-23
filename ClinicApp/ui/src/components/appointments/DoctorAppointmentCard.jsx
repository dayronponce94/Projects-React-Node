import React from 'react';

const DoctorAppointmentCard = ({ appointment, onStatusChange }) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800'
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">
                        {appointment.patient.name}
                    </h3>

                    <div className="mt-2">
                        <p className="text-gray-600">
                            <span className="font-semibold">Hour: </span>
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Contact: </span>
                            {appointment.patient.phone || appointment.patient.email}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                        {appointment.status === 'pending' && 'Pending'}
                        {appointment.status === 'confirmed' && 'Confirmed'}
                        {appointment.status === 'cancelled' && 'Cancelled'}
                        {appointment.status === 'completed' && 'Completed'}
                    </span>

                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={() => onStatusChange(appointment._id, 'confirmed')}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => onStatusChange(appointment._id, 'cancelled')}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {appointment.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{appointment.notes}</p>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointmentCard;