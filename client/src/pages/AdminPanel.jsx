import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { motion } from 'framer-motion';
import { Shield, Check, X, User, Filter, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchUsers();
    }, []);

    const handleApproval = async (id) => {
        try {
            const { data } = await api.toggleApproval(id);
            setUsers(users.map(u => u._id === id ? { ...u, isApproved: data.isApproved } : u));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#FFFDD0]/20">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
            <Shield size={48} className="text-[#800020]" />
        </motion.div>
    </div>;

    return (
        <div className="min-h-screen py-32 px-6 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#800020]/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[100px] -ml-24 -mb-24"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20 px-4">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-[#800020] rounded-[32px] flex items-center justify-center text-white shadow-2xl border-4 border-white rotate-6 hover:rotate-0 transition-all duration-500">
                            <Shield size={32} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[#800020] font-black uppercase tracking-[0.4em] text-[10px]">Community Management</p>
                            <h1 className="text-6xl font-serif font-black text-gray-900 tracking-tighter italic">Command Center</h1>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-[#800020]/5 border border-[#800020]/5 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#800020]"></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#F8F9FA]/30 border-b border-[#800020]/5 text-[#800020] uppercase tracking-[0.2em] text-[9px] font-black">
                                    <th className="px-10 py-8">Manifested Essence</th>
                                    <th className="px-10 py-8">Ethereal Portal</th>
                                    <th className="px-10 py-8">Alignment</th>
                                    <th className="px-10 py-8 text-right">Moderation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#800020]/5">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-[#FFFDD0]/20 transition-all duration-300 group">
                                        <td className="px-10 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[24px] bg-[#F8F9FA] flex items-center justify-center text-[#800020]/20 overflow-hidden border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                                                    {user.profilePicture ? (
                                                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={24} className="text-[#D4AF37]/30" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg font-serif font-bold text-gray-900 tracking-tight italic">{user.name}</span>
                                                        {user.isAdmin && (
                                                            <span className="px-3 py-1 bg-[#800020] text-[#D4AF37] text-[7px] font-black uppercase rounded-lg tracking-[0.2em] shadow-lg">Architect</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">{new Date(user.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10 text-xs font-bold text-gray-400 italic">{user.email}</td>
                                        <td className="px-10 py-10">
                                            {user.isApproved ? (
                                                <span className="inline-flex items-center gap-2 px-6 py-2 bg-[#800020] text-[#D4AF37] rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-xl">
                                                    <CheckCircle size={14} /> Harmonized
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-6 py-2 bg-[#F8F9FA] text-[#800020] rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-[#D4AF37]/20 shadow-md">
                                                    <AlertCircle size={14} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-10 py-10 text-right">
                                            {!user.isAdmin && (
                                                <button
                                                    onClick={() => handleApproval(user._id)}
                                                    className={`px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${user.isApproved
                                                        ? 'bg-white text-[#800020] hover:bg-[#800020] hover:text-white border border-[#800020]/5'
                                                        : 'bg-[#800020] text-[#D4AF37] hover:bg-[#600318]'
                                                        }`}
                                                >
                                                    {user.isApproved ? 'Dissolve' : 'Approve'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )).reverse()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
