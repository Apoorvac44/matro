import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FA]/50 text-gray-900 font-sans">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="lg:ml-72 flex flex-col min-h-screen">
                <AdminNavbar setIsSidebarOpen={setIsSidebarOpen} />

                <main className="flex-1 p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>

            {/* Background Accents */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#800020]/5 rounded-full blur-[120px] -mr-48 -mt-48 z-[-1]"></div>
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[100px] -ml-24 -mb-24 z-[-1]"></div>
        </div>
    );
};

export default AdminLayout;
