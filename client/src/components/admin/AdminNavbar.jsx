import React from 'react';
import { Menu, Bell, User, LogOut, Search } from 'lucide-react';

const AdminNavbar = ({ setIsSidebarOpen }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#800020]/5 sticky top-0 z-30 px-6 lg:px-10">
            <div className="h-full flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 hover:bg-[#FFFDD0]/50 rounded-xl transition-colors text-gray-600"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:flex items-center gap-3 bg-[#F8F9FA] px-4 py-2.5 rounded-2xl border border-gray-100 group focus-within:border-[#800020]/30 transition-all">
                        <Search size={18} className="text-gray-400 group-focus-within:text-[#800020]" />
                        <input
                            type="text"
                            placeholder="Search command center..."
                            className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 placeholder:text-gray-400 w-64"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 lg:gap-6">
                    <button className="relative p-2.5 hover:bg-[#FFFDD0]/50 rounded-2xl transition-all text-gray-600 group">
                        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#800020] rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-10 w-px bg-gray-100 hidden sm:block"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-[#800020] uppercase tracking-[0.2em]">Super Admin</p>
                            <p className="text-sm font-serif font-bold text-gray-900 italic">Admin User</p>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-[#FFFDD0] border border-[#D4AF37]/20 flex items-center justify-center text-[#800020] shadow-sm hover:shadow-md transition-all overflow-hidden group">
                            <User size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
