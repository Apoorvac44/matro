import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Activity,
    BarChart3,
    Settings,
    X,
    ShieldCheck
} from 'lucide-react';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: CreditCard, label: 'Membership', path: '/admin/membership' },
        { icon: Activity, label: 'Activity', path: '/admin/activity' },
        { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-[#800020]/10 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-8 flex items-center justify-between border-b border-[#800020]/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#800020] rounded-xl flex items-center justify-center text-[#D4AF37]">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-serif font-black text-gray-900 italic tracking-tight">Milana</h2>
                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#800020]">Admin Portal</p>
                            </div>
                        </div>
                        <button
                            className="lg:hidden text-gray-500 hover:text-[#800020] transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group
                  ${isActive
                                        ? 'bg-[#800020] text-[#D4AF37] shadow-lg shadow-[#800020]/20'
                                        : 'text-gray-500 hover:bg-[#FFFDD0]/50 hover:text-[#800020]'}
                `}
                            >
                                <item.icon size={20} className="transition-transform group-hover:scale-110" />
                                <span className="tracking-tight">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer Section */}
                    <div className="p-6 border-t border-[#800020]/5">
                        <div className="bg-[#FFFDD0]/30 rounded-2xl p-4 border border-[#D4AF37]/10 text-center">
                            <p className="text-[9px] font-black text-[#800020] uppercase tracking-[0.2em]">Logged in as</p>
                            <p className="text-sm font-serif font-bold text-gray-900 italic">System Architect</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
