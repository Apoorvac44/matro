import React, { useEffect, useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MainLayout = () => {
    const { pathname } = useLocation();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Only hide navbar on profile pages if we want that custom full-screen feel, 
    // but the user wants "similar to all other pages" so let's check Explore.
    const hideNavbar = pathname.startsWith('/profile/');
    const showBottomNav = user && (pathname === '/' || pathname === '/explore' || pathname === '/dashboard' || pathname.startsWith('/chat/'));

    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavbar && <Navbar />}
            <main className={`flex-grow ${!hideNavbar ? 'pt-16 md:pt-20' : ''} ${showBottomNav ? 'pb-16 md:pb-0' : ''}`}>
                <Outlet />
            </main>
            {showBottomNav && <BottomNav />}
            <Footer />
        </div>
    );
};

export default MainLayout;
