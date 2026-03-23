import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Bookmark, Phone, MessageCircle, MessageSquare, Camera, CheckCircle, User } from 'lucide-react';
import * as api from '../services/api';

const ProfileCard = ({ profile }) => {
    const navigate = useNavigate();
    const [interestSent, setInterestSent] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [sending, setSending] = useState(false);

    const profileId = profile?._id || profile?.id;

    // Move hooks to top
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

    if (!profile || dismissed) return null;

    const imgSrc = profile.profilePicture || profile.image;

    const handleInterest = async (interested) => {
        if (!profileId) return;
        setSending(true);
        try {
            await api.sendInterest(profileId, interested ? 'pending' : 'declined');
            if (interested) {
                setInterestSent(true);
            } else {
                setDismissed(true);
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to update interest';
            if (msg === 'Interest already sent' && interested) setInterestSent(true);
        } finally {
            setSending(false);
        }
    };

    if (dismissed) return null;

    // Derived mock ID
    const shortId = profileId.startsWith('u_')
        ? 'MTR' + profileId.slice(-6)
        : 'MTR' + profileId.slice(0, 6).toUpperCase();

    return (
        <div
            onClick={() => navigate(`/profile/${profileId}`)}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm relative z-0 flex flex-col group transition-all hover:shadow-md cursor-pointer w-full h-full"
        >
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] sm:aspect-square bg-gray-100 shrink-0 pointer-events-none overflow-hidden">
                {imgSrc && !imgError ? (
                    <img
                        src={imgSrc}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-100">
                        <User size={60} className="text-gray-300" />
                    </div>
                )}

                {/* Top-left Sash (Newly Joined) - Shown for profiles < 7 days old */}
                {(!profile.createdAt || (new Date() - new Date(profile.createdAt)) < 7 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
                        <div className="absolute top-4 -left-8 bg-[#800020] text-[#D4AF37] text-[9px] font-black py-1 w-32 text-center -rotate-45 shadow-lg uppercase tracking-widest border-y border-[#D4AF37]/20">
                            Newly Joined
                        </div>
                    </div>
                )}



                {/* Top-right Shortlist button - compact on mobile */}
                <button
                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-2 rounded-full flex items-center justify-center hover:bg-black transition z-20 sm:p-1.5 sm:px-3 sm:py-1.5 sm:gap-1.5 sm:rounded-full"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); console.log('Shortlisted'); }}
                >
                    <Bookmark size={12} className="fill-transparent" />
                    <span className="hidden sm:inline text-[11px] font-semibold">Shortlist</span>
                </button>

                {/* Bottom-right Photo count */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-black text-[10px] px-2 py-1 rounded flex items-center gap-1 font-bold shadow-sm z-10">
                    <Camera size={12} /> {(profile.photos?.length || 0) + 1}
                </div>
            </div>

            {/* Info Section */}
            <div className="p-2.5 relative bg-white pb-3 flex-1 flex flex-col min-h-0">
                {/* Action Buttons - Moved to Top of Info Section */}
                <div className="flex justify-between gap-2 z-20 overflow-visible mb-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleInterest(false); }}
                        className="flex-1 py-1.5 px-3 flex items-center justify-center gap-1.5 bg-white rounded-full border border-gray-200 text-gray-700 font-bold transition-all hover:bg-gray-50 shadow-sm active:scale-95"
                    >
                        <X size={14} className="text-gray-400" />
                        <span className="text-[11px]">Don't Show</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleInterest(true); }}
                        disabled={sending || interestSent}
                        className={`flex-[1.4] py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 font-bold transition-all shadow-md active:scale-95 ${interestSent
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-[#800020] text-[#D4AF37] hover:bg-[#600318] cursor-pointer'
                            }`}
                    >
                        {sending ? (
                            <div className="w-4 h-4 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                        ) : interestSent ? (
                            <>
                                <CheckCircle size={14} />
                                <span className="text-[11px]">Interest Sent</span>
                            </>
                        ) : (
                            <>
                                <Heart size={14} className="fill-[#D4AF37]" />
                                <span className="text-[11px] text-[#D4AF37]">Send Interest</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="flex justify-between items-start mb-1.5">
                    <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-bold text-gray-900 text-[14px] sm:text-[15px] group-hover:text-[#800020] transition-colors truncate leading-tight flex items-center gap-1">
                            {profile.name}
                            {profile.isApproved && (
                                <CheckCircle size={14} className="text-[#800020] fill-[#D4AF37] shrink-0" strokeWidth={3} />
                            )}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate font-medium">
                            {shortId} | Last seen few hours ago
                        </p>
                    </div>
                    {/* Circular Action Icons - Side by Side on Right */}
                    <div className="flex gap-2 shrink-0 pt-0.5">
                        <a
                            href={`tel:${profile.mobile || ''}`}
                            onClick={(e) => { e.stopPropagation(); if (!profile.mobile) { e.preventDefault(); alert('Phone number not available'); } }}
                            className="w-8 h-8 rounded-full border border-orange-100 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors z-20 shadow-sm bg-white"
                        >
                            <Phone size={14} />
                        </a>
                        <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate(`/chat/${profileId}`); }}
                            className="w-8 h-8 rounded-full border border-green-100 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors z-20 shadow-sm bg-white"
                        >
                            <MessageSquare size={14} />
                        </button>
                    </div>
                </div>

                <div className="text-[11px] text-gray-600 leading-snug line-clamp-2 mb-1.5 font-medium">
                    {profile.age || '26'} Yrs • 5'4" • {profile.education || 'MCA'} • {profile.profession || 'Software Professional'} • {profile.location || 'Mysuru'}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
