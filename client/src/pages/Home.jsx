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
                <div className="container mx-auto px-6 lg:px-24 relative z-10 w-full">
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-10 lg:gap-20">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full md:w-1/2 text-center md:text-left"
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-black text-slate-900 leading-[1.1] tracking-tight mb-3 md:mb-6 italic">
                                Find Your <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020] bg-[length:200%_auto] animate-shimmer">
                                    Eternal Match
                                </span>
                            </h1>

                            <p className="text-base md:text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-xl mb-10 mx-auto md:mx-0">
                                Meet verified people who share your values and culture. A safe place to find your partner.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start justify-center md:justify-start">
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
                            className="w-full md:w-1/2 relative flex justify-center md:justify-end shrink-0"
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
            <section className="py-24 md:py-32 bg-white relative">
                <div className="container mx-auto px-6 lg:px-24">
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-3 block"
                        >
                            Why Choose Milana
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic">Designed for Eternal Connections</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                        {[
                            { icon: <Search size={24} />, title: "Verified Profiles", desc: "Every profile is manually screened with mandatory ID verification for your safety." },
                            { icon: <Heart size={24} />, title: "Soulmate Focus", desc: "We prioritize values, culture, and long-term compatibility over casual dating." },
                            { icon: <Users size={24} />, title: "Premium Network", desc: "Access a curated community of educated professionals seeking life partners." }
                        ].map((feature, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="text-center group p-10 rounded-[3rem] hover:bg-[#FFFDD0]/30 transition-all border border-transparent hover:border-[#D4AF37]/10"
                            >
                                <div className="w-20 h-20 bg-[#800020]/5 rounded-[2rem] flex items-center justify-center text-[#800020] mx-auto mb-10 group-hover:bg-[#800020] group-hover:text-[#D4AF37] transition-all shadow-lg group-hover:shadow-[#800020]/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[#800020] mb-5 italic">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-base font-light">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 md:py-32 bg-[#FFFDD0]/10">
                <div className="container mx-auto px-6 lg:px-24">
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-3 block"
                        >
                            Your Journey to "I Do"
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic">How It Works</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Create Profile", desc: "Register and fill in your details to help us find the right match." },
                            { step: "02", title: "Get Verified", desc: "Our team verifies your profile to ensure a trustworthy community." },
                            { step: "03", title: "Find Matches", desc: "Use our advanced filters to find profiles that match your values." },
                            { step: "04", title: "Start Talking", desc: "Connect securely with your matches and start your story." }
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="relative bg-white p-10 rounded-[2.5rem] shadow-xl shadow-[#800020]/5 border border-[#800020]/5 hover:-translate-y-2 transition-transform"
                            >
                                <span className="absolute top-6 right-8 text-5xl font-serif font-black text-[#800020]/5 italic">{item.step}</span>
                                <h3 className="text-xl font-bold text-[#800020] mb-4 uppercase tracking-widest">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="py-24 md:py-32 bg-[#800020] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] -mr-64 -mt-64"></div>

                <div className="container mx-auto px-6 lg:px-24 relative z-10">
                    <div className="text-center mb-20 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-3 block">Milana Unions</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-black italic">Beautiful Success Stories</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            { name: "Aditi & Rahul", story: "Finding someone who shared the same spiritual values was important. Milana made it happen.", city: "Mumbai" },
                            { name: "Priya & Vikram", story: "The verification process gave me the confidence to meet people. I found my best friend here.", city: "Delhi" },
                            { name: "Meera & Arjun", story: "Simple, elegant, and effective. We are forever grateful to Milana for bringing us together.", city: "Bangalore" }
                        ].map((story, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-white group hover:bg-white/10 transition-all cursor-default"
                            >
                                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] mb-8">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                <p className="text-lg font-light leading-relaxed mb-10 italic">"{story.story}"</p>
                                <div>
                                    <h4 className="font-serif font-black text-xl text-[#D4AF37] italic">{story.name}</h4>
                                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40">{story.city}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
