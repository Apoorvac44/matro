import React from 'react';
import { Search as SearchIcon, ArrowLeft, Filter, SlidersHorizontal, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif italic text-gray-900">Search</h1>
                        <p className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-widest">Find your perfect match with advanced filters</p>
                    </div>
                    <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Search by keyword</label>
                            <div className="relative group">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                <input className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-[#800020]/5 transition-all font-medium text-sm" placeholder="Community, Profession, etc." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                <input className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-[#800020]/5 transition-all font-medium text-sm" placeholder="City or State" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-50">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-all">
                            <Users size={16} /> Age Range
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-all">
                            <Filter size={16} /> Community
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-all">
                            <SlidersHorizontal size={16} /> More Filters
                        </button>
                    </div>

                    <div className="mt-10">
                        <button className="w-full py-5 bg-[#800020] text-[#D4AF37] rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-[#600318] transition-all shadow-xl shadow-[#800020]/20 active:scale-95 leading-none">
                            Find Matches
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
