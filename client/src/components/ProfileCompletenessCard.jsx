import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Home, Music } from 'lucide-react';
import * as api from '../services/api';
import { calculateCompleteness } from '../utils/completeness';

const ProfileActionButton = ({ icon, label, bg, onClick }) => (
    <button
        onClick={onClick}
        className={`${bg} p-4 md:p-6 rounded-3xl flex items-center gap-4 hover:scale-105 transition-all w-full md:w-auto shadow-sm border border-black/5 group`}
    >
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
            {icon}
        </div>
        <span className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">{label}</span>
    </button>
);

const ProfileCompletenessCard = ({ userProfile }) => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [profile, setProfile] = useState(userProfile);
    const [loading, setLoading] = useState(!userProfile);

    useEffect(() => {
        if (!userProfile) {
            const fetchProfile = async () => {
                try {
                    const { data } = await api.getProfile();
                    setProfile(data);
                    setScore(calculateCompleteness(data));
                } catch (err) { console.error(err); }
                setLoading(false);
            };
            fetchProfile();
        } else {
            setScore(calculateCompleteness(userProfile));
        }
    }, [userProfile]);

    if (loading || score >= 100) return null;

    return (
        <div className="max-w-6xl mx-auto bg-[#F0F7FF] rounded-[2rem] p-8 border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
                <div className="flex-1">
                    <h2 className="text-xl font-black text-gray-900 mb-2 font-serif italic">Complete Your Profile</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Profile completeness score</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#FF8A00]">{score}%</span>
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden leading-none relative">
                                <div
                                    className="absolute left-0 top-0 h-full bg-[#FF8A00] rounded-full transition-all duration-1000"
                                    style={{ width: `${score}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <ProfileActionButton icon={<ShieldCheck size={20} className="text-blue-500" />} label="Verify Profile" bg="bg-blue-50" onClick={() => navigate('/edit-profile')} />
                    <ProfileActionButton icon={<Home size={20} className="text-orange-500" />} label="Family Details" bg="bg-orange-50" onClick={() => navigate('/edit-profile')} />
                    <ProfileActionButton icon={<Music size={20} className="text-pink-500" />} label="Add Hobbies" bg="bg-pink-50" onClick={() => navigate('/edit-profile')} />
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletenessCard;
