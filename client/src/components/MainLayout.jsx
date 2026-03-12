import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const hideNavbar = pathname === '/explore' || pathname.startsWith('/profile/');

    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavbar && <Navbar />}
            <main className={`flex-grow ${!hideNavbar ? 'pt-16 md:pt-20' : ''}`}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
