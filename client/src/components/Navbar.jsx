import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, User, MessageSquare, Compass, Home, Menu, X, Shield, LogOut, Users, Bell, Search, ChevronDown, ChevronRight, Settings, HelpCircle, Trophy, Star, Sparkles, BookOpen, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
    const dropdownRef = React.useRef(null);

    // Close dropdown on click outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const publicLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Login', path: '/login', icon: <User size={18} /> },
        { name: 'Register', path: '/register', icon: <Heart size={18} /> },
    ];

    const privateLinks = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Matches', path: '/explore', icon: <Users size={20} /> },
        { name: 'Interests', path: '/interests', icon: <Heart size={20} /> },
        { name: 'Messages', path: '/chat/inbox', icon: <MessageSquare size={20} /> },
        { name: 'Profile', path: '/dashboard', icon: <User size={20} /> },
        { name: 'Notification', path: '/notifications', icon: <Bell size={20} />, iconOnly: true },
    ];

    const navLinks = user ? privateLinks : publicLinks;

    return (
        <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_-5px_rgba(128,0,32,0.1)] border-b border-[#800020]/5">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-[#800020] p-2.5 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-[#800020]/20">
                        <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={20} />
                    </div>
                    <span className="text-2xl font-serif font-bold italic bg-clip-text text-transparent bg-gradient-to-r from-[#800020] to-[#D4AF37]">Milana</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] transition-all hover:text-[#D4AF37] ${location.pathname === link.path ? 'text-[#800020]' : 'text-[#800020]/60'}`}
                        >
                            <span className={`transition-colors ${location.pathname === link.path ? 'text-[#D4AF37]' : 'text-[#D4AF37]/60'}`}>
                                {link.icon}
                            </span>
                            {!link.iconOnly && link.name}
                        </Link>
                    ))}

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

                <div className="flex items-center gap-3 sm:gap-4">
                    {user && (
                        <>
                            {/* Mobile Notification Bell */}
                            <Link to="/notifications" className="md:hidden p-2 text-[#800020] hover:bg-[#800020]/10 rounded-xl transition-colors relative">
                                <Bell size={24} />
                                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                            </Link>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center gap-2 group transition-all"
                                >
                                    {/* Mobile Settings Symbol */}
                                    <div className="md:hidden flex items-center justify-center p-2 text-[#800020] hover:bg-[#800020]/10 rounded-xl transition-colors">
                                        <Settings size={24} />
                                    </div>

                                    {/* Desktop Profile Avatar */}
                                    <div className="hidden md:block w-10 h-10 rounded-full overflow-hidden border-2 border-[#800020]/20 group-hover:border-[#D4AF37] transition-all bg-white shadow-sm shrink-0">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                                                <User size={20} className="fill-current opacity-20 absolute" />
                                                <User size={20} className="relative z-10" />
                                            </div>
                                        )}
                                    </div>
                                    <ChevronDown size={16} className={`text-[#800020] hidden md:block shrink-0 group-hover:text-[#D4AF37] transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showProfileDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute top-full -right-2 md:right-0 mt-4 w-[calc(100vw-32px)] sm:w-80 max-w-[360px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[#800020]/10 overflow-hidden z-[110]"
                                        >
                                            {/* User Info Header */}
                                            <div className="p-5 pb-2 text-center">
                                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{user.name}</h3>
                                                <div className="flex items-center justify-center gap-1.5 mt-1 text-[#D4AF37]">
                                                    <div className="bg-[#800020] p-1 rounded-full"><Heart size={8} className="fill-[#D4AF37]" /></div>
                                                    <span className="text-[10px] font-bold text-gray-500 tracking-wide">Community Matrimony</span>
                                                </div>
                                                <p className="text-[10px] font-black text-gray-900 mt-2 tracking-widest uppercase">ID: {user._id?.slice(-8).toUpperCase() || 'MTR521753'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Free member</p>
                                            </div>

                                            {/* Upgrade Banner */}
                                            <div className="mx-6 mb-4 p-3 bg-gradient-to-br from-[#FFFDD0] to-[#FFF8E7] rounded-3xl border border-[#D4AF37]/10 relative overflow-hidden text-center">
                                                <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12"><Star size={60} /></div>
                                                <h4 className="text-[11px] font-black text-[#800020] leading-tight mb-3 px-4">Upgrade membership to call/chat with matches</h4>
                                                <Link
                                                    to="/edit-profile?tab=Photos"
                                                    onClick={() => setShowProfileDropdown(false)}
                                                    className="inline-block px-6 py-2 bg-[#F06262] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#e05252] transition-colors shadow-lg shadow-[#F06262]/20"
                                                >
                                                    Upgrade now
                                                </Link>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="px-2 pb-1 space-y-0.5 max-h-[280px] overflow-y-auto custom-scrollbar">
                                                <DropdownLink to="/dashboard" icon={<Home size={16} />} label="Profile" />
                                                <DropdownLink to="/edit-preferences" icon={<Settings size={16} />} label="Edit Preferences" />
                                                <DropdownLink to="/horoscope" icon={<Sparkles size={16} />} label="View/Edit Horoscope" />

                                                <div className="px-5 py-2">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Support & feedback</p>
                                                    <div className="space-y-1">
                                                        <DropdownItem
                                                            icon={<Settings size={16} />}
                                                            label="Settings"
                                                            hasChevron
                                                            onClick={() => { navigate('/settings'); setShowProfileDropdown(false); }}
                                                        />
                                                        <DropdownItem
                                                            icon={<HelpCircle size={16} />}
                                                            label="Help"
                                                            hasChevron
                                                            onClick={() => { navigate('/help'); setShowProfileDropdown(false); }}
                                                        />
                                                        <DropdownItem
                                                            icon={<Trophy size={16} />}
                                                            label="Success Stories"
                                                            onClick={() => { navigate('/success-stories'); setShowProfileDropdown(false); }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-gray-50 bg-gray-50/50">
                                                <button
                                                    onClick={() => { logout(); setShowProfileDropdown(false); navigate('/login'); }}
                                                    className="w-full h-12 px-6 flex items-center justify-between text-gray-500 hover:text-[#800020] transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:text-red-500 transition-all">
                                                            <LogOut size={14} />
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
};

const DropdownLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="w-full h-12 px-6 flex items-center gap-3 text-gray-500 hover:text-[#800020] hover:bg-[#800020]/5 transition-all group"
    >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow transition-all text-[#800020]/40 group-hover:text-[#800020]">
            {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </Link>
);

const DropdownItem = ({ icon, label, hasChevron, onClick }) => (
    <div
        onClick={onClick}
        className="w-full h-12 flex items-center justify-between text-gray-500 hover:text-[#800020] cursor-pointer group transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow transition-all text-[#800020]/40 group-hover:text-[#800020]">
                {icon}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {hasChevron && <ChevronRight size={14} className="text-gray-300 group-hover:text-[#D4AF37] transition-colors" />}
    </div>
);

export default Navbar;
