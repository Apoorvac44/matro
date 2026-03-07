import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Check,
    Settings2,
    DollarSign,
    Clock,
    Zap,
    ShieldCheck,
    X
} from 'lucide-react';

const MembershipManagement = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        duration: '',
        features: '',
        color: '#800020'
    });

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

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                price: plan.price,
                duration: plan.duration,
                features: plan.features.join('\n'),
                color: plan.color || '#800020'
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                price: 0,
                duration: '',
                features: '',
                color: '#800020'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const planData = {
            ...formData,
            features: formData.features.split('\n').filter(f => f.trim() !== '')
        };

        try {
            if (editingPlan) {
                await api.updateMembershipPlan(editingPlan._id, planData);
            } else {
                await api.createMembershipPlan(planData);
            }
            fetchPlans();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await api.deleteMembershipPlan(id);
                fetchPlans();
            } catch (err) {
                console.error(err);
            }
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

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-8 py-4 bg-[#800020] text-[#D4AF37] rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#800020]/20 hover:scale-105 active:scale-95 transition-all"
                >
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
                            <button
                                onClick={() => handleOpenModal(plan)}
                                className="flex-1 py-4.5 bg-[#F8F9FA] text-[#800020] rounded-2xl flex items-center justify-center hover:bg-[#FFFDD0] transition-colors active:scale-95"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(plan._id)}
                                className="flex-1 py-4.5 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all active:scale-95"
                            >
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

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-serif font-black italic">{editingPlan ? 'Refine Plan' : 'Forge New Plan'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#800020]">Plan Name</label>
                                        <input
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-[#800020]/20 transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#800020]">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-[#800020]/20 transition-all"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#800020]">Duration (e.g., 3 Months)</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-[#800020]/20 transition-all"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#800020]">Features (One per line)</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-[#800020]/20 transition-all min-h-[120px]"
                                        value={formData.features}
                                        onChange={e => setFormData({ ...formData, features: e.target.value })}
                                    />
                                </div>

                                <button className="w-full py-5 bg-[#800020] text-[#D4AF37] rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#800020]/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    {editingPlan ? 'Update Plan' : 'Forge Plan'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
