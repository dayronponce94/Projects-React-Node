import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-indigo-600">
                                ClinicApp
                            </Link>
                        </div>

                        {user && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {user && user.role === 'patient' && (
                                    <>
                                        <Link
                                            to="/doctors"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            Find Doctors
                                        </Link>
                                        <Link
                                            to="/my-appointments"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            My Appointments
                                        </Link>
                                    </>
                                )}

                                {user.role === 'doctor' && (
                                    <Link
                                        to="/doctor-schedule"
                                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        My Schedule
                                    </Link>
                                )}

                                {user.role === 'admin' && (
                                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                        <Link
                                            to="/admin"
                                            className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                )}
                                <Link
                                    to="/profile"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    My Profile
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {user && (
                            <div className="flex items-center">
                                <span className="text-gray-700 mr-4 hidden md:block">
                                    Hello, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;