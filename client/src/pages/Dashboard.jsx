import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Heart, MessageSquare, Bell, LogOut, Home, Eye, Send, CheckCheck, Image, ArrowRight, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DUMMY_PROFILES = [
    { _id: '1', name: 'Priya Sharma', age: 26, gender: 'Female', religion: 'Hindu', location: 'Mumbai', profession: 'Software Engineer', education: 'B.Tech', profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { _id: '2', name: 'Amit Patel', age: 29, gender: 'Male', religion: 'Hindu', location: 'Ahmedabad', profession: 'Doctor', education: 'MBBS', profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { _id: '3', name: 'Anjali Reddy', age: 24, gender: 'Female', religion: 'Hindu', location: 'Hyderabad', profession: 'Data Analyst', education: 'MBA', profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { _id: '4', name: 'Rahul Mehta', age: 31, gender: 'Male', religion: 'Jain', location: 'Surat', profession: 'Chartered Accountant', education: 'CA', profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { _id: '5', name: 'Kavya Nair', age: 27, gender: 'Female', religion: 'Hindu', location: 'Kochi', profession: 'Architect', education: 'B.Arch', profilePicture: 'https://randomuser.me/api/portraits/women/55.jpg' },
    { _id: '6', name: 'Vikram Singh', age: 33, gender: 'Male', religion: 'Sikh', location: 'Chandigarh', profession: 'Army Officer', education: 'B.Sc', profilePicture: 'https://randomuser.me/api/portraits/men/60.jpg' },
    { _id: '7', name: 'Sneha Iyer', age: 25, gender: 'Female', religion: 'Hindu', location: 'Chennai', profession: 'Teacher', education: 'M.Ed', profilePicture: 'https://randomuser.me/api/portraits/women/72.jpg' },
    { _id: '8', name: 'Rohan Gupta', age: 28, gender: 'Male', religion: 'Hindu', location: 'Delhi', profession: 'Marketing Manager', education: 'MBA', profilePicture: 'https://randomuser.me/api/portraits/men/25.jpg' },
    { _id: '9', name: 'Meera Joshi', age: 30, gender: 'Female', religion: 'Hindu', location: 'Pune', profession: 'Lawyer', education: 'LLB', profilePicture: 'https://randomuser.me/api/portraits/women/30.jpg' },
    { _id: '10', name: 'Arjun Kumar', age: 27, gender: 'Male', religion: 'Christian', location: 'Bangalore', profession: 'Product Manager', education: 'B.Tech + MBA', profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { _id: '11', name: 'Divya Krishnan', age: 23, gender: 'Female', religion: 'Hindu', location: 'Coimbatore', profession: 'Nurse', education: 'B.Sc Nursing', profilePicture: 'https://randomuser.me/api/portraits/women/85.jpg' },
    { _id: '12', name: 'Nikhil Bose', age: 32, gender: 'Male', religion: 'Hindu', location: 'Kolkata', profession: 'Business Owner', education: 'B.Com', profilePicture: 'https://randomuser.me/api/portraits/men/78.jpg' },
];

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
    const [dashStats, setDashStats] = useState({ viewedYou: 8, saved: 5, receivedInterested: 3, sentInterests: 7, gallery: 4 });
    const [activeView, setActiveView] = useState(null);
    const [viewProfiles, setViewProfiles] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);

    useEffect(() => {
        // Frontend-only: load dummy profiles
        setTimeout(() => {
            setAllProfiles(DUMMY_PROFILES);
            setLoading(false);
        }, 500);
    }, []);

    const handleStatClick = (type) => {
        if (type === 'gallery') { navigate('/gallery'); return; }
        if (type === 'viewed') return;
        setActiveView(activeView === type ? null : type);
        setViewProfiles(DUMMY_PROFILES.slice(0, 3));
    };

    const stats = [
        { label: 'Viewed You', value: dashStats.viewedYou, bg: 'bg-teal-50', iconBg: 'bg-teal-100', iconColor: 'text-teal-500', icon: Eye, type: 'viewed' },
        { label: 'Received Interests', value: dashStats.receivedInterested, bg: 'bg-pink-50', iconBg: 'bg-pink-100', iconColor: 'text-pink-500', icon: Bell, type: 'received' },
        { label: 'Interests Sent', value: dashStats.sentInterests, bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', icon: Send, type: 'sent' },
        { label: 'Gallery', value: dashStats.gallery, bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-500', icon: Image, type: 'gallery' },
    ];

    const viewTitles = { received: 'Received Interests', sent: 'Interests Sent' };

    // Split profiles into sections
    const recommended = allProfiles.slice(0, 6);
    const nearLocation = allProfiles.filter(p => p.location && user?.location && p.location.toLowerCase().includes(user.location?.toLowerCase?.() || '')).slice(0, 6);
    const nearFallback = nearLocation.length > 0 ? nearLocation : allProfiles.slice(2, 8);

    return (
        <div className="min-h-screen bg-[#FFFDD0]/10 flex flex-col pb-20 md:pb-0">
            {/* Elegant Header */}
            <div className="pt-32 px-6 pb-12 bg-white border-b border-[#800020]/5 shadow-sm">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-[2rem] overflow-hidden bg-gray-50 border-4 border-white shadow-xl group-hover:rotate-6 transition-transform duration-500">
                                {user?.profilePicture || user?.image ? (
                                    <img src={user.profilePicture || user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gradient-to-br from-gray-50 to-[#FFFDD0]">
                                        <User size={32} className="text-[#D4AF37]/30" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                        </div>
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-1 block"
                            >
                                Your Account
                            </motion.span>
                            <h1 className="text-3xl font-serif font-bold text-gray-900 italic">Namaste, {user?.name || 'User'}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/edit-profile"
                            className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#800020] rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all border border-[#800020]/10 shadow-sm active:scale-95"
                        >
                            <User size={16} />
                            Edit Profile
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className="px-6 py-2 rounded-xl bg-[#800020]/5 text-[#800020] font-bold text-xs uppercase tracking-widest hover:bg-[#800020] hover:text-[#D4AF37] transition-all flex items-center gap-2 border border-[#800020]/10"
                        >
                            <LogOut size={16} />
                            Logout
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Premium Search */}
            <div className="px-6 py-12 bg-white/50 backdrop-blur-sm border-b border-[#800020]/5 mb-10">
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
                        { label: 'Hearts Sent', value: dashStats.sentInterests, icon: Send, type: 'sent' },
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
                        ) : recommended.length > 0 ? (
                            recommended.map(p => <ProfileThumbnail key={p._id || p.id} profile={p} />)
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <SkeletonCard key={`loc-${i}`} />)
                        ) : nearFallback.length > 0 ? (
                            nearFallback.map(p => <ProfileThumbnail key={p._id || p.id} profile={p} />)
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <SkeletonCard key={`all-${i}`} />)
                        ) : allProfiles.length > 0 ? (
                            allProfiles.map(p => <ProfileThumbnail key={p._id || p.id} profile={p} />)
                        ) : (
                            <p className="text-sm text-gray-400">No profiles found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation for Mobile */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-8 py-3 flex justify-between items-center z-50 md:hidden">
                <Link to="/" className="flex flex-col items-center gap-1 text-[#FFBD8C]">
                    <Home size={22} />
                    <span className="text-[10px] font-bold">Home</span>
                </Link>
                <Link to="/explore" className="flex flex-col items-center gap-1 text-gray-400">
                    <Heart size={22} />
                    <span className="text-[10px] font-semibold">Matches</span>
                </Link>
                <Link to="/chat/inbox" className="flex flex-col items-center gap-1 text-gray-400">
                    <MessageSquare size={22} />
                    <span className="text-[10px] font-semibold">Chat</span>
                </Link>
                <Link to="/dashboard" className="flex flex-col items-center gap-1 text-gray-400">
                    <User size={22} />
                    <span className="text-[10px] font-semibold">Profile</span>
                </Link>
            </div>
        </div >
    );
};

export default Dashboard;
