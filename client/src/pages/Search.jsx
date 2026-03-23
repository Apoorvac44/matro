import { Search as SearchIcon, ArrowLeft, Filter, X, Loader2, MapPin, Briefcase, GraduationCap, Heart, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import ProfileCard from '../components/ProfileCard';
import { motion, AnimatePresence } from 'framer-motion';

const SearchPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState(user?.location || '');
    const [profession, setProfession] = useState(user?.profession || '');
    const [education, setEducation] = useState(user?.education || '');
    const [allProfiles, setAllProfiles] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const { data } = await api.getProfiles();
                setAllProfiles(data);

                // If user has details, we could pre-filter or show recommendations
                if (user?.location || user?.profession) {
                    const q = keyword.toLowerCase();
                    const filtered = data.filter(p => {
                        const matchLocation = !location || p.location?.toLowerCase().includes(location.toLowerCase());
                        const matchProfession = !profession || p.profession?.toLowerCase().includes(profession.toLowerCase());
                        return matchLocation && matchProfession;
                    }).slice(0, 12);
                    if (filtered.length > 0) {
                        setResults(filtered);
                        setSearched(true);
                    }
                }
            } catch (err) { console.error(err); }
        };
        fetchInitial();
    }, [user]);

    const handleSearch = () => {
        setLoading(true);
        setSearched(true);
        setTimeout(() => {
            const q = keyword.toLowerCase();
            const filtered = allProfiles.filter(p => {
                const matchKeyword = !keyword ||
                    p.name?.toLowerCase().includes(q) ||
                    p.profession?.toLowerCase().includes(q) ||
                    p.aboutMe?.toLowerCase().includes(q) ||
                    p.interests?.some(i => i.toLowerCase().includes(q));
                const matchLocation = !location ||
                    p.location?.toLowerCase().includes(location.toLowerCase()) ||
                    p.workLocation?.toLowerCase().includes(location.toLowerCase());
                const matchProfession = !profession ||
                    p.profession?.toLowerCase().includes(profession.toLowerCase());
                const matchEducation = !education ||
                    p.education?.toLowerCase().includes(education.toLowerCase());
                return matchKeyword && matchLocation && matchProfession && matchEducation;
            });
            setResults(filtered);
            setLoading(false);
        }, 500);
    };

    const clearFilters = () => {
        setKeyword(''); setLocation(''); setProfession(''); setEducation('');
        setSearched(false); setResults([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-16 md:top-20 z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-xl font-serif italic text-gray-900">Search Matches</h1>
                    </div>
                    {/* Search bar */}
                    <div className="relative mb-3">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#800020]/10 focus:border-[#800020]/30 transition-all font-medium text-sm"
                            placeholder="Name, profession, interests..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        {keyword && (
                            <button onClick={() => setKeyword('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {/* Filter Row */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <div className="relative shrink-0">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input className="pl-8 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs font-medium w-36 focus:ring-2 focus:ring-[#800020]/10" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                        <div className="relative shrink-0">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input className="pl-8 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs font-medium w-36 focus:ring-2 focus:ring-[#800020]/10" placeholder="Profession" value={profession} onChange={e => setProfession(e.target.value)} />
                        </div>
                        <div className="relative shrink-0">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input className="pl-8 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs font-medium w-36 focus:ring-2 focus:ring-[#800020]/10" placeholder="Education" value={education} onChange={e => setEducation(e.target.value)} />
                        </div>
                        {(keyword || location || profession || education) && (
                            <button onClick={clearFilters} className="shrink-0 px-3 py-2 rounded-xl bg-red-50 text-red-400 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1">
                                <X size={12} /> Clear
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full mt-3 py-3 bg-[#800020] text-[#D4AF37] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#600318] transition-all shadow-xl shadow-[#800020]/20 active:scale-95"
                    >
                        Search Matches
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 size={32} className="animate-spin text-[#800020]" />
                    </div>
                ) : searched ? (
                    results.length > 0 ? (
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {results.map(p => <ProfileCard key={p._id} profile={p} />)}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SearchIcon size={28} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">No matches found</h3>
                            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-[#FFFDD0] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={32} className="text-[#800020]" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Search for Your Match</h3>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto">Enter a keyword, location, or use filters above to find the perfect match for you.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
