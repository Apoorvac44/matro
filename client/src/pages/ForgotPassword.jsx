import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/users/forgot-password', { email });
            setIsSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-[#800020]/10 overflow-hidden"
            >
                <div className="bg-[#800020] p-8 text-center relative">
                    <Link to="/login" className="absolute left-6 top-8 text-[#D4AF37] hover:scale-110 transition-transform">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                        <Mail className="text-[#D4AF37]" size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-[#D4AF37] uppercase tracking-widest">Forgot Password</h1>
                    <p className="text-white/60 text-xs mt-2 font-medium tracking-wider uppercase">Reconnecting you with destiny</p>
                </div>

                <div className="p-8">
                    {!isSent ? (
                        <>
                            <p className="text-gray-600 text-center mb-8 font-medium">
                                Enter your registered email address and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={20} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#800020]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-900 group-hover:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#800020] text-[#D4AF37] rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#800020]/30 hover:bg-[#600318] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Reset Link</span>
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="text-green-500" size={48} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 mb-4">Check Your Email</h2>
                            <p className="text-gray-600 mb-8 font-medium">
                                We've sent a password reset link to <span className="text-[#800020] font-bold">{email}</span>. Please check your inbox and follow the instructions.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block px-8 py-3 bg-gray-100 text-[#800020] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Back to Login
                            </Link>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
