import React, { useState, useEffect, useRef } from 'react';
import * as api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    User,
    CheckCircle,
    MoreVertical,
    Check,
    X,
    AlertTriangle,
    Mail,
    Calendar,
    Eye,
    Trash2,
    Ban,
    Shield,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Heart
} from 'lucide-react';
import { createPortal } from 'react-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [activeMenu, setActiveMenu] = useState(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const [selectedUser, setSelectedUser] = useState(null);
    const [toast, setToast] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        if (!activeMenu) return;
        const timer = setTimeout(() => {
            const handler = (e) => {
                if (menuRef.current && menuRef.current.contains(e.target)) return;
                setActiveMenu(null);
            };
            document.addEventListener('click', handler, true);
            return () => document.removeEventListener('click', handler, true);
        }, 50);
        return () => clearTimeout(timer);
    }, [activeMenu]);

    // Auto-hide toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.getAdminUsers();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleToggleApproval = async (id) => {
        try {
            const { data } = await api.toggleApproval(id);
            setUsers(users.map(u => u._id === id ? { ...u, isApproved: data.isApproved } : u));
            showToast(data.isApproved ? 'User approved successfully!' : 'User approval revoked.');
        } catch (err) {
            console.error(err);
        }
    };

    const openMenu = (userId, e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPos({
            top: rect.bottom + 8,
            left: Math.min(rect.right - 208, window.innerWidth - 220),
        });
        setActiveMenu(prev => prev === userId ? null : userId);
    };

    const handleViewProfile = (id) => {
        const user = users.find(u => u._id === id);
        setSelectedUser(user);
        setActiveMenu(null);
    };

    const handleBlockUser = (id) => {
        const user = users.find(u => u._id === id);
        const newBlocked = !user?.isBlocked;
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: newBlocked } : u));
        setActiveMenu(null);
        showToast(newBlocked ? `${user.name} has been blocked.` : `${user.name} has been unblocked.`);
    };

    const handleMakeAdmin = (id) => {
        const user = users.find(u => u._id === id);
        const newAdmin = !user?.isAdmin;
        setUsers(users.map(u => u._id === id ? { ...u, isAdmin: newAdmin } : u));
        setActiveMenu(null);
        showToast(newAdmin ? `${user.name} is now an admin.` : `Admin access removed from ${user.name}.`);
    };

    const handleDeleteUser = (id) => {
        const user = users.find(u => u._id === id);
        if (!window.confirm(`Are you sure you want to permanently delete ${user?.name}? This cannot be undone.`)) return;
        setUsers(users.filter(u => u._id !== id));
        setActiveMenu(null);
        showToast(`${user?.name} has been deleted.`, 'error');
    };

    const filteredUsers = users.filter(user => {
        const name = user?.name || '';
        const email = user?.email || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'approved' && user?.isApproved) ||
            (filterStatus === 'pending' && !user?.isApproved);
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-[#800020]"
            >
                <User size={48} />
            </motion.div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-[99999] px-8 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#800020] text-[#D4AF37]'}`}
                    >
                        <CheckCircle size={18} /> {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <p className="text-[#800020] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Administrative</p>
                    <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tighter italic">User Directory</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-12 pr-6 py-3 bg-white border border-[#800020]/5 rounded-2xl outline-none focus:border-[#800020]/30 shadow-sm w-full md:w-80 font-bold text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl border border-[#800020]/5 shadow-sm">
                        {['all', 'approved', 'pending'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status
                                    ? 'bg-[#800020] text-[#D4AF37] shadow-lg shadow-[#800020]/20'
                                    : 'text-gray-400 hover:text-[#800020]'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[3rem] shadow-xl shadow-[#800020]/5 border border-[#800020]/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA]/50 border-b border-[#800020]/5 text-[#800020] uppercase tracking-[0.2em] text-[9px] font-black">
                                <th className="px-8 py-6">Identity</th>
                                <th className="px-8 py-6">Engagement</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#800020]/5 text-sm">
                            <AnimatePresence>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-[#FFFDD0]/20 transition-all group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                                                    {user.profilePicture ? (
                                                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#800020]/20">
                                                            <User size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-serif font-bold text-gray-900 italic text-base leading-tight">{user.name}</h4>
                                                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-1">
                                                        <Mail size={10} /> {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="font-bold text-gray-700 text-xs">{user.profession || 'N/A'}</p>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                                                    <Calendar size={10} /> Joined {new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.isApproved ? (
                                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                    <CheckCircle size={12} /> Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                    <AlertTriangle size={12} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleViewProfile(user._id); }}
                                                    className="p-2.5 bg-[#800020] text-white hover:bg-[#600318] rounded-xl transition-all shadow-lg active:scale-95 border border-[#800020]/20"
                                                    title="View Detailed Profile"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleToggleApproval(user._id); }}
                                                    className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${user.isApproved
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-100'
                                                        }`}
                                                    title={user.isApproved ? 'Revoke Approval' : 'Approve User'}
                                                >
                                                    {user.isApproved ? <X size={18} /> : <Check size={18} />}
                                                </button>

                                                <button
                                                    onClick={(e) => openMenu(user._id, e)}
                                                    className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${activeMenu === user._id ? 'bg-[#800020] text-[#D4AF37]' : 'bg-gray-50 text-gray-400 hover:bg-[#800020] hover:text-[#D4AF37] border border-gray-100'}`}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                            <Search size={32} />
                        </div>
                        <p className="text-gray-400 font-bold italic">No soul seekers found matching your criteria...</p>
                    </div>
                )}
            </div>

            {/* Dropdown Menu Portal */}
            {activeMenu && createPortal(
                <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 200000 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <div
                            onClick={() => handleViewProfile(activeMenu)}
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-[#FFFDD0]/50 hover:text-[#800020] transition-all cursor-pointer"
                        >
                            <Eye size={16} className="text-[#D4AF37]" /> View Profile
                        </div>
                        <div
                            onClick={() => handleBlockUser(activeMenu)}
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-[#FFFDD0]/50 hover:text-[#800020] transition-all cursor-pointer"
                        >
                            <Ban size={16} className="text-[#D4AF37]" /> {users.find(u => u._id === activeMenu)?.isBlocked ? 'Unblock User' : 'Block User'}
                        </div>
                        <div
                            onClick={() => handleMakeAdmin(activeMenu)}
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-[#FFFDD0]/50 hover:text-[#800020] transition-all cursor-pointer"
                        >
                            <Shield size={16} className="text-[#D4AF37]" /> {users.find(u => u._id === activeMenu)?.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </div>
                        <div className="border-t border-gray-50"></div>
                        <div
                            onClick={() => handleDeleteUser(activeMenu)}
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        >
                            <Trash2 size={16} /> Delete User
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}

            {/* View Profile Modal - Comprehensive Registration Data */}
            {createPortal(
                <AnimatePresence>
                    {selectedUser && (
                        <motion.div
                            key="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[999999] flex items-center justify-center p-4 md:p-10"
                            onClick={() => setSelectedUser(null)}
                        >
                            <motion.div
                                key="modal-content"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-[#D4AF37]/20"
                            >
                                {/* Modal Header */}
                                <div className="bg-gradient-to-br from-[#800020] via-[#4a0404] to-[#2a0101] p-10 relative shrink-0">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="absolute top-6 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50 cursor-pointer"
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="relative inline-block">
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-white/10 border-4 border-[#D4AF37]/40 overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                                {selectedUser?.profilePicture ? (
                                                    <img src={selectedUser.profilePicture} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/30">
                                                        <User size={50} />
                                                    </div>
                                                )}
                                            </div>
                                            {selectedUser?.isAdmin && (
                                                <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-[#800020] p-2 rounded-xl shadow-lg border-2 border-[#800020]">
                                                    <Shield size={16} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <h2 className="text-4xl font-serif font-black text-white italic tracking-tight">{selectedUser?.name}</h2>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Mail size={14} className="text-[#D4AF37]" />
                                                <p className="text-[#D4AF37] text-sm font-bold">{selectedUser?.email}</p>
                                            </div>

                                            <div className="flex gap-3 mt-4">
                                                {selectedUser?.isApproved ? (
                                                    <span className="px-5 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">Approved Profile</span>
                                                ) : (
                                                    <span className="px-5 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">Awaiting Review</span>
                                                )}
                                                {selectedUser?.isBlocked && (
                                                    <span className="px-5 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">Blocked Access</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Content - Scrollable */}
                                <div className="overflow-y-auto flex-1 p-10 scrollbar-hide">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                                        {/* Section: Personal Identity */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-3 border-b border-[#800020]/10">
                                                <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center text-[#800020]">
                                                    <User size={20} />
                                                </div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#800020]">Personal Identity</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <DetailItem label="Date of Birth" value={selectedUser?.dob} icon={<Calendar size={14} />} />
                                                <DetailItem label="Age" value={`${selectedUser?.age || 'N/A'} Years`} />
                                                <DetailItem label="Gender" value={selectedUser?.gender} />
                                                <DetailItem label="Marital Status" value={selectedUser?.maritalStatus || 'Single'} />
                                                <DetailItem label="Height" value={selectedUser?.height || 'N/A'} />
                                                <DetailItem label="Mobile" value={selectedUser?.mobile || 'N/A'} icon={<Phone size={14} />} />
                                            </div>
                                        </section>

                                        {/* Section: Professional Context */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-3 border-b border-[#800020]/10">
                                                <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center text-[#800020]">
                                                    <Briefcase size={20} />
                                                </div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#800020]">Professional Path</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <DetailItem label="Highest Education" value={selectedUser?.education} icon={<GraduationCap size={14} />} />
                                                <DetailItem label="Profession" value={selectedUser?.profession} />
                                                <DetailItem label="Annual Income" value={selectedUser?.income || 'Not disclosed'} />
                                                <DetailItem label="Work Location" value={selectedUser?.workLocation || selectedUser?.location} icon={<MapPin size={14} />} />
                                            </div>
                                        </section>

                                        {/* Section: Cultural & Background */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-3 border-b border-[#800020]/10">
                                                <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center text-[#800020]">
                                                    <Shield size={20} />
                                                </div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#800020]">Roots & Beliefs</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <DetailItem label="Mother Tongue" value={selectedUser?.motherTongue || 'N/A'} />
                                                <DetailItem label="Resident Location" value={selectedUser?.location} icon={<MapPin size={14} />} />
                                            </div>
                                        </section>

                                        {/* Section: Partner Preferences */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-3 border-b border-[#800020]/10">
                                                <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center text-[#800020]">
                                                    <Heart size={20} />
                                                </div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#800020]">Vision for Partner</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <DetailItem label="Preferred Age Range" value={
                                                    selectedUser?.prefAgeMin && selectedUser?.prefAgeMax
                                                        ? `${selectedUser.prefAgeMin} – ${selectedUser.prefAgeMax} Years`
                                                        : selectedUser?.prefAgeMin
                                                            ? `${selectedUser.prefAgeMin}+ Years`
                                                            : 'Any'
                                                } />
                                                <DetailItem label="Preferred Location" value={selectedUser?.prefLocation || 'Flexible'} />
                                                <DetailItem label="Preferred Education" value={selectedUser?.prefEducation || 'Any'} />
                                                <DetailItem label="Preferred Profession" value={selectedUser?.prefProfession || 'Any'} />
                                                <DetailItem label="Profile Created By" value={selectedUser?.profileCreatedBy || 'Self'} />
                                                <DetailItem label="Membership Plan" value={selectedUser?.membership || 'Free'} />
                                            </div>
                                        </section>

                                        {/* Section: Verification Documents */}
                                        <section className="space-y-6 md:col-span-2">
                                            <div className="flex items-center gap-3 pb-3 border-b border-[#800020]/10">
                                                <div className="w-10 h-10 bg-[#FFFDD0] rounded-xl flex items-center justify-center text-[#800020]">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#800020]">Verification Documents</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <DocumentItem
                                                    label="Aadhar Card"
                                                    status={selectedUser?.aadharCard ? "Uploaded" : "Pending"}
                                                    imageUrl={selectedUser?.aadharCard}
                                                />
                                                <DocumentItem
                                                    label="Caste Certificate"
                                                    status={selectedUser?.casteCertificate ? "Uploaded" : "Pending"}
                                                    imageUrl={selectedUser?.casteCertificate}
                                                />
                                            </div>
                                        </section>

                                        {/* Section: About Me */}
                                        <section className="space-y-6 md:col-span-2">
                                            <div className="flex justify-between items-center pb-3 border-b border-[#800020]/10">
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#800020]">In Their Own Words</h3>
                                            </div>
                                            <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-[#800020]/5 italic font-serif text-gray-600 leading-relaxed">
                                                "{selectedUser?.aboutMe || "No detailed introduction provided by the seeker."}"
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Modal Footer - Actions */}
                                <div className="p-8 bg-gray-50/80 backdrop-blur-sm border-t border-[#800020]/5 shrink-0 flex gap-4">
                                    <button
                                        onClick={() => { handleToggleApproval(selectedUser?._id); setSelectedUser(null); }}
                                        className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl ${selectedUser?.isApproved
                                            ? 'bg-white text-red-600 border-2 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600'
                                            : 'bg-[#800020] text-[#D4AF37] hover:bg-[#600318] shadow-[#800020]/20'}`}
                                    >
                                        {selectedUser?.isApproved ? 'Revoke Approval' : 'Approve Global Visibility'}
                                    </button>
                                    <button
                                        onClick={() => { handleBlockUser(selectedUser?._id); setSelectedUser(null); }}
                                        className="px-8 py-4 rounded-2xl bg-white text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] border-2 border-gray-100 hover:border-[#800020] hover:text-[#800020] transition-all active:scale-95 shadow-lg"
                                    >
                                        {selectedUser?.isBlocked ? 'Unblock' : 'Block User'}
                                    </button>
                                    <button
                                        onClick={() => { handleDeleteUser(selectedUser?._id); setSelectedUser(null); }}
                                        className="px-8 py-4 rounded-2xl bg-white text-red-500 font-black text-[10px] uppercase tracking-[0.3em] border-2 border-red-50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95 shadow-lg"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

// Helper Components for the Modal
const DetailItem = ({ label, value, icon }) => (
    <div className="space-y-1.5 group">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#800020] transition-colors flex items-center gap-2">
            {icon} {label}
        </p>
        <p className="text-sm font-bold text-gray-800 tracking-tight leading-snug">{value || 'Not Disclosed'}</p>
    </div>
);

const DocumentItem = ({ label, status, imageUrl }) => {
    const [showFull, setShowFull] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[#800020]/5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${imageUrl ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                        {imageUrl ? <CheckCircle size={18} /> : <X size={18} />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#800020]">{label}</p>
                        <p className="text-[9px] font-bold text-gray-400">Government ID Verification</p>
                    </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${imageUrl ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {status}
                </span>
            </div>

            {imageUrl && (
                <div className="relative group cursor-zoom-in" onClick={() => setShowFull(true)}>
                    <div className="w-full h-40 rounded-3xl overflow-hidden border-2 border-[#800020]/5 shadow-inner">
                        <img src={imageUrl} alt={label} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye size={24} />
                        </div>
                    </div>
                </div>
            )}

            {showFull && createPortal(
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/90 z-[999999] flex items-center justify-center p-10"
                    onClick={() => setShowFull(false)}
                >
                    <button className="absolute top-10 right-10 text-white p-4 hover:bg-white/10 rounded-full">
                        <X size={32} />
                    </button>
                    <img src={imageUrl} alt={label} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-white/10" />
                </motion.div>,
                document.body
            )}
        </div>
    );
};

export default UserManagement;
