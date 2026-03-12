import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, MessageSquare, User } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={22} /> },
        { name: 'Matches', path: '/explore', icon: <Heart size={22} /> },
        { name: 'Chat', path: '/chat/inbox', icon: <MessageSquare size={22} /> },
        { name: 'Profile', path: '/dashboard', icon: <User size={22} /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-[100] md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            {navLinks.map((link) => {
                const isActive = location.pathname === link.path ||
                    (link.path === '/chat/inbox' && location.pathname.startsWith('/chat/'));

                return (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#800020]' : 'text-gray-400'
                            }`}
                    >
                        <div className="relative">
                            {link.icon}
                            {link.name === 'Chat' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                            )}
                        </div>
                        <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {link.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
