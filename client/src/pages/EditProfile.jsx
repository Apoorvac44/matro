import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { Save, User, MapPin, Book, Briefcase, Heart, Info, ImagePlus, X, Trash2, ArrowLeft, CheckCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', location: '',
        education: '', profession: '', income: '', workLocation: '',
        interests: '', aboutMe: '', profilePicture: '',
        mobile: '', dob: '', motherTongue: '', maritalStatus: '', height: '',
        religion: '', caste: '', email: '',
        prefAgeMin: '', prefAgeMax: '', prefLocation: '', prefEducation: '', prefProfession: '',
        aadharCard: '', casteCertificate: '', membership: 'p1',
        weight: '', bodyType: '', profileCreatedBy: '', eatingHabits: '', smokingHabits: '', drinkingHabits: '',
        timeOfBirth: '', star: '', raasi: '', kujaDosha: '', kulaDaiva: '', horoscope: '',
        familyType: '', familyStatus: '', brothers: '', sisters: '', ancestralOrigin: ''
    });
    const [plans, setPlans] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
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
                    location: data.location || '',
                    education: data.education || '',
                    profession: data.profession || '',
                    income: data.income || '',
                    workLocation: data.workLocation || '',
                    interests: data.interests?.join(', ') || '',
                    aboutMe: data.aboutMe || '',
                    profilePicture: data.profilePicture || '',
                    mobile: data.mobile || '',
                    dob: data.dob || '',
                    motherTongue: data.motherTongue || '',
                    maritalStatus: data.maritalStatus || '',
                    height: data.height || '',
                    religion: data.religion || '',
                    caste: data.caste || '',
                    prefAgeMin: data.prefAgeMin || '',
                    prefAgeMax: data.prefAgeMax || '',
                    prefLocation: data.prefLocation || '',
                    prefEducation: data.prefEducation || '',
                    prefProfession: data.prefProfession || '',
                    email: data.email || '',
                    aadharCard: data.aadharCard || '',
                    casteCertificate: data.casteCertificate || '',
                    membership: data.membership || 'p1',
                    weight: data.weight || '',
                    bodyType: data.bodyType || '',
                    profileCreatedBy: data.profileCreatedBy || '',
                    eatingHabits: data.eatingHabits || '',
                    smokingHabits: data.smokingHabits || '',
                    drinkingHabits: data.drinkingHabits || '',
                    timeOfBirth: data.timeOfBirth || '',
                    star: data.star || '',
                    raasi: data.raasi || '',
                    kujaDosha: data.kujaDosha || '',
                    kulaDaiva: data.kulaDaiva || '',
                    horoscope: data.horoscope || '',
                    familyType: data.familyType || '',
                    familyStatus: data.familyStatus || '',
                    brothers: data.brothers || '',
                    sisters: data.sisters || '',
                    ancestralOrigin: data.ancestralOrigin || ''
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        const fetchPlans = () => {
            const dummyPlans = [
                { _id: 'p1', name: 'Free', price: 0, duration: 'Lifetime', features: ['View Profiles', 'Send 5 Interests/Day'], color: '#9CA3AF' },
                { _id: 'p2', name: 'Silver', price: 1999, duration: '3 Months', features: ['Unlimited Interests', 'Basic Support', 'View Contact Details (10)'], color: '#C0C0C0' },
                { _id: 'p3', name: 'Gold', price: 4999, duration: '6 Months', features: ['Priority Listing', 'Standard Support', 'View Contact Details (50)'], color: '#D4AF37' },
                { _id: 'p4', name: 'Premium', price: 9999, duration: '12 Months', features: ['Profile Highlight', 'Premium Support', 'Unlimited Contact Views', 'Personal Matchmaker'], color: '#800020' },
            ];
            setPlans(dummyPlans);
        };

        fetchProfile();
        fetchPlans();
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

    const handleDocumentChange = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Document must be less than 2MB.');
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
            setFormData({ ...formData, [field]: base64 });
        } catch (err) {
            console.error('Document conversion error:', err);
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
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-input-premium"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter your email"
                                        />
                                    </div>
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
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            placeholder="10-digit number"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-input-premium"
                                            value={formData.dob}
                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Religion</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.religion}
                                            onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                                        >
                                            <option value="">Select Religion</option>
                                            <option>Hindu</option>
                                            <option>Muslim</option>
                                            <option>Christian</option>
                                            <option>Sikh</option>
                                            <option>Jain</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Caste</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.caste}
                                            onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                                            placeholder="e.g. Brahmin"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mother Tongue</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.motherTongue}
                                            onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option>Hindi</option>
                                            <option>Bengali</option>
                                            <option>Marathi</option>
                                            <option>Telugu</option>
                                            <option>Tamil</option>
                                            <option>Kannada</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Marital Status</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.maritalStatus}
                                            onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Height</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.height}
                                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        >
                                            <option value="">Select Height</option>
                                            <option>5'0" (152 cm)</option>
                                            <option>5'2" (157 cm)</option>
                                            <option>5'4" (162 cm)</option>
                                            <option>5'6" (167 cm)</option>
                                            <option>5'8" (172 cm)</option>
                                            <option>5'10" (177 cm)</option>
                                            <option>6'0" (182 cm)</option>
                                            <option>Other</option>
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
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Weight</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            placeholder="e.g. 60 kg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Body Type</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.bodyType}
                                            onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option value="Slim">Slim</option>
                                            <option value="Average">Average</option>
                                            <option value="Athletic">Athletic</option>
                                            <option value="Heavy">Heavy</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Profile Created By</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.profileCreatedBy}
                                            onChange={(e) => setFormData({ ...formData, profileCreatedBy: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option value="Self">Self</option>
                                            <option value="Parents">Parents</option>
                                            <option value="Sibling">Sibling</option>
                                            <option value="Relative">Relative</option>
                                            <option value="Friend">Friend</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Education Information */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Education Info
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Education</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                            placeholder="Education (e.g. MBA, B.Tech)"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Profession</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.profession}
                                            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                            placeholder="Profession (e.g. Doctor, Engineer)"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Annual Income</label>
                                        <select
                                            className="form-input-premium appearance-none cursor-pointer"
                                            value={formData.income}
                                            onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                                        >
                                            <option value="">Select Range</option>
                                            <option>0 - 3 LPA</option>
                                            <option>3 - 7 LPA</option>
                                            <option>7 - 15 LPA</option>
                                            <option>15 - 30 LPA</option>
                                            <option>30+ LPA</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Work Location</label>
                                        <input
                                            type="text"
                                            className="form-input-premium"
                                            value={formData.workLocation}
                                            onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                                            placeholder="Work City, State"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lifestyle Information */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Lifestyle
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Eating Habits</label>
                                        <select className="form-input-premium appearance-none cursor-pointer" value={formData.eatingHabits} onChange={(e) => setFormData({ ...formData, eatingHabits: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="Vegetarian">Vegetarian</option>
                                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                                            <option value="Eggetarian">Eggetarian</option>
                                            <option value="Vegan">Vegan</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Drinking Habits</label>
                                        <select className="form-input-premium appearance-none cursor-pointer" value={formData.drinkingHabits} onChange={(e) => setFormData({ ...formData, drinkingHabits: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                            <option value="Occasionally">Occasionally</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Smoking Habits</label>
                                        <select className="form-input-premium appearance-none cursor-pointer" value={formData.smokingHabits} onChange={(e) => setFormData({ ...formData, smokingHabits: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                            <option value="Occasionally">Occasionally</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Astrological Information */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Astrological Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Time of Birth</label>
                                        <input type="time" className="form-input-premium" value={formData.timeOfBirth} onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Star / Nakshatra</label>
                                        <input type="text" className="form-input-premium" value={formData.star} onChange={(e) => setFormData({ ...formData, star: e.target.value })} placeholder="e.g. Rohini" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Raasi</label>
                                        <input type="text" className="form-input-premium" value={formData.raasi} onChange={(e) => setFormData({ ...formData, raasi: e.target.value })} placeholder="e.g. Vrishabha" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kuja Dosha</label>
                                        <select className="form-input-premium appearance-none cursor-pointer" value={formData.kujaDosha} onChange={(e) => setFormData({ ...formData, kujaDosha: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                            <option value="Don't Know">Don't Know</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kula Daiva</label>
                                        <input type="text" className="form-input-premium" value={formData.kulaDaiva} onChange={(e) => setFormData({ ...formData, kulaDaiva: e.target.value })} placeholder="e.g. Tirupati Balaji" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Horoscope Matching Required?</label>
                                        <select className="form-input-premium appearance-none cursor-pointer" value={formData.horoscope} onChange={(e) => setFormData({ ...formData, horoscope: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Family Background */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Family Background
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Family Type</label>
                                        <select className="form-input-premium appearance-none cursor-pointer" value={formData.familyType} onChange={(e) => setFormData({ ...formData, familyType: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="Nuclear Family">Nuclear Family</option>
                                            <option value="Joint Family">Joint Family</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Family Status</label>
                                        <select className="form-input-premium appearance-none cursor-pointer" value={formData.familyStatus} onChange={(e) => setFormData({ ...formData, familyStatus: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="Middle Class">Middle Class</option>
                                            <option value="Upper Middle Class">Upper Middle Class</option>
                                            <option value="Rich">Rich</option>
                                            <option value="Affluent">Affluent</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ancestral Origin</label>
                                        <input type="text" className="form-input-premium" value={formData.ancestralOrigin} onChange={(e) => setFormData({ ...formData, ancestralOrigin: e.target.value })} placeholder="e.g. Hubli" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Brothers</label>
                                        <input type="number" className="form-input-premium" value={formData.brothers} onChange={(e) => setFormData({ ...formData, brothers: e.target.value })} placeholder="Number of brothers" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sisters</label>
                                        <input type="number" className="form-input-premium" value={formData.sisters} onChange={(e) => setFormData({ ...formData, sisters: e.target.value })} placeholder="Number of sisters" />
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

                            {/* Verification Documents */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Verification Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Aadhar Card</label>
                                        <div className="flex items-center gap-4 p-4 form-input-premium">
                                            {formData.aadharCard ? (
                                                <div className="flex-1 flex justify-between items-center text-sm">
                                                    <span className="text-green-600 font-bold items-center flex gap-1"><ShieldCheck size={16} /> Uploaded</span>
                                                    <button type="button" onClick={() => setFormData({ ...formData, aadharCard: '' })} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest">Remove</button>
                                                </div>
                                            ) : (
                                                <input type="file" accept=".pdf,image/*" onChange={(e) => handleDocumentChange(e, 'aadharCard')} className="w-full text-sm" disabled={uploading} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Caste Certificate</label>
                                        <div className="flex items-center gap-4 p-4 form-input-premium">
                                            {formData.casteCertificate ? (
                                                <div className="flex-1 flex justify-between items-center text-sm">
                                                    <span className="text-green-600 font-bold items-center flex gap-1"><ShieldCheck size={16} /> Uploaded</span>
                                                    <button type="button" onClick={() => setFormData({ ...formData, casteCertificate: '' })} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest">Remove</button>
                                                </div>
                                            ) : (
                                                <input type="file" accept=".pdf,image/*" onChange={(e) => handleDocumentChange(e, 'casteCertificate')} className="w-full text-sm" disabled={uploading} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Partner Preferences
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Min Age</label>
                                        <input type="number" className="form-input-premium" value={formData.prefAgeMin} onChange={(e) => setFormData({ ...formData, prefAgeMin: e.target.value })} placeholder="e.g. 21" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Max Age</label>
                                        <input type="number" className="form-input-premium" value={formData.prefAgeMax} onChange={(e) => setFormData({ ...formData, prefAgeMax: e.target.value })} placeholder="e.g. 30" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred Location</label>
                                        <input type="text" className="form-input-premium" value={formData.prefLocation} onChange={(e) => setFormData({ ...formData, prefLocation: e.target.value })} placeholder="e.g. Any City in India" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred Education</label>
                                        <input type="text" className="form-input-premium" value={formData.prefEducation} onChange={(e) => setFormData({ ...formData, prefEducation: e.target.value })} placeholder="e.g. Masters" />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred Profession</label>
                                        <input type="text" className="form-input-premium" value={formData.prefProfession} onChange={(e) => setFormData({ ...formData, prefProfession: e.target.value })} placeholder="e.g. IT Professional" />
                                    </div>
                                </div>
                            </div>

                            {/* Membership Selection */}
                            <div className="space-y-10">
                                <h3 className="text-[10px] font-black text-[#800020] uppercase tracking-[0.4em] flex items-center gap-4">
                                    <span className="w-12 h-0.5 bg-[#D4AF37] opacity-30 rounded-full"></span>
                                    Membership Plan
                                </h3>
                                <div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {plans.map((plan) => {
                                            const isSelected = formData.membership === plan._id;
                                            return (
                                                <div
                                                    key={plan._id}
                                                    onClick={() => setFormData({ ...formData, membership: plan._id })}
                                                    className={`flex flex-col p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all select-none relative ${isSelected ? 'border-[#800020] shadow-xl scale-[1.02]' : 'border-gray-100 hover:border-[#800020]/20 bg-gray-50/50'}`}
                                                    style={{ backgroundColor: isSelected ? '#ffffff' : undefined }}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div
                                                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                                            style={{ borderColor: isSelected ? '#800020' : '#e5e7eb', backgroundColor: '#ffffff' }}
                                                        >
                                                            {isSelected && (
                                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#800020' }}></div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-serif font-black italic leading-none" style={{ color: isSelected ? '#800020' : '#111827' }}>
                                                                ₹{plan.price.toLocaleString()}
                                                            </div>
                                                            <div className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mt-1">{plan.duration}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-tight">{plan.name}</h4>
                                                        <ul className="space-y-1">
                                                            {plan.features.slice(0, 2).map((feat, i) => (
                                                                <li key={i} className="text-[10px] font-medium text-gray-500 flex items-center gap-1.5">
                                                                    <div className="w-1 h-1 rounded-full bg-[#D4AF37]"></div>
                                                                    {feat}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    {plan.name === 'Gold' && (
                                                        <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[7px] font-black uppercase px-3 py-1 rounded-full shadow-lg border border-white/20">Popular</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="space-y-6 mt-8">
                                    <div className="flex flex-col sm:flex-row gap-4 p-2 bg-[#F8F9FA] rounded-2xl border border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('UPI')}
                                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'UPI' ? 'bg-[#800020] text-[#D4AF37] shadow-lg' : 'text-gray-400 hover:text-[#800020]'}`}
                                        >
                                            UPI ID
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('Card')}
                                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'Card' ? 'bg-[#800020] text-[#D4AF37] shadow-lg' : 'text-gray-400 hover:text-[#800020]'}`}
                                        >
                                            Credit / Debit Card
                                        </button>
                                    </div>
                                    <div
                                        className="p-8 bg-[#800020] rounded-[2.5rem] text-[#D4AF37] border border-[#D4AF37]/20 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
                                        <div className="relative z-10">
                                            {paymentMethod === 'UPI' ? (
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Enter your UPI ID</label>
                                                        <input type="text" placeholder="yourname@upi" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Card Number</label>
                                                        <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Expiry Date</label>
                                                            <input type="text" placeholder="MM/YY" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60">CVV</label>
                                                            <input type="password" placeholder="•••" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#D4AF37]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-[#800020] text-[#D4AF37] rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-1 transition-all">
                                Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div >

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
        </div >
    );
};

export default EditProfile;
