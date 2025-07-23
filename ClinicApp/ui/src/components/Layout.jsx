import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-6">
                {children || <Outlet />}
            </main>

            <footer className="bg-gray-800 text-white py-4 text-center">
                Online Medical Appointments - ClinicApp © 2025
            </footer>
        </div>
    );
};

export default Layout;