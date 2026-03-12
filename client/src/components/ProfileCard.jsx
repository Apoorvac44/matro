import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Bookmark, Phone, MessageCircle, Camera, CheckCircle, User } from 'lucide-react';
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
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-4 relative z-0 flex flex-col">
            {/* Image Section */}
            <Link to={`/profile/${profileId}`} className="relative block aspect-[4/5] bg-gray-100 shrink-0">
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
                    onClick={(e) => { e.preventDefault(); console.log('Shortlisted'); }}
                >
                    <Bookmark size={12} className="fill-transparent" />
                    Shortlist
                </button>

                {/* Bottom-right Photo count */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-black text-[10px] px-2 py-1 rounded flex items-center gap-1 font-bold shadow-sm z-10">
                    <Camera size={12} /> {(profile.photos?.length || 0) + 1}
                </div>

                {/* Subtle gradient overlay at bottom for better text contrast if we had text over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            </Link>

            {/* Info Section */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                    <Link to={`/profile/${profileId}`} className="group max-w-[70%]">
                        <h3 className="text-[17px] font-bold text-gray-900 group-hover:text-[#ed5a5a] transition-colors truncate">
                            {profile.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                            {shortId} | Last seen few hours ago
                        </p>
                    </Link>
                    <div className="flex gap-2 shrink-0">
                        <button className="w-8 h-8 rounded-full border border-orange-400 text-orange-400 flex items-center justify-center hover:bg-orange-50 transition-colors">
                            <Phone size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full border border-green-500 text-green-500 flex items-center justify-center hover:bg-green-50 transition-colors">
                            <MessageCircle size={14} />
                        </button>
                    </div>
                </div>

                <div className="mt-2 mb-4 text-[13px] text-gray-700 leading-snug">
                    {profile.age || '26'} Yrs • 5'4" • {profile.education || 'MCA'} • {profile.profession || 'Software Professional'} • {profile.location || 'Mysuru'}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                    {interestSent ? (
                        <div className="py-3 bg-green-50 rounded-full flex items-center justify-center gap-2 text-green-600 font-semibold text-sm border border-green-100">
                            <CheckCircle size={16} /> Interest Sent
                        </div>
                    ) : (
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={(e) => { e.preventDefault(); handleInterest(false); }}
                                className="flex-[0.45] py-2.5 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center gap-1.5 text-sm font-semibold hover:bg-gray-50 transition-colors active:scale-95"
                            >
                                <X size={16} /> Don't Show
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); handleInterest(true); }}
                                disabled={sending}
                                className="flex-[0.55] py-2.5 rounded-full bg-[#ed5a5a] text-white flex items-center justify-center gap-1.5 text-sm font-semibold hover:bg-[#e04848] transition-colors shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-70"
                            >
                                {sending ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Heart size={16} className="fill-transparent stroke-white stroke-2" />
                                )}
                                Send Interest
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
