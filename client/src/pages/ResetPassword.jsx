import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Save, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post(`/api/users/reset-password/${token}`, { password });
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Token is invalid or has expired.');
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
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                        <Lock className="text-[#D4AF37]" size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-[#D4AF37] uppercase tracking-widest">New Password</h1>
                    <p className="text-white/60 text-xs mt-2 font-medium tracking-wider uppercase">Secure your destiny</p>
                </div>

                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            <p className="text-gray-600 text-center mb-8 font-medium">
                                Please enter your new password below.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-[#800020]/20 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-900 group-hover:bg-gray-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800020] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
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
                                            <span>Update Password</span>
                                            <Save size={18} />
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
                            <h2 className="text-xl font-black text-gray-900 mb-4">Success!</h2>
                            <p className="text-gray-600 mb-8 font-medium">
                                Your password has been successfully reset. Redirecting you to login...
                            </p>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                    className="h-full bg-green-500"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
