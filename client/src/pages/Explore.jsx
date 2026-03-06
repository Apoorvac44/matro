import React, { useState, useEffect, useContext } from 'react';
import { Search, SlidersHorizontal, Heart, Loader2, Home, MessageSquare, User, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../services/api';

const Explore = () => {
    const { user } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Collapsible sections
    const [openSections, setOpenSections] = useState({
        filters: true,
        matchPreference: false,
        basicDetails: false,
    });

    // Filter states
    const [filters, setFilters] = useState({
        gender: '',
        ageMin: '',
        ageMax: '',
        location: '',
        religion: '',
        profession: '',
        education: '',
        maritalStatus: '',
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProfiles = async () => {
            try {
                const { data } = await api.getProfiles();
                setProfiles(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch matches. Please try again.');
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ gender: '', ageMin: '', ageMax: '', location: '', religion: '', profession: '', education: '', maritalStatus: '' });
    };

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    const filteredProfiles = profiles.filter(profile => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            profile.name?.toLowerCase().includes(q) ||
            profile.profession?.toLowerCase().includes(q) ||
            profile.location?.toLowerCase().includes(q) ||
            profile.religion?.toLowerCase().includes(q);

        const matchesGender = !filters.gender || profile.gender === filters.gender;
        const matchesAgeMin = !filters.ageMin || (profile.age && profile.age >= parseInt(filters.ageMin));
        const matchesAgeMax = !filters.ageMax || (profile.age && profile.age <= parseInt(filters.ageMax));
        const matchesLocation = !filters.location || profile.location?.toLowerCase().includes(filters.location.toLowerCase());
        const matchesReligion = !filters.religion || profile.religion?.toLowerCase() === filters.religion.toLowerCase();
        const matchesProfession = !filters.profession || profile.profession?.toLowerCase().includes(filters.profession.toLowerCase());
        const matchesEducation = !filters.education || profile.education?.toLowerCase().includes(filters.education.toLowerCase());

        return matchesSearch && matchesGender && matchesAgeMin && matchesAgeMax && matchesLocation && matchesReligion && matchesProfession && matchesEducation;
    });

    const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/30 transition-all";
    const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block";

    return (
        <div className="min-h-screen bg-[#F0F2F5]/10 flex flex-col pb-20 md:pb-0">
            {/* Premium Header */}
            <div className="pt-32 px-6 lg:px-24 pb-20 bg-gradient-to-br from-[#800020] via-[#600318] to-[#4a0404] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[100px] -ml-24 -mb-24"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-6 block"
                    >
                        Search for Matches
                    </motion.span>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-10 italic">Find your life partner</h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={20} />
                        <input
                            type="text"
                            placeholder="Search by community, profession, or city..."
                            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 text-sm font-medium outline-none focus:ring-2 focus:ring-[#D4AF37]/50 shadow-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area with Sidebar */}
            <div className="flex-1 flex">
                {/* Sidebar - Toggle on mobile */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden fixed bottom-24 right-4 z-50 bg-[#800020] text-[#D4AF37] w-14 h-14 rounded-full shadow-2xl shadow-[#800020]/30 flex items-center justify-center active:scale-95 transition-all"
                >
                    <SlidersHorizontal size={22} />
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#800020] text-[10px] font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>
                    )}
                </button>

                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:sticky top-0 md:top-20 left-0 z-40 md:z-10 w-80 h-screen md:h-[calc(100vh-5rem)] bg-white border-r border-gray-100 overflow-y-auto transition-transform duration-300 shadow-2xl md:shadow-none pt-20 md:pt-0`}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                        <div>
                            <h3 className="text-sm font-black text-[#800020] uppercase tracking-[0.2em]">Refine Search</h3>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">{filteredProfiles.length} matches found</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wider">Clear</button>
                            )}
                            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-[#800020]">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="border-b border-gray-50">
                        <button
                            onClick={() => toggleSection('filters')}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal size={16} className="text-[#D4AF37]" />
                                <span className="text-xs font-bold text-[#800020] uppercase tracking-[0.2em]">Filters</span>
                            </div>
                            {openSections.filters ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>
                        <AnimatePresence>
                            {openSections.filters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 space-y-4">
                                        <div>
                                            <label className={labelClass}>Gender</label>
                                            <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)} className={inputClass}>
                                                <option value="">All</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Religion</label>
                                            <select value={filters.religion} onChange={e => handleFilterChange('religion', e.target.value)} className={inputClass}>
                                                <option value="">All</option>
                                                <option value="hindu">Hindu</option>
                                                <option value="muslim">Muslim</option>
                                                <option value="christian">Christian</option>
                                                <option value="sikh">Sikh</option>
                                                <option value="jain">Jain</option>
                                                <option value="buddhist">Buddhist</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelClass}>Age Min</label>
                                                <input type="number" placeholder="18" value={filters.ageMin} onChange={e => handleFilterChange('ageMin', e.target.value)} className={inputClass} />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Age Max</label>
                                                <input type="number" placeholder="60" value={filters.ageMax} onChange={e => handleFilterChange('ageMax', e.target.value)} className={inputClass} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Match Preferences Section */}
                    <div className="border-b border-gray-50">
                        <button
                            onClick={() => toggleSection('matchPreference')}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Heart size={16} className="text-[#D4AF37]" />
                                <span className="text-xs font-bold text-[#800020] uppercase tracking-[0.2em]">Match Preferences</span>
                            </div>
                            {openSections.matchPreference ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>
                        <AnimatePresence>
                            {openSections.matchPreference && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 space-y-4">
                                        <div>
                                            <label className={labelClass}>Location</label>
                                            <input type="text" placeholder="e.g. Mumbai" value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Profession</label>
                                            <input type="text" placeholder="e.g. Engineer" value={filters.profession} onChange={e => handleFilterChange('profession', e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Basic Details Section */}
                    <div className="border-b border-gray-50">
                        <button
                            onClick={() => toggleSection('basicDetails')}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <User size={16} className="text-[#D4AF37]" />
                                <span className="text-xs font-bold text-[#800020] uppercase tracking-[0.2em]">Basic Details</span>
                            </div>
                            {openSections.basicDetails ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>
                        <AnimatePresence>
                            {openSections.basicDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 space-y-4">
                                        <div>
                                            <label className={labelClass}>Education</label>
                                            <input type="text" placeholder="e.g. B.Tech, MBA" value={filters.education} onChange={e => handleFilterChange('education', e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Gender</label>
                                            <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)} className={inputClass}>
                                                <option value="">All</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Religion</label>
                                            <select value={filters.religion} onChange={e => handleFilterChange('religion', e.target.value)} className={inputClass}>
                                                <option value="">All</option>
                                                <option value="hindu">Hindu</option>
                                                <option value="muslim">Muslim</option>
                                                <option value="christian">Christian</option>
                                                <option value="sikh">Sikh</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Profile Cards */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-7xl mx-auto px-6 py-16">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="mb-6"
                                >
                                    <Heart size={48} className="text-[#D4AF37] fill-[#D4AF37]/20" />
                                </motion.div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.4em]">Curating matches...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100 italic">
                                <p className="text-red-600 font-serif">{error}</p>
                            </div>
                        ) : filteredProfiles.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[4rem] border border-gray-100 shadow-inner">
                                <div className="w-24 h-24 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Heart className="text-[#D4AF37]" size={40} />
                                </div>
                                <h2 className="text-3xl font-serif italic text-gray-900 mb-2">No Matches Found</h2>
                                <p className="text-gray-400 text-sm font-medium mb-8">Refine your search to discover our diverse community.</p>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearFilters} className="px-10 py-4 rounded-2xl bg-[#800020] text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:bg-[#600318] transition-all">Reset Filters</button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {filteredProfiles.map((profile, i) => (
                                    <motion.div
                                        key={profile._id || profile.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.8 }}
                                    >
                                        <ProfileCard profile={profile} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation for Mobile */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-[#800020]/5 px-8 py-4 flex justify-between items-center z-50 md:hidden shadow-[0_-10px_30px_-5px_rgba(10,25,47,0.05)]">
                <Link to="/" className="flex flex-col items-center gap-1.5 text-gray-400 group">
                    <Home size={20} className="group-hover:text-[#800020] transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
                </Link>
                <Link to="/explore" className="flex flex-col items-center gap-1.5 text-[#800020]">
                    <div className="relative">
                        <Heart size={20} className="fill-[#D4AF37] text-[#D4AF37]" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Matches</span>
                </Link>
                <Link to="/chat/inbox" className="flex flex-col items-center gap-1.5 text-gray-400 group">
                    <MessageSquare size={20} className="group-hover:text-[#800020] transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
                </Link>
                <Link to="/dashboard" className="flex flex-col items-center gap-1.5 text-gray-400 group">
                    <User size={20} className="group-hover:text-[#800020] transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
                </Link>
            </div>
        </div>
    );
};

export default Explore;
