import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { User, MapPin, CupSoda, Book, Briefcase, Heart, MessageSquare, Check, CheckCircle, X, Shield, Image as ImageIcon, ArrowLeft, Clock, GraduationCap, Send, Sparkles, Loader2, CreditCard, CalendarDays, Cake, Phone, Languages, Users, Ruler, Wallet, Building, Lock, Scale, UserPlus, Utensils, Cigarette, Wine, Moon, Sun, Home, Activity, Star, AlertTriangle, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interestSent, setInterestSent] = useState(false);
    const [activePhotoIndex, setActivePhotoIndex] = useState(null);
    const [heroPhotoIndex, setHeroPhotoIndex] = useState(0);
    const [fullCurrentUser, setFullCurrentUser] = useState(null);

    const allPhotos = [
        profile?.profilePicture, 
        ...(profile?.photos || []),
        profile?.aadharCard,
        profile?.casteCertificate
    ].filter(Boolean);

    const handleNextHero = (e) => {
        e.stopPropagation();
        setHeroPhotoIndex((prev) => (prev + 1) % allPhotos.length);
    };

    const handlePrevHero = (e) => {
        e.stopPropagation();
        setHeroPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activePhotoIndex === null) return;
            if (e.key === 'ArrowRight') handleNextPhoto();
            if (e.key === 'ArrowLeft') handlePrevPhoto();
            if (e.key === 'Escape') setActivePhotoIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activePhotoIndex]);

    const handleNextPhoto = () => {
        setActivePhotoIndex((prev) => (prev + 1) % allPhotos.length);
    };

    const handlePrevPhoto = () => {
        setActivePhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProfile = async () => {
            try {
                const [{ data: profileData }, { data: myData }] = await Promise.all([
                    api.getProfile(id),
                    api.getMyProfile()
                ]);
                setProfile(profileData);
                setFullCurrentUser(myData);

                // check if interest is already sent
                const { data: sentList } = await api.getSentInterestsList();
                if (sentList.includes(id)) {
                    setInterestSent(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleInterest = async () => {
        try {
            await api.sendInterest(id);
            setInterestSent(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error sending interest');
        }
    };



    if (loading) return <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#800020]" size={48} />
    </div>;

    if (!profile) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white p-10">
            <div className="w-24 h-24 bg-brand-pink/50 rounded-full flex items-center justify-center text-brand-maroon/20 mb-8">
                <Shield size={48} />
            </div>
            <h1 className="text-4xl font-black text-brand-maroon uppercase tracking-widest mb-4">Essence Not Found</h1>
            <p className="text-gray-400 font-medium italic">This profile hasn't manifested in our sanctuary yet.</p>
        </div>
    );

    const plan = currentUser?.membership || 'Free';
    const normalizedPlan = ['p1', 'Basic', 'Free'].includes(plan) ? 'Free' : plan;

    const isFree = normalizedPlan === 'Free';
    const isSilver = normalizedPlan === 'Silver';
    const isGold = normalizedPlan === 'Gold';
    const isPremium = normalizedPlan === 'Premium';

    const canViewMobile = isGold || isPremium;
    const canViewPremiumDetails = isGold || isPremium;
    const canViewAstrological = true;
    const canViewEducation = true;
    const canViewFamily = true;
    const canViewPartnerPref = true;
    const canViewAboutYou = true;
    const canViewVerification = true;

    const calculateMatch = () => {
        if (!profile || !currentUser) return { score: 0, total: 6, details: [] };
        
        let minAge = 18, maxAge = 40;
        if (profile.prefAgeRange) {
            const parts = profile.prefAgeRange.split('-');
            if (parts.length === 2) {
                minAge = parseInt(parts[0]);
                maxAge = parseInt(parts[1]);
            }
        } else {
            minAge = profile.prefAgeMin || 18;
            maxAge = profile.prefAgeMax || 40;
        }

        const matchAge = currentUser.age >= minAge && currentUser.age <= maxAge;
        
        const matchString = (userVal, prefVal, overrideMatch = []) => {
            if (!prefVal || prefVal === 'Any' || prefVal === "Doesn't Matter") return true;
            if (!userVal) return false;
            const u = userVal.toLowerCase();
            const p = prefVal.toLowerCase();
            if (u.includes(p) || p.includes(u)) return true;
            if (p.split('/').some(part => u.includes(part.trim()) || part.trim().includes(u))) return true;
            if (overrideMatch.some(m => p.includes(m.toLowerCase()) && u.includes(m.toLowerCase()))) return true;
            return false;
        };

        const checks = [
            { label: 'Age', match: matchAge, displayVal: `${minAge}-${maxAge} Yrs` },
            { label: 'Religion', match: matchString(currentUser.religion || 'Hindu', profile.prefReligion), displayVal: profile.prefReligion || "Doesn't Matter" },
            { label: 'Education', match: matchString(currentUser.education, profile.prefEducation, ['B.E', 'M.Tech', 'Masters', 'Graduate', 'Professional']), displayVal: profile.prefEducation || "Doesn't Matter" },
            { label: 'Profession', match: matchString(currentUser.profession, profile.prefProfession, ['Software', 'IT', 'Finance', 'Professional']), displayVal: profile.prefProfession || "Doesn't Matter" },
            { label: 'Location', match: matchString(currentUser.location, profile.prefLocation), displayVal: profile.prefLocation || "Doesn't Matter" },
            { label: 'Marital Status', match: matchString(currentUser.maritalStatus, profile.prefMaritalStatus, ['Never Married', 'Single']), displayVal: profile.prefMaritalStatus || "Doesn't Matter" }
        ];

        const score = checks.filter(c => c.match).length;
        return { score, total: checks.length, details: checks };
    };

    const matchData = calculateMatch();

    const renderLockedValue = (value) => {
        return <span className="text-gray-900 font-semibold">{value || 'Not Specified'}</span>;
    };

    return (
        <div className="min-h-screen pb-12 pt-4 px-6 bg-white">
            <div className="container mx-auto max-w-6xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#800020]/60 hover:text-[#800020] font-bold mb-8 transition-colors uppercase text-[10px] tracking-widest"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Search</span>
                </button>



                <div className="flex flex-col items-center gap-12">
                    {/* Top Hero Section */}
                    <div className="w-full flex flex-col items-center max-w-4xl text-center">
                        {/* Profile Photo Hero */}
                        <div className="relative mb-10 w-full flex justify-center group">
                            <div 
                                className="relative w-full max-w-[320px] aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border-4 border-[#800020]/10 shadow-xl cursor-pointer hover:border-[#800020]/30 transition-all z-10" 
                                onClick={() => setActivePhotoIndex(heroPhotoIndex)}
                            >
                                {allPhotos[heroPhotoIndex] ? (
                                    <img
                                        src={allPhotos[heroPhotoIndex]}
                                        alt={profile.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <User size={100} />
                                    </div>
                                )}

                                {/* Hero Navigation Symbols */}
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <button
                                        onClick={handlePrevHero}
                                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-[#800020] flex items-center justify-center shadow-md hover:bg-white pointer-events-auto transition-transform active:scale-90"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={handleNextHero}
                                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-[#800020] flex items-center justify-center shadow-md hover:bg-white pointer-events-auto transition-transform active:scale-90"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                {/* Photo Counter Mini */}
                                {allPhotos.length > 1 && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{heroPhotoIndex + 1} / {allPhotos.length}</span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#800020]/5 rounded-full blur-3xl -z-0"></div>
                        </div>

                        {/* Quick Info Header */}
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{profile.name}</h1>
                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <Clock size={14} className="text-[#800020]" />
                                    {profile.dob ? (new Date().getFullYear() - new Date(profile.dob).getFullYear()) + ' Years' : '24 Years'}
                                </span>
                                <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <User size={14} className="text-[#800020]" />
                                    {profile.gender || 'Female'}
                                </span>
                                <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <MapPin size={14} className="text-[#800020]" />
                                    {profile.location || 'Location Not Specified'}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {currentUser?._id !== id && (
                            <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-12">
                                <button
                                    onClick={handleInterest}
                                    disabled={interestSent}
                                    className={`w-full max-w-[320px] py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${interestSent ? 'bg-green-500 text-white cursor-default' : 'bg-[#800020] text-white hover:bg-[#600018] active:scale-95'}`}
                                >
                                    {interestSent ? (
                                        <><CheckCircle size={18} /> Interest Sent</>
                                    ) : (
                                        <><Heart size={18} /> Send Interest</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Detailed Information Container */}
                    <div className="w-full max-w-4xl space-y-12">
                        {/* Membership Status (Only for own profile) */}
                        {currentUser?._id === id && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-[#800020] to-[#600318] p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#D4AF37]/20 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center border border-[#D4AF37]/30">
                                        <Sparkles size={32} className="text-[#D4AF37]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Your Current Plan</p>
                                        <h3 className="text-2xl font-serif font-black italic">{profile.membership || 'Premium'} Member</h3>
                                    </div>
                                </div>
                                <div className="relative z-10 flex flex-col items-center md:items-end gap-1">
                                    <div className="flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                        <CalendarDays size={16} className="text-[#D4AF37]" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">24 Days Remaining</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}



                        {/* Detail Sections */}
                        <div className="space-y-8">
                            {/* Consolidated Detailed Information */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                                <div className="flex items-center gap-4 bg-[#800020]/5 p-6 border-b border-gray-50">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#800020] shadow-sm">
                                        <User size={24} />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Personal Information</h3>
                                </div>
                                <div className="p-4">
                                    {[
                                        { label: 'Height', value: profile.height || 'Not Specified' },
                                        { label: 'Spoken Languages', value: `${profile.motherTongue || 'Regional'} (Mother Tongue), English` },
                                        { label: 'Profile created by', value: profile.profileCreatedBy || 'Not Specified' },
                                        { label: 'Marital Status', value: profile.maritalStatus || 'Not Specified' },
                                        { label: 'Lives In', value: profile.location || 'Not Specified' },
                                        { label: 'Eating Habits', value: profile.eatingHabits || 'Not Specified' },
                                        { label: 'Religion', value: `${profile.religion || 'Hindu'}` },
                                        { label: 'Date Of Birth', value: renderLockedValue(profile.dob) },
                                        { label: 'Time Of Birth', value: renderLockedValue(profile.timeOfBirth) },
                                        { label: 'Star', value: renderLockedValue(profile.star) },
                                        { label: 'Raasi', value: renderLockedValue(profile.raasi) },
                                        { label: 'Horoscope', value: renderLockedValue(profile.horoscope) },
                                        { label: 'Employment', value: profile.profession || 'Not Specified' },
                                        canViewMobile ? { label: 'Mobile', value: profile.mobile || 'Private' } : null
                                    ].filter(Boolean).map((item, idx) => (
                                        <div key={idx} className="flex px-4 py-3 items-baseline border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <span className="w-1/3 text-gray-400 font-bold uppercase text-[10px] tracking-wider">{item.label}</span>
                                            <span className="w-4 text-gray-300 font-black text-sm">:</span>
                                            <div className="flex-1 text-gray-900 font-semibold text-sm">{typeof item.value === 'string' ? item.value : item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Family Background */}
                            {canViewFamily && (
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                                    <div className="flex items-center gap-4 bg-[#800020]/5 p-6 border-b border-gray-50">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#800020] shadow-sm">
                                            <Home size={24} />
                                        </div>
                                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Family Background</h3>
                                    </div>
                                    <div className="p-4">
                                        {[
                                            { label: 'Family Type', value: profile.familyType || 'Not Specified' },
                                            { label: "Father's Name", value: profile.fatherName || 'Not Specified' },
                                            { label: "Father's Job", value: profile.fatherOccupation || 'Not Specified' },
                                            { label: "Mother's Name", value: profile.motherName || 'Not Specified' },
                                            { label: "Mother's Job", value: profile.motherOccupation || 'Not Specified' },
                                            { label: 'Ancestral Origin', value: profile.ancestralOrigin || 'Not Specified' },
                                            { label: 'Brothers', value: profile.brothers || 'Not Specified' },
                                            { label: 'Sisters', value: profile.sisters || 'Not Specified' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex px-4 py-3 items-baseline border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <span className="w-1/3 text-gray-400 font-bold uppercase text-[10px] tracking-wider">{item.label}</span>
                                                <span className="w-4 text-gray-300 font-black text-sm">:</span>
                                                <span className="flex-1 text-gray-900 font-semibold text-sm">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Professional Information */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                                <div className="flex items-center gap-4 bg-[#800020]/5 p-6 border-b border-gray-50">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#800020] shadow-sm">
                                        <Briefcase size={24} />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Career & Education</h3>
                                </div>
                                <div className="p-4">
                                    {[
                                        canViewEducation ? { label: 'Education', value: profile.education || 'Not Specified' } : null,
                                        { label: 'Field of Study', value: profile.educationDetail || 'Not Specified' },
                                        { label: 'Profession', value: profile.profession || 'Not Specified' },
                                        { label: 'Company', value: profile.occupationDetail || 'Not Specified' },
                                        { label: 'Income', value: profile.income || 'Not Specified' },
                                        { label: 'Work Location', value: profile.workLocation || 'Not Specified' },
                                        { label: 'Current Location', value: profile.location || 'Not Specified' }
                                    ].filter(Boolean).map((item, idx) => (
                                        <div key={idx} className="flex px-4 py-3 items-baseline border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <span className="w-1/3 text-gray-400 font-bold uppercase text-[10px] tracking-wider">{item.label}</span>
                                            <span className="w-4 text-gray-300 font-black text-sm">:</span>
                                            <span className="flex-1 text-gray-900 font-semibold text-sm">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             {/* Interests Section - NEW LOCATION (Before Partner Pref) */}
                             {profile.interests?.length > 0 && (
                                <div className="mb-12">
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-6">Interests</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.interests.map(interest => (
                                            <span key={interest} className="px-5 py-2 bg-[#FFFDD0] text-[#800020] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border border-[#D4AF37]/20">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Partner Preferences */}
                            {canViewPartnerPref && (
                                <div className="space-y-6">
                                    <h3 className="flex items-center justify-center gap-4 py-4 text-sm font-black text-gray-800 uppercase tracking-[0.3em]">
                                        <Sparkles className="text-[#800020]" size={18} />
                                        <span>{profile.gender?.toLowerCase() === 'male' ? 'His' : 'Her'} Partner Preferences</span>
                                        <Sparkles className="text-[#800020]" size={18} />
                                    </h3>

                                    {/* Match Score Card */}
                                    <div className="bg-gradient-to-br from-[#800020]/5 to-transparent p-6 rounded-[2.5rem] border border-[#800020]/10">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                                                        <img src={profile.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'M')}&background=800020&color=D4AF37&size=200`} alt="Match" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{(profile.name || '').split(' ')[0]}</p>
                                                </div>
                                                <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#800020] shadow-sm font-black text-xs italic">VS</div>
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-lg ring-2 ring-[#800020]/10">
                                                        {fullCurrentUser?.profilePicture ? (
                                                            <img src={fullCurrentUser.profilePicture} alt="You" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-[#800020] to-[#600018] flex items-center justify-center text-[#D4AF37] font-black text-2xl">
                                                                {(fullCurrentUser?.name || currentUser?.name || 'Y').charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-center text-[9px] font-black text-[#800020] uppercase tracking-widest mt-1">You</p>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-right">
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Matching Score</p>
                                                <h4 className="text-2xl font-serif font-black italic text-[#800020]">You match {matchData.score}/{matchData.total}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">of {profile.gender?.toLowerCase() === 'male' ? 'his' : 'her'} preferences</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preference List */}
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                                        <div className="flex items-center justify-between bg-gray-50/50 p-6 border-b border-gray-50">
                                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Basic Preferences</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">You Match</span>
                                                <CheckCircle className="text-green-500" size={16} />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            {matchData.details.map((item, idx) => (
                                                <div key={idx} className="flex px-4 py-4 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-xl">
                                                    <div className="flex-1">
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Preferred {item.label}</p>
                                                        <p className="text-sm text-gray-900 font-semibold">
                                                            {item.displayVal}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0">
                                                        {item.match ? (
                                                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                                                <Check size={18} strokeWidth={3} />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                                                <X size={18} strokeWidth={3} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Verification Details */}
                            {canViewVerification && profile.aadharCard && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Verification Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => {
                                            if (profile.aadharCard) {
                                                const idx = allPhotos.indexOf(profile.aadharCard);
                                                if (idx !== -1) setActivePhotoIndex(idx);
                                            }
                                        }}>
                                            <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Shield size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Aadhar Card</p>
                                                <p className={profile.aadharCard ? "text-green-600 font-semibold text-sm" : "text-amber-500 font-semibold text-sm"}>{profile.aadharCard ? 'Verified' : 'Pending Verification'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => {
                                            if (profile.casteCertificate) {
                                                const idx = allPhotos.indexOf(profile.casteCertificate);
                                                if (idx !== -1) setActivePhotoIndex(idx);
                                            }
                                        }}>
                                            <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Book size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Caste Certificate</p>
                                                <p className={profile.casteCertificate ? "text-green-600 font-semibold text-sm" : "text-amber-500 font-semibold text-sm"}>{profile.casteCertificate ? 'Verified' : 'Not Uploaded'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-12">
                            {canViewAboutYou && (
                                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-[#800020]/5 mt-12">
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#800020]/5">About Me</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg italic font-serif">
                                        {profile.aboutMe || "I'm looking for a partner who respects values and has a modern outlook on life. Let's connect to know more."}
                                    </p>
                                </div>
                            )}

                            {/* "Next Profile" Button */}
                            <div className="pt-12 flex justify-center">
                                <button
                                    onClick={() => navigate('/explore')}
                                    className="px-10 py-5 bg-gradient-to-r from-[#800020] to-[#600318] text-[#D4AF37] rounded-none font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                                >
                                    Next Profile <ChevronRight size={20} />
                                </button>
                            </div>


                        </div>
                    </div>
                </div>

            </div>

            {/* Lightbox / Gallery Slider */}
            <AnimatePresence>
                {activePhotoIndex !== null && (
                    <motion.div
                        key="gallery-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md"
                        onClick={() => setActivePhotoIndex(null)}
                    >
                        {/* Navigation Symbols */}
                        <div className="absolute inset-0 flex items-center justify-between px-2 md:px-10 pointer-events-none">
                            <button
                                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all flex items-center justify-center text-white pointer-events-auto border border-white/10 shadow-lg group"
                                onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
                            >
                                <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all flex items-center justify-center text-white pointer-events-auto border border-white/10 shadow-lg group"
                                onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
                            >
                                <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Top Controls */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
                            <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                                <span className="text-white text-xs font-black uppercase tracking-widest leading-none">
                                    {activePhotoIndex + 1} / {allPhotos.length}
                                </span>
                            </div>
                            <button
                                className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
                                onClick={() => setActivePhotoIndex(null)}
                            >
                                <X size={32} />
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className="relative w-full max-w-5xl h-full flex items-center justify-center p-4">
                            <motion.img
                                key={activePhotoIndex}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                src={allPhotos[activePhotoIndex]}
                                alt={`Gallery image ${activePhotoIndex + 1}`}
                                className="w-full h-auto max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDetail;
