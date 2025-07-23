import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';

const ReportsPage = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('daily');
    const [error, setError] = useState('');

    const formatUTCDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "MMM dd, yyyy", { timeZone: 'UTC' });
    };

    const fetchReports = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/api/v1/admin/reports', {
                params: { period }
            });
            setReports(response.data);
        } catch (err) {
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [period]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Appointment Reports</h1>

                <div className="flex items-center">
                    <label className="mr-3 text-sm font-medium text-gray-700">Period:</label>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <p>Loading reports...</p>
            ) : reports ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {period.charAt(0).toUpperCase() + period.slice(1)} Report
                    </h2>

                    <div className="mb-6">
                        <p className="text-gray-600">
                            <span className="font-medium">Date Range:</span>  {formatUTCDate(reports.startDate)} - {formatUTCDate(reports.endDate)}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Total Appointments:</span> {reports.appointments.reduce((acc, curr) => acc + curr.count, 0)}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.appointments.map((report, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.doctor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.specialty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.confirmed}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.cancelled}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>No reports available</p>
            )}
        </div>
    );
};

export default ReportsPage;