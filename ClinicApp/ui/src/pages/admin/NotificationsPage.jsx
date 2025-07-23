import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/api/v1/admin/notifications');
                setNotifications(response.data);
            } catch (err) {
                setError('Failed to load notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/v1/admin/notifications/${id}/read`);
            setNotifications(notifications.map(notif =>
                notif._id === id ? { ...notif, read: true } : notif
            ));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };


    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">System Notifications</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {notifications.map((notification) => (
                            <tr
                                key={notification._id}
                                className={notification.read ? 'bg-white' : 'bg-blue-50'}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                    {notification.type}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{notification.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(notification.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.read
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {notification.read ? 'Read' : 'Unread'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {notifications.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No notifications available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;