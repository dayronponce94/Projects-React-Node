import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/admin/DashboardPage';
import DoctorsPage from './pages/admin/DoctorsPage';
import SpecialtiesPage from './pages/admin/SpecialtiesPage';
import ReportsPage from './pages/admin/ReportsPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import BookAppointmentPage from './pages/BookAppointmentPage'
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DoctorList from './components/appointments/DoctorList';
import AvailabilityPage from './pages/admin/AvailabilityPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/register" replace />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/doctors" element={<DoctorList />} />
                        <Route path="/book-appointment/:doctorId" element={<BookAppointmentPage />} />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-appointments"
                            element={
                                <ProtectedRoute>
                                    <MyAppointmentsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/doctor-schedule"
                            element={
                                <ProtectedRoute allowedRoles={['doctor']}>
                                    <DoctorSchedulePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/doctors"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <DoctorsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/specialties"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <SpecialtiesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/reports"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ReportsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/notifications"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <NotificationsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/admin/doctors/:id/availability" element={<AvailabilityPage />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
}

export default App;