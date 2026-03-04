import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { User, MapPin, CupSoda, Book, Briefcase, Heart, MessageSquare, Check, CheckCircle, X, Shield, Image as ImageIcon, ArrowLeft, Clock, GraduationCap, Send, Sparkles, Loader2 } from 'lucide-react';

const ProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interestSent, setInterestSent] = useState(false);

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

    return (
        <div className="min-h-screen py-24 px-6 bg-white">
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
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                                {profile.profilePicture ? (
                                    <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
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

                    {/* Right Column: Details */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{profile.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-500">
                                <span className="flex items-center gap-2"><Clock size={16} /> {profile.age} Years</span>
                                <span className="flex items-center gap-2"><User size={16} /> {profile.gender}</span>
                                <span className="flex items-center gap-2"><Sparkles size={16} /> {profile.religion}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: <MapPin size={20} />, label: 'Location', value: profile.location || 'Not Specified' },
                                { icon: <Briefcase size={20} />, label: 'Profession', value: profile.profession || 'Not Specified' },
                                { icon: <GraduationCap size={20} />, label: 'Education', value: profile.education || 'Not Specified' },
                                { icon: <Shield size={20} />, label: 'Caste', value: profile.caste || 'Not Specified' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[#800020]/5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#FFFDD0] text-[#D4AF37] rounded-xl flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                                        <p className="text-gray-900 font-bold">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-12">
                            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-[#800020]/5">
                                <h3 className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#800020]/5">About Me</h3>
                                <p className="text-gray-600 leading-relaxed text-lg italic font-serif">
                                    {profile.aboutMe || "I'm looking for a partner who respects values and has a modern outlook on life. Let's connect to know more."}
                                </p>
                            </div>

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
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                        {profile.photos.map((photo, index) => (
                                            <div key={index} className="aspect-[4/5] rounded-[2rem] overflow-hidden border-2 border-white shadow-md group cursor-pointer hover:shadow-xl transition-all">
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
        </div>
    );
};

export default ProfileDetail;
