import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Filter, User, MoreVertical, Check, X, Clock, Shield, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Interests = () => {
    const [activeTab, setActiveTab] = useState('received_all');
    const [interests, setInterests] = useState({ received: [], sent: [] });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const [receivedRes, sentRes] = await Promise.all([
                    api.getInterestsReceived(),
                    api.getInterestsSent()
                ]);

                setInterests({
                    received: receivedRes.data,
                    sent: sentRes.data
                });
            } catch (err) {
                console.error('Error fetching interests:', err);
            }
            setLoading(false);
        };
        fetchInterests();
    }, []);

    const sidebarItems = [
        { id: 'Interests Received', type: 'header' },
        { id: 'received_all', label: 'All', count: interests.received.length, type: 'item' },
        { id: 'received_pending', label: 'Pending', count: interests.received.filter(i => i.status === 'pending').length, type: 'item' },
        { id: 'received_accepted', label: 'Accepted / replied', count: interests.received.filter(i => i.status === 'accepted').length, type: 'item' },
        { id: 'received_declined', label: 'Declined', count: interests.received.filter(i => i.status === 'declined').length, type: 'item' },
        { id: 'Interests Sent', type: 'header', className: 'mt-8' },
        { id: 'sent_all', label: 'All', count: interests.sent.length, type: 'item' },
        { id: 'sent_pending', label: 'Pending', count: interests.sent.filter(i => i.status === 'pending').length, type: 'item' },
        { id: 'sent_accepted', label: 'Accepted / replied', count: interests.sent.filter(i => i.status === 'accepted').length, type: 'item' },
        { id: 'sent_declined', label: 'Declined', count: interests.sent.filter(i => i.status === 'declined').length, type: 'item' },
    ];

    const getFilteredInterests = () => {
        const [category, sub] = activeTab.split('_');
        const list = category === 'received' ? interests.received : interests.sent;
        if (sub === 'all') return list;
        return list.filter(i => i.status === sub);
    };

    const filteredList = getFilteredInterests();

    return (
        <div className="min-h-screen bg-white">
            <div className="flex max-w-[1440px] mx-auto min-h-screen pt-4 md:pt-14">
                {/* Sidebar - Desktop only */}
                <div className="w-72 border-r border-gray-100 p-8 hidden md:block overflow-y-auto shrink-0">
                    {sidebarItems.map((item, idx) => (
                        item.type === 'header' ? (
                            <h3 key={idx} className={`text-sm font-black text-gray-900 uppercase tracking-widest mb-4 ${item.className || ''}`}>
                                {item.id}
                            </h3>
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest mb-1 ${activeTab === item.id ? 'bg-red-50 text-[#800020] shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span>{item.label}</span>
                                {item.count > 0 && <span className="text-[10px] opacity-70">({item.count})</span>}
                            </button>
                        )
                    ))}
                </div>

                {/* Mobile Tab Pills */}
                <div className="block md:hidden fixed top-16 left-0 w-full z-20 bg-white border-b border-gray-100 px-4 pt-2 pb-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'received_all', label: `Received (${interests.received.length})` },
                            { id: 'received_pending', label: 'Pending' },
                            { id: 'received_accepted', label: 'Accepted' },
                            { id: 'sent_all', label: `Sent (${interests.sent.length})` },
                            { id: 'sent_pending', label: 'Sent Pending' },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-50/30 p-4 md:p-8 overflow-y-auto mt-16 md:mt-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                    {activeTab.includes('received') ? 'All interests received' : 'All interests sent'}
                                    <span className="text-gray-400 font-bold">({filteredList.length})</span>
                                </h1>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Interests and responses from members</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse" />)}
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                    <Heart size={40} />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">No interests found</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 px-4 max-w-sm">When someone expresses interest in your profile, it will appear here.</p>
                                <Link to="/explore" className="mt-8 px-8 py-3.5 bg-[#800020] text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#600318] transition-all shadow-xl shadow-[#800020]/10">
                                    Start Browsing
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredList.map((interest) => (
                                    <InterestCard
                                        key={interest._id}
                                        interest={interest}
                                        type={activeTab.includes('received') ? 'received' : 'sent'}
                                        onStatusUpdate={async (id, status) => {
                                            try {
                                                await api.updateInterestStatus(id, status);
                                                // Update local state
                                                setInterests(prev => ({
                                                    ...prev,
                                                    received: prev.received.map(i => i._id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i),
                                                    sent: prev.sent.map(i => i._id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i)
                                                }));
                                            } catch (err) {
                                                console.error('Failed to update status:', err);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InterestCard = ({ interest, type, onStatusUpdate }) => {
    const profile = interest.sender || interest.receiver || {};
    // if (!profile.name) return null; // Only hide if absolutely no data

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative group"
        >
            <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
                {/* Photo Area */}
                <div className="md:w-64 shrink-0">
                    <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-gray-100 relative shadow-inner">
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                <User size={48} className="text-gray-200" />
                                <button className="text-[9px] font-black text-[#800020] uppercase tracking-widest border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors bg-white shadow-sm">
                                    Request photo
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-black text-gray-900 group-hover:text-[#800020] transition-colors">{profile.name}</h2>
                                {profile.membership !== 'p1' && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-[#800020]/5 text-[#800020] text-[8px] font-black uppercase tracking-widest rounded-full">
                                        <Shield size={10} className="fill-[#800020]/10" /> Paid Member
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>{profile._id?.slice(-8).toUpperCase() || 'MTR-521753'}</span>
                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                <span className="flex items-center gap-1.5"><Clock size={10} /> Last seen {interest.updatedAt ? new Date(interest.updatedAt).toLocaleDateString() : 'a week ago'}</span>
                            </div>
                        </div>
                        <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 mb-8">
                        <InfoItem label="Age / Height" value={`${profile.age} Yrs • ${profile.height || "5'4\""}`} />
                        <InfoItem label="Profession" value={profile.profession || 'Software Professional'} />
                        <InfoItem label="Education" value={profile.education || 'B.E'} />
                        <InfoItem label="Location" value={profile.location || 'Bengaluru/ Bangalore'} />
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em]">
                            {interest.status === 'pending' ? (
                                <span className="text-orange-500">Wait for response</span>
                            ) : interest.status === 'accepted' ? (
                                <span className="text-green-600 flex items-center gap-2">You accepted interest <Check size={12} /></span>
                            ) : (
                                <span className="text-gray-400">You declined interest • {new Date(interest.updatedAt).toLocaleDateString()}</span>
                            )}
                        </div>

                        {type === 'received' && interest.status === 'pending' && (
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => onStatusUpdate(interest._id, 'accepted')}
                                    className="flex-1 sm:flex-none px-8 py-3 bg-[#F06262] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#F06262]/20 hover:bg-[#e05252] transition-all active:scale-95 flex items-center justify-center gap-2 leading-none"
                                >
                                    <Heart size={14} className="fill-white" /> Accept Interest
                                </button>
                                <button
                                    onClick={() => onStatusUpdate(interest._id, 'declined')}
                                    className="flex-1 sm:flex-none px-8 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2 leading-none"
                                >
                                    <X size={14} /> Decline
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-xs font-bold text-gray-600 tracking-tight leading-none">{value}</p>
    </div>
);

export default Interests;
