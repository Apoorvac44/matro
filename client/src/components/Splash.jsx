import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

const Particle = ({ delay }) => (
    <motion.div
        initial={{ y: '100vh', x: Math.random() * 100 + 'vw', opacity: 0, scale: 0 }}
        animate={{
            y: '-10vh',
            opacity: [0, 0.5, 0],
            scale: [0, 1.2, 0.5],
            rotate: [0, 180, 360]
        }}
        transition={{
            duration: Math.random() * 5 + 5,
            delay,
            repeat: Infinity,
            ease: "linear"
        }}
        className="absolute w-1 h-1 bg-yellow-400 rounded-full blur-[1px] pointer-events-none"
    />
);

const Splash = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        setParticles([...Array(20)].map((_, i) => i));
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#4a0404] flex flex-col items-center justify-center overflow-hidden">
            {/* Luxurious Deep Maroon Radial Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#800020]/40 via-[#4a0404] to-[#2a0202]"></div>

            {/* Dynamic Gold Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map((p) => (
                    <Particle key={p} delay={p * 0.5} />
                ))}
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-900/5 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Glassmorphism Logo Container */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative mb-12"
                >
                    <div className="w-28 h-28 bg-white/5 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <Heart size={48} className="text-[#FFD700] fill-[#FFD700]/10 relative z-10 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" />

                        {/* Shimmer Effect */}
                        <motion.div
                            animate={{ x: ['100%', '-100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                        />
                    </div>
                    {/* Ring Decoration */}
                    <div className="absolute -inset-2 border-2 border-[#D4AF37]/20 rounded-[3rem] animate-[spin_10s_linear_infinite]"></div>
                </motion.div>

                <h1 className="text-7xl font-serif text-white tracking-tight mb-2 italic">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#FFFDD0] via-[#D4AF37] to-[#800020] drop-shadow-sm">
                        Milana
                    </span>
                </h1>

                <div className="flex items-center gap-4 w-full justify-center">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/50"></div>
                    <p className="text-[#D4AF37] font-medium uppercase tracking-[0.5em] text-xs">
                        Matrimony
                    </p>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/50"></div>
                </div>

                {/* Elegant Loading Indication */}
                <div className="mt-16 flex gap-3">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0.1, 0.8, 0.1],
                                scale: [1, 1.5, 1],
                                backgroundColor: i === 1 ? '#FFD700' : '#FFF'
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeInOut"
                            }}
                            className="w-1.5 h-1.5 rounded-full opacity-20 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        />
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-2"
            >
                <div className="flex items-center gap-2 text-[#FFFDD0]/60 text-[10px] font-medium tracking-[0.4em] uppercase">
                    <ShieldCheck size={12} className="text-[#D4AF37]" />
                    Safe & Tradition Bound
                </div>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
            </motion.div>
        </div>
    );
};

export default Splash;
