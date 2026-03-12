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
        if (!interested) {
            setDismissed(true);
            return;
        }
        if (!profileId) return;
        setSending(true);
        try {
            await api.sendInterest(profileId);
            setInterestSent(true);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to send interest';
            if (msg === 'Interest already sent') setInterestSent(true);
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
            className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-3 relative z-0 flex flex-col group transition-all hover:shadow-md h-[340px] max-h-[340px] cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative block aspect-[4/4] bg-gray-100 shrink-0 pointer-events-none">
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

                {/* Top-left Sash (Newly Joined) */}
                <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
                    <div className="absolute top-0 left-0 bg-[#e91e63] text-white text-[9px] font-bold py-1.5 w-32 text-center -rotate-45 origin-bottom-right -translate-x-12 -translate-y-4 shadow-sm leading-tight">
                        NEWLY<br />JOINED
                    </div>
                </div>

                {/* Top-right Shortlist pill */}
                <button
                    className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black transition z-20"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); console.log('Shortlisted'); }}
                >
                    <Bookmark size={12} className="fill-transparent" />
                    Shortlist
                </button>

                {/* Bottom-right Photo count */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-black text-[10px] px-2 py-1 rounded flex items-center gap-1 font-bold shadow-sm z-10">
                    <Camera size={12} /> {(profile.photos?.length || 0) + 1}
                </div>

                {/* Subtle gradient overlay at bottom for better text contrast if we had text over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Info Section */}
            <div className="p-2 relative bg-white pb-16 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#ed5a5a] transition-colors truncate">
                            {profile.name}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                            {shortId} | Last seen few hours ago
                        </p>
                    </div>
                    {/* Circular Action Icons */}
                    <div className="flex gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigate(`/chat/${profileId}`); }}
                            className="w-7 h-7 rounded-full border border-green-400 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors z-20"
                        >
                            <MessageSquare size={12} />
                        </button>
                    </div>
                </div>

                <div className="mt-1 mb-1 text-[11px] text-gray-700 leading-snug line-clamp-2">
                    {profile.age || '26'} Yrs • 5'4" • {profile.education || 'MCA'} • {profile.profession || 'Software Professional'} • {profile.location || 'Mysuru'}
                </div>

                {/* Bottom Floating Action Buttons */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2.5 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleInterest(false); }}
                        className="flex-1 py-2 px-2 flex items-center justify-center gap-2 bg-white rounded-full border border-gray-200 text-gray-500 font-bold transition-colors hover:bg-gray-50 shadow-sm"
                    >
                        <span className="text-gray-400 font-light text-xs"><X size={14} /></span>
                        <span className="text-[10px] leading-[1.1] text-left">Don't<br />Show</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleInterest(true); }}
                        disabled={sending || interestSent}
                        className={`flex-[1.2] py-2 px-2 rounded-full flex items-center justify-center gap-2 font-bold transition-all shadow-sm ${interestSent
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-[#800020] text-[#D4AF37] hover:bg-[#600318] cursor-pointer'
                            }`}
                    >
                        {sending ? (
                            <div className="w-3 h-3 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                        ) : interestSent ? (
                            <>
                                <CheckCircle size={14} />
                                <span className="text-[10px] leading-[1.1] text-left text-green-700">Interest<br />Sent</span>
                            </>
                        ) : (
                            <>
                                <Heart size={14} className="fill-[#D4AF37]" />
                                <span className="text-[10px] leading-[1.1] text-left text-[#D4AF37] tracking-wide">Send<br />Interest</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
