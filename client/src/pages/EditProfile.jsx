import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { User, ArrowLeft, CheckCircle, Loader2, Heart, ShieldCheck, ChevronRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sidebar definition moved inside component to support dynamic labels

const FormRow = ({ label, required, children }) => (
    <div className="flex flex-col md:flex-row md:items-start py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 rounded-xl">
        <label className="md:w-1/3 text-xs font-bold text-gray-700 uppercase tracking-widest pt-3 md:pb-0 pb-2 flex items-center pr-4">
            {label} {required && <span className="text-red-500 ml-1 text-base">*</span>}
        </label>
        <div className="md:w-2/3 flex flex-col sm:flex-row gap-4 w-full relative">
            {children}
        </div>
    </div>
);

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', location: '',
        education: '', profession: '', income: '', workLocation: '',
        interests: '', aboutMe: '', profilePicture: '',
        photos: [], // Gallery photos
        mobile: '', dob: '', motherTongue: '', maritalStatus: '', height: '',
        religion: '', caste: '', email: '', subcaste: '',
        languagesKnown: '', gothra: '',
        prefAgeMin: '', prefAgeMax: '', prefLocation: '', prefEducation: '', prefProfession: '',
        aadharCard: '', casteCertificate: '', membership: 'p1',
        weight: '', bodyType: '', profileCreatedBy: '', eatingHabits: '', smokingHabits: '', drinkingHabits: '',
        timeOfBirth: '', star: '', raasi: '', kujaDosha: '', kulaDaiva: '', horoscope: '',
        familyType: '', familyStatus: '', brothers: '', sisters: '', ancestralOrigin: '',
        collegeInstitution: '', educationDetail: '', employedIn: '', occupationDetail: '',
        parentsContact: '', familyValue: '', nativePlace: '', fatherOccupation: '', motherOccupation: '', aboutFamily: '',
        prefMaritalStatus: [], prefHeightMin: '', prefHeightMax: '', prefPhysicalStatus: '', prefMotherTongue: '',
        prefReligion: '', prefOtherReligionAllowed: false, prefSubcaste: '', prefStar: '', prefKujaDosham: '',
        prefEducationType: '', prefEducationDetails: '', prefEmployedIn: '', prefOccupation: '', prefCitizenship: '',
        prefCountryLiving: '', prefFoodHabits: [], prefSmokingHabits: [], prefDrinkingHabits: [], prefIncome: 'Any', aboutPartner: ''
    });

    const sidebarSections = [
        {
            title: 'Profile Info',
            items: [
                { id: 'Basic Information', label: 'Basic Information', action: 'edit' },
                { id: 'Education & Occupation', label: 'Education & Occupation', action: 'edit' },
                { id: 'Family Details', label: 'Family Details', action: 'edit' },
                { id: 'Hobbies & Interest', label: 'Hobbies & Interest', action: 'edit' },
                { id: 'Partner Preference', label: 'Partner Preference', action: 'edit' }
            ]
        },
        {
            title: 'Contact Details',
            items: [
                { id: 'Location', label: 'Location', action: 'edit' },
                { id: 'E-mail', label: 'E-mail', action: 'edit' },
                { id: 'Contact Number', label: 'Contact Number', action: 'edit' }
            ]
        },
        {
            title: 'Enhance Profile',
            items: [
                { id: 'Photos', label: `Photos (${formData.photos?.length || 0}/10)`, action: 'add' },
                { id: 'Horoscope', label: 'Horoscope', action: 'edit' },
                { id: 'Trust Badge', label: 'Trust Badge', action: 'edit' }
            ]
        },
        {
            title: 'Settings',
            items: [
                { id: 'Change Password', label: 'Change Password', action: '' },
                { id: 'Deactivate Profile', label: 'Deactivate Profile', action: '' },
                { id: 'Delete Profile', label: 'Delete Profile', action: '' },
                { id: 'Manage Alert', label: 'Manage Alert', action: '' }
            ]
        }
    ];
    const [plans, setPlans] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('Basic Information');
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
                    subcaste: data.subcaste || '',
                    languagesKnown: data.languagesKnown || '',
                    gothra: data.gothra || '',
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
                    brothers: data.brothers || '',
                    sisters: data.sisters || '',
                    ancestralOrigin: data.ancestralOrigin || '',
                    collegeInstitution: data.collegeInstitution || '',
                    educationDetail: data.educationDetail || '',
                    employedIn: data.employedIn || '',
                    occupationDetail: data.occupationDetail || '',
                    parentsContact: data.parentsContact || '',
                    familyValue: data.familyValue || '',
                    nativePlace: data.nativePlace || '',
                    fatherOccupation: data.fatherOccupation || '',
                    motherOccupation: data.motherOccupation || '',
                    aboutFamily: data.aboutFamily || '',
                    prefMaritalStatus: data.prefMaritalStatus || [],
                    prefHeightMin: data.prefHeightMin || '',
                    prefHeightMax: data.prefHeightMax || '',
                    prefPhysicalStatus: data.prefPhysicalStatus || '',
                    prefMotherTongue: data.prefMotherTongue || '',
                    prefReligion: data.prefReligion || '',
                    prefOtherReligionAllowed: data.prefOtherReligionAllowed || false,
                    prefSubcaste: data.prefSubcaste || '',
                    prefStar: data.prefStar || '',
                    prefKujaDosham: data.prefKujaDosham || '',
                    prefEducationType: data.prefEducationType || '',
                    prefEducationDetails: data.prefEducationDetails || '',
                    prefEmployedIn: data.prefEmployedIn || '',
                    prefOccupation: data.prefOccupation || '',
                    prefCitizenship: data.prefCitizenship || '',
                    prefCountryLiving: data.prefCountryLiving || '',
                    prefFoodHabits: data.prefFoodHabits || [],
                    prefSmokingHabits: data.prefSmokingHabits || [],
                    prefDrinkingHabits: data.prefDrinkingHabits || [],
                    prefIncome: data.prefIncome || 'Any',
                    aboutPartner: data.aboutPartner || '',
                    photos: data.photos || []
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCheckboxArrayChange = (e, fieldName) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            let arr = [...(prev[fieldName] || [])];
            if (checked) {
                arr.push(value);
            } else {
                arr = arr.filter(item => item !== value);
            }
            return { ...prev, [fieldName]: arr };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const profileData = {
                ...formData,
                interests: Array.isArray(formData.interests)
                    ? formData.interests
                    : formData.interests.split(',').map(i => i.trim()).filter(i => i !== '')
            };
            await api.updateProfile(profileData);
            setMessage('Your profile info has been updated successfully.');
            setTimeout(() => setMessage(''), 3000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const handleGalleryPhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remainingSlots = 10 - formData.photos.length;
        if (remainingSlots <= 0) {
            alert('You can only upload up to 10 gallery photos.');
            return;
        }

        const filesToUpload = files.slice(0, remainingSlots);
        setUploading(true);

        try {
            const newPhotos = await Promise.all(
                filesToUpload.map(file => {
                    if (file.size > 2 * 1024 * 1024) throw new Error(`File ${file.name} is too large. Max 2MB.`);
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                    });
                })
            );

            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos]
            }));
        } catch (err) {
            alert(err.message || 'Error uploading photos');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const removeGalleryPhoto = (index) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#F8F9FA]/20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Heart size={48} className="text-[#D4AF37] fill-[#D4AF37]/20" />
            </motion.div>
        </div>
    );

    return (
        <div className="bg-[#F9FAFB] min-h-screen pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-2 block"
                        >
                            Profile details
                        </motion.span>
                        <h1 className="text-3xl font-serif font-black text-gray-900 italic flex items-center gap-4">
                            Edit Profile
                            <a href="/profile" className="text-sm font-sans font-bold text-[#D4AF37] hover:text-[#800020] underline transition-colors normal-case tracking-normal">View my profile</a>
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-12 h-12 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#800020] hover:bg-gray-100 transition-all border border-gray-200 group flex-shrink-0"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-50 text-green-700 px-6 py-4 rounded-2xl mb-8 font-bold flex items-center gap-3 border border-green-200 shadow-sm"
                    >
                        <CheckCircle size={20} className="text-green-600" /> {message}
                    </motion.div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-72 flex-shrink-0 bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden sticky top-28">
                        <div className="flex flex-col">
                            {sidebarSections.map((section, idx) => (
                                <div key={idx}>
                                    <div className="w-full flex items-center justify-between px-4 py-3 bg-[#F4F4F4] text-gray-900 border-b border-gray-300 font-bold text-[15px] cursor-pointer">
                                        {section.title}
                                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        {section.items.map((item, itemIdx) => (
                                            <button
                                                key={itemIdx}
                                                type="button"
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-left border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${activeTab === item.id ? 'bg-gray-50 border-l-2 border-l-[#800020]' : 'bg-white'}`}
                                            >
                                                <span className="text-[13px] text-gray-800">
                                                    {item.label}
                                                </span>
                                                {item.action && (
                                                    <span className="text-[13px] text-[#0081C5] hover:underline">
                                                        {item.action}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Form */}
                    <div className="flex-1 w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 relative">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                            <h2 className="text-2xl font-serif font-black text-gray-900 italic">
                                {activeTab}
                            </h2>
                            {activeTab === 'Basic Information' && (
                                <span className="text-xs font-bold text-gray-400">Fields marked as <span className="text-red-500">*</span> are Mandatory</span>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-2"
                                >
                                    {/* BASIC INFORMATION TAB */}
                                    {activeTab === 'Basic Information' && (
                                        <div className="space-y-2">
                                            <FormRow label="Profile Created By" required>
                                                <select name="profileCreatedBy" value={formData.profileCreatedBy} onChange={handleChange} className="form-input-premium max-w-md appearance-none">
                                                    <option value="">Select</option>
                                                    <option value="Self">Self</option>
                                                    <option value="Parents">Parents</option>
                                                    <option value="Sibling">Sibling</option>
                                                    <option value="Relative">Relative</option>
                                                    <option value="Friend">Friend</option>
                                                </select>
                                            </FormRow>

                                            <FormRow label="Name" required>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Enter Full Name" />
                                            </FormRow>

                                            <FormRow label="Date of Birth" required>
                                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-input-premium max-w-md" />
                                            </FormRow>

                                            <FormRow label="Age" required>
                                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="form-input-premium max-w-[150px]" placeholder="Years" />
                                            </FormRow>

                                            <FormRow label="Gender" required>
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Male', 'Female', 'Other'].map(g => (
                                                        <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {g}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>

                                            <FormRow label="Marital Status" required>
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Unmarried', 'Widow / Widower', 'Divorced', 'Separated'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="maritalStatus" value={status} checked={formData.maritalStatus === status} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>

                                            <FormRow label="Height" required>
                                                <select name="height" value={formData.height} onChange={handleChange} className="form-input-premium max-w-md appearance-none">
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
                                            </FormRow>

                                            <FormRow label="Weight">
                                                <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="form-input-premium max-w-xs" placeholder="--Kgs--" />
                                            </FormRow>

                                            <FormRow label="Physical Status" required>
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Normal', 'Physically Challenged'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="bodyType" value={status} checked={formData.bodyType === status} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>

                                            <FormRow label="Religion" required>
                                                <select name="religion" value={formData.religion} onChange={handleChange} className="form-input-premium max-w-md appearance-none">
                                                    <option value="">Select Religion</option>
                                                    <option>Hindu</option>
                                                    <option>Muslim</option>
                                                    <option>Christian</option>
                                                    <option>Sikh</option>
                                                    <option>Jain</option>
                                                    <option>Other</option>
                                                </select>
                                            </FormRow>

                                            <FormRow label="Caste & Subcaste">
                                                <div className="flex gap-4 w-full max-w-xl">
                                                    <input type="text" name="caste" value={formData.caste} onChange={handleChange} className="form-input-premium w-1/2" placeholder="Caste" />
                                                    <input type="text" name="subcaste" value={formData.subcaste} onChange={handleChange} className="form-input-premium w-1/2" placeholder="Subcaste" />
                                                </div>
                                            </FormRow>

                                            <FormRow label="Mother Tongue" required>
                                                <select name="motherTongue" value={formData.motherTongue} onChange={handleChange} className="form-input-premium max-w-md appearance-none">
                                                    <option value="">Select</option>
                                                    <option>Hindi</option>
                                                    <option>Bengali</option>
                                                    <option>Marathi</option>
                                                    <option>Telugu</option>
                                                    <option>Tamil</option>
                                                    <option>Kannada</option>
                                                    <option>Other</option>
                                                </select>
                                            </FormRow>

                                            <FormRow label="Languages Known">
                                                <input type="text" name="languagesKnown" value={formData.languagesKnown} onChange={handleChange} className="form-input-premium w-full" placeholder="e.g. English, Hindi, Kannada" />
                                            </FormRow>

                                            <FormRow label="About Me" required>
                                                <div className="w-full">
                                                    <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} className="form-input-premium w-full min-h-[120px] resize-y" placeholder="Describe yourself..."></textarea>
                                                    <p className="text-right text-[10px] text-gray-400 font-bold mt-1">Min. 50 characters</p>
                                                </div>
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* EDUCATION & OCCUPATION */}
                                    {activeTab === 'Education & Occupation' && (
                                        <div className="space-y-2">
                                            <FormRow label="Highest Education" required>
                                                <input type="text" name="education" value={formData.education} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. B.Tech, MBA" />
                                            </FormRow>
                                            <FormRow label="College / Institution">
                                                <input type="text" name="collegeInstitution" value={formData.collegeInstitution} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Search for College / Institution" />
                                            </FormRow>
                                            <FormRow label="Education in Detail">
                                                <input type="text" name="educationDetail" value={formData.educationDetail} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Education Details" />
                                            </FormRow>
                                            <FormRow label="Employed In" required>
                                                <div className="flex gap-4 items-center flex-wrap h-full pt-3">
                                                    {['Government', 'Defence', 'Private', 'Business', 'Self Employed', 'Not Working'].map(emp => (
                                                        <label key={emp} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="employedIn" value={emp} checked={formData.employedIn === emp} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {emp}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Occupation" required>
                                                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Software Professional" />
                                            </FormRow>
                                            <FormRow label="Occupation in Detail">
                                                <input type="text" name="occupationDetail" value={formData.occupationDetail} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Occupation Details" />
                                            </FormRow>
                                            <FormRow label="Annual Income" required>
                                                <div className="flex gap-4 w-full max-w-md flex-col sm:flex-row">
                                                    <select className="form-input-premium sm:w-1/3 appearance-none cursor-pointer"><option>India - Rs.</option></select>
                                                    <select name="income" value={formData.income} onChange={handleChange} className="form-input-premium sm:w-2/3 appearance-none cursor-pointer">
                                                        <option value="">Select Range</option>
                                                        <option>0 - 3 Lakhs</option>
                                                        <option>3 - 7 Lakhs</option>
                                                        <option>7 - 15 Lakhs</option>
                                                        <option>15 - 30 Lakhs</option>
                                                        <option>30+ Lakhs</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                            </FormRow>
                                            <FormRow label="Work Location">
                                                <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} className="form-input-premium max-w-md" placeholder="City, State" />
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* FAMILY DETAILS */}
                                    {activeTab === 'Family Details' && (
                                        <div className="space-y-2">
                                            <FormRow label="Parent's Contact No.">
                                                <div className="w-full flex items-center gap-4">
                                                    <input type="text" name="parentsContact" value={formData.parentsContact} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Mobile No. / Landline No." />
                                                    <span className="text-xs text-gray-400 font-bold hidden sm:block">Optional but recommended</span>
                                                </div>
                                            </FormRow>
                                            <FormRow label="Family Value" required>
                                                <div className="flex gap-4 items-center flex-wrap h-full pt-3">
                                                    {['Orthodox', 'Traditional', 'Moderate', 'Liberal'].map(val => (
                                                        <label key={val} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="familyValue" value={val} checked={formData.familyValue === val} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {val}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Family Type" required>
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Joint family', 'Nuclear family'].map(type => (
                                                        <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="familyType" value={type} checked={formData.familyType === type} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {type}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Family Status" required>
                                                <div className="flex gap-4 items-center flex-wrap h-full pt-3">
                                                    {['Middle class', 'Upper middle class', 'Rich / Affluent'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="familyStatus" value={status} checked={formData.familyStatus === status} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Native Place">
                                                <input type="text" name="nativePlace" value={formData.nativePlace} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Native Place" />
                                            </FormRow>
                                            <FormRow label="Father's Occupation">
                                                <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Father's Occupation" />
                                            </FormRow>
                                            <FormRow label="Mother's Occupation">
                                                <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Mother's Occupation" />
                                            </FormRow>
                                            <FormRow label="No. of Brothers">
                                                <select name="brothers" value={formData.brothers} onChange={handleChange} className="form-input-premium max-w-xs appearance-none cursor-pointer">
                                                    <option value="">--Select No Of Brothers--</option>
                                                    {[0, 1, 2, 3, 4, 5, '5+'].map(num => <option key={num} value={num}>{num}</option>)}
                                                </select>
                                            </FormRow>
                                            <FormRow label="No. of Sisters">
                                                <select name="sisters" value={formData.sisters} onChange={handleChange} className="form-input-premium max-w-xs appearance-none cursor-pointer">
                                                    <option value="">--Select No Of Sisters--</option>
                                                    {[0, 1, 2, 3, 4, 5, '5+'].map(num => <option key={num} value={num}>{num}</option>)}
                                                </select>
                                            </FormRow>
                                            <FormRow label="About My Family">
                                                <div className="w-full">
                                                    <textarea name="aboutFamily" value={formData.aboutFamily} onChange={handleChange} className="form-input-premium w-full min-h-[120px] resize-y" placeholder="Use this space to talk about your parents and siblings."></textarea>
                                                </div>
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* HOBBIES & INTEREST */}
                                    {activeTab === 'Hobbies & Interest' && (
                                        <div className="space-y-2">
                                            <FormRow label="Eating Habits">
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="eatingHabits" value={status} checked={formData.eatingHabits === status} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Drinking Habits">
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Non-drinker', 'Light / Social drinker', 'Regular drinker'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="drinkingHabits" value={status} checked={formData.drinkingHabits === status} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Smoking Habits">
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Non-smoker', 'Light / Social smoker', 'Regular smoker'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="smokingHabits" value={status} checked={formData.smokingHabits === status} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Interests & Hobbies">
                                                <input type="text" name="interests" value={formData.interests} onChange={handleChange} className="form-input-premium w-full" placeholder="e.g. Travel, Music, Reading (comma separated)" />
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* PARTNER PREFERENCE */}
                                    {activeTab === 'Partner Preference' && (
                                        <div className="space-y-2">
                                            <div className="text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
                                                Here you can customize your partner preference. You will receive matches by e-mail based on the highlighted fields (<CheckCircle className="w-4 h-4 text-green-500 inline" />) below which form your MatchWatch criteria.
                                            </div>

                                            <FormRow label={<span className="flex items-center">Marital Status <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="flex gap-4 items-center flex-wrap h-full pt-3">
                                                    {['Unmarried', 'Widow / Widower', 'Divorced', 'Separated', 'Doesn\'t matter'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="checkbox" value={status} checked={formData.prefMaritalStatus.includes(status)} onChange={(e) => handleCheckboxArrayChange(e, 'prefMaritalStatus')} className="accent-[#800020] w-4 h-4 rounded" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Age <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="flex items-center gap-4 w-full">
                                                    <select name="prefAgeMin" value={formData.prefAgeMin} onChange={handleChange} className="form-input-premium w-24 appearance-none cursor-pointer">
                                                        <option value="">Min</option>
                                                        {Array.from({ length: 50 }, (_, i) => i + 18).map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest hidden sm:inline">To</span>
                                                    <select name="prefAgeMax" value={formData.prefAgeMax} onChange={handleChange} className="form-input-premium w-24 appearance-none cursor-pointer">
                                                        <option value="">Max</option>
                                                        {Array.from({ length: 50 }, (_, i) => i + 18).map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                    <span className="text-sm text-gray-500 hidden sm:inline">years</span>
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Height <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="flex items-center gap-2 sm:gap-4 w-full flex-col sm:flex-row items-start sm:items-center">
                                                    <select name="prefHeightMin" value={formData.prefHeightMin} onChange={handleChange} className="form-input-premium w-full sm:w-auto min-w-[140px] appearance-none cursor-pointer">
                                                        <option value="">Min</option>
                                                        {['4 feet 0 inches', '4 feet 5 inches', '4 feet 9 inches', '5 feet 0 inches', '5 feet 5 inches', '5 feet 9 inches', '6 feet 0 inches'].map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest sm:block hidden">To</span>
                                                    <select name="prefHeightMax" value={formData.prefHeightMax} onChange={handleChange} className="form-input-premium w-full sm:w-auto min-w-[140px] appearance-none cursor-pointer">
                                                        <option value="">Max</option>
                                                        {['4 feet 5 inches', '4 feet 9 inches', '5 feet 0 inches', '5 feet 5 inches', '5 feet 9 inches', '6 feet 0 inches', '6 feet 5 inches'].map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Physical Status <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="flex gap-4 items-center flex-wrap h-full pt-3">
                                                    {['Doesn\'t matter', 'Normal', 'Physically Challenged'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="prefPhysicalStatus" value={status} checked={formData.prefPhysicalStatus === status} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Mother Tongue <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <input type="text" name="prefMotherTongue" value={formData.prefMotherTongue} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Kannada" />
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Religion <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="flex flex-col gap-3">
                                                    <input type="text" name="prefReligion" value={formData.prefReligion} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Hindu" />
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-500">
                                                        <input type="checkbox" name="prefOtherReligionAllowed" checked={formData.prefOtherReligionAllowed} onChange={handleChange} className="accent-[#800020] w-4 h-4 rounded" /> Include matching profiles from other religion also
                                                    </label>
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Subcaste <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <input type="text" name="prefSubcaste" value={formData.prefSubcaste} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Any" />
                                            </FormRow>
                                            <FormRow label="Star">
                                                <input type="text" name="prefStar" value={formData.prefStar} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Any" />
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Kuja Dosham <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="flex gap-4 items-center flex-wrap h-full pt-3">
                                                    {['Doesn\'t matter', 'Yes', 'No'].map(v => (
                                                        <label key={v} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="prefKujaDosham" value={v} checked={formData.prefKujaDosham === v} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {v}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Education <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-4 items-center flex-wrap pt-2">
                                                        {['Any', 'Any Degree', 'Professional Degree', 'Specific Degree'].map(type => (
                                                            <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                                <input type="radio" name="prefEducationType" value={type} checked={formData.prefEducationType === type} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {type}
                                                            </label>
                                                        ))}
                                                    </div>
                                                    <textarea name="prefEducationDetails" value={formData.prefEducationDetails} onChange={handleChange} className="form-input-premium max-w-md h-20 resize-y" placeholder="e.g. Bachelors - Engineering / Computers / Others"></textarea>
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Employed In <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <input type="text" name="prefEmployedIn" value={formData.prefEmployedIn} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Any" />
                                            </FormRow>
                                            <FormRow label="Occupation">
                                                <input type="text" name="prefOccupation" value={formData.prefOccupation} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Any" />
                                            </FormRow>
                                            <FormRow label="Citizenship">
                                                <input type="text" name="prefCitizenship" value={formData.prefCitizenship} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Any" />
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Country Living In <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <input type="text" name="prefCountryLiving" value={formData.prefCountryLiving} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Any" />
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Food Habits <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="grid grid-cols-2 gap-y-3 pt-3 max-w-sm">
                                                    {['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan', 'Doesn\'t matter'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="checkbox" value={status} checked={formData.prefFoodHabits.includes(status)} onChange={(e) => handleCheckboxArrayChange(e, 'prefFoodHabits')} className="accent-[#800020] w-4 h-4 rounded" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Smoking Habits <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="grid grid-cols-2 gap-y-3 pt-3 max-w-sm">
                                                    {['Non-smoker', 'Light / Social smoker', 'Regular smoker', 'Doesn\'t matter'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="checkbox" value={status} checked={formData.prefSmokingHabits.includes(status)} onChange={(e) => handleCheckboxArrayChange(e, 'prefSmokingHabits')} className="accent-[#800020] w-4 h-4 rounded" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Drinking Habits <CheckCircle className="w-4 h-4 text-green-500 ml-1" /></span>}>
                                                <div className="grid grid-cols-2 gap-y-3 pt-3 max-w-sm">
                                                    {['Non-drinker', 'Light / Social drinker', 'Regular drinker', 'Doesn\'t matter'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="checkbox" value={status} checked={formData.prefDrinkingHabits.includes(status)} onChange={(e) => handleCheckboxArrayChange(e, 'prefDrinkingHabits')} className="accent-[#800020] w-4 h-4 rounded" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Annual Income">
                                                <select name="prefIncome" value={formData.prefIncome} onChange={handleChange} className="form-input-premium max-w-md appearance-none cursor-pointer">
                                                    <option value="Any">Any</option>
                                                    <option value="0 - 3 Lakhs">0 - 3 Lakhs</option>
                                                    <option value="3 - 7 Lakhs">3 - 7 Lakhs</option>
                                                    <option value="7 - 15 Lakhs">7 - 15 Lakhs</option>
                                                    <option value="15 - 30 Lakhs">15 - 30 Lakhs</option>
                                                    <option value="30+ Lakhs">30+ Lakhs</option>
                                                </select>
                                            </FormRow>
                                            <FormRow label="About my partner">
                                                <div className="w-full">
                                                    <textarea name="aboutPartner" value={formData.aboutPartner} onChange={handleChange} className="form-input-premium w-full min-h-[120px] resize-y" placeholder="Summarize what you're looking for inside a partner..."></textarea>
                                                </div>
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* CONTACT DETAILS (Separated) */}
                                    {activeTab === 'Location' && (
                                        <div className="space-y-2">
                                            <FormRow label="Location (City, State)" required>
                                                <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Current location" />
                                            </FormRow>
                                        </div>
                                    )}
                                    {activeTab === 'E-mail' && (
                                        <div className="space-y-2">
                                            <FormRow label="E-mail" required>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Email address" />
                                            </FormRow>
                                        </div>
                                    )}
                                    {activeTab === 'Contact Number' && (
                                        <div className="space-y-2">
                                            <FormRow label="Contact Number" required>
                                                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="form-input-premium max-w-md" placeholder="10-digit mobile number" />
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* ENHANCE PROFILE: PHOTOS & GALLERY */}
                                    {activeTab === 'Photos' && (
                                        <div className="space-y-12">
                                            {/* Profile Photo Section */}
                                            <div className="bg-[#F8F9FA]/50 p-8 rounded-3xl border border-gray-100 relative">
                                                <h3 className="text-xl font-serif font-black italic text-gray-900 mb-6">Main Profile Photo</h3>
                                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                                    <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white shadow-xl border-4 border-white flex-shrink-0 relative group">
                                                        {formData.profilePicture ? (
                                                            <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gradient-to-br from-gray-50 to-[#FFFDD0]">
                                                                <User size={64} className="text-[#D4AF37]/30" />
                                                            </div>
                                                        )}
                                                        {uploading && (
                                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                                                                <Loader2 size={32} className="animate-spin text-[#800020]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-4 text-center md:text-left">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">Choose a Profile Picture</h4>
                                                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Your profile picture is the first thing others see. Make it count! A clear face shot works best.</p>
                                                        </div>
                                                        <div className="flex items-center justify-center md:justify-start gap-4">
                                                            <label className="cursor-pointer bg-[#800020] text-[#D4AF37] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#600318] transition-all shadow-lg active:scale-95 inline-block">
                                                                Upload New
                                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                                                            </label>
                                                            {formData.profilePicture && (
                                                                <button type="button" onClick={() => setFormData({ ...formData, profilePicture: '' })} className="text-red-500 font-black text-xs uppercase tracking-widest hover:text-red-700 transition-all p-2">
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Photo Gallery Section */}
                                            <div className="bg-white p-2 md:p-4 rounded-3xl">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <h3 className="text-xl font-serif font-black italic text-gray-900">Photo Gallery</h3>
                                                        <p className="text-sm font-bold text-gray-400 mt-1">Upload up to 10 photos of your interests, travels, and lifestyle.</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-2xl font-serif font-black italic text-[#800020]">{formData.photos?.length || 0}</span>
                                                        <span className="text-gray-400 font-bold ml-1">/ 10</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {/* Existing Gallery Photos */}
                                                    {(formData.photos || []).map((photo, index) => (
                                                        <motion.div
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            key={index}
                                                            className="aspect-square rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100"
                                                        >
                                                            <img src={photo} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeGalleryPhoto(index)}
                                                                    className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                                                                    title="Remove Photo"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    {/* Add Photo Button (Placeholder) */}
                                                    {(!formData.photos || formData.photos.length < 10) && (
                                                        <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#800020]/30 hover:bg-gray-50 transition-all group overflow-hidden relative">
                                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#800020]/10 group-hover:text-[#800020] transition-colors">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                                            </div>
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#800020]">Add Photo</span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleGalleryPhotoUpload}
                                                                disabled={uploading}
                                                            />
                                                            {uploading && (
                                                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                                    <Loader2 size={24} className="animate-spin text-[#800020]" />
                                                                </div>
                                                            )}
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Membership Plans Section (Now clearly separated below) */}
                                            <div className="pt-12 border-t border-gray-100">
                                                <h4 className="text-xs font-black text-[#800020] uppercase tracking-widest mb-8 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                                                    Recommended Membership Plans
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    {plans.map((plan) => {
                                                        const isSelected = formData.membership === plan._id;
                                                        return (
                                                            <div
                                                                key={plan._id}
                                                                onClick={() => setFormData({ ...formData, membership: plan._id })}
                                                                className={`flex flex-col p-6 rounded-3xl border-2 cursor-pointer transition-all select-none relative group ${isSelected ? 'border-[#800020] shadow-xl bg-white scale-[1.02]' : 'border-gray-100 hover:border-[#800020]/20 bg-gray-50/50'}`}
                                                            >
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#800020] bg-[#800020]' : 'border-gray-200 bg-white'}`}>
                                                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className={`text-2xl font-serif font-black italic transition-colors ${isSelected ? 'text-[#800020]' : 'text-gray-900'}`}>
                                                                            ₹{plan.price.toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-tight flex items-center gap-2">
                                                                        {plan.name}
                                                                        <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">{plan.duration}</span>
                                                                    </h4>
                                                                    <ul className="space-y-2 mt-4">
                                                                        {plan.features.slice(0, 3).map((feat, i) => (
                                                                            <li key={i} className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                                                                <CheckCircle size={10} className="text-green-500" />{feat}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ENHANCE PROFILE: HOROSCOPE */}
                                    {activeTab === 'Horoscope' && (
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-[#800020] uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]"></div> Horoscope & Astrological Details</h4>
                                            <FormRow label="Time of Birth">
                                                <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleChange} className="form-input-premium w-40" />
                                            </FormRow>
                                            <FormRow label="Star / Nakshatra">
                                                <input type="text" name="star" value={formData.star} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Rohini" />
                                            </FormRow>
                                            <FormRow label="Gothra">
                                                <input type="text" name="gothra" value={formData.gothra} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Kashyapa" />
                                            </FormRow>
                                            <FormRow label="Raasi">
                                                <input type="text" name="raasi" value={formData.raasi} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Vrishabha" />
                                            </FormRow>
                                            <FormRow label="Kuja Dosha">
                                                <div className="flex gap-6 items-center flex-wrap h-full pt-3">
                                                    {['Yes', 'No', 'Don\'t Know'].map(v => (
                                                        <label key={v} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="radio" name="kujaDosha" value={v} checked={formData.kujaDosha === v} onChange={handleChange} className="accent-[#800020] w-4 h-4" /> {v}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label="Kula Daiva">
                                                <input type="text" name="kulaDaiva" value={formData.kulaDaiva} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Family Deity" />
                                            </FormRow>
                                            <FormRow label="Match Horoscope?">
                                                <select name="horoscope" value={formData.horoscope} onChange={handleChange} className="form-input-premium max-w-[150px] appearance-none">
                                                    <option value="">Select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* TRUST BADGE */}
                                    {activeTab === 'Trust Badge' && (
                                        <div className="space-y-6">
                                            <p className="text-sm font-bold text-gray-500 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">Upload your government ID and Caste certificate to verify your authenticity. Verified profiles get 3x more visibility.</p>

                                            <FormRow label="Aadhar Card">
                                                <div className="w-full max-w-md form-input-premium !p-3">
                                                    {formData.aadharCard ? (
                                                        <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                                                            <span className="text-green-600 font-bold text-xs flex items-center gap-2 uppercase tracking-widest"><ShieldCheck size={16} /> Uploaded</span>
                                                            <button type="button" onClick={() => setFormData({ ...formData, aadharCard: '' })} className="text-red-500 hover:text-red-700 font-bold text-[10px] uppercase tracking-widest">Remove</button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <input type="file" accept=".pdf,image/*" onChange={(e) => handleDocumentChange(e, 'aadharCard')} className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#800020] file:text-[#D4AF37] hover:file:bg-[#600318] file:cursor-pointer" disabled={uploading} />
                                                        </div>
                                                    )}
                                                </div>
                                            </FormRow>

                                            <FormRow label="Caste Certificate">
                                                <div className="w-full max-w-md form-input-premium !p-3">
                                                    {formData.casteCertificate ? (
                                                        <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                                                            <span className="text-green-600 font-bold text-xs flex items-center gap-2 uppercase tracking-widest"><ShieldCheck size={16} /> Uploaded</span>
                                                            <button type="button" onClick={() => setFormData({ ...formData, casteCertificate: '' })} className="text-red-500 hover:text-red-700 font-bold text-[10px] uppercase tracking-widest">Remove</button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <input type="file" accept=".pdf,image/*" onChange={(e) => handleDocumentChange(e, 'casteCertificate')} className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#800020] file:text-[#D4AF37] hover:file:bg-[#600318] file:cursor-pointer" disabled={uploading} />
                                                        </div>
                                                    )}
                                                </div>
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* SETTINGS PLACEHOLDERS */}
                                    {activeTab === 'Change Password' && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-gray-500 mb-6 pb-4 border-b border-gray-100">Update your account password securely.</p>
                                            <FormRow label="Current Password">
                                                <input type="password" name="currentPassword" placeholder="Enter current password" title="Coming soon" disabled className="form-input-premium max-w-md opacity-70 cursor-not-allowed" />
                                            </FormRow>
                                            <FormRow label="New Password">
                                                <input type="password" name="newPassword" placeholder="Enter new password" title="Coming soon" disabled className="form-input-premium max-w-md opacity-70 cursor-not-allowed" />
                                            </FormRow>
                                        </div>
                                    )}
                                    {activeTab === 'Deactivate Profile' && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-gray-500 mb-6 pb-4 border-b border-gray-100">Temporarily hide your profile from other users if you are taking a break.</p>
                                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                                <h4 className="font-bold text-amber-800 text-sm">Deactivation Feature Coming Soon</h4>
                                                <p className="text-xs text-amber-700 mt-1">This feature is currently under active development.</p>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'Delete Profile' && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-gray-500 mb-6 pb-4 border-b border-gray-100">Permanently delete your Matro account and all associated data.</p>
                                            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                                <h4 className="font-bold text-red-800 text-sm">Delete Account Coming Soon</h4>
                                                <p className="text-xs text-red-700 mt-1">This feature is currently under active development.</p>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'Manage Alert' && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-medium text-gray-500 mb-6 pb-4 border-b border-gray-100">Manage your email and SMS notification preferences.</p>
                                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                <h4 className="font-bold text-blue-800 text-sm">Alert Management Coming Soon</h4>
                                                <p className="text-xs text-blue-700 mt-1">This feature is currently under active development.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end">
                                <button type="submit" className="w-full md:w-auto px-12 py-4 bg-[#800020] text-[#D4AF37] rounded-xl font-bold uppercase tracking-[0.3em] text-[11px] shadow-lg shadow-[#800020]/20 hover:bg-[#600318] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                    <Save size={16} /> Save Profile Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .form-input-premium {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    background: #F9FAFB/50;
                    border: 1.5px solid #F3F4F6;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #111827;
                    transition: all 0.3s ease;
                    outline: none;
                }
                .form-input-premium:focus {
                    background: #FFFFFF;
                    border-color: #800020;
                    box-shadow: 0 4px 12px rgba(128, 0, 32, 0.05);
                }
            `}</style>
        </div>
    );
};

export default EditProfile;
