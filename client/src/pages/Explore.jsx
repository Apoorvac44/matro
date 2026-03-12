import React, { useState, useEffect, useContext } from 'react';
import { Search, SlidersHorizontal, Heart, Loader2, Home, MessageSquare, User, X, ChevronDown, ChevronUp, MoreVertical, LayoutGrid, ArrowLeft, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../services/api';

const Explore = () => {
    const { user } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [activeTab, setActiveTab] = useState('All matches');
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Quick Filter States
    const [sortBy, setSortBy] = useState('Relevance');
    const [showNewlyJoined, setShowNewlyJoined] = useState(false);
    const [showNotSeen, setShowNotSeen] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        // Basic Details
        age: '23 Yrs - 30 Yrs',
        height: "4'9\" - 5'9\"",
        profileCreatedBy: 'Any',
        maritalStatus: 'Never Married',
        motherTongue: 'Kannada',
        // Professional Details
        occupation: 'Any',
        annualIncome: 'Any',
        employmentType: 'Any',
        education: "Bachelor's - Engineering/Technology",
        // Lifestyle
        eatingHabits: 'Any',
        drinkingHabits: "Doesn't Matter",
        smokingHabits: "Doesn't Matter",
        // Family Details
        familyStatus: 'Any',
        familyType: 'Any',
        familyValue: 'Any',
        // Recently created / Type
        profileCreatedDate: 'All', // 'Today', 'Last 3 days', 'One week', 'One month'
        mutualMatches: false,
        photosOnly: false
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProfiles = async () => {
            try {
                const { data } = await api.getProfiles();
                // Duplicate data to show a good number of cards since we want to mimic "34 Matches"
                const repeatedData = [...data, ...data.map(p => ({ ...p, _id: p._id + '_2' })), ...data.map(p => ({ ...p, _id: p._id + '_3' }))];
                setProfiles(repeatedData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch matches. Please try again.');
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    let derivedProfiles = profiles.filter(profile => {
        // Basic matching logic based on the filters state
        if (filters.maritalStatus !== 'Any') {
            const isMatch = profile.maritalStatus?.toLowerCase() === filters.maritalStatus.toLowerCase();
            // Assuming 'Never Married' maps to 'Single' or similar in actual DB
            if (filters.maritalStatus === 'Never Married' && profile.maritalStatus !== 'Single' && profile.maritalStatus !== 'Never Married') return false;
        }

        if (filters.occupation !== 'Any' && profile.profession) {
            // Very loose matching for demo
            if (!profile.profession.toLowerCase().includes(filters.occupation.toLowerCase()) && filters.occupation !== 'Other') return false;
        }

        if (filters.photosOnly && (!profile.photos || profile.photos.length === 0) && !profile.image && !profile.profilePicture) {
            return false;
        }

        return true;
    });

    // Apply Quick Pills
    if (showNewlyJoined) {
        // Mock new arrivals by reversing the array
        derivedProfiles = [...derivedProfiles].reverse();
    }

    if (showNotSeen) {
        // Mock "not seen" by arbitrarily removing some items for demonstration
        derivedProfiles = derivedProfiles.filter((_, i) => i % 3 !== 0);
    }

    if (sortBy === 'Age (Low to High)') {
        derivedProfiles.sort((a, b) => (parseInt(a.age) || 99) - (parseInt(b.age) || 99));
    } else if (sortBy === 'Age (High to Low)') {
        derivedProfiles.sort((a, b) => (parseInt(b.age) || 0) - (parseInt(a.age) || 0));
    }

    const filteredProfiles = derivedProfiles;

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const FilterSection = ({ title, children }) => (
        <div className="mb-2">
            <div className="bg-gray-100 px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            </div>
            <div className="bg-white">
                {children}
            </div>
        </div>
    );

    const EditableFilterRow = ({ label, value, filterKey, options }) => {
        const [isEditing, setIsEditing] = useState(false);

        if (isEditing) {
            return (
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#EF5350]/30 bg-red-50/50">
                    <span className="text-[13px] font-bold text-[#EF5350] w-1/3">{label}</span>
                    <select
                        autoFocus
                        value={value}
                        onChange={(e) => {
                            updateFilter(filterKey, e.target.value);
                            setIsEditing(false);
                        }}
                        onBlur={() => setIsEditing(false)}
                        className="flex-1 bg-white border border-[#EF5350]/50 rounded text-[13px] p-1.5 outline-none focus:ring-2 focus:ring-[#EF5350]/20 text-gray-900 font-medium"
                    >
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        }

        return (
            <div
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <span className="text-[13px] text-gray-800 w-1/3">{label}</span>
                <div className="flex items-center justify-end gap-2 flex-1">
                    <span className={`text-[13px] font-medium truncate ${value !== 'Any' && value !== "Doesn't Matter" ? 'text-gray-900' : 'text-gray-500'}`}>
                        {value}
                    </span>
                    <Edit2 size={12} className="text-[#EF5350] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
            </div>
        );
    };

    const FilterItemRow = ({ label, value, isChecked, type = 'select', filterKey }) => {
        if (type === 'checkbox') {
            return (
                <div
                    onClick={() => updateFilter(filterKey, !isChecked)}
                    className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <div>
                        <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                        <p className="text-[11px] text-gray-500 mt-1">{value}</p>
                    </div>
                    <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${isChecked ? 'bg-[#EF5350] border-[#EF5350]' : 'border-gray-300'}`}>
                        {isChecked && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                    </div>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-[13px] text-gray-800">{label}</span>
                <div className="flex items-center gap-2 max-w-[50%]">
                    <span className="text-[13px] font-medium text-gray-900 truncate">
                        {value}
                    </span>
                    <Edit2 size={12} className="text-gray-400 group-hover:text-[#ed5a5a]" />
                </div>
            </div>
        );
    };

    const DatePill = ({ label, active }) => (
        <button
            onClick={() => updateFilter('profileCreatedDate', label)}
            className={`px-4 py-1.5 rounded-lg border text-xs font-medium transition-colors ${active ? 'border-[#EF5350] text-[#EF5350] bg-red-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col pb-20 md:pb-0 font-sans">

            {/* Top Navigation Bar - App Header Area */}
            <div className="bg-[#EF5350] px-4 py-3 flex items-center justify-between z-30">
                {/* Mock OS Status Bar area visually integrated */}
                <div className="w-full flex justify-between items-center">
                    <div className="flex gap-2">
                        {/* Burger menu line representation */}
                        <div className="w-6 flex flex-col gap-1.5 justify-center">
                            <div className="w-full h-0.5 bg-white rounded"></div>
                            <div className="w-full h-0.5 bg-white rounded"></div>
                            <div className="w-3/4 h-0.5 bg-white rounded"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Search size={20} className="text-white" />
                        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Top Tabs */}
            <div className="bg-white border-b border-gray-100 flex justify-between px-6 sticky top-0 z-30">
                {['All matches', 'Newly joined', 'More'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-1 text-[13px] font-bold transition-all relative ${activeTab === tab ? 'text-[#EF5350]' : 'text-gray-500'
                            }`}
                    >
                        {tab === 'More' ? (
                            <span className="flex items-center gap-1">{tab} <ChevronDown size={14} /></span>
                        ) : tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EF5350]"
                            />
                        )}
                    </button>
                ))}
            </div>



            {/* Filter Stats Bar */}
            <div className="px-4 md:px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between z-20">
                <h2 className="text-[13px] md:text-sm font-bold text-gray-900">
                    {filteredProfiles.length} Matches based on your <span className="text-[#EF5350]">preferences</span>
                </h2>
                <button className="text-gray-600 hover:text-[#EF5350] transition-colors"><MoreVertical size={16} /></button>
            </div>

            {/* Quick Filter Pills Row (Side-scrolling) */}
            <div className="px-4 md:px-6 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap z-10">
                <button
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-[12px] font-medium text-gray-700 hover:bg-gray-50 shrink-0 shadow-sm"
                >
                    <SlidersHorizontal size={12} className="text-gray-500" /> Filter
                </button>

                <div className="relative shrink-0">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                        <option value="Relevance">Sort by: Relevance</option>
                        <option value="Age (Low to High)">Age (Low to High)</option>
                        <option value="Age (High to Low)">Age (High to Low)</option>
                    </select>
                    <button
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-medium transition-colors shadow-sm ${sortBy !== 'Relevance' ? 'border-[#EF5350] bg-red-50 text-[#EF5350]' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        Sort by <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <button
                    onClick={() => setShowNewlyJoined(!showNewlyJoined)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-medium shrink-0 transition-colors shadow-sm ${showNewlyJoined ? 'border-[#EF5350] bg-red-50 text-[#EF5350]' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Newly joined
                </button>

                <button
                    onClick={() => setShowNotSeen(!showNotSeen)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-medium shrink-0 transition-colors shadow-sm ${showNotSeen ? 'border-[#EF5350] bg-red-50 text-[#EF5350]' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Not seen
                </button>
            </div>

            {/* Main Content Area: Profiles - Responsive Grid */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-3 sm:px-6 py-6 border-t md:border-none border-gray-200">
                {/* Grid Layout - denser for smaller cards */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 size={32} className="animate-spin text-[#EF5350]" />
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 bg-red-50 text-red-500 rounded-xl font-medium border border-red-100">{error}</div>
                    ) : filteredProfiles.length === 0 ? (
                        <div className="text-center p-12 bg-gray-50 text-gray-500 rounded-xl border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No matches found</h3>
                            <p>Try adjusting your search criteria</p>
                            <button
                                onClick={() => {
                                    setFilters({ ...filters, maritalStatus: 'Any', occupation: 'Any', photosOnly: false });
                                    setShowNewlyJoined(false);
                                    setShowNotSeen(false);
                                }}
                                className="mt-4 px-6 py-2 bg-[#EF5350] text-white rounded-lg font-bold hover:bg-[#e04848] transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-1 md:px-2">
                            {filteredProfiles.map((profile, i) => (
                                <ProfileCard key={profile._id || i} profile={profile} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation for Mobile */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-40 md:hidden pb-safe shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
                <Link to="/" className="flex flex-col items-center gap-1 text-gray-400">
                    <Home size={22} className="stroke-[1.5]" />
                    <span className="text-[10px] font-semibold">Home</span>
                </Link>
                <Link to="/explore" className="flex flex-col items-center gap-1 text-[#EF5350]">
                    <User size={22} className="stroke-[2.5]" />
                    <span className="text-[10px] font-bold">Matches</span>
                </Link>
                <Link to="/explore" className="flex flex-col items-center gap-1 text-gray-400">
                    <Heart size={22} className="stroke-[1.5]" />
                    <span className="text-[10px] font-semibold">Interests</span>
                </Link>
                <Link to="/chat/inbox" className="flex flex-col items-center gap-1 text-gray-400">
                    <MessageSquare size={22} className="stroke-[1.5]" />
                    <span className="text-[10px] font-semibold">Messages</span>
                </Link>
                <Link to="/explore" className="flex flex-col items-center gap-1 text-gray-400">
                    <Search size={22} className="stroke-[1.5]" />
                    <span className="text-[10px] font-semibold">Search</span>
                </Link>
            </div>

            {/* RESPONSIVE FILTER MODAL / SIDEBAR */}
            <AnimatePresence>
                {showFilterModal && (
                    <>
                        {/* Desktop Overlay Background */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-40 hidden md:block backdrop-blur-sm"
                            onClick={() => setShowFilterModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, x: window.innerWidth > 768 ? '100%' : 0, y: window.innerWidth > 768 ? 0 : '100%' }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: window.innerWidth > 768 ? '100%' : 0, y: window.innerWidth > 768 ? 0 : '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[450px] z-50 bg-gray-50 flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="bg-[#EF5350] px-4 py-4 flex items-center gap-4 shadow-md shrink-0">
                                <button onClick={() => setShowFilterModal(false)} className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors active:scale-90">
                                    {window.innerWidth > 768 ? <X size={24} /> : <ArrowLeft size={24} />}
                                </button>
                                <h2 className="text-white text-lg font-bold tracking-wide">Refine Filters</h2>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto pb-24 shadow-inner">

                                <FilterSection title="Basic Details">
                                    <EditableFilterRow label="Age" value={filters.age} filterKey="age" options={['18 Yrs - 25 Yrs', '23 Yrs - 30 Yrs', '28 Yrs - 35 Yrs', '35 Yrs - 45 Yrs', 'Any']} />
                                    <EditableFilterRow label="Height" value={filters.height} filterKey="height" options={["4'0\" - 4'9\"", "4'9\" - 5'9\"", "5'9\" - 6'3\"", "Any"]} />
                                    <EditableFilterRow label="Profile created by" value={filters.profileCreatedBy} filterKey="profileCreatedBy" options={['Self', 'Parent', 'Sibling', 'Relative', 'Any']} />
                                    <EditableFilterRow label="Marital Status" value={filters.maritalStatus} filterKey="maritalStatus" options={['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Any']} />
                                    <EditableFilterRow label="Mother Tongue" value={filters.motherTongue} filterKey="motherTongue" options={['Kannada', 'Hindi', 'Telugu', 'Tamil', 'English', 'Any']} />
                                </FilterSection>

                                <FilterSection title="Professional Details">
                                    <EditableFilterRow label="Occupation" value={filters.occupation} filterKey="occupation" options={['Software Professional', 'Engineer', 'Doctor', 'Teacher', 'Business', 'Any']} />
                                    <EditableFilterRow label="Annual Income" value={filters.annualIncome} filterKey="annualIncome" options={['2L - 5L', '5L - 10L', '10L - 20L', '20L+', 'Any']} />
                                    <EditableFilterRow label="Employment Type" value={filters.employmentType} filterKey="employmentType" options={['Private Sector', 'Government', 'Self Employed', 'Not Working', 'Any']} />
                                    <EditableFilterRow label="Education" value={filters.education} filterKey="education" options={["Bachelor's - Engineering/Technology", "Master's Degree", "Doctorate", "Diploma", "Any"]} />
                                </FilterSection>

                                <FilterSection title="Lifestyle">
                                    <EditableFilterRow label="Eating Habits" value={filters.eatingHabits} filterKey="eatingHabits" options={['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Any']} />
                                    <EditableFilterRow label="Drinking Habits" value={filters.drinkingHabits} filterKey="drinkingHabits" options={['No', 'Occasionally', 'Yes', "Doesn't Matter"]} />
                                    <EditableFilterRow label="Smoking Habits" value={filters.smokingHabits} filterKey="smokingHabits" options={['No', 'Occasionally', 'Yes', "Doesn't Matter"]} />
                                </FilterSection>

                                <FilterSection title="Family Details">
                                    <EditableFilterRow label="Family Status" value={filters.familyStatus} filterKey="familyStatus" options={['Middle Class', 'Upper Middle Class', 'Rich/Affluent', 'Any']} />
                                    <EditableFilterRow label="Family Type" value={filters.familyType} filterKey="familyType" options={['Joint', 'Nuclear', 'Any']} />
                                    <EditableFilterRow label="Family Value" value={filters.familyValue} filterKey="familyValue" options={['Orthodox', 'Traditional', 'Moderate', 'Liberal', 'Any']} />
                                </FilterSection>

                                <FilterSection title="Recently created profiles">
                                    <div className="p-4 border-b border-gray-100">
                                        <p className="text-[13px] text-gray-900 font-semibold mb-1">Profile Created</p>
                                        <p className="text-[11px] text-gray-500 mb-4">Profiles based on created date</p>
                                        <div className="flex flex-wrap gap-2">
                                            <DatePill label="All" active={filters.profileCreatedDate === 'All'} />
                                            <DatePill label="Today" active={filters.profileCreatedDate === 'Today'} />
                                            <DatePill label="Last 3 days" active={filters.profileCreatedDate === 'Last 3 days'} />
                                            <DatePill label="One week" active={filters.profileCreatedDate === 'One week'} />
                                            <DatePill label="One month" active={filters.profileCreatedDate === 'One month'} />
                                        </div>
                                    </div>
                                </FilterSection>

                                <FilterSection title="Profile Type">
                                    <FilterItemRow
                                        label="Mutual Matches"
                                        value="Profiles matching your preferences & vice versa"
                                        type="checkbox"
                                        filterKey="mutualMatches"
                                        isChecked={filters.mutualMatches}
                                    />
                                    <FilterItemRow
                                        label="Profiles with photo"
                                        value="Matches who have added photos"
                                        type="checkbox"
                                        filterKey="photosOnly"
                                        isChecked={filters.photosOnly}
                                    />
                                </FilterSection>

                            </div>

                            {/* Fixed Bottom Button in Modal */}
                            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-4 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-10">
                                <div className="text-center mb-3">
                                    <span className="text-[15px] font-black text-gray-900">{filteredProfiles.length}</span>
                                    <span className="text-[13px] font-medium text-gray-600"> matches based on your filters</span>
                                </div>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="w-full py-3.5 bg-[#EF5350] text-white rounded-[1rem] font-bold text-[15px] shadow-lg shadow-red-500/20 hover:bg-[#E53935] hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0"
                                >
                                    Show Matches
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Explore;
