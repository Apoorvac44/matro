import React, { useState, useEffect, useContext } from 'react';
import { Search, SlidersHorizontal, Heart, Loader2, Home, MessageSquare, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';

const Explore = () => {
    const { user } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState(null);
    const [error, setError] = useState(null);

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

    const DUMMY_PROFILES = [
        { _id: '1', name: 'Priya Sharma', age: 26, gender: 'Female', religion: 'Hindu', location: 'Mumbai', profession: 'Software Engineer', education: 'B.Tech', income: '₹12 LPA', profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg', aboutMe: 'Passionate about technology and classical dance.', isApproved: true },
        { _id: '2', name: 'Amit Patel', age: 29, gender: 'Male', religion: 'Hindu', location: 'Ahmedabad', profession: 'Doctor', education: 'MBBS', income: '₹18 LPA', profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg', aboutMe: 'A dedicated physician who loves cricket and travel.', isApproved: true },
        { _id: '3', name: 'Anjali Reddy', age: 24, gender: 'Female', religion: 'Hindu', location: 'Hyderabad', profession: 'Data Analyst', education: 'MBA', income: '₹10 LPA', profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg', aboutMe: 'Love cooking and exploring new cuisines.', isApproved: true },
        { _id: '4', name: 'Rahul Mehta', age: 31, gender: 'Male', religion: 'Jain', location: 'Surat', profession: 'Chartered Accountant', education: 'CA', income: '₹15 LPA', profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg', aboutMe: 'Traditional values with a modern outlook.', isApproved: true },
        { _id: '5', name: 'Kavya Nair', age: 27, gender: 'Female', religion: 'Hindu', location: 'Kochi', profession: 'Architect', education: 'B.Arch', income: '₹14 LPA', profilePicture: 'https://randomuser.me/api/portraits/women/55.jpg', aboutMe: 'Creative soul who loves design and music.', isApproved: true },
        { _id: '6', name: 'Vikram Singh', age: 33, gender: 'Male', religion: 'Sikh', location: 'Chandigarh', profession: 'Army Officer', education: 'B.Sc', income: '₹20 LPA', profilePicture: 'https://randomuser.me/api/portraits/men/60.jpg', aboutMe: 'Disciplined, adventurous and family-oriented.', isApproved: true },
        { _id: '7', name: 'Sneha Iyer', age: 25, gender: 'Female', religion: 'Hindu', location: 'Chennai', profession: 'Teacher', education: 'M.Ed', income: '₹7 LPA', profilePicture: 'https://randomuser.me/api/portraits/women/72.jpg', aboutMe: 'Passionate about education and classical music.', isApproved: true },
        { _id: '8', name: 'Rohan Gupta', age: 28, gender: 'Male', religion: 'Hindu', location: 'Delhi', profession: 'Marketing Manager', education: 'MBA', income: '₹16 LPA', profilePicture: 'https://randomuser.me/api/portraits/men/25.jpg', aboutMe: 'Energetic, creative and love traveling.', isApproved: true },
        { _id: '9', name: 'Meera Joshi', age: 30, gender: 'Female', religion: 'Hindu', location: 'Pune', profession: 'Lawyer', education: 'LLB', income: '₹13 LPA', profilePicture: 'https://randomuser.me/api/portraits/women/30.jpg', aboutMe: 'Strong, independent and family-oriented.', isApproved: true },
        { _id: '10', name: 'Arjun Kumar', age: 27, gender: 'Male', religion: 'Christian', location: 'Bangalore', profession: 'Product Manager', education: 'B.Tech + MBA', income: '₹22 LPA', profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg', aboutMe: 'Tech enthusiast and avid reader.', isApproved: true },
        { _id: '11', name: 'Divya Krishnan', age: 23, gender: 'Female', religion: 'Hindu', location: 'Coimbatore', profession: 'Nurse', education: 'B.Sc Nursing', income: '₹6 LPA', profilePicture: 'https://randomuser.me/api/portraits/women/85.jpg', aboutMe: 'Caring, compassionate and loves arts and crafts.', isApproved: true },
        { _id: '12', name: 'Nikhil Bose', age: 32, gender: 'Male', religion: 'Hindu', location: 'Kolkata', profession: 'Business Owner', education: 'B.Com', income: '₹25 LPA', profilePicture: 'https://randomuser.me/api/portraits/men/78.jpg', aboutMe: 'Ambitious entrepreneur who enjoys music and travel.', isApproved: true },
    ];

    useEffect(() => {
        // Frontend-only: load dummy profiles
        setTimeout(() => {
            setProfiles(DUMMY_PROFILES);
            setLoading(false);
        }, 600);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ gender: '', ageMin: '', ageMax: '', location: '', religion: '', profession: '', education: '', maritalStatus: '' });
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    const filteredProfiles = profiles.filter(profile => {
        // Search query
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            profile.name?.toLowerCase().includes(q) ||
            profile.profession?.toLowerCase().includes(q) ||
            profile.location?.toLowerCase().includes(q) ||
            profile.religion?.toLowerCase().includes(q);

        // Filter criteria
        const matchesGender = !filters.gender || profile.gender === filters.gender;
        const matchesAgeMin = !filters.ageMin || (profile.age && profile.age >= parseInt(filters.ageMin));
        const matchesAgeMax = !filters.ageMax || (profile.age && profile.age <= parseInt(filters.ageMax));
        const matchesLocation = !filters.location || profile.location?.toLowerCase().includes(filters.location.toLowerCase());
        const matchesReligion = !filters.religion || profile.religion?.toLowerCase() === filters.religion.toLowerCase();
        const matchesProfession = !filters.profession || profile.profession?.toLowerCase().includes(filters.profession.toLowerCase());
        const matchesEducation = !filters.education || profile.education?.toLowerCase().includes(filters.education.toLowerCase());

        return matchesSearch && matchesGender && matchesAgeMin && matchesAgeMax && matchesLocation && matchesReligion && matchesProfession && matchesEducation;
    });

    const filterTabs = ['Filters', 'Match Preference', 'Basic Details'];

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

            {/* Filter Tabs */}
            <div className="px-4 py-8 border-b border-[#800020]/5 bg-white/80 backdrop-blur-xl sticky top-20 z-20">
                <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto justify-center md:justify-start no-scrollbar">
                    {filterTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(activeFilter === tab ? null : tab)}
                            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border group ${activeFilter === tab
                                ? 'bg-[#800020] text-[#D4AF37] border-[#800020] shadow-lg shadow-[#800020]/20 scale-[1.02]'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-[#D4AF37]/50 hover:bg-[#800020]/5 hover:text-[#800020] hover:scale-[1.02]'
                                }`}
                        >
                            {tab === 'Filters' && <SlidersHorizontal size={14} />}
                            {tab}
                            {tab === 'Filters' && activeFilterCount > 0 && (
                                <span className="w-5 h-5 bg-[#D4AF37] text-[#800020] text-[10px] font-black rounded-lg flex items-center justify-center">{activeFilterCount}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter Panels */}
            <AnimatePresence>
                {activeFilter && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-gray-100 overflow-hidden bg-gray-50"
                    >
                        <div className="max-w-4xl mx-auto px-6 py-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-800">{activeFilter}</h3>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearFilters} className="text-xs font-semibold text-red-500 hover:text-red-600">Clear All</button>
                                )}
                            </div>

                            {activeFilter === 'Filters' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Gender</label>
                                        <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200">
                                            <option value="">All</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Religion</label>
                                        <select value={filters.religion} onChange={e => handleFilterChange('religion', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200">
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
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Age Min</label>
                                        <input type="number" placeholder="18" value={filters.ageMin} onChange={e => handleFilterChange('ageMin', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Age Max</label>
                                        <input type="number" placeholder="60" value={filters.ageMax} onChange={e => handleFilterChange('ageMax', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200" />
                                    </div>
                                </div>
                            )}

                            {activeFilter === 'Match Preference' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-[#800020] uppercase tracking-widest px-6">Location</label>
                                        <input type="text" placeholder="e.g. Mumbai" value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Profession</label>
                                        <input type="text" placeholder="e.g. Engineer" value={filters.profession} onChange={e => handleFilterChange('profession', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200" />
                                    </div>
                                </div>
                            )}

                            {activeFilter === 'Basic Details' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Education</label>
                                        <input type="text" placeholder="e.g. B.Tech, MBA" value={filters.education} onChange={e => handleFilterChange('education', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Gender</label>
                                        <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200">
                                            <option value="">All</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Religion</label>
                                        <select value={filters.religion} onChange={e => handleFilterChange('religion', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200">
                                            <option value="">All</option>
                                            <option value="hindu">Hindu</option>
                                            <option value="muslim">Muslim</option>
                                            <option value="christian">Christian</option>
                                            <option value="sikh">Sikh</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Results count */}
                            <p className="text-xs text-[#800020]/40 font-bold uppercase tracking-widest mt-6">{filteredProfiles.length} matches found</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
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
