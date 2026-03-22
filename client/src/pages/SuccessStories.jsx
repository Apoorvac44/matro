import React from 'react';
import { Trophy, ArrowLeft, Heart, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessStories = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-serif italic text-gray-900 italic">Success Stories</h1>
                        <p className="text-sm text-gray-500 mt-2 uppercase font-bold tracking-widest">Real stories of hearts finding their way home</p>
                    </div>
                    <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#800020] transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            names: 'Ananya & Rohan',
                            date: 'September 2025',
                            text: 'We found each other through Milana in just two months. It felt like destiny!',
                            color: 'from-rose-50 to-pink-50'
                        },
                        {
                            names: 'Priya & Arjun',
                            date: 'January 2026',
                            text: 'The shared values and community focus made it so easy to connect deeply.',
                            color: 'from-amber-50 to-orange-50'
                        },
                    ].map((story, i) => (
                        <div key={i} className={`bg-gradient-to-br ${story.color} p-10 rounded-[3rem] border border-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500`}>
                            <Quote className="absolute top-8 right-8 text-gray-300/30 scale-[3]" size={40} />
                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Heart size={24} className="text-[#800020] fill-[#800020]/10" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 mb-2">{story.names}</h2>
                                <p className="text-[10px] font-black text-[#800020]/60 uppercase tracking-widest mb-6">{story.date}</p>
                                <p className="text-sm text-gray-600 font-medium italic leading-relaxed">"{story.text}"</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                        <Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
                        Endless Possibilities
                    </div>
                    <h2 className="text-2xl font-serif italic text-gray-900 mb-8 px-4">Ready to start your own story?</h2>
                    <Link to="/explore" className="px-12 py-5 bg-[#800020] text-[#D4AF37] rounded-3xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-[#600318] transition-all shadow-xl shadow-[#800020]/20 active:scale-95 leading-none">
                        Explore Matches
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessStories;
