import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Heart, MessageSquare, Bell, LogOut, Home, Eye, Send, CheckCheck, Image, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const ProfileThumbnail = ({ profile }) => {
    if (!profile) return null;
    const id = profile._id || profile.id;
    const [imgError, setImgError] = React.useState(false);
    const imgSrc = profile.profilePicture || profile.image;

    return (
        <Link to={`/profile/${id}`} className="w-full group">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 relative shadow-sm border border-[#800020]/5">
                {imgSrc && !imgError ? (
                    <img
                        src={imgSrc}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gradient-to-br from-gray-50 to-[#FFFDD0]">
                        <User size={32} />
                    </div>
                )}
                {/* Elegant Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#800020]/90 via-[#800020]/40 to-transparent p-5 pt-12">
                    <p className="text-white text-sm font-serif font-bold italic truncate mb-0.5">{profile.name}</p>
                    <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest truncate">{profile.profession || 'Professional'}</p>
                </div>
            </div>
        </Link>
    );
};

const SkeletonCard = () => (
    <div className="w-full">
        <div className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse"></div>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [allProfiles, setAllProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dashStats, setDashStats] = useState({ viewedYou: 0, saved: 0, receivedInterested: 0, sentInterests: 0, gallery: 0 });
    const [activeView, setActiveView] = useState(null);
    const [viewProfiles, setViewProfiles] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profilesRes, statsRes] = await Promise.all([
                    api.getProfiles(),
                    api.getDashboardStats()
                ]);
                setAllProfiles(profilesRes.data);
                setDashStats(statsRes.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleStatClick = async (type) => {
        if (type === 'gallery') { navigate('/gallery'); return; }
        if (type === 'viewed') return;
        setActiveView(activeView === type ? null : type);
        setViewLoading(true);
        try {
            if (type === 'received') {
                const { data } = await api.getInterestsReceived();
                setViewProfiles(data);
            } else if (type === 'sent') {
                const { data } = await api.getInterestsSent();
                setViewProfiles(data);
            }
        } catch (err) { setViewProfiles([]); }
        setViewLoading(false);
    };

    const stats = [
        { label: 'Viewed You', value: dashStats.viewedYou, bg: 'bg-teal-50', iconBg: 'bg-teal-100', iconColor: 'text-teal-500', icon: Eye, type: 'viewed' },
        { label: 'Received Interests', value: dashStats.receivedInterested, bg: 'bg-[#FFFDD0]', iconBg: 'bg-[#D4AF37]/20', iconColor: 'text-[#800020]', icon: Bell, type: 'received' },
        { label: 'Interests Sent', value: dashStats.sentInterests, bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', icon: Send, type: 'sent' },
        { label: 'Gallery', value: dashStats.gallery, bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-500', icon: Image, type: 'gallery' },
    ];

    const viewTitles = { received: 'Received Interests', sent: 'Interests Sent' };

    // Split profiles into sections
    const recommended = allProfiles.slice(0, 6);
    const nearLocation = allProfiles.filter(p => p.location && user?.location && p.location.toLowerCase().includes(user.location?.toLowerCase?.() || '')).slice(0, 6);
    const nearFallback = nearLocation.length > 0 ? nearLocation : allProfiles.slice(2, 8);

    return (
        <div className="min-h-screen bg-[#FFFDD0]/20 flex flex-col">


            {/* Premium Search */}
            <div className="px-6 py-6 bg-white/50 backdrop-blur-sm border-b border-[#800020]/5 mb-6">
                <div className="max-w-4xl mx-auto relative text-center">
                    <h2 className="text-3xl font-serif italic text-gray-900 mb-8">Find Your Match</h2>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={20} />
                        <input
                            type="text"
                            placeholder="Search by community, values, or city..."
                            className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-[#800020]/10 text-sm font-medium outline-none focus:ring-4 focus:ring-[#800020]/5 shadow-xl transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-6 pb-16">
                <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {[
                        { label: 'Interested Users', value: dashStats.receivedInterested, icon: Bell, type: 'received' },
                        { label: 'Interests Sent', value: dashStats.sentInterests, icon: Send, type: 'sent' },
                        { label: 'Profile Views', value: dashStats.viewedYou, icon: Eye, type: 'viewed' },
                        { label: 'My Photos', value: dashStats.gallery, icon: Image, type: 'gallery' },
                    ].map((stat, i) => (
                        <motion.button
                            whileHover={{ y: -10 }}
                            key={i}
                            onClick={() => handleStatClick(stat.type)}
                            className={`bg-white hover:bg-[#800020] group rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-xl hover:shadow-[#800020]/40 border border-[#800020]/5 cursor-pointer active:scale-95 ${activeView === stat.type ? 'ring-4 ring-[#D4AF37]/30' : ''}`}
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner bg-[#800020]/5 group-hover:bg-white/10 transition-colors">
                                <stat.icon size={24} className="text-[#800020] group-hover:text-[#D4AF37] transition-colors" />
                            </div>
                            <div className="text-4xl font-serif font-bold text-gray-900 group-hover:text-white transition-colors italic">{stat.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.3em] mt-3 text-gray-400 group-hover:text-[#D4AF37]/60 transition-colors">{stat.label}</div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Premium Membership Banner */}
            <div className="px-6 pb-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-[#800020] to-[#600318] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-[#800020]/30 border border-[#D4AF37]/20"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                        <div className="pt-8 pb-12 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full mb-6">
                                    <Sparkles size={12} className="text-[#D4AF37]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Premium Status</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-black italic mb-4 leading-tight">
                                    Your {user?.membership || 'Basic'} <span className="text-[#D4AF37] not-italic">Journey</span>
                                </h2>
                                <p className="text-white/60 text-sm font-medium max-w-md leading-relaxed">
                                    Unlock the full potential of Milana Matrimony. Gain access to direct chats, verified badges, and personalized matchmaker assistance.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center p-4">
                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Expires</span>
                                    <span className="text-2xl font-serif font-bold italic text-[#D4AF37]">30 Days</span>
                                </div>
                                <Link
                                    to="/register" // In a real app, this would be a payment page
                                    className="px-10 py-5 bg-[#D4AF37] text-[#800020] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:shadow-2xl transition-all shadow-xl active:scale-95 whitespace-nowrap"
                                >
                                    Elevate Experience
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Expanded View for Saved / Received Interested */}
            {
                activeView && activeView !== 'viewed' && activeView !== 'gallery' && (
                    <div className="px-6 pb-12">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-800">{viewTitles[activeView]}</h2>
                                <button onClick={() => setActiveView(null)} className="text-sm font-semibold text-gray-400 hover:text-gray-600">Close</button>
                            </div>
                            {viewLoading ? (
                                <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
                            ) : viewProfiles.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                                    <p className="text-gray-400 text-sm font-medium">No profiles found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {viewProfiles.map(p => (
                                        <Link key={p._id} to={`/profile/${p._id}`} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all active:scale-[0.98]">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                                {p.profilePicture ? (
                                                    <img src={p.profilePicture} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={20} /></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 text-sm truncate">{p.name}</h3>
                                                <p className="text-xs text-gray-400">{p.age ? `${p.age} yrs` : ''}{p.location ? ` • ${p.location}` : ''}</p>
                                            </div>
                                            <ArrowRight size={14} className="text-gray-300" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            <div className="px-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recommended Matches</h2>
                    </div>
                    <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 no-scrollbar pb-4 sm:pb-0 snap-x">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="shrink-0 w-[200px] sm:w-auto snap-center"><SkeletonCard /></div>)
                        ) : recommended.length > 0 ? (
                            recommended.map(p => <div key={p._id || p.id} className="shrink-0 w-[200px] sm:w-auto snap-center"><ProfileThumbnail profile={p} /></div>)
                        ) : (
                            <p className="text-sm text-gray-400">No matches found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Near your Location */}
            <div className="px-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Near your Location</h2>
                    </div>
                    <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 no-scrollbar pb-4 sm:pb-0 snap-x">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={`loc-${i}`} className="shrink-0 w-[200px] sm:w-auto snap-center"><SkeletonCard /></div>)
                        ) : nearFallback.length > 0 ? (
                            nearFallback.map(p => <div key={p._id || p.id} className="shrink-0 w-[200px] sm:w-auto snap-center"><ProfileThumbnail profile={p} /></div>)
                        ) : (
                            <p className="text-sm text-gray-400">No profiles nearby</p>
                        )}
                    </div>
                </div>
            </div>

            {/* All Matches */}
            <div className="px-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">All Matches</h2>
                        <Link to="/explore" className="text-sm font-semibold text-[#FFBD8C] hover:text-orange-500 transition-colors bg-orange-50 px-4 py-2 rounded-full">view all</Link>
                    </div>
                    <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 no-scrollbar pb-4 sm:pb-0 snap-x">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={`all-${i}`} className="shrink-0 w-[200px] sm:w-auto snap-center"><SkeletonCard /></div>)
                        ) : allProfiles.length > 0 ? (
                            allProfiles.map(p => <div key={p._id || p.id} className="shrink-0 w-[200px] sm:w-auto snap-center"><ProfileThumbnail profile={p} /></div>)
                        ) : (
                            <p className="text-sm text-gray-400">No profiles found</p>
                        )}
                    </div>
                </div>
            </div>

        </div >
    );
};

export default Dashboard;
