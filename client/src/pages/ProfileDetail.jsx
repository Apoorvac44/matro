import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { User, MapPin, CupSoda, Book, Briefcase, Heart, MessageSquare, Check, CheckCircle, X, Shield, Image as ImageIcon, ArrowLeft, Clock, GraduationCap, Send, Sparkles, Loader2, CreditCard, CalendarDays, Cake, Phone, Languages, Users, Ruler, Wallet, Building, Lock, Scale, UserPlus, Utensils, Cigarette, Wine, Moon, Sun, Home, Activity, Star, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interestSent, setInterestSent] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProfile = async () => {
            try {
                const { data } = await api.getProfile(id);
                setProfile(data);

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

    const handleChat = () => {
        navigate(`/chat/${id}`);
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
    const canViewAstrological = isPremium;
    const canViewEducation = isPremium;
    const canViewFamily = !isFree;
    const canViewPartnerPref = !isFree;
    const canViewAboutYou = !isFree;
    const canViewVerification = !isFree;

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



                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Photo & Actions */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-4 rounded-3xl shadow-lg mb-8">
                            <div className="aspect-square rounded-full overflow-hidden bg-gray-100 border-4 border-[#800020]/5 shadow-inner">
                                {profile.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt={profile.name}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => setSelectedPhoto(profile.profilePicture)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <User size={80} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleInterest}
                                disabled={interestSent}
                                className={`py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition-all ${interestSent ? 'bg-green-50 text-green-600' : 'bg-[#800020] text-[#D4AF37] hover:bg-[#600318] shadow-lg shadow-[#800020]/20'}`}
                            >
                                {interestSent ? <CheckCircle size={24} /> : <Heart size={24} className="fill-[#D4AF37]" />}
                                <span className="text-[10px] uppercase tracking-widest">{interestSent ? 'Interest Sent' : 'Interested'}</span>
                            </button>
                            <button
                                onClick={handleChat}
                                className="py-4 rounded-xl bg-white border border-[#800020]/10 text-[#800020] flex flex-col items-center gap-2 font-bold hover:bg-[#800020]/5 transition-all"
                            >
                                <MessageSquare size={24} />
                                <span className="text-[10px] uppercase tracking-widest">Message</span>
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 space-y-8">
                        {/* Membership Status (Only for own profile) */}
                        {currentUser?._id === id && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-[#800020] to-[#600318] p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#800020]/20 border border-[#D4AF37]/20 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center border border-[#D4AF37]/30">
                                        <Sparkles size={32} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Your Current Plan</p>
                                        <h3 className="text-2xl font-serif font-black italic">{profile.membership || 'Premium'} Member</h3>
                                    </div>
                                </div>
                                <div className="relative z-10 flex flex-col items-center md:items-end gap-1">
                                    <div className="flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                        <CalendarDays size={16} className="text-[#D4AF37]" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">24 Days Remaining</span>
                                    </div>
                                    <p className="text-white/40 text-[9px] font-medium uppercase tracking-tighter">Plan expires on 30 Mar 2026</p>
                                </div>
                            </motion.div>
                        )}

                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{profile.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-500">
                                <span className="flex items-center gap-2"><Clock size={16} /> {profile.age} Years</span>
                                <span className="flex items-center gap-2"><User size={16} /> {profile.gender}</span>
                            </div>
                        </div>

                        {/* Detail Sections */}
                        <div className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { icon: <Users size={16} />, label: 'Marital Status', value: <span className="text-gray-900 font-semibold">{profile.maritalStatus || 'Not Specified'}</span> },
                                        { icon: <Ruler size={16} />, label: 'Height', value: <span className="text-gray-900 font-semibold">{profile.height || 'Not Specified'}</span> },
                                        { icon: <Languages size={16} />, label: 'Mother Tongue', value: <span className="text-gray-900 font-semibold">{profile.motherTongue || 'Not Specified'}</span> },
                                        { icon: <Cake size={16} />, label: 'Date of Birth', value: <span className="text-gray-900 font-semibold">{profile.dob || '12-Aug-1996'}</span> },
                                        canViewMobile ? { icon: <Phone size={16} />, label: 'Mobile', value: <span className="text-gray-900 font-semibold">{profile.mobile || '+91 9876543210'}</span> } : null,
                                        { icon: <Scale size={16} />, label: 'Weight', value: <span className="text-gray-900 font-semibold">{profile.weight || 'Not Specified'}</span> },
                                        { icon: <User size={16} />, label: 'Body Type', value: <span className="text-gray-900 font-semibold">{profile.bodyType || 'Not Specified'}</span> },
                                        { icon: <UserPlus size={16} />, label: 'Profile Created By', value: <span className="text-gray-900 font-semibold">{profile.profileCreatedBy || 'Not Specified'}</span> }
                                    ].filter(Boolean).map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                                                <div className="text-sm truncate">{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lifestyle Information */}
                            <div>
                                <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Lifestyle Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { icon: <Utensils size={16} />, label: 'Eating Habits', value: profile.eatingHabits || 'Not Specified' },
                                        { icon: <Wine size={16} />, label: 'Drinking Habits', value: profile.drinkingHabits || 'Not Specified' },
                                        { icon: <Cigarette size={16} />, label: 'Smoking Habits', value: profile.smokingHabits || 'Not Specified' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                                                <p className="text-gray-900 font-semibold text-sm truncate">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Astrological Details */}
                            {canViewAstrological && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Astrological Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { icon: <Clock size={16} />, label: 'Time of Birth', value: <span className="text-gray-900 font-semibold">{profile.timeOfBirth || '10:30 AM'}</span> },
                                            { icon: <Star size={16} />, label: 'Star / Nakshatra', value: <span className="text-gray-900 font-semibold">{profile.star || 'Rohini'}</span> },
                                            { icon: <Moon size={16} />, label: 'Raasi / Moon Sign', value: <span className="text-gray-900 font-semibold">{profile.raasi || 'Vrushabha'}</span> },
                                            { icon: <AlertTriangle size={16} />, label: 'Kuja Dosha', value: <span className="text-gray-900 font-semibold">{profile.kujaDosha || 'No'}</span> },
                                            { icon: <Home size={16} />, label: 'Kula Daiva', value: <span className="text-gray-900 font-semibold">{profile.kulaDaiva || 'Tirupati Balaji'}</span> },
                                            { icon: <Activity size={16} />, label: 'Horoscope Matching', value: <span className="text-gray-900 font-semibold">{profile.horoscope || 'Yes'}</span> }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                    {item.icon}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                                                    <div className="text-sm truncate">{item.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Family Background */}
                            {canViewFamily && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Family Background</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { icon: <Home size={16} />, label: 'Family Type', value: profile.familyType || 'Not Specified' },
                                            { icon: <Shield size={16} />, label: 'Family Status', value: profile.familyStatus || 'Not Specified' },
                                            { icon: <MapPin size={16} />, label: 'Ancestral Origin', value: profile.ancestralOrigin || 'Not Specified' },
                                            { icon: <Users size={16} />, label: 'Brothers', value: profile.brothers || 'Not Specified' },
                                            { icon: <Users size={16} />, label: 'Sisters', value: profile.sisters || 'Not Specified' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                    {item.icon}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                                                    <p className="text-gray-900 font-semibold text-sm truncate">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Professional Information */}
                            <div>
                                <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Career & Education</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        canViewEducation ? { icon: <GraduationCap size={16} />, label: 'Education', value: profile.education || 'Not Specified' } : null,
                                        { icon: <Briefcase size={16} />, label: 'Profession', value: profile.profession || 'Not Specified' },
                                        { icon: <Wallet size={16} />, label: 'Income', value: profile.income || 'Not Specified' },
                                        { icon: <Building size={16} />, label: 'Work Location', value: profile.workLocation || 'Not Specified' },
                                        { icon: <MapPin size={16} />, label: 'Current Location', value: profile.location || 'Not Specified' }
                                    ].filter(Boolean).map((item, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                                                <p className="text-gray-900 font-semibold text-sm truncate">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Partner Preferences */}
                            {canViewPartnerPref && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Partner Preferences</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-[#800020]/5 p-5 rounded-2xl border border-[#800020]/10 flex flex-col gap-1">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Age Range</p>
                                            <p className="text-gray-900 font-semibold">{profile.prefAgeMin || '18'} to {profile.prefAgeMax || '40'} Years</p>
                                        </div>
                                        <div className="bg-[#800020]/5 p-5 rounded-2xl border border-[#800020]/10 flex flex-col gap-1">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Preferred Location</p>
                                            <p className="text-gray-900 font-semibold">{profile.prefLocation || 'Any'}</p>
                                        </div>
                                        <div className="bg-[#800020]/5 p-5 rounded-2xl border border-[#800020]/10 flex flex-col gap-1">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Preferred Education</p>
                                            <p className="text-gray-900 font-semibold">{profile.prefEducation || 'Any'}</p>
                                        </div>
                                        <div className="bg-[#800020]/5 p-5 rounded-2xl border border-[#800020]/10 flex flex-col gap-1">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Preferred Profession</p>
                                            <p className="text-gray-900 font-semibold">{profile.prefProfession || 'Any'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Verification Details */}
                            {canViewVerification && profile.aadharCard && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#800020]/5">Verification Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#800020]/5 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#FFFDD0] text-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Shield size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Aadhar Card</p>
                                                <p className="text-green-600 font-semibold text-sm">Verified</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-12">
                            {canViewAboutYou && (
                                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-[#800020]/5">
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#800020]/5">About Me</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg italic font-serif">
                                        {profile.aboutMe || "I'm looking for a partner who respects values and has a modern outlook on life. Let's connect to know more."}
                                    </p>
                                </div>
                            )}

                            {profile.interests?.length > 0 && (
                                <div>
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

                            {profile.photos && profile.photos.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#800020]/5">Photo Gallery</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-6 md:gap-8">
                                        {profile.photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setSelectedPhoto(photo)}
                                                className="aspect-square rounded-[2rem] overflow-hidden border-2 border-white shadow-md group cursor-pointer hover:shadow-xl transition-all"
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox / Full Photo View */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedPhoto}
                            alt="Full view"
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDetail;
