import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, User, Ruler, GraduationCap, Calendar, Eye, MessageSquare, Loader2, Star, CheckCircle, Heart } from 'lucide-react';
import * as api from '../services/api';

const ProfileCard = ({ profile }) => {
    if (!profile) return null;
    const profileId = profile._id || profile.id;
    const [interestSent, setInterestSent] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [sending, setSending] = useState(false);
    const imgSrc = profile.profilePicture || profile.image;

    React.useEffect(() => {
        const checkInterestStatus = async () => {
            if (!profileId) return;
            try {
                const { data: sentList } = await api.getSentInterestsList();
                if (sentList.includes(profileId)) {
                    setInterestSent(true);
                }
            } catch (err) {
                console.error(err);
            }
        };
        checkInterestStatus();
    }, [profileId]);

    const handleInterest = async (interested) => {
        if (!interested) {
            setDismissed(true);
            return;
        }
        if (!profileId) {
            alert('Profile ID not found');
            return;
        }
        setSending(true);
        try {
            const { data } = await api.sendInterest(profileId);
            setInterestSent(true);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to send interest';
            if (msg === 'Interest already sent') {
                setInterestSent(true);
            } else {
                alert(msg);
            }
        } finally {
            setSending(false);
        }
    };

    if (dismissed) return null;

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-[#800020]/5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] group hover:shadow-[0_25px_50px_-12px_rgba(128,0,32,0.12)] transition-all duration-500">
            {/* Profile Image */}
            <div className="relative">
                <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                    {imgSrc && !imgError ? (
                        <img
                            src={imgSrc}
                            alt={profile.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gradient-to-b from-gray-50/50 to-blue-50/50">
                            <User size={80} className="text-[#800020]/10" />
                        </div>
                    )}
                </div>
                {/* Last Seen Badge */}
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-600 shadow-sm border border-white/50 uppercase tracking-wider">
                    Online Now
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Profile Details */}
            <div className="p-7">
                {/* Name */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-gray-900 italic">{profile.name}</h3>
                    <div className="flex gap-0.5">
                        <Star size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
                        <Star size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-3 mb-6">
                    {/* Age & Height */}
                    <div className="flex items-center gap-2.5 text-gray-600 text-xs">
                        <div className="w-7 h-7 bg-[#FFFDD0] rounded-lg flex items-center justify-center">
                            <Calendar size={13} className="text-[#D4AF37]" />
                        </div>
                        <span className="font-semibold">{profile.age || '25'} yrs, 5'6"</span>
                    </div>
                    {/* Location */}
                    <div className="flex items-center gap-2.5 text-gray-600 text-xs">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                            <MapPin size={13} className="text-blue-400" />
                        </div>
                        <span className="font-semibold truncate">{profile.location || 'India'}</span>
                    </div>
                    {/* Education */}
                    <div className="flex items-center gap-2.5 text-gray-600 text-xs">
                        <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                            <GraduationCap size={13} className="text-green-400" />
                        </div>
                        <span className="font-semibold truncate">{profile.education || 'Graduate'}</span>
                    </div>
                    {/* Profession */}
                    <div className="flex items-center gap-2.5 text-gray-600 text-xs">
                        <div className="w-7 h-7 bg-[#FFFDD0] rounded-lg flex items-center justify-center">
                            <Briefcase size={13} className="text-[#800020]" />
                        </div>
                        <span className="font-semibold truncate">{profile.profession || 'Professional'}</span>
                    </div>
                </div>

                {/* Interest Section */}
                <div className="border-t border-[#800020]/5 pt-6">
                    {interestSent ? (
                        <div className="text-center py-2.5 bg-green-50 rounded-2xl">
                            <p className="text-sm font-bold text-green-600 flex items-center justify-center gap-2">
                                <CheckCircle size={16} /> Interest Sent!
                            </p>
                        </div>
                    ) : dismissed ? (
                        <div className="text-center py-2.5 bg-gray-50 rounded-2xl">
                            <p className="text-sm font-bold text-gray-400">Profile Skipped</p>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={(e) => { e.preventDefault(); handleInterest(true); }}
                                disabled={sending}
                                className="flex items-center gap-2 px-6 py-2 bg-[#800020] text-[#D4AF37] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#600318] transition-colors shadow-lg shadow-[#800020]/20 disabled:opacity-60"
                            >
                                {sending ? <Loader2 size={16} className="animate-spin text-[#D4AF37]" /> : <Heart size={14} className="fill-[#D4AF37] text-[#D4AF37]" />}
                                {sending ? 'Sending...' : 'Interested'}
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); handleInterest(false); }}
                                disabled={sending}
                                className="flex-1 py-3.5 rounded-2xl bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-60"
                            >
                                Skip
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4 mt-6">
                    <Link
                        to={`/profile/${profileId}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#FFFDD0]/50 text-[#800020] text-xs font-bold uppercase tracking-widest hover:bg-[#FFFDD0] transition-all active:scale-95 border border-[#D4AF37]/20"
                    >
                        <Eye size={15} />
                        Details
                    </Link>
                    <Link
                        to={`/chat/${profileId}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border border-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <MessageSquare size={15} />
                        Message
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
