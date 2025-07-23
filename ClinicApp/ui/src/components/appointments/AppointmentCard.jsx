import React from 'react';
import { toZonedTime, format } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';


const AppointmentCard = ({ appointment, onCancel }) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800'
    };

    const utcDate = new Date(appointment.date);
    const zoned = toZonedTime(utcDate, 'UTC');

    const formatted = format(zoned, "EEEE, MMMM d, yyyy", {
        timeZone: 'UTC',
        locale: enUS
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-5 mb-4 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">
                        {appointment.doctor.name} - {appointment.doctor.specialty}
                    </h3>

                    <div className="mt-2">
                        <p className="text-gray-600">
                            <span className="font-semibold">Date: </span>
                            {formatted}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Hour: </span>
                            {appointment.startTime} - {appointment.endTime}
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

                    {['pending', 'confirmed'].includes(appointment.status) && (
                        <button
                            onClick={() => onCancel(appointment._id)}
                            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                        >
                            Cancel
                        </button>
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

export default AppointmentCard;
