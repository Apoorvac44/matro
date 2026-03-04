import React from 'react';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen py-32 px-6 relative overflow-hidden bg-white">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-maroon/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFFDD0]/40 rounded-full -translate-x-1/2 translate-y-1/2 blur-[120px]"></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-28">
                    <p className="text-brand-maroon font-black uppercase tracking-[0.5em] text-[10px] mb-6 animate-fade-in">Divine Resonance</p>
                    <h1 className="text-7xl font-black premium-gradient-text tracking-tighter mb-8 italic">Oracle of Connection</h1>
                    <p className="text-gray-400 font-medium max-w-xl mx-auto italic leading-relaxed text-lg">
                        Seeking clarity or wish to weave new paths? The architects of this sanctuary await your whispers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-28">
                    <div className="glass-card p-12 shadow-2xl border-brand-maroon/5 text-center group hover:-translate-y-2 transition-all duration-500">
                        <div className="w-20 h-20 bg-[#FFFDD0] rounded-3xl flex items-center justify-center text-[#800020] mx-auto mb-8 shadow-xl group-hover:bg-[#800020] group-hover:text-white transition-all duration-500">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-sm font-black text-brand-maroon uppercase tracking-widest mb-3">Ethereal Mail</h3>
                        <p className="text-gray-500 font-medium italic">resonance@matro.com</p>
                    </div>

                    <div className="glass-card p-12 shadow-2xl border-brand-maroon/5 text-center group hover:-translate-y-2 transition-all duration-500">
                        <div className="w-20 h-20 bg-[#FFFDD0] rounded-3xl flex items-center justify-center text-[#800020] mx-auto mb-8 shadow-xl group-hover:bg-[#800020] group-hover:text-white transition-all duration-500">
                            <Phone size={32} />
                        </div>
                        <h3 className="text-sm font-black text-brand-maroon uppercase tracking-widest mb-3">Vocal Resonance</h3>
                        <p className="text-gray-500 font-medium italic">+91 999 888 7777</p>
                    </div>

                    <div className="glass-card p-12 shadow-2xl border-brand-maroon/5 text-center group hover:-translate-y-2 transition-all duration-500">
                        <div className="w-20 h-20 bg-[#FFFDD0] rounded-3xl flex items-center justify-center text-[#800020] mx-auto mb-8 shadow-xl group-hover:bg-[#800020] group-hover:text-white transition-all duration-500">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-sm font-black text-brand-maroon uppercase tracking-widest mb-3">Sanctuary Core</h3>
                        <p className="text-gray-500 font-medium italic">Celestial Hub, Bangalore</p>
                    </div>
                </div>

                <div className="glass-card p-12 md:p-24 shadow-2xl border-brand-maroon/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                        <Sparkles size={200} className="text-brand-maroon" />
                    </div>

                    <h2 className="text-4xl font-black text-brand-maroon uppercase tracking-[0.2em] mb-16 italic">Whisper to the Architects</h2>
                    <form className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.3em] ml-2">Identity / Full Name</label>
                                <input type="text" className="w-full p-6 rounded-[32px] bg-gray-50 border-none focus:ring-4 focus:ring-[#800020]/5 outline-none transition-all text-sm font-medium italic placeholder:text-gray-300" placeholder="Your essence..." />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.3em] ml-2">Ethereal Address</label>
                                <input type="email" className="w-full p-6 rounded-[32px] bg-gray-50 border-none focus:ring-4 focus:ring-[#800020]/5 outline-none transition-all text-sm font-medium italic placeholder:text-gray-300" placeholder="Your portal..." />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-brand-maroon uppercase tracking-[0.3em] ml-2">Manifestation / Message</label>
                            <textarea className="w-full p-8 rounded-[40px] bg-gray-50 border-none focus:ring-4 focus:ring-[#800020]/5 outline-none transition-all text-sm font-medium italic min-h-[200px] resize-none placeholder:text-gray-300" placeholder="How may we serve your journey?"></textarea>
                        </div>
                        <button className="btn-primary w-full py-6 rounded-[32px] font-black uppercase tracking-[0.5em] text-xs flex items-center justify-center gap-4 shadow-2xl hover:shadow-brand-maroon/30 transition-all active:scale-95">
                            <Send size={20} /> Manifest Whisper
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
