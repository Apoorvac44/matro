import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import * as api from '../../services/api';

const AdminLogin = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.login(formData);

            // Check if the user is actually an admin before letting them in
            if (!data.isAdmin && data.role !== 'MAIN_ADMIN') {
                setError("Access Denied: You do not have administrator privileges.");
                setIsLoading(false);
                return;
            }

            login(data);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Invalid admin credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative font-sans">

            <Link to="/" className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors">
                <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Back</span>
            </Link>

            <div className="w-full max-w-[400px]">
                <div className="flex flex-col items-center justify-center text-center mb-10">
                    <div className="w-20 h-20 bg-[#FFF9D6] border border-[#F2E8A9] rounded-[24px] flex items-center justify-center mb-8 shadow-sm">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFF9D6" stroke="#800020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                    <h3 className="text-[#D4AF37] text-[11px] font-bold tracking-[0.3em] uppercase mb-3">Welcome Back</h3>
                    <h2 className="text-[44px] leading-none mb-3 text-[#001738]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 700 }}>Namaste</h2>
                    <p className="text-sm text-gray-500 font-medium">Reconnecting you with destiny.</p>
                </div>
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-[#800020] text-sm font-medium flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 px-2">
                    <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-100 text-gray-800 rounded-[1.25rem] py-3.5 pl-12 pr-4 text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] transition-all shadow-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] ml-1">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-100 text-gray-800 rounded-[1.25rem] py-3.5 pl-12 pr-12 text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-[#800020] focus:border-[#800020] transition-all shadow-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <button type="button" className="text-[10px] font-bold text-[#D4AF37] hover:text-[#bda03c] tracking-[0.1em] uppercase transition-colors">
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#800020] hover:bg-[#6b001a] text-white rounded-[1.25rem] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-[0_10px_20px_-10px_rgba(128,0,32,0.6)] mt-4"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>Sign In <ArrowLeft size={16} className="rotate-180 ml-1" /></>
                        )}
                    </button>

                    <div className="border-t border-gray-100 mt-10 pt-8 text-center flex items-center justify-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Here?</span>
                        <Link to="/register" className="text-[10px] font-bold text-[#800020] hover:text-[#6b001a] uppercase tracking-widest transition-colors">
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
