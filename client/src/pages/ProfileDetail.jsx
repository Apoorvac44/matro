import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { User, MapPin, CupSoda, Book, Briefcase, Heart, MessageSquare, Check, X, Shield, Image as ImageIcon, ArrowLeft, Clock, GraduationCap, Send, Sparkles, Loader2 } from 'lucide-react';

const ProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interestSent, setInterestSent] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.getProfiles();
                const found = data.find(p => (p._id === id) || (p.id === id));
                if (found) {
                    setProfile(found);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
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

    if (loading) return <div className="h-screen flex items-center justify-center bg-brand-pink/20">
        <Loader2 className="animate-spin text-brand-maroon" size={48} />
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
        <div className="min-h-screen py-24 px-6 bg-pink-50">
            <div className="container mx-auto max-w-6xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-pink-600 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
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
                                className={`py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition-all ${interestSent ? 'bg-pink-100 text-pink-600' : 'bg-pink-600 text-white hover:bg-pink-700'}`}
                            >
                                {interestSent ? <Check size={24} /> : <Heart size={24} />}
                                <span className="text-xs">{interestSent ? 'Interest Sent' : 'Send Interest'}</span>
                            </button>
                            <button
                                onClick={handleChat}
                                className="py-4 rounded-xl bg-white border border-pink-200 text-pink-600 flex flex-col items-center gap-2 font-bold hover:bg-pink-50 transition-all"
                            >
                                <MessageSquare size={24} />
                                <span className="text-xs">Message</span>
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
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.label}</p>
                                        <p className="text-gray-900 font-bold">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-12">
                            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-pink-100">
                                <h3 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-6 pb-2 border-b border-pink-50">About Me</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {profile.aboutMe || "I'm looking for a partner who respects values and has a modern outlook on life. Let's connect to know more."}
                                </p>
                            </div>

                            {profile.interests?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-6">Interests</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.interests.map(interest => (
                                            <span key={interest} className="px-5 py-2 bg-pink-100 text-pink-700 rounded-full text-xs font-bold shadow-sm">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {profile.photos && profile.photos.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-6 pb-2 border-b border-pink-50">Photo Gallery</h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                        {profile.photos.map((photo, index) => (
                                            <div key={index} className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-white shadow-md group cursor-pointer hover:shadow-lg transition-all">
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
