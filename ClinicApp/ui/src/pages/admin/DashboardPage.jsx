import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/v1/admin/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Failed to load stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                    to="/admin/doctors"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Manage Doctors</h2>
                    <p className="text-gray-500">Add, edit, or deactivate doctors</p>
                </Link>

                <Link
                    to="/admin/specialties"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Manage Specialties</h2>
                    <p className="text-gray-500">Add or remove medical specialties</p>
                </Link>

                <Link
                    to="/admin/reports"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">View Reports</h2>
                    <p className="text-gray-500">Appointment analytics and insights</p>
                </Link>

                <Link
                    to="/admin/notifications"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Notifications</h2>
                    <p className="text-gray-500">System alerts and reminders</p>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium">Active Doctors</p>
                        <p className="text-2xl font-bold">
                            {loading ? '...' : stats?.activeDoctors || 0}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 font-medium">Today's Appointments</p>
                        <p className="text-2xl font-bold">
                            {loading ? '...' : stats?.todaysAppointments || 0}
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-yellow-800 font-medium">Pending Notifications</p>
                        <p className="text-2xl font-bold">
                            {loading ? '...' : stats?.pendingNotifications || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;