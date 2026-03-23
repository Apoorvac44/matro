import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Heart, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: zodResolver(loginSchema)
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setLoginError(null);
        try {
            const response = await api.login(data);
            login(response.data);
            navigate('/dashboard');
        } catch (error) {
            setLoginError(error.message || "Failed to log in. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#FFFDD0]/20 min-h-screen flex items-center justify-center p-6 pt-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#800020]/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="max-w-[400px] w-full bg-white rounded-none shadow-2xl shadow-[#800020]/10 px-6 py-8 md:p-10 border border-[#800020]/5 relative z-10">
                <div className="text-center mb-8">
                    <div className="bg-[#FFFDD0] w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#D4AF37]/20">
                        <Heart className="text-[#800020] fill-[#800020]/20" size={28} />
                    </div>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-2 block"
                    >
                        Welcome Back
                    </motion.span>
                    <h1 className="text-3xl font-serif font-black text-gray-900 italic">Namaste</h1>
                    <p className="text-gray-400 text-xs mt-1 font-medium">Reconnecting you with destiny.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#800020] transition-colors" size={16} />
                            <input {...register('email')} className="w-full pl-11 pr-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020]/30 focus:bg-white outline-none transition-all font-medium text-sm" placeholder="Enter your email" />
                        </div>
                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#800020] transition-colors" size={16} />
                            <input type="password" {...register('password')} className="w-full pl-11 pr-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020]/30 focus:bg-white outline-none transition-all font-medium text-sm" placeholder="••••••••" />
                        </div>
                        {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-end pt-1">
                        <button type="button" className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:text-[#800020] transition-colors">Forgot Password?</button>
                    </div>

                    <AnimatePresence>
                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 text-red-500 p-3 rounded-none text-xs font-bold text-center border border-red-100"
                            >
                                {loginError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#800020] text-[#D4AF37] rounded-none font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 hover:shadow-[#D4AF37]/10 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
                        >
                            {isLoading ? 'Authenticating...' : <><span className="mr-2">Sign In</span> <ArrowRight className="inline" size={14} /></>}
                        </button>

                        <Link
                            to="/admin/login"
                            className="w-full py-4 bg-white/50 border border-[#800020]/20 text-[#800020] rounded-none font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[#800020]/5 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                        >
                            <ShieldCheck className="inline mr-2" size={14} /> Admin Login
                        </Link>
                    </div>
                </form>

                <div className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest border-t border-gray-50 pt-6">
                    <span className="text-gray-400">New here?</span>
                    <Link to="/register" className="ml-2 text-[#800020] hover:text-[#600318] hover:underline">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
