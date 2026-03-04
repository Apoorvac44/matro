import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroRitual from '../assets/hero_ritual.png';

const Home = () => {
    return (
        <div className="bg-[#FFFDD0]/20 min-h-screen relative overflow-hidden flex flex-col">
            {/* Minimalist Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#800020]/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>

            {/* Hero Section */}
            <section className="relative md:min-h-[90vh] flex items-center pt-24 md:pt-32 pb-4 md:pb-20 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-24 relative z-10 w-full overflow-hidden">
                    <div className="flex flex-row items-center gap-4 md:gap-10 lg:gap-20">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 w-1/2 text-left"
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-black text-slate-900 leading-[1.1] tracking-tight mb-3 md:mb-6 italic">
                                Find Your <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020] bg-[length:200%_auto] animate-shimmer">
                                    Eternal Match
                                </span>
                            </h1>

                            <p className="text-[10px] sm:text-xs md:text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-xl mb-6 md:mb-10 mx-0">
                                Meet verified people who share your values and culture. A safe place to find your partner.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-start justify-start">
                                <Link to="/register" className="w-full sm:w-auto px-4 py-2.5 md:px-12 md:py-5 bg-[#800020] text-white rounded-xl md:rounded-2xl text-[10px] sm:text-xs md:text-base font-bold shadow-[0_20px_40px_-15px_rgba(128,0,32,0.3)] transition-all hover:scale-105 active:scale-95 text-center leading-none flex items-center justify-center min-h-[36px] md:min-h-[60px]">
                                    Get Started
                                </Link>
                                <Link to="/explore" className="w-full sm:w-auto px-4 py-2.5 md:px-12 md:py-5 bg-white text-[#800020] border border-[#800020]/10 rounded-xl md:rounded-2xl text-[10px] sm:text-xs md:text-base font-bold hover:bg-gray-50 transition-all shadow-sm text-center leading-none flex items-center justify-center min-h-[36px] md:min-h-[60px]">
                                    Explore Matches
                                </Link>
                            </div>
                        </motion.div>

                        {/* Image Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="flex-1 w-1/2 relative flex justify-end shrink-0"
                        >
                            <div className="relative z-10 w-full max-w-[500px] aspect-[4/5] md:aspect-square rounded-3xl lg:rounded-[4rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-[4px] sm:border-[6px] lg:border-[12px] border-white group">
                                <img
                                    src={heroRitual}
                                    alt="Indian Wedding Ritual Hands"
                                    className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/40 via-transparent to-transparent"></div>
                            </div>

                            {/* Decorative Background Circles */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 md:w-64 md:h-64 bg-[#D4AF37]/10 rounded-full blur-2xl md:blur-3xl -z-10 animate-pulse"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 md:w-64 md:h-64 bg-[#800020]/10 rounded-full blur-2xl md:blur-3xl -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Premium Features Section */}
            <section className="py-12 md:py-32 bg-white relative">
                <div className="container mx-auto px-6 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 border-t border-gray-100 pt-8 md:pt-20">
                        {[
                            { icon: <Search size={24} />, title: "Verified Profiles", desc: "Every profile is manually screened for your safety and trust." },
                            { icon: <Heart size={24} />, title: "Soulmate Focus", desc: "For those seeking meaningful, lifelong relationships and values." },
                            { icon: <Users size={24} />, title: "Premium Network", desc: "Access a curated community of like-minded individuals." }
                        ].map((feature, i) => (
                            <div key={i} className="text-center group p-8 rounded-[2.5rem] hover:bg-[#FFFDD0]/30 transition-all">
                                <div className="w-16 h-16 bg-[#800020]/5 rounded-2xl flex items-center justify-center text-[#800020] mx-auto mb-8 group-hover:bg-[#800020] group-hover:text-white transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-serif font-bold text-[#800020] mb-4 italic">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm font-light">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
