import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Filter, User, MoreVertical, Check, X, Clock, Shield, Search, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Interests = () => {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState('received'); // 'received' or 'sent'
    const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'pending', 'accepted', 'declined'
    const [interests, setInterests] = useState({ received: [], sent: [], shortlisted: [] });
    const [loading, setLoading] = useState(true);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'Recently';
            return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return 'Recently';
        }
    };

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const [receivedRes, sentRes, shortlistedRes] = await Promise.all([
                    api.getInterestsReceived(),
                    api.getInterestsSent(),
                    api.getShortlistedProfiles()
                ]);

                const rData = receivedRes?.data || (Array.isArray(receivedRes) ? receivedRes : []);
                const sData = sentRes?.data || (Array.isArray(sentRes) ? sentRes : []);
                const shResData = shortlistedRes?.data || (Array.isArray(shortlistedRes) ? shortlistedRes : []);
                const shData = Array.isArray(shResData) ? shResData : [];

                setInterests({
                    received: Array.isArray(rData) ? rData : [],
                    sent: Array.isArray(sData) ? sData : [],
                    shortlisted: shData.map(p => ({
                        _id: `short_${p?._id || p?.id}`,
                        status: 'shortlisted',
                        updatedAt: new Date().toISOString(),
                        receiver: p 
                    }))
                });
            } catch (err) {
                console.error('Error fetching interests:', err);
            }
            setLoading(false);
        };
        fetchInterests();
    }, []);

    const getFilteredList = () => {
        if (viewType === 'shortlisted') return interests.shortlisted;
        
        const list = viewType === 'received' ? interests.received : interests.sent;
        let filtered = list;
        if (statusFilter !== 'All') {
            const status = statusFilter === 'Accepted / Replied' ? 'accepted' : statusFilter.toLowerCase();
            filtered = list.filter(i => {
                if (statusFilter === 'Accepted / Replied') return i.status === 'accepted' || i.status === 'replied';
                return i.status === status;
            });
        }
        return filtered;
    };

    const filteredList = getFilteredList();

    const tabs = [
        { id: 'received', label: 'Received', count: interests.received.length },
        { id: 'sent', label: 'Sent', count: interests.sent.length },
        { id: 'shortlisted', label: 'Shortlisted', count: interests.shortlisted.length }
    ];

    const pills = [
        { id: 'All', label: 'All', count: viewType === 'shortlisted' ? interests.shortlisted.length : (viewType === 'received' ? interests.received.length : interests.sent.length) },
        { id: 'pending', label: 'Pending', count: (viewType === 'received' ? interests.received : interests.sent).filter(i => i.status === 'pending').length },
        { id: 'accepted', label: 'Accepted', count: (viewType === 'received' ? interests.received : interests.sent).filter(i => (i.status === 'accepted' || i.status === 'replied')).length },
        { id: 'declined', label: 'Declined', count: (viewType === 'received' ? interests.received : interests.sent).filter(i => i.status === 'declined').length },
    ];

    if (viewType === 'shortlisted') {
        pills.splice(1, 4); // Only show 'All' for shortlisted
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header Fixed Nav */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-xl mx-auto flex flex-col">
                    <div className="flex items-center gap-4 px-4 py-4">
                        <button onClick={() => navigate(-1)} className="text-gray-900 p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase">Interests & Lists</h1>
                    </div>

                    {/* Main Tabs */}
                    <div className="flex px-2 border-b border-gray-50">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setViewType(tab.id); setStatusFilter('All'); }}
                                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${viewType === tab.id ? 'text-[#800020]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span>{tab.label}</span>
                                    <span className={`text-[9px] ${viewType === tab.id ? 'text-[#800020]/60' : 'text-gray-400'}`}>{tab.count}</span>
                                </div>
                                {viewType === tab.id && (
                                    <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#800020] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Filter Pills */}
                    <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar bg-gray-50/50">
                        {pills.map(pill => (
                            <button
                                key={pill.id}
                                onClick={() => setStatusFilter(pill.id)}
                                className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${statusFilter === pill.id 
                                    ? 'bg-[#800020] border-[#800020] text-white shadow-md shadow-[#800020]/20' 
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}`}
                            >
                                {pill.label} {pill.count > 0 && `(${pill.count})`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">
                            {viewType === 'received' ? `All interests received (${filteredList.length})` : `Interests that were ${statusFilter.toLowerCase()} (${filteredList.length})`}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-1 border-l-2 border-[#800020]/20 ml-0.5">Interests and responses from members</p>
                    </div>

                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-56 bg-gray-50 rounded-[2rem] animate-pulse border border-gray-100" />)}
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8 border border-gray-50 shadow-inner">
                            <Heart size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">Nothing to show</h3>
                        <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">No interests found in this category yet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredList.map((interest) => (
                            <InterestCard
                                key={interest._id}
                                interest={interest}
                                type={viewType}
                                formatDate={formatDate}
                                sentInterests={interests.sent}
                                onStatusUpdate={async (id, status) => {
                                    try {
                                        await api.updateInterestStatus(id, status);
                                        setInterests(prev => ({
                                            ...prev,
                                            received: prev.received.map(i => i._id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i),
                                            sent: prev.sent.map(i => i._id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i)
                                        }));
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const InterestCard = ({ interest, type, onStatusUpdate, formatDate, sentInterests = [] }) => {
    const profile = interest?.sender || interest?.receiver || {};
    const navigate = useNavigate();
    const [sending, setSending] = useState(false);
    const [localSent, setLocalSent] = useState(false);

    if (!interest) return null;

    const isAccepted = interest.status === 'accepted' || interest.status === 'replied';
    const isDeclined = interest.status === 'declined';
    const isPending = interest.status === 'pending';
    const isShortlisted = interest.status === 'shortlisted';

    const isAlreadySent = sentInterests.some(s => s.receiverId === profile._id || s.receiver?._id === profile._id);
    const hasSent = isAlreadySent || localSent;

    const handleSendInterest = async () => {
        setSending(true);
        try {
            await api.sendInterest(profile._id, 'pending');
            setLocalSent(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
        >
            <div className="p-6">
                <div className="flex gap-6">
                    {/* Photo Container */}
                    <div 
                        onClick={() => navigate(`/profile/${profile._id}`)}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-[1.5rem] overflow-hidden bg-gray-50 border-2 border-white shadow-md shrink-0 cursor-pointer relative group/img"
                    >
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                <User size={48} />
                            </div>
                        )}
                    </div>

                    {/* Simple Content Info */}
                    <div className="flex-1 min-w-0 flex flex-col pt-1">
                        <div className="flex justify-between items-start">
                            <div className="min-w-0">
                                <h3 className="text-[17px] font-black text-gray-900 group-hover:text-[#800020] transition-colors truncate leading-tight">
                                    {profile.name}
                                </h3>
                                {(!profile.membership || profile.membership !== 'p1') && (
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="w-4 h-4 bg-[#800020]/10 rounded-full flex items-center justify-center">
                                            <Shield size={10} className="fill-[#800020] text-[#800020]" />
                                        </div>
                                        <span className="text-[9px] font-black text-[#800020] uppercase tracking-widest">Paid Member</span>
                                    </div>
                                )}
                            </div>
                            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        
                        <div className="mt-4 space-y-1">
                            <p className="text-[12px] font-bold text-gray-600 leading-none">
                                {profile.age} Yrs • {profile.height || "5'4\""} • {profile.education || "B.E"} • {profile.profession || "Software Professional"}
                            </p>
                            <p className="text-[11px] font-semibold text-gray-400 leading-tight">
                                {profile.location || "Bengaluru/ Bangalore"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Status & Actions Footer */}
                <div className="mt-6 pt-5 border-t border-gray-50 flex flex-col gap-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                        {isShortlisted ? (
                            <span className="text-[#800020] font-black">Shortlisted Profile • {formatDate(interest.updatedAt)}</span>
                        ) : isDeclined ? (
                            <span className="text-gray-400 italic">You declined her interest • {formatDate(interest.updatedAt)}</span>
                        ) : isAccepted ? (
                            <span className="text-gray-900">You accepted her Interest • {formatDate(interest.updatedAt)}</span>
                        ) : (
                            <span className="text-[#800020] font-black animate-pulse">Interest pending • {formatDate(interest.updatedAt)}</span>
                        )}
                    </div>

                    {/* Contextual Action Buttons */}
                    <div className="flex gap-3">
                        {isShortlisted ? (
                             hasSent ? (
                                <button className="w-full py-4 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center justify-center gap-2 cursor-default transition-all">
                                    <Check size={16} strokeWidth={3} /> Interest Sent
                                </button>
                             ) : (
                                <button
                                    onClick={handleSendInterest}
                                    disabled={sending}
                                    className="w-full py-4 bg-[#800020] text-[#D4AF37] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                                >
                                    {sending ? <span className="w-4 h-4 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></span> : <Heart size={18} className="fill-[#D4AF37]" />} 
                                    {sending ? 'Sending...' : 'Send Interest'}
                                </button>
                             )
                        ) : (isDeclined || (isPending && type === 'received')) ? (
                            <button
                                onClick={() => onStatusUpdate(interest._id, 'accepted')}
                                className="w-full py-4 bg-[#800020] text-[#D4AF37] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Heart size={18} className="fill-[#D4AF37]" /> Accept Interest
                            </button>
                        ) : isAccepted ? (
                            <div className="w-full py-4 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center justify-center gap-2 cursor-default transition-all">
                                <CheckCircle size={16} /> Interest Accepted
                            </div>
                        ) : (
                            // Sent Pending
                            <div className="w-full py-4 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center italic">
                                Waiting for Response...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Interests;
