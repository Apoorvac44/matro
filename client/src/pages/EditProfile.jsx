import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Save, User, MapPin, Book, Briefcase, Heart, Info, ImagePlus, X, Trash2, ArrowLeft, CheckCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', religion: '', caste: '',
        location: '', education: '', profession: '', interests: '', aboutMe: '',
        profilePicture: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.getProfile();
                setFormData({
                    name: data.name || '',
                    age: data.age || '',
                    gender: data.gender || '',
                    religion: data.religion || '',
                    caste: data.caste || '',
                    location: data.location || '',
                    education: data.education || '',
                    profession: data.profession || '',
                    interests: data.interests?.join(', ') || '',
                    aboutMe: data.aboutMe || '',
                    profilePicture: data.profilePicture || ''
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const profileData = {
                ...formData,
                interests: formData.interests.split(',').map(i => i.trim()).filter(i => i !== '')
            };
            await api.updateProfile(profileData);
            setMessage('Your profile info has been updated.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Profile picture must be less than 2MB.');
            return;
        }

        setUploading(true);
        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
            setFormData({ ...formData, profilePicture: base64 });
        } catch (err) {
            console.error('File conversion error:', err);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#F8F9FA]/20">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
            <Heart size={48} className="text-[#D4AF37] fill-[#D4AF37]/20" />
        </motion.div>
    </div>;

    return (
        <div className="bg-[#F8F9FA]/20 min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>

            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-[#800020]/5 overflow-hidden border border-[#800020]/5">
                    <div className="p-8 lg:p-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                            <div>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-3 block"
                                >
                                    Edit Profile Details
                                </motion.span>
                                <h1 className="text-4xl font-serif font-black text-gray-900 mb-3 italic">Refine Your Profile</h1>
                                <p className="text-gray-400 font-medium">Keep your profile updated to find your perfect match.</p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-14 h-14 rounded-2xl bg-[#F8F9FA]/50 flex items-center justify-center text-[#800020] hover:bg-[#F8F9FA] transition-all border border-[#D4AF37]/20 shadow-sm group"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 text-green-700 px-6 py-4 rounded-xl mb-8 font-bold flex items-center gap-3 border border-green-100"
                            >
                                <CheckCircle size={20} /> {message}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-16">
                            {/* Profile Photo Section */}
                            <div className="flex flex-col md:flex-row items-center gap-10 p-10 bg-[#F8F9FA]/30 rounded-[2.5rem] border border-[#D4AF37]/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-5"></div>
                                <div className="relative z-10">
                                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden bg-white shadow-xl border-4 border-white group-hover:rotate-3 transition-transform duration-500">
                                        {formData.profilePicture ? (
                                            <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gradient-to-br from-gray-50 to-[#FFFDD0]">
                                                <User size={64} className="text-[#D4AF37]/20" />
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 size={32} className="animate-spin text-[#800020]" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-6 text-center md:text-left relative z-10 flex-1">
                                    <div>
                                        <h3 className="text-xl font-serif font-black text-gray-900 italic mb-1">Profile Picture</h3>
                                        <p className="text-gray-400 text-sm font-medium">A clear photo increases your chances of finding a match by 80%.</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                        <label className="cursor-pointer bg-[#800020] text-[#D4AF37] px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#600318] transition-all shadow-lg shadow-[#800020]/20 block">
                                            Upload Photo
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                                        </label>
                                        {formData.profilePicture && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, profilePicture: '' })}
                                                className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#800020] transition-all px-4"
                                            >
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Basic Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                        <input
                                            type="number"
                                            className="form-input-premium"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            placeholder="e.g. 25"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Background Details */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Background Info
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Religion</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.religion}
                                            onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                                            placeholder="Religion"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Caste / Community</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.caste}
                                            onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                                            placeholder="Caste"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Education</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                            placeholder="Education"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Profession</label>

                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.profession}
                                            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                            placeholder="Profession"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About & Interests */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    About You
                                </h3>
                                <div className="space-y-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">About Me</label>
                                        <textarea
                                            className="form-input-premium min-h-[160px] resize-none !pl-6"
                                            value={formData.aboutMe}
                                            onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                                            placeholder="Tell us a little about yourself and what you are looking for."
                                        ></textarea>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Interests & Hobbies</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.interests}
                                            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                            placeholder="e.g. Travel, Music, Reading"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-[#800020] text-[#D4AF37] rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 transition-all">
                                Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .form-input-premium {
                    width: 100%;
                    padding: 1.15rem 1.15rem 1.15rem 1.5rem;
                    background: #F9FAFB/50;
                    border: 1.5px solid #F3F4F6;
                    border-radius: 1.5rem;
                    font-size: 0.825rem;
                    font-weight: 600;
                    color: #111827;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                }
                .form-input-premium:focus {
                    background: #FFFFFF;
                    border-color: #800020;
                    box-shadow: 0 15px 25px -5px rgba(128, 0, 32, 0.08);
                }
            `}</style>
        </div>
    );
};

export default EditProfile;
