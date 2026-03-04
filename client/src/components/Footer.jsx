import React from 'react';
import { Heart, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#800020] text-white pt-24 pb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFFDD0] to-[#D4AF37]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center gap-12">
                    <div className="flex flex-col items-center"> {/* Added a wrapper div for logo and matrimony text */}
                        <div className="flex items-center gap-3 mb-8 group">
                            <div className="bg-[#FFFDD0] p-2.5 rounded-xl rotate-3 group-hover:rotate-12 transition-all">
                                <Heart className="text-[#800020] fill-[#800020]" size={24} />
                            </div>
                            <span className="text-3xl font-serif font-bold italic text-[#FFFDD0] tracking-tight">Milana</span>
                        </div>
                        <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] mt-1 ml-1">Matrimony</p>
                    </div>

                    <p className="max-w-md text-[#FFFDD0]/70 font-light text-center leading-relaxed text-lg italic">
                        "Helping you find a partner with the same values, tradition, and trust."
                    </p>

                    <div className="flex gap-8">
                        {[Instagram, Twitter, Facebook].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#800020] transition-all"
                            >
                                <Icon size={24} />
                            </a>
                        ))}
                    </div>

                    <div className="pt-16 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} Milana Matrimony. Sacredly Handcrafted in India.
                        </div>
                        <div className="flex gap-10 text-[10px] font-bold text-[#FFFDD0]/60 uppercase tracking-widest">
                            {/* Assuming these links are hardcoded or mapped from an array */}
                            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-[#D4AF37] transition-colors">Expert Help</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
