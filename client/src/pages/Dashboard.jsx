import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Heart, MessageSquare, Bell, LogOut, Home, Eye, Send, CheckCheck, Image, ArrowRight, Search, Sparkles, ShieldCheck, Users, Music } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import ProfileCompletenessCard from '../components/ProfileCompletenessCard';

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
    const [fullProfile, setFullProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profilesRes, statsRes, profileRes] = await Promise.all([
                    api.getProfiles(),
                    api.getDashboardStats(),
                    api.getProfile()
                ]);
                setAllProfiles(profilesRes.data);
                setDashStats(statsRes.data);
                setFullProfile(profileRes.data);
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


            {/* Refined Header & Profile Quick Access */}
            <div className="px-6 py-12 bg-white/50 backdrop-blur-sm border-b border-[#800020]/5 mb-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900 mb-12 font-black tracking-tight">Find Your Match</h2>

                    {/* Desktop-friendly Profile Card */}
                    <div className="max-w-sm md:max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-[#800020]/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 relative transition-transform hover:scale-[1.01]">
                        <div className="flex items-center gap-6 px-2">
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-[#800020]/5 shadow-inner shrink-0 bg-[#FFFDD0]/30 flex items-center justify-center">
                                {fullProfile?.profilePicture ? (
                                    <img src={fullProfile.profilePicture} alt={fullProfile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <img src="https://cdn-icons-png.flaticon.com/512/3667/3667231.png" alt="Couple" className="p-3 opacity-80" />
                                )}
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl md:text-4xl font-serif font-black italic text-gray-900 lowercase">{user?.name || 'apoorva c'}</h3>
                                <p className="text-[10px] md:text-xs font-black text-[#D4AF37] uppercase tracking-[0.2em] mt-2">Manage your account details</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 w-full md:w-[320px] lg:w-auto">
                            <Link
                                to={`/profile/${user?._id || user?.id}`}
                                className="w-full lg:min-w-[200px] py-4 md:py-5 bg-[#800020] text-[#D4AF37] rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-[0.2em] hover:bg-[#600318] transition-all shadow-lg active:scale-95 border border-[#800020] text-center"
                            >
                                View My Profile
                            </Link>
                            <Link
                                to="/edit-profile"
                                className="w-full lg:min-w-[200px] py-4 md:py-5 bg-white text-[#800020] border-2 border-[#800020]/10 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95 text-center"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Complete Your Profile Card */}
            <div className="px-6 pb-12">
                <ProfileCompletenessCard userProfile={fullProfile} />
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
                                <button
                                    onClick={() => navigate('/membership')}
                                    className="px-10 py-5 bg-[#D4AF37] text-[#800020] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:shadow-2xl transition-all shadow-xl active:scale-95 whitespace-nowrap relative z-10"
                                >
                                    Elevate Experience
                                </button>
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

const ProfileThumbnail = ({ profile }) => {
    const navigate = useNavigate();
    const profileId = profile?._id || profile?.id;

    if (!profile) return null;

    return (
        <div
            onClick={() => navigate(`/profile/${profileId}`)}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#800020]/5 cursor-pointer aspect-[4/5.5] w-full"
        >
            {/* Image section */}
            <div className="absolute inset-0">
                {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-[#FFFDD0]/30 flex items-center justify-center text-[#800020]/10">
                        <User size={48} />
                    </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 w-full p-5">
                <h3 className="text-white font-serif font-bold italic text-base leading-tight truncate">{profile.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden">
                    <span className="text-[#D4AF37]/90 text-[9px] font-black uppercase tracking-widest truncate">
                        {profile.age ? `${profile.age} Yrs` : ''} {profile.location ? `• ${profile.location}` : ''}
                    </span>
                </div>
            </div>
        </div>
    );
};

const ProfileActionButton = ({ icon, label, bg, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 bg-white hover:bg-gray-50 p-4 pr-8 rounded-2xl border border-gray-100 shadow-sm transition-all group active:scale-95"
    >
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center relative`}>
            {icon}
            <div className="absolute -right-1 -bottom-1 bg-white rounded-full shadow-sm border border-gray-100 p-0.5">
                <div className="bg-blue-400 rounded-full p-0.5 text-white">
                    <CheckCheck size={8} />
                </div>
            </div>
        </div>
        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{label}</span>
    </button>
);

export default Dashboard;
