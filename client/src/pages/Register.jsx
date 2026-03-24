import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Mail, Lock, Phone, User, MapPin, Briefcase, GraduationCap, Heart, Sparkles, CheckCircle, Eye, EyeOff, Coins, Shield, Image as ImageIcon, Ruler, Users, Info } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../services/api';

const calculateDetailedAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months -= 1;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
};

const registrationSchema = z.object({
    // Step 1
    profileCreatedBy: z.enum(['Self', 'Parent', 'Sibling', 'Friend', 'Relative', 'Other'], { required_error: 'Please select who is creating the profile' }),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
    dob: z.string().min(1, 'Date of birth is required').refine(val => {
        const age = new Date().getFullYear() - new Date(val).getFullYear();
        return age >= 18;
    }, 'Must be at least 18 years old'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    // Step 2
    motherTongue: z.string().min(1, 'Mother tongue is required'),
    religion: z.string().default('Hindu'),
    caste: z.string().min(1, 'Caste is required'),
    customCaste: z.string().optional(),
    maritalStatus: z.enum(['Single', 'Divorced', 'Widowed', 'Other'], { required_error: 'Marital status is required' }),
    height: z.string().min(1, 'Height is required'),
    weight: z.string().optional(),
    location: z.string().min(1, 'Location is required'),
    // Step 3
    education: z.string().min(1, 'Education is required'),
    educationDetail: z.string().optional(),
    profession: z.string().min(1, 'Profession is required'),
    occupationDetail: z.string().optional(),
    income: z.string().optional(),
    workLocation: z.string().min(1, 'Work location is required'),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    // Step 4
    prefAgeMin: z.string().optional().refine(val => !val || /^[0-9]+$/.test(val), "Must be a number").refine(val => !val || parseInt(val) >= 18, "Min age is 18"),
    prefAgeMax: z.string().optional().refine(val => !val || /^[0-9]+$/.test(val), "Must be a number").refine(val => !val || parseInt(val) >= 18, "Min age is 18"),
    prefLocation: z.string().optional(),
    prefEducation: z.string().optional(),
    prefProfession: z.string().optional(),
    // Step 5
    aadharCard: z.any().refine((file) => file && file.length > 0, 'Aadhaar card is required'),
    casteCertificate: z.any().optional(),
    // Step 6
    membership: z.string().default('p1'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => {
    if (data.prefAgeMin && data.prefAgeMax) {
        return parseInt(data.prefAgeMax) >= parseInt(data.prefAgeMin);
    }
    return true;
}, {
    message: "Maximum age cannot be less than minimum age",
    path: ["prefAgeMax"],
}).refine((data) => {
    if (data.caste === 'Other' && (!data.customCaste || data.customCaste.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "Please specify your caste",
    path: ["customCaste"]
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
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state
    const [aadharFileName, setAadharFileName] = useState('');
    const [casteCertificateFileName, setCasteCertificateFileName] = useState('');

    const { register, handleSubmit, formState: { errors }, watch, trigger, setValue } = useForm({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange'
    });

    const dobValue = watch('dob');
    const selectedCaste = watch('caste');
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // In a real app, import getMembershipPlans from services/api
                // For now, mirroring the DUMMY_PLANS in services/api.js
                const dummyPlans = [
                    { _id: 'p1', name: 'Free', price: 0, duration: 'Lifetime', features: ['View Profiles', 'Send 5 Interests/Day'], color: '#9CA3AF' },
                    { _id: 'p2', name: 'Silver', price: 1999, duration: '3 Months', features: ['Unlimited Interests', 'Basic Support', 'View Contact Details (10)'], color: '#C0C0C0' },
                    { _id: 'p3', name: 'Gold', price: 4999, duration: '6 Months', features: ['Priority Listing', 'Standard Support', 'View Contact Details (50)'], color: '#D4AF37' },
                    { _id: 'p4', name: 'Premium', price: 9999, duration: '12 Months', features: ['Profile Highlight', 'Premium Support', 'Unlimited Contact Views', 'Personal Matchmaker'], color: '#800020' },
                ];
                setPlans(dummyPlans);
                // Set default membership if not set
                if (!watch('membership')) {
                    setValue('membership', 'p2'); // Default to Silver
                }
            } catch (err) {
                console.error("Error fetching plans:", err);
            }
        };
        fetchPlans();

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
    }, [dobValue, watch, setValue]);

    const nextStep = async () => {
        let fieldsToValidate = [];
        if (step === 1) fieldsToValidate = ['name', 'gender', 'dob', 'mobile', 'email', 'password', 'confirmPassword'];
        if (step === 2) fieldsToValidate = ['motherTongue', 'religion', 'caste', 'customCaste', 'maritalStatus', 'height', 'weight', 'location'];
        if (step === 3) fieldsToValidate = ['education', 'educationDetail', 'profession', 'occupationDetail', 'workLocation', 'fatherName', 'motherName'];
        if (step === 4) fieldsToValidate = ['prefAgeMin', 'prefAgeMax', 'prefLocation', 'prefEducation', 'prefProfession'];
        if (step === 5) fieldsToValidate = ['aadharCard'];

        const isValid = await trigger(fieldsToValidate);

        // Block step 5 → 6 if document is not uploaded
        if (step === 5) {
            const aadharFile = watch('aadharCard');
            if (!aadharFile || aadharFile.length === 0) {
                // If form isn't already showing error, trigger it
                await trigger(['aadharCard']);
                alert('Please upload your AADHAAR CARD document to proceed.');
                return;
            }
        }

        if (isValid) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    const onSubmit = async (data) => {
        console.log("Submission attempt at step:", step);
        if (step < 6) {
            console.log("Safeguard triggered: Redirecting to nextStep instead of dashboard.");
            nextStep();
            return;
        }

        setLoading(true);
        try {
            // Convert files to base64 before saving to localStorage
            const fileToBase64 = (file) => {
                if (!file || !(file instanceof File)) return Promise.resolve(file);
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
            };

            const aadharBase64 = await fileToBase64(data.aadharCard[0]); // Access the first file from FileList
            const casteCertificateBase64 = data.casteCertificate && data.casteCertificate.length > 0
                ? await fileToBase64(data.casteCertificate[0])
                : null;

            const finalData = {
                ...data,
                caste: data.caste === 'Other' ? data.customCaste : data.caste,
                aadharCard: aadharBase64,
                casteCertificate: casteCertificateBase64,
                membership: data.membership || 'p1'
            };

            const result = await api.register(finalData);
            const responseData = result.data; // Ensure we access .data from the mock resolve

            console.log("Registration successful, navigating to dashboard.");
            login({
                ...finalData,
                _id: responseData._id,
                token: responseData.token,
                isAdmin: false
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderProgress = () => (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.3em]">Phase {step} of 6</span>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{Math.round((step / 6) * 100)}% Complete</span>
            </div>
            <div className="h-1.5 bg-[#FFFDD0] rounded-none overflow-hidden border border-[#D4AF37]/10">
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
        <div className="min-h-screen bg-[#FFFDD0]/20 flex items-center justify-center p-4 md:p-6 pt-6">
            <div className="max-w-4xl w-full bg-white rounded-none shadow-2xl shadow-[#800020]/5 overflow-hidden flex flex-col md:flex-row border border-[#800020]/5">

                {/* Left Section - Premium Sidebar */}
                <div className="hidden lg:flex w-[35%] bg-[#800020] relative overflow-hidden flex-col justify-center p-10 text-white">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="relative z-10"
                    >
                        <div className="bg-[#D4AF37]/20 w-12 h-12 rounded-none flex items-center justify-center mb-8 shadow-lg border border-[#D4AF37]/30">
                            <Heart className="text-[#D4AF37] fill-[#D4AF37]/20" size={24} />
                        </div>
                        <h2 className="text-3xl font-serif font-black leading-tight mb-6 italic text-white/95">
                            The Art of Connection
                        </h2>
                        <p className="text-[#D4AF37] text-base font-medium leading-relaxed max-w-xs">
                            Step into a sanctuary where hearts align and destinies converge.
                        </p>
                    </motion.div>

                    <div className="mt-auto relative z-10 grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 rounded-none border border-white/10 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px]">
                            <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-1">100%</h4>
                            <p className="text-[8px] sm:text-[9px] text-white/50 uppercase font-bold tracking-widest leading-tight">100% Verified</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 rounded-none border border-white/10 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px]">
                            <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-1 leading-none">Secure</h4>
                            <p className="text-[8px] sm:text-[9px] text-white/50 uppercase font-bold tracking-widest leading-tight mt-1">Privacy PACT</p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="flex-1 p-6 md:p-12 relative">
                    <div className="max-w-xl mx-auto h-full flex flex-col">
                        <div className="mb-8 text-center lg:text-left">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-2 block"
                            >
                                Begin Your Eternal Journey
                            </motion.span>
                            <h1 className="text-3xl font-serif font-black text-gray-900 mb-2 italic">Milana Matrimony</h1>
                            <p className="text-gray-400 font-medium text-xs">Finding the partner meant for your eternal destiny.</p>
                        </div>

                        {renderProgress()}

                        <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex flex-col">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Profile Created By *</label>
                                            <select {...register('profileCreatedBy')} className="form-input-premium appearance-none">
                                                <option value="">Select</option>
                                                <option>Self</option>
                                                <option>Parent</option>
                                                <option>Sibling</option>
                                                <option>Friend</option>
                                                <option>Relative</option>
                                                <option>Other</option>
                                            </select>
                                            {errors.profileCreatedBy && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.profileCreatedBy.message}</p>}
                                        </div>

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
                                                    <input
                                                        type="date"
                                                        {...register('dob')}
                                                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                                        className="form-input-premium"
                                                    />
                                                </div>
                                                {watch('dob') && (
                                                    <div className="mt-1 px-4 py-1.5 bg-blue-50/50 rounded-lg flex items-center gap-2 border border-blue-100/50">
                                                        <Info size={12} className="text-[#800020]" />
                                                        <span className="text-[10px] font-bold text-[#800020] uppercase tracking-wider">
                                                            Age: {(() => {
                                                                const age = calculateDetailedAge(watch('dob'));
                                                                return `${age.years} Yrs, ${age.months} Mos, ${age.days} Days`;
                                                            })()}
                                                        </span>
                                                    </div>
                                                )}
                                                {errors.dob && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.dob.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Mobile Number *</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" size={18} />
                                                    <input {...register('mobile')} className="form-input-premium !pr-28" placeholder="10-digit number" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setOtpSent(true)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#800020] text-white text-[10px] font-black rounded-none uppercase tracking-widest hover:bg-[#112240] transition-all shadow-md active:scale-95"
                                                    >
                                                        {otpSent ? 'Resend' : 'Send OTP'}
                                                    </button>
                                                </div>
                                                {errors.mobile && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.mobile.message}</p>}
                                            </div>
                                        </div>

                                        {otpSent && !otpVerified && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-50 rounded-none border border-blue-100 flex gap-4 items-center">
                                                <input maxLength={4} onChange={(e) => { if (e.target.value === '1234') setOtpVerified(true); }} className="w-32 px-4 py-2 rounded-none bg-white border border-blue-200 outline-none font-bold text-center tracking-[0.5em]" placeholder="1234" />
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
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Religion *</label>
                                                <select {...register('religion')} disabled className="form-input-premium appearance-none bg-gray-100 cursor-not-allowed text-gray-500">
                                                    <option value="Hindu">Hindu</option>
                                                </select>
                                                {errors.religion && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.religion.message}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Caste *</label>
                                                <select {...register('caste')} className="form-input-premium appearance-none">
                                                    <option value="">Select Option</option>
                                                    <option value="Kshatriya Komarpanth">Kshatriya Komarpanth</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors.caste && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.caste.message}</p>}
                                            </div>
                                        </div>

                                        {selectedCaste === 'Other' && (
                                            <div className="space-y-1.5 p-4 bg-orange-50 border border-orange-100 rounded-none">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Please Specify Caste *</label>
                                                <input {...register('customCaste')} type="text" placeholder="Enter your caste" className="form-input-premium bg-white" />
                                                {errors.customCaste && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.customCaste.message}</p>}
                                                <p className="text-[10px] text-orange-600 font-bold mt-2">Please note since you are creating a profile for other caste, your profile won't be visible in our portal. But still you can search for the profile and get matches.</p>
                                            </div>
                                        )}

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
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Weight</label>
                                                <select {...register('weight')} className="form-input-premium appearance-none">
                                                    <option value="">Select</option>
                                                    {Array.from({ length: 111 }, (_, i) => i + 40).map(w => (
                                                        <option key={w} value={`${w} kg`}>{w} kg</option>
                                                    ))}
                                                </select>
                                                {errors.weight && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.weight.message}</p>}
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
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Highest Education *</label>
                                            <div className="relative group">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors z-10" size={18} />
                                                <select {...register('education')} className="form-input-premium appearance-none pl-12">
                                                    <option value="">Select Education</option>
                                                    <option>B.E / B.Tech</option>
                                                    <option>M.E / M.Tech</option>
                                                    <option>MCA / BCA</option>
                                                    <option>MBA / BBA</option>
                                                    <option>MBBS / MD</option>
                                                    <option>B.Com / M.Com</option>
                                                    <option>B.Sc / M.Sc</option>
                                                    <option>L.L.B / L.L.M</option>
                                                    <option>Ph.D</option>
                                                    <option>Diploma</option>
                                                    <option>Others</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                            </div>
                                            {errors.education && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.education.message}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Field of Study</label>
                                            <input {...register('educationDetail')} className="form-input-premium" placeholder="e.g. Computer Science, Mechanical Eng." />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Profession *</label>
                                                <div className="relative group">
                                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors z-10" size={18} />
                                                    <select {...register('profession')} className="form-input-premium appearance-none pl-12">
                                                        <option value="">Select Profession</option>
                                                        <option>Software Professional</option>
                                                        <option>Engineer</option>
                                                        <option>Doctor</option>
                                                        <option>Business Owner</option>
                                                        <option>Government Employee</option>
                                                        <option>Teacher / Academician</option>
                                                        <option>Accountant / CA</option>
                                                        <option>Advocate / Legal</option>
                                                        <option>Service Sector</option>
                                                        <option>Civil Service (IAS/IPS)</option>
                                                        <option>Not Working</option>
                                                        <option>Others</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                                </div>
                                                {errors.profession && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.profession.message}</p>}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Company</label>
                                                <input {...register('occupationDetail')} className="form-input-premium" placeholder="e.g. Google, Microsoft, Self Employed" />
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Father's Name</label>
                                                <input {...register('fatherName')} className="form-input-premium" placeholder="Father's Full Name" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Mother's Name</label>
                                                <input {...register('motherName')} className="form-input-premium" placeholder="Mother's Full Name" />
                                            </div>
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
                                        <div className="p-6 bg-blue-50 rounded-none border border-blue-100 flex items-center gap-4">
                                            <div className="bg-[#800020] p-3 rounded-none shadow-lg">
                                                <Sparkles className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-[#800020] uppercase text-xs tracking-widest">Almost There!</h4>
                                                <p className="text-xs text-[#800020]/70 font-medium tracking-tight">Tell us what you're looking for in a partner.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred partner Age Range (Years)</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="relative group">
                                                        <select {...register('prefAgeMin')} className="form-input-premium appearance-none">
                                                            <option value="">Min Age</option>
                                                            {Array.from({ length: 53 }, (_, i) => i + 18).map(age => (
                                                                <option key={age} value={age}>{age} Years</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors.prefAgeMin && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.prefAgeMin.message}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="relative group">
                                                        <select {...register('prefAgeMax')} className="form-input-premium appearance-none">
                                                            <option value="">Max Age</option>
                                                            {Array.from({ length: 53 }, (_, i) => i + 18).map(age => (
                                                                <option key={age} value={age}>{age} Years</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors.prefAgeMax && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.prefAgeMax.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred Location</label>
                                            <input {...register('prefLocation')} className="form-input-premium" placeholder="e.g. Any City in India" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred Education</label>
                                                <select {...register('prefEducation')} className="form-input-premium appearance-none">
                                                    <option value="">Any Education</option>
                                                    <option>Master's Degree</option>
                                                    <option>Bachelor's Degree</option>
                                                    <option>Doctorate</option>
                                                    <option>Diploma</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Preferred Profession</label>
                                                <select {...register('prefProfession')} className="form-input-premium appearance-none">
                                                    <option value="">Any Profession</option>
                                                    <option>Software Professional</option>
                                                    <option>Engineer</option>
                                                    <option>Doctor</option>
                                                    <option>Teacher</option>
                                                    <option>Business</option>
                                                    <option>Other</option>
                                                </select>
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
                                        <div className="p-6 bg-yellow-50 rounded-none border border-yellow-100 flex items-center gap-4 mb-6">
                                            <div className="bg-[#D4AF37] p-3 rounded-none shadow-lg">
                                                <CheckCircle className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-[#800020] uppercase text-xs tracking-widest">Document Verification</h4>
                                                <p className="text-xs text-[#800020]/70 font-medium tracking-tight">Upload PDFs to get a 'Verified' badge.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Aadhar Card Upload - Responsive */}
                                            <div className="bg-[#800020]/5 p-5 rounded-none border-2 border-dashed border-[#800020]/20 transition-all hover:border-[#800020]/40">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-[#800020] shadow-sm shrink-0">
                                                            <Shield size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Aadhaar Card <span className="text-red-500">*</span></p>
                                                            <p className="text-[10px] text-gray-400 font-bold">Required • PDF format • Government ID</p>
                                                        </div>
                                                    </div>

                                                    {(() => {
                                                        const { ref, onChange: rhfOnChange, ...regProps } = register('aadharCard');
                                                        return (
                                                            <input
                                                                type="file"
                                                                accept=".pdf,image/*"
                                                                {...regProps}
                                                                ref={ref}
                                                                className="hidden"
                                                                id="aadhar-upload"
                                                                onChange={(e) => {
                                                                    rhfOnChange(e);
                                                                    const file = e.target.files?.[0];
                                                                    if (file) setAadharFileName(file.name);
                                                                }}
                                                            />
                                                        );
                                                    })()}

                                                    <label
                                                        htmlFor="aadhar-upload"
                                                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-none font-bold text-[11px] uppercase tracking-widest cursor-pointer transition-all active:scale-95 ${aadharFileName
                                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                            : 'bg-[#800020] text-[#D4AF37] hover:bg-[#600318] shadow-lg shadow-[#800020]/20'
                                                            }`}
                                                    >
                                                        {aadharFileName ? (
                                                            <><CheckCircle size={16} /> Uploaded ✓</>
                                                        ) : (
                                                            <><ImageIcon size={16} /> Tap to Upload Document</>
                                                        )}
                                                    </label>

                                                    {aadharFileName && (
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-none border border-green-100">
                                                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                                                            <p className="text-xs font-bold text-green-700 truncate">{aadharFileName}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.aadharCard && <p className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.aadharCard.message}</p>}
                                                {!aadharFileName && (
                                                    <p className="text-[10px] text-[#800020]/60 font-bold uppercase tracking-widest mt-3 text-center">📄 Upload Aadhaar Card to proceed to next step</p>
                                                )}
                                            </div>

                                            {/* Caste Certificate Upload - Optional */}
                                            <div className="bg-[#D4AF37]/5 p-5 rounded-none border-2 border-dashed border-[#D4AF37]/20 transition-all hover:border-[#D4AF37]/40">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-[#D4AF37] shadow-sm shrink-0">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Caste Certificate</p>
                                                            <p className="text-[10px] text-gray-400 font-bold">Optional • PDF/Image format</p>
                                                        </div>
                                                    </div>

                                                    {(() => {
                                                        const { ref, onChange: rhfOnChange, ...regProps } = register('casteCertificate');
                                                        return (
                                                            <input
                                                                type="file"
                                                                accept=".pdf,image/*"
                                                                {...regProps}
                                                                ref={ref}
                                                                className="hidden"
                                                                id="caste-upload"
                                                                onChange={(e) => {
                                                                    rhfOnChange(e);
                                                                    const file = e.target.files?.[0];
                                                                    if (file) setCasteCertificateFileName(file.name);
                                                                }}
                                                            />
                                                        );
                                                    })()}

                                                    <label
                                                        htmlFor="caste-upload"
                                                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-none font-bold text-[11px] uppercase tracking-widest cursor-pointer transition-all active:scale-95 ${casteCertificateFileName
                                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                            : 'bg-[#D4AF37] text-[#800020] hover:bg-[#B38D15] shadow-lg shadow-[#D4AF37]/20'
                                                            }`}
                                                    >
                                                        {casteCertificateFileName ? (
                                                            <><CheckCircle size={16} /> Uploaded ✓</>
                                                        ) : (
                                                            <><ImageIcon size={16} /> Tap to Upload Certificate</>
                                                        )}
                                                    </label>

                                                    {casteCertificateFileName && (
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-none border border-green-100">
                                                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                                                            <p className="text-xs font-bold text-green-700 truncate">{casteCertificateFileName}</p>
                                                        </div>
                                                    )}
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
                                            <h3 className="text-xl font-serif font-black text-gray-900 mb-6 italic text-center md:text-left">Choose Your Membership</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {plans.map((plan) => {
                                                    const isSelected = watch('membership') === plan._id;
                                                    return (
                                                        <div
                                                            key={plan._id}
                                                            onClick={() => setValue('membership', plan._id)}
                                                            className={`flex flex-col p-6 rounded-none border-2 cursor-pointer transition-all select-none relative ${isSelected ? 'border-[#800020] shadow-xl scale-[1.02]' : 'border-gray-100 hover:border-[#800020]/20 bg-gray-50/50'}`}
                                                            style={{ backgroundColor: isSelected ? '#ffffff' : undefined }}
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div
                                                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                                                    style={{ borderColor: isSelected ? '#800020' : '#e5e7eb', backgroundColor: '#ffffff' }}
                                                                >
                                                                    {isSelected && (
                                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#800020' }}></div>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-serif font-black italic leading-none" style={{ color: isSelected ? '#800020' : '#111827' }}>
                                                                        ₹{plan.price.toLocaleString()}
                                                                    </div>
                                                                    <div className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mt-1">{plan.duration}</div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-tight">{plan.name}</h4>
                                                                <ul className="space-y-1">
                                                                    {plan.features.slice(0, 2).map((feat, i) => (
                                                                        <li key={i} className="text-[10px] font-medium text-gray-500 flex items-center gap-1.5">
                                                                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]"></div>
                                                                            {feat}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            {plan.name === 'Gold' && (
                                                                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[7px] font-black uppercase px-3 py-1 rounded-full shadow-lg border border-white/20">Popular</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-[#F8F9FA] rounded-none border border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('UPI')}
                                                    className={`flex-1 py-3 px-4 rounded-none font-bold text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'UPI' ? 'bg-[#800020] text-[#D4AF37] shadow-lg' : 'text-gray-400 hover:text-[#800020]'}`}
                                                >
                                                    UPI ID
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('Card')}
                                                    className={`flex-1 py-3 px-4 rounded-none font-bold text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'Card' ? 'bg-[#800020] text-[#D4AF37] shadow-lg' : 'text-gray-400 hover:text-[#800020]'}`}
                                                >
                                                    Credit / Debit Card
                                                </button>
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-8 bg-[#800020] rounded-none text-[#D4AF37] border border-[#D4AF37]/20 relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                                                <div className="relative z-10">
                                                    {paymentMethod === 'UPI' ? (
                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Enter your UPI ID</label>
                                                                <input type="text" placeholder="yourname@upi" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-none px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                            </div>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-center opacity-80 pt-4">Activation follow verified payment.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Card Number</label>
                                                                <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-none px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Expiry Date</label>
                                                                    <input type="text" placeholder="MM/YY" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-none px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">CVV</label>
                                                                    <input type="password" placeholder="•••" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-none px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="space-y-6 pt-4 text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#800020]/60">Your journey begins here</p>
                                            <p className="text-sm font-serif font-medium italic text-gray-500 max-w-sm mx-auto">
                                                By creating an account, you agree to our community guidelines.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-auto pt-12 flex gap-6">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 py-5 flex items-center justify-center gap-3 rounded-none bg-white text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#800020]/5 hover:text-[#800020] hover:border-[#800020]/20 transition-all border border-gray-100 shadow-sm active:scale-95"
                                    >
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                )}

                                {step < 6 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-[2] py-5 bg-[#800020] text-[#D4AF37] flex items-center justify-center gap-3 rounded-none font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 hover:shadow-[#D4AF37]/10 transition-all active:scale-95"
                                    >
                                        Save & Continue <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleSubmit(onSubmit, (err) => {
                                            console.log("Validation Errors:", err);
                                        })}
                                        className="flex-[2] py-5 bg-[#800020] text-[#D4AF37] flex items-center justify-center gap-3 rounded-none font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 hover:shadow-[#D4AF37]/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                Create Account <ArrowRight size={16} />
                                            </>
                                        )}
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
                    border-radius: 0;
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
