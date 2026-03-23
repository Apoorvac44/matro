import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, MessageSquare, User, Search, Bell, LayoutDashboard } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={22} /> },
        { name: 'Explore', path: '/explore', icon: <Heart size={22} /> },
        { name: 'Chat', path: '/chat/inbox', icon: <MessageSquare size={22} /> },
        { name: 'Alerts', path: '/notifications', icon: <Bell size={22} /> },
        { name: 'Profile', path: '/dashboard', icon: <User size={22} /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-2 flex justify-around items-center z-[100] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            {navLinks.map((link) => {
                const isActive = location.pathname === link.path ||
                    (link.path === '/chat/inbox' && location.pathname.startsWith('/chat/')) ||
                    (link.path === '/dashboard' && location.pathname === '/');

                return (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${isActive ? 'text-[#800020] bg-[#800020]/5' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <div className="relative">
                            {link.icon}
                            {link.name === 'Chat' && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                            )}
                        </div>
                        <span className={`text-[9px] font-bold ${isActive ? 'text-[#800020]' : 'opacity-60'}`}>
                            {link.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
