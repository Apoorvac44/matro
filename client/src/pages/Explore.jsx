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
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [tempSortBy, setTempSortBy] = useState('Relevance');

    // Quick Filter States
    const [sortBy, setSortBy] = useState('Relevance');
    const [showNewlyJoined, setShowNewlyJoined] = useState(false);
    const [showNotSeen, setShowNotSeen] = useState(false);
    const [showWithPhoto, setShowWithPhoto] = useState(false);
    const [showWithHoroscope, setShowWithHoroscope] = useState(false);
    const [showMutualMatches, setShowMutualMatches] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        // Location Details
        citizenship: 'Any',
        countryLivingIn: 'Any',
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
                // Duplicate data to mimic "34 Matches"
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

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    let derivedProfiles = profiles.filter(profile => {
        if (filters.maritalStatus !== 'Any') {
            const isMatch = profile.maritalStatus?.toLowerCase() === filters.maritalStatus.toLowerCase();
            if (filters.maritalStatus === 'Never Married' && profile.maritalStatus !== 'Single' && profile.maritalStatus !== 'Never Married') return false;
        }
        if (filters.occupation !== 'Any' && profile.profession) {
            if (!profile.profession.toLowerCase().includes(filters.occupation.toLowerCase()) && filters.occupation !== 'Other') return false;
        }
        if (filters.photosOnly && (!profile.photos || profile.photos.length === 0) && !profile.image && !profile.profilePicture) {
            return false;
        }
        return true;
    });

    if (showNewlyJoined) derivedProfiles = [...derivedProfiles].reverse();
    if (showNotSeen) derivedProfiles = derivedProfiles.filter((_, i) => i % 3 !== 0);

    if (sortBy === 'Age (Low to High)') {
        derivedProfiles.sort((a, b) => (parseInt(a.age) || 99) - (parseInt(b.age) || 99));
    } else if (sortBy === 'Age (High to Low)') {
        derivedProfiles.sort((a, b) => (parseInt(b.age) || 0) - (parseInt(a.age) || 0));
    } else if (sortBy === 'Last active') {
        derivedProfiles.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    } else if (sortBy === 'Date created') {
        derivedProfiles.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'Latest photos') {
        derivedProfiles.sort((a, b) => (b.photos?.length || 0) - (a.photos?.length || 0));
    } else if (sortBy === 'Distance') {
        // Mock distance sort
        derivedProfiles.sort((a, b) => (a.location?.length || 0) - (b.location?.length || 0));
    }

    if (showWithPhoto) derivedProfiles = derivedProfiles.filter(p => p.profilePicture || (p.photos && p.photos.length > 0));
    if (showWithHoroscope) derivedProfiles = derivedProfiles.filter(p => p.horoscope || p.hasHoroscope);
    if (showMutualMatches) derivedProfiles = derivedProfiles.filter(p => p.isMutualMatch);

    const filteredProfiles = derivedProfiles;

    const FilterSection = ({ title, children }) => (
        <div className="mb-2">
            <div className="bg-gray-100 px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            </div>
            <div className="bg-white">{children}</div>
        </div>
    );

    const AutocompleteFilterRow = ({ label, value, filterKey }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [search, setSearch] = useState('');
        const [allCountries, setAllCountries] = useState([]);
        const [loadingCountries, setLoadingCountries] = useState(false);

        useEffect(() => {
            if (isEditing && allCountries.length === 0) {
                setLoadingCountries(true);
                api.getCountries()
                    .then(res => {
                        const data = res.data || res;
                        setAllCountries(data);
                    })
                    .finally(() => setLoadingCountries(false));
            }
        }, [isEditing]);

        const filteredCountries = allCountries.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );

        if (isEditing) {
            return (
                <div className="px-4 py-4 bg-gray-50 border-b border-[#800020]/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[13px] font-bold text-[#800020]">{label}</span>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            autoFocus
                            placeholder="Type to search country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg text-[13px] py-2.5 px-4 outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/40 transition-all shadow-sm"
                        />
                        {loadingCountries && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" size={14} />}
                    </div>
                    <div className="mt-2 max-h-[200px] overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div
                            onClick={() => { updateFilter(filterKey, 'Any'); setIsEditing(false); }}
                            className="px-4 py-2.5 text-[13px] hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors font-medium text-gray-500"
                        >
                            Any
                        </div>
                        {filteredCountries.map(country => (
                            <div
                                key={country.code}
                                onClick={() => { updateFilter(filterKey, country.name); setIsEditing(false); }}
                                className="px-4 py-2.5 text-[13px] hover:bg-red-50 hover:text-[#800020] cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                            >
                                {country.name}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div onClick={() => setIsEditing(true)} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-[13px] text-gray-800 w-1/3">{label}</span>
                <div className="flex items-center justify-end gap-2 flex-1">
                    <span className={`text-[13px] font-medium truncate ${value !== 'Any' ? 'text-gray-900' : 'text-gray-500'}`}>
                        {value}
                    </span>
                    <Search size={12} className="text-[#800020] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
            </div>
        );
    };

    const EditableFilterRow = ({ label, value, filterKey, options }) => {
        const [isEditing, setIsEditing] = useState(false);
        if (isEditing) {
            return (
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#800020]/30 bg-red-50/50">
                    <span className="text-[13px] font-bold text-[#800020] w-1/3">{label}</span>
                    <select
                        autoFocus
                        value={value}
                        onChange={(e) => {
                            updateFilter(filterKey, e.target.value);
                            setIsEditing(false);
                        }}
                        onBlur={() => setIsEditing(false)}
                        className="flex-1 bg-white border border-[#800020]/50 rounded text-[13px] p-1.5 outline-none focus:ring-2 focus:ring-[#800020]/20 text-gray-900 font-medium"
                    >
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        }
        return (
            <div onClick={() => setIsEditing(true)} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-[13px] text-gray-800 w-1/3">{label}</span>
                <div className="flex items-center justify-end gap-2 flex-1">
                    <span className={`text-[13px] font-medium truncate ${value !== 'Any' && value !== "Doesn't Matter" ? 'text-gray-900' : 'text-gray-500'}`}>
                        {value}
                    </span>
                    <Edit2 size={12} className="text-[#800020] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
            </div>
        );
    };

    const FilterItemRow = ({ label, value, isChecked, type = 'select', filterKey }) => {
        if (type === 'checkbox') {
            return (
                <div onClick={() => updateFilter(filterKey, !isChecked)} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div>
                        <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                        <p className="text-[11px] text-gray-500 mt-1">{value}</p>
                    </div>
                    <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${isChecked ? 'bg-[#800020] border-[#800020]' : 'border-gray-300'}`}>
                        {isChecked && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                    </div>
                </div>
            );
        }
        return (
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-[13px] text-gray-800">{label}</span>
                <div className="flex items-center gap-2 max-w-[50%]">
                    <span className="text-[13px] font-medium text-gray-900 truncate">{value}</span>
                    <Edit2 size={12} className="text-gray-400 group-hover:text-[#800020]" />
                </div>
            </div>
        );
    };

    const DatePill = ({ label, active }) => (
        <button
            onClick={() => updateFilter('profileCreatedDate', label)}
            className={`px-4 py-1.5 rounded-lg border text-xs font-medium transition-colors ${active ? 'border-[#800020] text-[#800020] bg-red-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <div className="px-4 md:px-6 py-3 bg-white border-b border-gray-100 flex gap-2 flex-wrap z-10">
                <button
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-[12px] font-medium text-gray-700 hover:bg-gray-50 shrink-0 shadow-sm"
                >
                    <SlidersHorizontal size={12} className="text-gray-500" /> Filter
                </button>

                <div className="relative shrink-0">
                    <button
                        onClick={() => {
                            setTempSortBy(sortBy);
                            setShowSortModal(true);
                        }}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-none border text-[12px] font-medium transition-all shadow-sm active:scale-95 ${sortBy !== 'Relevance' ? 'border-[#800020] bg-red-50 text-[#800020]' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        Sort by: {sortBy} <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <button
                    onClick={() => setShowNotSeen(!showNotSeen)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-medium shrink-0 transition-colors shadow-sm ${showNotSeen ? 'border-[#800020] bg-red-50 text-[#800020]' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Not seen
                </button>

                <button
                    onClick={() => setShowWithPhoto(!showWithPhoto)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-medium shrink-0 transition-colors shadow-sm ${showWithPhoto ? 'border-[#800020] bg-red-50 text-[#800020]' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Profiles with photo
                </button>

                <button
                    onClick={() => setShowWithHoroscope(!showWithHoroscope)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[12px] font-medium shrink-0 transition-colors shadow-sm ${showWithHoroscope ? 'border-[#800020] bg-red-50 text-[#800020]' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Profiles with horoscope
                </button>
            </div>

            {/* Main Content Area: Profiles - Responsive Grid */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-3 sm:px-6 py-6 border-t md:border-none border-gray-200">
                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 size={32} className="animate-spin text-[#800020]" />
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
                            className="mt-4 px-6 py-2 bg-[#800020] text-[#D4AF37] rounded-lg font-bold hover:bg-[#600318] transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 sm:px-2">
                        {filteredProfiles.map((profile, i) => (
                            <ProfileCard key={profile._id || i} profile={profile} />
                        ))}
                    </div>
                )}
            </div>

            {/* RESPONSIVE FILTER MODAL / SIDEBAR */}
            <AnimatePresence>
                {showFilterModal && (
                    <>
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
                            <div className="bg-[#800020] px-4 py-4 flex items-center justify-between shadow-md shrink-0 rounded-none">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setShowFilterModal(false)} className="text-[#D4AF37] hover:bg-white/10 p-1.5 rounded-none transition-colors active:scale-90">
                                        {window.innerWidth > 768 ? <X size={24} /> : <ArrowLeft size={24} />}
                                    </button>
                                    <h2 className="text-[#D4AF37] text-lg font-bold tracking-wide font-serif italic">Refine Filters</h2>
                                </div>
                                <button
                                    onClick={() => setFilters({
                                        citizenship: 'Any',
                                        countryLivingIn: 'Any',
                                        age: '23 Yrs - 30 Yrs',
                                        height: "4'9\" - 5'9\"",
                                        profileCreatedBy: 'Any',
                                        maritalStatus: 'Never Married',
                                        motherTongue: 'Kannada',
                                        occupation: 'Any',
                                        annualIncome: 'Any',
                                        employmentType: 'Any',
                                        education: "Bachelor's - Engineering/Technology",
                                        eatingHabits: 'Any',
                                        drinkingHabits: "Doesn't Matter",
                                        smokingHabits: "Doesn't Matter",
                                        familyStatus: 'Any',
                                        familyType: 'Any',
                                        familyValue: 'Any',
                                        profileCreatedDate: 'All',
                                        mutualMatches: false,
                                        photosOnly: false
                                    })}
                                    className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto pb-24 shadow-inner">
                                <FilterSection title="Location Details">
                                    <AutocompleteFilterRow label="Citizenship" value={filters.citizenship} filterKey="citizenship" />
                                    <AutocompleteFilterRow label="Country Living In" value={filters.countryLivingIn} filterKey="countryLivingIn" />
                                </FilterSection>
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
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-4 shrink-0 shadow-lg z-10">
                                <div className="text-center mb-3 text-sm font-medium text-gray-600 font-serif italic">
                                    <span className="font-bold text-gray-900">{filteredProfiles.length}</span> matches found
                                </div>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="w-full py-4 bg-[#800020] text-[#D4AF37] rounded-none font-bold uppercase tracking-widest hover:bg-[#600318] transition-all active:scale-[0.98] shadow-lg shadow-[#800020]/20"
                                >
                                    Show Matches
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* SORT MODAL */}
                {showSortModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                            onClick={() => setShowSortModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-none shadow-2xl max-w-md mx-auto"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight font-serif">Sort matches by:</h3>
                                <button onClick={() => setShowSortModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-2">
                                {[
                                    { id: 'Last active', label: 'Last active', desc: 'Members who recently logged-in will be shown first' },
                                    { id: 'Date created', label: 'Date created', desc: 'Profiles created recently will be shown first' },
                                    { id: 'Distance', label: 'Distance', desc: 'Profiles nearby will be shown first' },
                                    { id: 'Latest photos', label: 'Latest photos', desc: 'Members who have recently added photos will be shown first' },
                                ].map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => setTempSortBy(option.id)}
                                        className="flex items-start justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                                    >
                                        <div className="space-y-1">
                                            <p className={`text-sm font-black uppercase tracking-tight ${tempSortBy === option.id ? 'text-[#800020]' : 'text-gray-900'}`}>{option.label}</p>
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{option.desc}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${tempSortBy === option.id ? 'border-[#800020] bg-white' : 'border-gray-300'}`}>
                                            {tempSortBy === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#800020]"></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 flex gap-3 border-t border-gray-50 mt-2">
                                <button
                                    onClick={() => {
                                        setSortBy('Relevance');
                                        setShowSortModal(false);
                                    }}
                                    className="flex-1 py-3 text-[#800020] border border-[#800020] font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-[#800020]/5 transition-all active:scale-95"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy(tempSortBy);
                                        setShowSortModal(false);
                                    }}
                                    className="flex-1 py-3 bg-[#800020] text-[#D4AF37] font-black uppercase tracking-widest text-[10px] rounded-none shadow-lg shadow-[#800020]/20 hover:bg-[#600318] transition-all active:scale-95"
                                >
                                    Apply
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
