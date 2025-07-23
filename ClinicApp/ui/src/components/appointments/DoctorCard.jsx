import React from 'react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                    <p className="text-indigo-600 font-medium">{doctor.specialty}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Contact:</span> {doctor.email}
                </p>
                {doctor.phone && (
                    <p className="text-gray-600">
                        <span className="font-semibold">Phone:</span> {doctor.phone}
                    </p>
                )}
            </div>

            <Link
                to={`/book-appointment/${doctor._id}`}
                className="inline-block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-md transition-colors"
            >
                Book Appointment
            </Link>
        </div>
    );
};

export default DoctorCard;