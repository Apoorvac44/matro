import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { motion } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Check,
    Settings2,
    DollarSign,
    Clock,
    Zap,
    ShieldCheck
} from 'lucide-react';

const MembershipManagement = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const { data } = await api.getMembershipPlans();
            setPlans(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center font-bold text-[#800020] italic">Loading Treasury...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <p className="text-[#800020] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Financials</p>
                    <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tighter italic">Membership Plans</h1>
                </div>

                <button className="flex items-center gap-2 px-8 py-4 bg-[#800020] text-[#D4AF37] rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#800020]/20 hover:scale-105 active:scale-95 transition-all">
                    <Plus size={16} /> Forge New Plan
                </button>
            </div>

            {/* Plans Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white rounded-[3rem] border border-[#800020]/5 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                    >
                        {/* Header / Price Section */}
                        <div className="p-8 text-center border-b border-[#800020]/5 relative overflow-hidden">
                            <div
                                className="absolute top-0 left-0 w-full h-1.5"
                                style={{ backgroundColor: plan.color || '#800020' }}
                            ></div>
                            <h3 className="text-xl font-serif font-black text-gray-900 italic mb-4">{plan.name}</h3>
                            <div className="inline-flex items-baseline gap-1">
                                <span className="text-sm font-black text-[#800020]">₹</span>
                                <span className="text-4xl font-serif font-black text-gray-900 italic tracking-tighter">{plan.price.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{plan.duration}</p>
                        </div>

                        {/* Features List */}
                        <div className="p-8 space-y-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#800020]/40">Included Privileges</p>
                            <ul className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs font-bold text-gray-600">
                                        <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-8 pt-0 flex gap-2">
                            <button className="flex-1 py-4.5 bg-[#F8F9FA] text-[#800020] rounded-2xl flex items-center justify-center hover:bg-[#FFFDD0] transition-colors active:scale-95">
                                <Edit2 size={16} />
                            </button>
                            <button className="flex-1 py-4.5 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all active:scale-95">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Premium Badge for High End Plans */}
                        {plan.name === 'Premium' && (
                            <div className="absolute top-4 right-4 text-[#D4AF37]">
                                <ShieldCheck size={20} />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Subscription Stats Mini Card */}
            <div className="bg-[#800020] rounded-[3rem] p-10 text-[#D4AF37] flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center">
                        <Zap size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-black italic">Membership Revenue</h3>
                        <p className="text-xs opacity-70 font-bold max-w-sm">Premium subscriptions increased by 22% this quarter. The Gold plan is currently your most popular mid-tier option.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-8 border-r border-[#D4AF37]/20">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Subs</p>
                        <p className="text-3xl font-serif font-black italic">1,248</p>
                    </div>
                    <div className="text-center px-8">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Monthly ROI</p>
                        <p className="text-3xl font-serif font-black italic">18.5%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipManagement;
