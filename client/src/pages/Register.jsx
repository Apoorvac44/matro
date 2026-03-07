import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User, Mail, Lock, Phone, Calendar,
    CheckCircle, Eye, EyeOff, Heart,
    ChevronRight, ChevronLeft, MapPin,
    Briefcase, GraduationCap, Coins,
    ArrowRight, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const registrationSchema = z.object({
    // Step 1
    name: z.string().min(2, 'Name must be at least 2 characters'),
    gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
    dob: z.string().min(1, 'Date of birth is required'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    // Step 2
    religion: z.string().min(1, 'Religion is required'),
    caste: z.string().optional(),
    motherTongue: z.string().min(1, 'Mother tongue is required'),
    maritalStatus: z.enum(['Single', 'Divorced', 'Widowed', 'Other'], { required_error: 'Marital status is required' }),
    height: z.string().min(1, 'Height is required'),
    location: z.string().min(1, 'Location is required'),
    // Step 3
    education: z.string().min(1, 'Education is required'),
    profession: z.string().min(1, 'Profession is required'),
    income: z.string().optional(),
    workLocation: z.string().min(1, 'Work location is required'),
    // Step 4
    prefAgeRange: z.string().optional(),
    prefLocation: z.string().optional(),
    prefEducation: z.string().optional(),
    prefProfession: z.string().optional(),
    // Step 5
    casteCertificate: z.any().optional(),
    aadharCard: z.any().optional(),
    // Step 6
    membership: z.string().default('Basic'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const Register = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [age, setAge] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [casteFileName, setCasteFileName] = useState('');
    const [aadharFileName, setAadharFileName] = useState('');

    const { register, handleSubmit, formState: { errors }, watch, trigger, setValue } = useForm({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange'
    });

    const dobValue = watch('dob');
    useEffect(() => {
        if (dobValue) {
            const birthDate = new Date(dobValue);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge);
        }
    }, [dobValue]);

    const nextStep = async () => {
        let fieldsToValidate = [];
        if (step === 1) fieldsToValidate = ['name', 'gender', 'dob', 'mobile', 'email', 'password', 'confirmPassword'];
        if (step === 2) fieldsToValidate = ['religion', 'motherTongue', 'maritalStatus', 'height', 'location'];
        if (step === 3) fieldsToValidate = ['education', 'profession', 'workLocation'];
        if (step === 4) fieldsToValidate = ['prefAgeRange', 'prefLocation', 'prefEducation', 'prefProfession'];
        if (step === 5) fieldsToValidate = ['casteCertificate', 'aadharCard'];

        const isValid = await trigger(fieldsToValidate);
        console.log(`Step ${step} validation - isValid:`, isValid);

        if (!isValid) {
            console.log("Validation errors:", errors);
        }

        if (isValid) {
            if (step === 1 && !otpVerified) {
                alert('Please verify your mobile number first');
                return;
            }
            console.log(`Transitioning from step ${step} to ${step + 1}`);
            setStep(step + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    const onSubmit = (data) => {
        console.log("Submission attempt at step:", step);
        if (step < 6) {
            console.log("Safeguard triggered: Redirecting to nextStep instead of dashboard.");
            nextStep();
            return;
        }

        // Frontend-only mock registration
        const mockUser = {
            _id: 'mock_user_' + Date.now(),
            name: data.name,
            email: data.email,
            membership: data.membership || 'Basic',
            token: 'mock_token_frontend_only',
            isAdmin: false // Ensure registered users are not admins
        };
        console.log("Registration successful, navigating to dashboard.");
        login(mockUser);
        navigate('/dashboard');
    };

    const renderProgress = () => (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.3em]">Phase {step} of 6</span>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{Math.round((step / 6) * 100)}% Complete</span>
            </div>
            <div className="h-1.5 bg-[#FFFDD0] rounded-full overflow-hidden border border-[#D4AF37]/10">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#800020] to-[#D4AF37]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 6) * 100}%` }}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFDD0]/20 flex items-center justify-center p-4 md:p-8 pt-28">
            <div className="max-w-6xl w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-[#800020]/5 overflow-hidden md:overflow-hidden flex flex-col md:flex-row min-h-[auto] md:min-h-[750px] border border-[#800020]/5">

                {/* Left Section - Premium Sidebar */}
                <div className="hidden lg:flex w-2/5 bg-[#800020] relative overflow-hidden flex-col justify-center p-16 text-white">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="relative z-10"
                    >
                        <div className="bg-[#D4AF37]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-lg border border-[#D4AF37]/30">
                            <Heart className="text-[#D4AF37] fill-[#D4AF37]/20" size={32} />
                        </div>
                        <h2 className="text-5xl font-serif font-black leading-tight mb-8 italic text-white/95">
                            The Art of Connection
                        </h2>
                        <p className="text-[#D4AF37] text-lg font-medium leading-relaxed max-w-xs">
                            Step into a sanctuary where hearts align and destinies converge.
                        </p>
                    </motion.div>

                    <div className="mt-auto relative z-10 grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-lg">
                            <h4 className="font-serif text-3xl font-bold text-[#D4AF37] mb-1">100%</h4>
                            <p className="text-[9px] text-white/50 uppercase font-bold tracking-widest">100% Verified</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-lg">
                            <h4 className="font-serif text-3xl font-bold text-[#D4AF37] mb-1">Secure</h4>
                            <p className="text-[9px] text-white/50 uppercase font-bold tracking-widest">Privacy PACT</p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="flex-1 p-6 md:p-20 relative">
                    <div className="max-w-xl mx-auto h-full flex flex-col">
                        <div className="mb-12 text-center lg:text-left">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-3 block"
                            >
                                Begin Your Eternal Journey
                            </motion.span>
                            <h1 className="text-4xl font-serif font-black text-gray-900 mb-3 italic">Milana Matrimony</h1>
                            <p className="text-gray-400 font-medium text-sm">Finding the partner meant for your eternal destiny.</p>
                        </div>

                        {renderProgress()}

                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Full Name *</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input {...register('name')} className="form-input-premium" placeholder="John Doe" />
                                                </div>
                                                {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.name.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Gender *</label>
                                                <div className="flex gap-4 pt-2">
                                                    {['Male', 'Female', 'Other'].map((g) => (
                                                        <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                                            <input type="radio" value={g} {...register('gender')} className="hidden peer" />
                                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-[#800020] peer-checked:bg-[#800020] transition-all"></div>
                                                            <span className="text-sm font-bold text-gray-600 group-hover:text-[#800020] transition-colors">{g}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.gender && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.gender.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Date of Birth * {age && `(${age} years)`}</label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input type="date" {...register('dob')} className="form-input-premium" />
                                                </div>
                                                {errors.dob && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.dob.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Mobile Number *</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input {...register('mobile')} className="form-input-premium" placeholder="10-digit number" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setOtpSent(true)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#800020] text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-[#112240] transition-colors"
                                                    >
                                                        {otpSent ? 'Resend' : 'Send OTP'}
                                                    </button>
                                                </div>
                                                {errors.mobile && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.mobile.message}</p>}
                                            </div>
                                        </div>

                                        {otpSent && !otpVerified && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-center">
                                                <input maxLength={4} onChange={(e) => { if (e.target.value === '1234') setOtpVerified(true); }} className="w-32 px-4 py-2 rounded-xl bg-white border border-blue-200 outline-none font-bold text-center tracking-[0.5em]" placeholder="1234" />
                                                <p className="text-xs font-bold text-[#800020]">Enter "1234" to verify (Mock)</p>
                                            </motion.div>
                                        )}

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Email Address *</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                <input {...register('email')} className="form-input-premium" placeholder="your@email.com" />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.email.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Password *</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input type={showPassword ? "text" : "password"} {...register('password')} className="form-input-premium pr-12" placeholder="••••••••" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#800020] transition-colors">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.password.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Confirm *</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input type="password" {...register('confirmPassword')} className="form-input-premium" placeholder="••••••••" />
                                                </div>
                                                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.confirmPassword.message}</p>}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Religion *</label>
                                                <select {...register('religion')} className="form-input-premium appearance-none">
                                                    <option value="">Select</option>
                                                    <option>Hindu</option>
                                                    <option>Muslim</option>
                                                    <option>Christian</option>
                                                    <option>Sikh</option>
                                                    <option>Jain</option>
                                                    <option>Other</option>
                                                </select>
                                                {errors.religion && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.religion.message}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Caste (Optional)</label>
                                                <input {...register('caste')} className="form-input-premium" placeholder="e.g. Brahmin" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Mother Tongue *</label>
                                                <select {...register('motherTongue')} className="form-input-premium appearance-none">
                                                    <option value="">Select</option>
                                                    <option>Hindi</option>
                                                    <option>Bengali</option>
                                                    <option>Marathi</option>
                                                    <option>Telugu</option>
                                                    <option>Tamil</option>
                                                    <option>Kannada</option>
                                                    <option>Other</option>
                                                </select>
                                                {errors.motherTongue && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.motherTongue.message}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Marital Status *</label>
                                                <select {...register('maritalStatus')} className="form-input-premium appearance-none">
                                                    <option value="">Select</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Divorced">Divorced</option>
                                                    <option value="Widowed">Widowed</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors.maritalStatus && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.maritalStatus.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Height *</label>
                                                <select {...register('height')} className="form-input-premium appearance-none">
                                                    <option value="">Select</option>
                                                    <option>5'0" (152 cm)</option>
                                                    <option>5'2" (157 cm)</option>
                                                    <option>5'4" (162 cm)</option>
                                                    <option>5'6" (167 cm)</option>
                                                    <option>5'8" (172 cm)</option>
                                                    <option>5'10" (177 cm)</option>
                                                    <option>6'0" (182 cm)</option>
                                                    <option>Other</option>
                                                </select>
                                                {errors.height && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.height.message}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Location *</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input {...register('location')} className="form-input-premium" placeholder="City, State" />
                                                </div>
                                                {errors.location && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.location.message}</p>}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Highest Education *</label>
                                            <div className="relative group">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                <input {...register('education')} className="form-input-premium" placeholder="e.g. MBA, B.Tech" />
                                            </div>
                                            {errors.education && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.education.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Profession *</label>
                                                <div className="relative group">
                                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input {...register('profession')} className="form-input-premium" placeholder="e.g. Doctor" />
                                                </div>
                                                {errors.profession && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.profession.message}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Annual Income</label>
                                                <div className="relative group">
                                                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <select {...register('income')} className="form-input-premium appearance-none">
                                                        <option value="">Select Range</option>
                                                        <option>0 - 3 LPA</option>
                                                        <option>3 - 7 LPA</option>
                                                        <option>7 - 15 LPA</option>
                                                        <option>15 - 30 LPA</option>
                                                        <option>30+ LPA</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Work Location *</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                <input {...register('workLocation')} className="form-input-premium" placeholder="Company City, State" />
                                            </div>
                                            {errors.workLocation && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.workLocation.message}</p>}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                                            <div className="bg-[#800020] p-3 rounded-2xl shadow-lg">
                                                <Sparkles className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-[#800020] uppercase text-xs tracking-widest">Almost There!</h4>
                                                <p className="text-xs text-[#800020]/70 font-medium tracking-tight">Tell us what you're looking for in a partner.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred Partner Age Range</label>
                                            <input {...register('prefAgeRange')} className="form-input-premium" placeholder="e.g. 24 - 30 years" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred Location</label>
                                            <input {...register('prefLocation')} className="form-input-premium" placeholder="e.g. Any City in India" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred Education</label>
                                                <input {...register('prefEducation')} className="form-input-premium" placeholder="e.g. Masters" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred Profession</label>
                                                <input {...register('prefProfession')} className="form-input-premium" placeholder="e.g. IT Professional" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 5 && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="p-6 bg-yellow-50 rounded-3xl border border-yellow-100 flex items-center gap-4 mb-6">
                                            <div className="bg-[#D4AF37] p-3 rounded-2xl shadow-lg">
                                                <CheckCircle className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-[#800020] uppercase text-xs tracking-widest">Document Verification</h4>
                                                <p className="text-xs text-[#800020]/70 font-medium tracking-tight">Upload PDFs to get a 'Verified' badge.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Aadhar Card (PDF)</label>
                                            <div className="relative group cursor-pointer h-16 bg-[#F9FAFB/50] border-2 border-dashed border-gray-300 rounded-2xl flex items-center px-4 hover:border-[#800020] transition-colors focus-within:border-[#800020]">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    {...register('aadharCard')}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setAadharFileName(file.name);
                                                            setValue('aadharCard', file);
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="w-8 h-8 rounded-lg bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                                                        <ImageIcon size={14} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-600 truncate flex-1">
                                                        {aadharFileName || 'Upload Aadhar Card'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest bg-[#FFFDD0] px-3 py-1 rounded-full">
                                                        Browse
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Caste Certificate (PDF)</label>
                                            <div className="relative group cursor-pointer h-16 bg-[#F9FAFB/50] border-2 border-dashed border-gray-300 rounded-2xl flex items-center px-4 hover:border-[#800020] transition-colors focus-within:border-[#800020]">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    {...register('casteCertificate')}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setCasteFileName(file.name);
                                                            setValue('casteCertificate', file);
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="w-8 h-8 rounded-lg bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                                                        <ImageIcon size={14} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-600 truncate flex-1">
                                                        {casteFileName || 'Upload Caste Certificate'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest bg-[#FFFDD0] px-3 py-1 rounded-full">
                                                        Browse
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 6 && (
                                    <motion.div
                                        key="step6"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-xl font-serif font-black text-gray-900 mb-6 italic">Choose Your Membership</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {[
                                                    { id: 'Basic', name: 'Basic', price: '₹499 /mo', perks: ['Limited searches', 'Standard profile', 'Basic matching'] },
                                                    { id: 'Premium', name: 'Premium', price: '₹999 /mo', perks: ['Unlimited interests', 'Highlighted profile', 'See who viewed you'], recommended: true },
                                                    { id: 'Elite', name: 'Elite', price: '₹1599 /mo', perks: ['Personalized matchmaker', 'Priority support', 'All premium features'] },
                                                ].map((plan) => {
                                                    const isSelected = watch('membership') === plan.id;
                                                    return (
                                                        <div
                                                            key={plan.id}
                                                            onClick={() => setValue('membership', plan.id)}
                                                            className={`flex items-center justify-between p-6 rounded-3xl border-2 cursor-pointer transition-all select-none ${isSelected ? 'border-[#800020] shadow-lg' : 'border-gray-100 hover:border-[#800020]/30'}`}
                                                            style={{ backgroundColor: '#ffffff' }}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div
                                                                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                                                    style={{ borderColor: isSelected ? '#800020' : '#e5e7eb', backgroundColor: '#ffffff' }}
                                                                >
                                                                    {isSelected && (
                                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#800020' }}></div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold" style={{ color: '#111827' }}>{plan.name}</span>
                                                                        {plan.recommended && <span className="text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter" style={{ backgroundColor: '#D4AF37' }}>Recommended</span>}
                                                                    </div>
                                                                    <p className="text-[10px] font-medium" style={{ color: '#9ca3af' }}>{plan.perks.join(' • ')}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <span className="text-lg md:text-xl font-serif font-black italic" style={{ color: '#800020' }}>{plan.price.split(' ')[0]}</span>
                                                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: '#9ca3af' }}>Monthly</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-[#F8F9FA] rounded-2xl border border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('UPI')}
                                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'UPI' ? 'bg-[#800020] text-[#D4AF37] shadow-lg' : 'text-gray-400 hover:text-[#800020]'}`}
                                                >
                                                    UPI ID
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('Card')}
                                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'Card' ? 'bg-[#800020] text-[#D4AF37] shadow-lg' : 'text-gray-400 hover:text-[#800020]'}`}
                                                >
                                                    Credit / Debit Card
                                                </button>
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-8 bg-[#800020] rounded-[2.5rem] text-[#D4AF37] border border-[#D4AF37]/20 relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-8">
                                                        {paymentMethod === 'UPI' ? (
                                                            <div className="space-y-6 py-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Enter your UPI ID</label>
                                                                    <div className="relative group">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="yourname@upi"
                                                                            className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]"
                                                                        />
                                                                    </div>
                                                                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-2">Example: username@okhdfcbank, name@upi</p>
                                                                </div>
                                                                <p className="text-[10px] font-bold uppercase tracking-widest text-center opacity-80 pt-4">Your membership will be activated once payment is verified via your UPI app.</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-6 py-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Card Number</label>
                                                                    <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Expiry Date</label>
                                                                        <input type="text" placeholder="MM/YY" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">CVV</label>
                                                                        <input type="password" placeholder="•••" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-auto pt-12 flex gap-6">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 py-5 flex items-center justify-center gap-3 rounded-2xl bg-white text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#800020]/5 hover:text-[#800020] hover:border-[#800020]/20 transition-all border border-gray-100 shadow-sm active:scale-95"
                                    >
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                )}

                                {step < 6 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-[2] py-5 bg-[#800020] text-[#D4AF37] flex items-center justify-center gap-3 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 hover:shadow-[#D4AF37]/10 transition-all active:scale-95"
                                    >
                                        Save & Continue <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 bg-[#800020] text-[#D4AF37] flex items-center justify-center gap-3 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 hover:shadow-[#D4AF37]/10 transition-all active:scale-95"
                                    >
                                        Create Account <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="mt-12 text-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Deeply connected already?</span>
                            <Link to="/login" className="ml-2 text-[#800020] hover:text-[#D4AF37] transition-colors font-black">Login Now</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Styles Hook */}
            <style>{`
                .form-input-premium {
                    width: 100%;
                    padding: 1.15rem 1.15rem 1.15rem 3.5rem;
                    background: #F9FAFB/50;
                    border: 1.5px solid #F3F4F6;
                    border-radius: 1.5rem;
                    font-size: 0.825rem;
                    font-weight: 600;
                    color: #111827;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                }
                .form-input-premium:focus {
                    background: #FFFFFF;
                    border-color: #800020;
                    box-shadow: 0 15px 25px -5px rgba(10, 25, 47, 0.08);
                }
                select.form-input-premium {
                    padding-left: 3.5rem;
                    cursor: pointer;
                }
                .label-premium {
                    font-size: 10px;
                    font-weight: 800;
                    color: #374151;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }
                input[type="radio"]:checked + div {
                    background-color: #800020;
                    border-color: #800020;
                    box-shadow: 0 0 0 4px rgba(128, 0, 32, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Register;
