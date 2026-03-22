import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, User, MessageSquare, Compass, Home, Menu, X, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(false);

    const publicLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Login', path: '/login', icon: <User size={18} /> },
        { name: 'Register', path: '/register', icon: <Heart size={18} /> },
    ];

    const privateLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Matches', path: '/explore', icon: <Heart size={18} /> },
        { name: 'Chat', path: '/chat/inbox', icon: <MessageSquare size={18} /> },
        { name: 'Profile', path: '/dashboard', icon: <User size={18} /> },
    ];

    const navLinks = user ? privateLinks : publicLinks;

    return (
        <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_-5px_rgba(128,0,32,0.1)] border-b border-[#800020]/5">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 group">
                    <div className="bg-[#800020] p-2.5 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-[#800020]/20">
                        <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={20} />
                    </div>
                    <span className="text-2xl font-serif font-bold italic bg-clip-text text-transparent bg-gradient-to-r from-[#800020] to-[#D4AF37]">Milana</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        if (link.name === 'Profile' && user) {
                            return (
                                <div key={link.name} className="relative group/dropdown">
                                    <Link
                                        to={link.path}
                                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-[#D4AF37] ${location.pathname === link.path ? 'text-[#800020]' : 'text-[#800020]/60'}`}
                                    >
                                        <span className={`transition-colors ${location.pathname === link.path ? 'text-[#D4AF37]' : 'text-[#D4AF37]/60'}`}>
                                            {link.icon}
                                        </span>
                                        {link.name}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 translate-y-2 group-hover/dropdown:translate-y-0 z-[110]">
                                        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(128,0,32,0.2)] border border-[#800020]/5 overflow-hidden min-w-[200px] backdrop-blur-xl bg-white/95">
                                            <Link
                                                to="/edit-profile"
                                                className="flex items-center gap-3 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#800020]/60 hover:text-[#800020] hover:bg-[#800020]/5 transition-all border-b border-[#800020]/5"
                                            >
                                                <User size={14} className="text-[#D4AF37]" />
                                                Edit Profile
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#800020]/60 hover:text-[#800020] hover:bg-[#800020]/5 transition-all text-left"
                                            >
                                                <LogOut size={14} className="text-[#D4AF37]" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-[#D4AF37] ${location.pathname === link.path ? 'text-[#800020]' : 'text-[#800020]/60'}`}
                            >
                                <span className={`transition-colors ${location.pathname === link.path ? 'text-[#D4AF37]' : 'text-[#D4AF37]/60'}`}>
                                    {link.icon}
                                </span>
                                {link.name}
                            </Link>
                        );
                    })}
                    {user?.isAdmin && (
                        <Link
                            to="/admin"
                            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-[#D4AF37] ${location.pathname.startsWith('/admin') ? 'text-[#800020]' : 'text-[#800020]/60'}`}
                        >
                            <span className={`transition-colors ${location.pathname.startsWith('/admin') ? 'text-[#D4AF37]' : 'text-[#D4AF37]/60'}`}>
                                <Shield size={18} />
                            </span>
                            Admin
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-[#800020] hover:text-[#D4AF37] transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-[#800020]/5 overflow-hidden"
                    >
                        <div className="px-8 py-10 flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-5 text-xl font-serif italic transition-all group ${location.pathname === link.path
                                        ? 'text-[#800020]'
                                        : 'text-gray-500 hover:text-[#800020]'
                                        }`}
                                >
                                    <span className={`p-4 rounded-2xl shadow-sm transition-all duration-300 ${location.pathname === link.path
                                        ? 'bg-[#800020] text-[#D4AF37] shadow-[#800020]/20 scale-110'
                                        : 'bg-gray-50 text-gray-400 group-hover:bg-[#800020]/5 group-hover:text-[#800020] group-hover:scale-105'
                                        }`}>
                                        {React.cloneElement(link.icon, { size: 28 })}
                                    </span>
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                                        {link.name}
                                    </span>
                                </Link>
                            ))}

                            {user && (
                                <>
                                    <Link
                                        to="/edit-profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-5 text-xl font-serif italic text-gray-500 hover:text-[#800020] transition-all group"
                                    >
                                        <span className="p-4 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-[#800020]/5 group-hover:text-[#800020] group-hover:scale-105 transition-all duration-300 shadow-sm">
                                            <User size={28} />
                                        </span>
                                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                                            Edit Profile
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-5 text-xl font-serif italic text-gray-500 hover:text-[#800020] transition-all group text-left"
                                    >
                                        <span className="p-4 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-[#800020]/5 group-hover:text-[#800020] group-hover:scale-105 transition-all duration-300 shadow-sm">
                                            <LogOut size={28} />
                                        </span>
                                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                                            Logout
                                        </span>
                                    </button>
                                </>
                            )}

                            {user?.isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-5 text-xl font-serif italic transition-all group ${location.pathname.startsWith('/admin')
                                        ? 'text-[#800020]'
                                        : 'text-gray-500 hover:text-[#800020]'
                                        }`}
                                >
                                    <span className={`p-4 rounded-2xl shadow-sm transition-all duration-300 ${location.pathname.startsWith('/admin')
                                        ? 'bg-[#800020] text-[#D4AF37] shadow-[#800020]/20 scale-110'
                                        : 'bg-gray-50 text-gray-400 group-hover:bg-[#800020]/5 group-hover:text-[#800020] group-hover:scale-105'
                                        }`}>
                                        <Shield size={28} />
                                    </span>
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                                        Admin
                                    </span>
                                </Link>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
