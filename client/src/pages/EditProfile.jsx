import React, { useState, useEffect, useContext } from 'react';
import {
    User, ArrowLeft, CheckCircle, Loader2, Heart, ShieldCheck, ChevronRight,
    Save, ChevronDown, Image, Menu, X as XIcon, Sparkles, Lock, Bell,
    Phone, Eye, UserX, Trash2, Shield, Settings, LogOut, Info
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { calculateCompleteness } from '../utils/completeness';
import Autocomplete from '../components/Autocomplete';
import MultiSelect from '../components/MultiSelect';
import { cities, colleges, languages } from '../utils/autocompleteData';


const raasiOptions = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
const nakshatraOptions = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];
const gothraOptions = ['Vishnu', 'Shiva', 'Kashyapa', 'Bharadwaj', 'Vishvamitra', 'Gautama', 'Jamadagni', 'Atri', 'Vashistha', 'Agastya', 'Angirasa', 'Bhrigu', 'Other'];


const FormRow = ({ label, required, children }) => (
    <div className="flex flex-row items-start py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2 sm:px-4 rounded-xl">
        <label className="w-1/3 text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-widest pt-3 flex items-center pr-2 sm:pr-4 shrink-0">
            {label} {required && <span className="text-[#800020] ml-1 text-base">*</span>}
        </label>
        <div className="w-2/3 flex flex-col sm:flex-row gap-4 w-full relative">
            {children}
        </div>
    </div>
);

const EditProfile = ({ defaultTab }) => {
    const [formData, setFormData] = useState({
        name: '', age: '', gender: '', location: '',
        education: '', profession: '', income: '', workLocation: '',
        interests: '', aboutMe: '', profilePicture: '',
        photos: [], // Gallery photos
        mobile: '', dob: '', motherTongue: '', maritalStatus: '', height: '',
        email: '',
        religion: 'Hindu', caste: '', customCaste: '',
        languagesKnown: '',
        prefAgeMin: '', prefAgeMax: '', prefLocation: '', prefEducation: '', prefProfession: '',
        aadharCard: '', membership: 'p1',
        weight: '', bodyType: '', profileCreatedBy: '', eatingHabits: '', smokingHabits: '', drinkingHabits: '',
        timeOfBirth: '', star: '', raasi: '', kujaDosha: '', kulaDaiva: '', horoscope: '',
        familyType: '', familyStatus: '', brothers: '', sisters: '', ancestralOrigin: '',
        collegeInstitution: '', educationDetail: '', employedIn: '', occupationDetail: '',
        parentsContact: '', familyValue: '', nativePlace: '', fatherName: '', motherName: '', fatherOccupation: '', motherOccupation: '', aboutFamily: '',
        prefMaritalStatus: [], prefHeightMin: '', prefHeightMax: '', prefPhysicalStatus: '', prefMotherTongue: '',
        prefEducationType: '', prefEducationDetails: '', prefEmployedIn: '', prefOccupation: '', prefCitizenship: '',
        prefCountryLiving: '', prefFoodHabits: [], prefSmokingHabits: [], prefDrinkingHabits: [], prefIncome: 'Any', aboutPartner: '',
        // Settings & Privacy
        photoPrivacy: 'Visible to all', horoscopePrivacy: 'Visible to all', phonePrivacy: 'Show to paid members',
        showShortlist: true, showViewed: true, blockedProfiles: [], ignoredProfiles: [], isDeactivated: false
    });

    const sidebarSections = [
        {
            title: 'Profile Info',
            items: [
                { id: 'basic_info', label: 'Basic Information', action: 'edit' },
                { id: 'education', label: 'Education & Occupation', action: 'edit' },
                { id: 'family', label: 'Family Details', action: 'edit' },
                { id: 'hobbies', label: 'Hobbies & Interest', action: 'edit' },
                { id: 'partner_pref', label: 'Partner Preference', action: 'edit' }
            ]
        },
        {
            title: 'Contact Details',
            items: [
                { id: 'location', label: 'Location', action: 'edit' },
                { id: 'email', label: 'E-mail', action: 'edit' },
                { id: 'mobile', label: 'Contact Number', action: 'edit' }
            ]
        },
        {
            title: 'Enhance Profile',
            items: [
                { id: 'photos', label: 'Photos & Gallery', action: 'edit' },
                { id: 'membership', label: 'Membership Plans', action: 'edit' },
                { id: 'horoscope', label: 'Horoscope', action: 'edit' },
                { id: 'trust_badge', label: 'Trust Badge', action: 'edit' }
            ]
        },
        {
            title: 'Privacy & Security',
            items: [
                { id: 'settings', label: 'Settings', action: 'manage' },
                { id: 'privacy', label: 'Privacy Settings', action: 'manage' },
                { id: 'communication', label: 'Communication Settings', action: 'manage' }
            ]
        },
        {
            title: 'Account Settings',
            items: [
                { id: 'account_settings', label: 'Account Settings', action: 'manage' },
                { id: 'blocked_profiles', label: 'Blocked Profiles', action: 'view' },
                { id: 'ignored_profiles', label: 'Ignored Profiles', action: 'view' },
                { id: 'change_password', label: 'Change Password', action: '' },
                { id: 'logout', label: 'Logout', action: '' }
            ]
        }
    ];
    const [plans, setPlans] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('basic_info');
    const [expandedSections, setExpandedSections] = useState(['Profile Info']); // Default open the first section
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const navigate = useNavigate();
    const { user, refreshUser, logout } = useContext(AuthContext); // Added user to context destructuring
    const [completeness, setCompleteness] = useState(0);
    const [countries, setCountries] = useState([]);
    const [showCountrySuggestions, setShowCountrySuggestions] = useState({ citizenship: false, living: false });


    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await api.getCountries();
                setCountries(data);
            } catch (err) {
                console.error('Error fetching countries:', err);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        const tab = tabParam || defaultTab;

        if (tab) {
            // Alias handling for legacy or external links
            const tabMap = {
                'Basic Information': 'basic_info',
                'Education & Occupation': 'education',
                'Family Details': 'family',
                'Hobbies & Interest': 'hobbies',
                'Partner Preference': 'partner_pref',
                'Location': 'location',
                'E-mail': 'email',
                'Contact Number': 'mobile',
                'Photos': 'photos',
                'MembershipPlans': 'membership',
                'Membership Plans': 'membership',
                'Horoscope': 'horoscope',
                'Trust Badge': 'trust_badge',
                'Privacy Settings': 'privacy',
                'Communication Settings': 'communication',
                'Blocked Profiles': 'blocked_profiles',
                'Ignored Profiles': 'ignored_profiles',
                'Change Password': 'change_password',
                'Settings': 'privacy'
            };

            const normalizedTab = tabMap[tab] || tab;
            setActiveTab(normalizedTab);
        }
    }, [defaultTab, searchParams]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.getProfile();
                const dataMap = {
                    _id: data._id || data.id || '',
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
                    languagesKnown: data.languagesKnown || '',
                    prefLocation: data.prefLocation || '',
                    email: data.email || '',
                    religion: data.religion || 'Hindu',
                    caste: (data.caste === 'Kshatriya Komarpanth' || !data.caste) ? (data.caste || '') : 'Other',
                    customCaste: (data.caste && data.caste !== 'Kshatriya Komarpanth') ? data.caste : '',
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
                    familyStatus: data.familyStatus || '',
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
                    fatherName: data.fatherName || '',
                    motherName: data.motherName || '',
                    fatherOccupation: data.fatherOccupation || '',
                    motherOccupation: data.motherOccupation || '',
                    aboutFamily: data.aboutFamily || '',
                    prefMaritalStatus: data.prefMaritalStatus || [],
                    prefAgeMin: data.prefAgeMin || '',
                    prefAgeMax: data.prefAgeMax || '',
                    prefHeightMin: data.prefHeightMin || '',
                    prefHeightMax: data.prefHeightMax || '',
                    prefPhysicalStatus: data.prefPhysicalStatus || '',
                    prefMotherTongue: data.prefMotherTongue || '',
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
                    photos: data.photos || [],
                    casteCertificate: data.casteCertificate || '',
                    // Settings mapping
                    photoPrivacy: data.photoPrivacy || 'Visible to all',
                    horoscopePrivacy: data.horoscopePrivacy || 'Visible to all',
                    phonePrivacy: data.phonePrivacy || 'Show to paid members',
                    showShortlist: data.showShortlist !== undefined ? data.showShortlist : true,
                    showViewed: data.showViewed !== undefined ? data.showViewed : true,
                    blockedProfiles: data.blockedProfiles || [],
                    ignoredProfiles: data.ignoredProfiles || [],
                    isDeactivated: data.isDeactivated || false
                };
                setFormData(dataMap);
                setCompleteness(calculateCompleteness(dataMap));
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

    const handleAccountAction = async (action) => {
        if (action === 'delete') {
            setIsDeleting(true);
            return;
        }

        const confirmMsg = 'Are you sure you want to deactivate your account? Your profile will be hidden from other members.';

        if (window.confirm(confirmMsg)) {
            try {
                await api.updateAccountSettings({ isDeactivated: true });
                setFormData(prev => ({ ...prev, isDeactivated: true }));
                setMessage('Your account has been deactivated.');
                setTimeout(() => setMessage(''), 3000);
            } catch (err) {
                console.error(`Error deactivating account:`, err);
                setMessage(`Failed to deactivate account. Please try again.`);
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    const confirmDelete = async () => {
        if (!deleteReason) {
            alert('Please select a reason for deletion');
            return;
        }

        if (window.confirm('Are you sure you want to PERMANENTLY delete your account? This action cannot be undone.')) {
            try {
                await api.deleteAccount({ reason: deleteReason });
                logout();
                navigate('/login');
            } catch (err) {
                console.error('Error deleting account:', err);
                setMessage('Failed to delete account. Please try again.');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const profileData = {
                ...formData,
                caste: formData.caste === 'Other' ? formData.customCaste : formData.caste,
                interests: Array.isArray(formData.interests)
                    ? formData.interests
                    : formData.interests.split(',').map(i => i.trim()).filter(i => i !== '')
            };
            await api.updateProfile(profileData);
            setCompleteness(calculateCompleteness(profileData));
            refreshUser();
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

            const updatedProfile = { ...formData, profilePicture: base64 };
            setFormData(updatedProfile);
            setCompleteness(calculateCompleteness(updatedProfile));

            // Immediate Save for better UX
            await api.updateProfile(updatedProfile);
            refreshUser();
            setMessage('Profile photo updated successfully.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('File conversion error:', err);
            alert('Failed to update profile photo.');
        } finally {
            setUploading(false);
        }
    };

    const removeProfilePhoto = async () => {
        const updatedProfile = { ...formData, profilePicture: '' };
        setFormData(updatedProfile);
        setCompleteness(calculateCompleteness(updatedProfile));

        try {
            await api.updateProfile(updatedProfile);
            refreshUser();
            setMessage('Profile photo removed.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error removing profile photo:', err);
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
            const updatedProfile = { ...formData, [field]: base64 };
            setFormData(updatedProfile);
            setCompleteness(calculateCompleteness(updatedProfile));

            // Immediate Save
            await api.updateProfile(updatedProfile);
            refreshUser();
            setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Document conversion error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleGalleryPhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const remainingSlots = 6 - formData.photos.length;
        if (remainingSlots <= 0) {
            alert('You can only upload up to 6 gallery photos.');
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

            const updatedProfile = {
                ...formData,
                photos: [...(formData.photos || []), ...newPhotos]
            };

            setFormData(updatedProfile);
            setCompleteness(calculateCompleteness(updatedProfile));

            // Immediate Save for better UX
            await api.updateProfile(updatedProfile);
            refreshUser();
            setMessage('Gallery photos added successfully.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert(err.message || 'Error uploading photos');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const removeGalleryPhoto = async (index) => {
        const newPhotos = formData.photos.filter((_, i) => i !== index);
        const updatedProfile = { ...formData, photos: newPhotos };

        setFormData(updatedProfile);
        setCompleteness(calculateCompleteness(updatedProfile));

        try {
            await api.updateProfile(updatedProfile);
            refreshUser();
        } catch (err) {
            console.error('Error removing gallery photo:', err);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#F8F9FA]/20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Heart size={48} className="text-[#D4AF37] fill-[#D4AF37]/20" />
            </motion.div>
        </div>
    );

    return (
        <div className="bg-[#F9FAFB] min-h-screen pt-16 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
                    <div className="flex items-center gap-4">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-2 block"
                            >
                                Profile details
                            </motion.span>
                            <h1 className="text-xl sm:text-3xl font-serif font-black text-gray-900 italic flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
                                Edit Profile
                                <Link
                                    to={`/profile/${formData?._id || user?._id || user?.id}`}
                                    className="bg-[#800020] text-[#D4AF37] px-6 py-2.5 rounded-none font-black text-[10px] uppercase tracking-widest hover:bg-[#600318] transition-all shadow-lg shadow-[#800020]/20 flex items-center gap-2 active:scale-95"
                                >
                                    <User size={14} /> View My Profile
                                </Link>
                            </h1>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-12 h-12 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#800020] hover:bg-gray-100 transition-all border border-gray-200 group flex-shrink-0 absolute top-8 right-8 md:relative md:top-0 md:right-0"
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

                <div className="flex flex-col md:flex-row gap-8 items-start relative">
                    {/* Mobile Horizontal Tabs */}
                    <div className="lg:hidden w-full overflow-x-auto whitespace-nowrap flex gap-2 pb-4 mb-4 no-scrollbar custom-scrollbar-hide">
                        {sidebarSections.flatMap(section => section.items).map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (item.id === 'logout') {
                                        logout();
                                        navigate('/login');
                                        return;
                                    }
                                    setActiveTab(item.id);
                                }}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${activeTab === item.id
                                    ? 'bg-[#800020] text-[#D4AF37]'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>


                    {/* Desktop Sidebar Navigation */}
                    <div
                        className="hidden lg:block sticky top-28 w-72 bg-white shadow-[0_0_5px_rgba(0,0,0,0.1)] border-r border-gray-200 overflow-hidden rounded-3xl"
                    >

                        {/* Profile Photo Preview */}
                        <div className="p-6 bg-white border-b border-gray-100 flex flex-col items-center">
                            <div className="relative group">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#800020]/10 shadow-lg bg-gray-50 flex items-center justify-center cursor-pointer group hover:border-[#800020]/30 transition-all relative"
                                    onClick={() => document.getElementById('sidebar-photo-upload').click()}
                                >
                                    {formData.profilePicture ? (
                                        <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                                    ) : (
                                        <User size={48} className="text-gray-300" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Image size={24} className="text-white" />
                                    </div>
                                    <input
                                        type="file"
                                        id="sidebar-photo-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('Photos')}
                                    className="absolute bottom-1 right-1 w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                >
                                    <Heart size={14} fill="currentColor" />
                                </button>
                            </div>
                            <h3 className="mt-4 font-serif font-black text-gray-900 italic text-lg">{formData.name || 'Your Name'}</h3>
                            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mt-1">Profile Completeness: {completeness}%</p>
                        </div>
                        <div className="flex flex-col">
                            {sidebarSections.map((section, idx) => {
                                const isExpanded = expandedSections.includes(section.title);
                                return (
                                    <div key={idx} className="mb-px last:mb-0">
                                        <div
                                            onClick={() => {
                                                setExpandedSections(prev =>
                                                    prev.includes(section.title)
                                                        ? prev.filter(t => t !== section.title)
                                                        : [...prev, section.title]
                                                );
                                            }}
                                            className="w-full flex items-center justify-between px-6 py-4 bg-[#800020]/5 text-[#800020] border-b border-[#800020]/10 font-serif font-bold italic text-[16px] cursor-pointer hover:bg-[#800020]/10 transition-colors select-none"
                                        >
                                            {section.title}
                                            {isExpanded ? <ChevronDown size={16} className="text-[#800020]/60" /> : <ChevronRight size={16} className="text-[#800020]/40" />}
                                        </div>
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden flex flex-col"
                                                >
                                                    {section.items.map((item, itemIdx) => (
                                                        <button
                                                            key={itemIdx}
                                                            type="button"
                                                            onClick={() => {
                                                                if (item.id === 'logout') {
                                                                    logout();
                                                                    navigate('/login');
                                                                    return;
                                                                }
                                                                setActiveTab(item.id);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-6 py-3.5 text-left border-b border-gray-50 last:border-0 hover:bg-[#FFFDD0]/30 transition-all ${activeTab === item.id ? 'bg-[#FFFDD0]/50 border-l-4 border-l-[#800020] pl-5' : 'bg-white'}`}
                                                        >
                                                            <span className={`text-[13px] font-bold ${activeTab === item.id ? 'text-[#800020]' : 'text-gray-600'}`}>
                                                                {item.label}
                                                            </span>
                                                            {item.action && (
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] group-hover:text-[#800020] transition-colors">
                                                                    {item.action}
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content Form */}
                    <div id="main-form-content" className={`flex-1 w-full bg-white rounded-3xl shadow-sm border border-gray-100 relative ${['privacy', 'communication', 'account_settings', 'blocked_profiles', 'ignored_profiles', 'change_password'].includes(activeTab) ? 'p-0 overflow-hidden' : 'p-6 md:p-10'}`}>
                        {!['privacy', 'communication', 'account_settings', 'blocked_profiles', 'ignored_profiles', 'change_password'].includes(activeTab) && (
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <h2 className="text-2xl font-serif font-black text-gray-900 italic">
                                    {activeTab === 'photos' ? 'Profile Photos' : sidebarSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || activeTab}
                                </h2>
                                {activeTab === 'basic_info' && (
                                    <span className="text-xs font-bold text-gray-400">Fields marked as <span className="text-[#800020]">*</span> are Mandatory</span>
                                )}
                            </div>
                        )}

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
                                    {activeTab === 'basic_info' && (
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
                                                <select name="weight" value={formData.weight} onChange={handleChange} className="form-input-premium max-w-xs appearance-none cursor-pointer">
                                                    <option value="">--Select Weight--</option>
                                                    {Array.from({ length: 111 }, (_, i) => i + 40).map(w => (
                                                        <option key={w} value={`${w} kg`}>{w} kg</option>
                                                    ))}
                                                </select>
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
                                                <select name="religion" value={formData.religion} disabled className="form-input-premium max-w-md appearance-none bg-gray-100 cursor-not-allowed text-gray-500">
                                                    <option value="Hindu">Hindu</option>
                                                </select>
                                            </FormRow>

                                            <FormRow label="Caste" required>
                                                <div className="w-full">
                                                    <select name="caste" value={formData.caste} onChange={handleChange} disabled={!!formData.caste} className={`form-input-premium max-w-md appearance-none ${!!formData.caste ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}>
                                                        <option value="">Select Option</option>
                                                        <option value="Kshatriya Komarpanth">Kshatriya Komarpanth</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    {formData.caste === 'Other' && (
                                                        <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl max-w-md">
                                                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest block mb-1.5">Please Specify Caste *</label>
                                                            <input type="text" name="customCaste" value={formData.customCaste} onChange={handleChange} disabled={!!formData.customCaste} placeholder="Enter your caste" className={`form-input-premium bg-white w-full ${!!formData.customCaste ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`} />
                                                            <p className="text-[10px] text-orange-600 font-bold mt-2">Please note since you are creating a profile for other caste, your profile won't be visible in our portal. But still you can search for the profile and get matches.</p>
                                                        </div>
                                                    )}
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
                                                <MultiSelect
                                                    options={languages}
                                                    selectedOptions={formData.languagesKnown}
                                                    onChange={(val) => setFormData({ ...formData, languagesKnown: val })}
                                                    placeholder="Select languages you know"
                                                />
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
                                    {activeTab === 'education' && (
                                        <div className="space-y-2">
                                            <FormRow label="Highest Education" required>
                                                <div className="relative group w-full max-w-md">
                                                    <select name="education" value={formData.education} onChange={handleChange} className="form-input-premium appearance-none pr-10">
                                                        <option value="">Select Education</option>
                                                        <option>B.E / B.Tech</option>
                                                        <option>M.E / M.Tech</option>
                                                        <option>MCA / BCA</option>
                                                        <option>MBA / BBA</option>
                                                        <option>MBBS / MD</option>
                                                        <option>B.Com / M.Com</option>
                                                        <option>B.Sc / M.Sc</option>
                                                        <option>L.L.B / L.L.M</option>
                                                        <option>Ph.D</option>
                                                        <option>Diploma</option>
                                                        <option>Others</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                                </div>
                                            </FormRow>
                                            <FormRow label="College / Institution">
                                                <Autocomplete
                                                    label="College / Institution"
                                                    value={formData.collegeInstitution}
                                                    onChange={(val) => setFormData({ ...formData, collegeInstitution: val })}
                                                    options={colleges}
                                                    placeholder="Search for College / Institution"
                                                />
                                            </FormRow>
                                            <FormRow label="Field of Study">
                                                <input type="text" name="educationDetail" value={formData.educationDetail} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Computer Science, Mechanical Eng." />
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
                                                <div className="relative group w-full max-w-md">
                                                    <select name="profession" value={formData.profession} onChange={handleChange} className="form-input-premium appearance-none pr-10">
                                                        <option value="">Select Profession</option>
                                                        <option>Software Professional</option>
                                                        <option>Engineer</option>
                                                        <option>Doctor</option>
                                                        <option>Business Owner</option>
                                                        <option>Government Employee</option>
                                                        <option>Teacher / Academician</option>
                                                        <option>Accountant / CA</option>
                                                        <option>Advocate / Legal</option>
                                                        <option>Service Sector</option>
                                                        <option>Civil Service (IAS/IPS)</option>
                                                        <option>Not Working</option>
                                                        <option>Others</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                                </div>
                                            </FormRow>
                                            <FormRow label="Company">
                                                <input type="text" name="occupationDetail" value={formData.occupationDetail} onChange={handleChange} className="form-input-premium max-w-md" placeholder="e.g. Google, Microsoft, Self Employed" />
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
                                                <Autocomplete
                                                    label="Work Location"
                                                    value={formData.workLocation}
                                                    onChange={(val) => setFormData({ ...formData, workLocation: val })}
                                                    options={cities}
                                                    placeholder="City, State"
                                                />
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* FAMILY DETAILS */}
                                    {activeTab === 'family' && (
                                        <div className="space-y-2">
                                            <FormRow label="Parent's Contact No.">
                                                <div className="w-full flex items-center gap-4">
                                                    <input type="text" name="parentsContact" value={formData.parentsContact} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Mobile No. / Landline No." />
                                                    <span className="text-xs text-gray-400 font-bold hidden sm:block">Optional but recommended</span>
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
                                            <FormRow label="Native Place">
                                                <input type="text" name="nativePlace" value={formData.nativePlace} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Native Place" />
                                            </FormRow>
                                            <FormRow label="Father's Name">
                                                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Father's Full Name" />
                                            </FormRow>
                                            <FormRow label="Father's Occupation">
                                                <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Father's Occupation" />
                                            </FormRow>
                                            <FormRow label="Mother's Name">
                                                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Mother's Full Name" />
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
                                    {activeTab === 'hobbies' && (
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
                                    {activeTab === 'partner_pref' && (
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

                                            <FormRow label="Star">
                                                <select name="prefStar" value={formData.prefStar} onChange={handleChange} className="form-input-premium max-w-md appearance-none cursor-pointer">
                                                    <option value="">Any</option>
                                                    {nakshatraOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
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
                                                <div className="relative w-full max-w-md">
                                                    <select
                                                        name="prefCitizenship"
                                                        value={formData.prefCitizenship}
                                                        onChange={handleChange}
                                                        className="form-input-premium w-full appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Any</option>
                                                        {countries.map(c => (
                                                            <option key={c.code} value={c.name}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Country Living In <CheckCircle className="w-4 h-4 text-[#800020] ml-1" /></span>}>
                                                <div className="relative w-full max-w-md">
                                                    <select
                                                        name="prefCountryLiving"
                                                        value={formData.prefCountryLiving}
                                                        onChange={handleChange}
                                                        className="form-input-premium w-full appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Any</option>
                                                        {countries.map(c => (
                                                            <option key={c.code} value={c.name}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Food Habits <CheckCircle className="w-4 h-4 text-[#800020] ml-1" /></span>}>
                                                <div className="grid grid-cols-2 gap-y-3 pt-3 max-w-sm">
                                                    {['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan', 'Doesn\'t matter'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="checkbox" value={status} checked={formData.prefFoodHabits.includes(status)} onChange={(e) => handleCheckboxArrayChange(e, 'prefFoodHabits')} className="accent-[#800020] w-4 h-4 rounded" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Smoking Habits <CheckCircle className="w-4 h-4 text-[#800020] ml-1" /></span>}>
                                                <div className="grid grid-cols-2 gap-y-3 pt-3 max-w-sm">
                                                    {['Non-smoker', 'Light / Social smoker', 'Regular smoker', 'Doesn\'t matter'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                                            <input type="checkbox" value={status} checked={formData.prefSmokingHabits.includes(status)} onChange={(e) => handleCheckboxArrayChange(e, 'prefSmokingHabits')} className="accent-[#800020] w-4 h-4 rounded" /> {status}
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormRow>
                                            <FormRow label={<span className="flex items-center">Drinking Habits <CheckCircle className="w-4 h-4 text-[#800020] ml-1" /></span>}>
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
                                    {activeTab === 'location' && (
                                        <div className="space-y-2">
                                            <FormRow label="Location (City, State)" required>
                                                <Autocomplete
                                                    label="City you live in?"
                                                    value={formData.location}
                                                    onChange={(val) => setFormData({ ...formData, location: val })}
                                                    options={cities}
                                                    placeholder="Enter the city you live in"
                                                    required
                                                />
                                            </FormRow>
                                        </div>
                                    )}
                                    {activeTab === 'email' && (
                                        <div className="space-y-2">
                                            <FormRow label="E-mail" required>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input-premium max-w-md" placeholder="Email address" />
                                            </FormRow>
                                        </div>
                                    )}
                                    {activeTab === 'mobile' && (
                                        <div className="space-y-2">
                                            <FormRow label="Contact Number" required>
                                                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="form-input-premium max-w-md" placeholder="10-digit mobile number" />
                                            </FormRow>
                                        </div>
                                    )}

                                    {/* ENHANCE PROFILE: PHOTOS & GALLERY */}
                                    {activeTab === 'photos' && (
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

                                            {/* PHOTO GALLERY SECTION */}
                                            <div className="space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-xl font-serif font-black italic text-gray-900">Photo Gallery</h4>
                                                        <p className="text-sm text-gray-500">Showcase your lifestyle and personality with up to 6 more photos.</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-2xl font-serif font-black italic text-[#800020]">{formData.photos?.length || 0}</span>
                                                        <span className="text-gray-300 font-serif italic mx-1">/</span>
                                                        <span className="text-sm font-serif text-gray-400 italic">6</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    {/* Existing Photos */}
                                                    {formData.photos?.map((photo, idx) => (
                                                        <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                                            <img src={photo} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGalleryPhoto(idx)}
                                                                className="absolute top-2 right-2 w-8 h-8 bg-white/90 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                            >
                                                                <Heart size={14} fill="currentColor" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Add Photo Button */}
                                                    {(formData.photos?.length || 0) < 6 && (
                                                        <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-[#800020]/30 hover:bg-gray-50/50 transition-all cursor-pointer group">
                                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#800020] transition-colors">
                                                                <Image size={14} />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-2">Add Gallery Photo</span>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleGalleryPhotoUpload}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {/* ENHANCE PROFILE: HOROSCOPE */}
                                    {activeTab === 'horoscope' && (
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-[#800020] uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#D4AF37]"></div> Horoscope & Astrological Details</h4>
                                            <FormRow label="Time of Birth">
                                                <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleChange} className="form-input-premium w-40" />
                                            </FormRow>
                                            <FormRow label="Star / Nakshatra">
                                                <select name="star" value={formData.star} onChange={handleChange} className="form-input-premium max-w-md appearance-none cursor-pointer">
                                                    <option value="">Select Nakshatra</option>
                                                    {nakshatraOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                            </FormRow>
                                            <FormRow label="Gothra">
                                                <select name="gothra" value={formData.gothra} onChange={handleChange} className="form-input-premium max-w-md appearance-none cursor-pointer">
                                                    <option value="">Select Gothra</option>
                                                    {gothraOptions.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </FormRow>
                                            <FormRow label="Raasi">
                                                <select name="raasi" value={formData.raasi} onChange={handleChange} className="form-input-premium max-w-md appearance-none cursor-pointer">
                                                    <option value="">Select Raasi</option>
                                                    {raasiOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
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
                                    {activeTab === 'trust_badge' && (
                                        <div className="space-y-6">
                                            <FormRow label="AADHAAR CARD">
                                                <div className="w-full max-w-md form-input-premium !p-3">
                                                    {formData.aadharCard ? (
                                                        <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                                                            <span className="text-[#800020] font-bold text-xs flex items-center gap-2 uppercase tracking-widest"><ShieldCheck size={16} /> Uploaded</span>
                                                            <button type="button" onClick={() => setFormData({ ...formData, aadharCard: '' })} className="text-[#800020]/70 hover:text-[#800020] font-bold text-[10px] uppercase tracking-widest">Remove</button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <input type="file" accept=".pdf,image/*" onChange={(e) => handleDocumentChange(e, 'aadharCard')} className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[#800020] file:text-[#D4AF37] hover:file:bg-[#600318] file:cursor-pointer" disabled={uploading} />
                                                        </div>
                                                    )}
                                                </div>
                                            </FormRow>

                                            <FormRow label="CASTE CERTIFICATE">
                                                <div className="w-full max-w-md form-input-premium !p-3">
                                                    {formData.casteCertificate ? (
                                                        <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                                                            <span className="text-[#800020] font-bold text-xs flex items-center gap-2 uppercase tracking-widest"><ShieldCheck size={16} /> Uploaded</span>
                                                            <button type="button" onClick={() => setFormData({ ...formData, casteCertificate: '' })} className="text-[#800020]/70 hover:text-[#800020] font-bold text-[10px] uppercase tracking-widest">Remove</button>
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


                                    {/* MAIN SETTINGS MENU TAB (Image 1) */}
                                    {activeTab === 'settings' && (
                                        <div className="space-y-4">
                                            {[
                                                { id: 'privacy', label: 'Privacy Settings', icon: ShieldCheck, bg: 'bg-[#FFFDD0]', color: 'text-[#800020]' },
                                                { id: 'communication', label: 'Communication Settings', icon: Settings, bg: 'bg-[#FFFDD0]', color: 'text-[#800020]' },
                                                { id: 'account_settings', label: 'Account Settings', icon: User, bg: 'bg-[#FFFDD0]', color: 'text-[#800020]' }
                                            ].map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setActiveTab(item.id)}
                                                    className="w-full flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-xl hover:border-[#D4AF37]/30 transition-all group text-left"
                                                >
                                                    <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                        <item.icon size={28} />
                                                    </div>
                                                    <span className="text-lg font-bold text-gray-800 flex-grow">{item.label}</span>
                                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-[#800020] transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* PRIVACY SETTINGS TAB (Image 2) */}
                                    {activeTab === 'privacy' && (
                                        <div className="flex flex-col h-full bg-gray-50/30">
                                            <div className="flex items-center gap-4 bg-[#800020] text-[#D4AF37] p-6 rounded-t-3xl shadow-lg z-10 sticky top-0">
                                                <button onClick={() => setActiveTab('settings')} className="hover:scale-110 transition-transform"><ArrowLeft size={24} /></button>
                                                <h3 className="text-xl font-bold tracking-tight">Privacy Settings</h3>
                                            </div>

                                            <div className="p-6 space-y-6 overflow-y-auto">
                                                {/* Photo Privacy */}
                                                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                                                            <Image size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-gray-900 leading-tight">Photo Privacy</h3>
                                                            <p className="text-xs text-gray-400 font-medium">Control who can see your profile photos</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {[
                                                            { id: 'Visible to all', label: 'Visible to all (Recommended)' },
                                                            { id: 'Visible to members I give access', label: 'Visible only to the members I give access to view' }
                                                        ].map(option => (
                                                            <label key={option.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.photoPrivacy === option.id ? 'border-[#800020] bg-[#800020]/5' : 'border-gray-200'}`}>
                                                                    {formData.photoPrivacy === option.id && <div className="w-2.5 h-2.5 bg-[#800020] rounded-full" />}
                                                                </div>
                                                                <span className={`text-[15px] font-bold ${formData.photoPrivacy === option.id ? 'text-gray-900' : 'text-gray-500'}`}>{option.label}</span>
                                                                <input type="radio" name="photoPrivacy" value={option.id} checked={formData.photoPrivacy === option.id} onChange={handleChange} className="hidden" />
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Horoscope Privacy */}
                                                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                                            <Sparkles size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-gray-900 leading-tight">Horoscope Privacy</h3>
                                                            <p className="text-xs text-gray-400 font-medium">Manage visibility of your astrological details</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {[
                                                            { id: 'Visible to all', label: 'Visible to all (Only premium members can view your horoscope)' },
                                                            { id: 'Visible to members I give access', label: 'Visible only to the members I give access to view' }
                                                        ].map(option => (
                                                            <label key={option.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.horoscopePrivacy === option.id ? 'border-[#800020] bg-[#800020]/5' : 'border-gray-200'}`}>
                                                                    {formData.horoscopePrivacy === option.id && <div className="w-2.5 h-2.5 bg-[#800020] rounded-full" />}
                                                                </div>
                                                                <span className={`text-[15px] font-bold ${formData.horoscopePrivacy === option.id ? 'text-gray-900' : 'text-gray-500'}`}>{option.label}</span>
                                                                <input type="radio" name="horoscopePrivacy" value={option.id} checked={formData.horoscopePrivacy === option.id} onChange={handleChange} className="hidden" />
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Phone Number Privacy */}
                                                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                                                            <Phone size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-gray-900 leading-tight">Phone Number Privacy</h3>
                                                            <p className="text-xs text-gray-400 font-medium">Control who can see your contact number</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {[
                                                            { id: 'Show to paid members', label: 'Show mobile number only to paid members' },
                                                            { id: 'Show to whom I grant access', label: 'Show mobile number only to whom I grant access to view' }
                                                        ].map(option => (
                                                            <label key={option.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.phonePrivacy === option.id ? 'border-[#800020] bg-[#800020]/5' : 'border-gray-200'}`}>
                                                                    {formData.phonePrivacy === option.id && <div className="w-2.5 h-2.5 bg-[#800020] rounded-full" />}
                                                                </div>
                                                                <span className={`text-[15px] font-bold ${formData.phonePrivacy === option.id ? 'text-gray-900' : 'text-gray-500'}`}>{option.label}</span>
                                                                <input type="radio" name="phonePrivacy" value={option.id} checked={formData.phonePrivacy === option.id} onChange={handleChange} className="hidden" />
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Profile View Settings */}
                                                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
                                                            <User size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-gray-900 leading-tight">Profile View Settings</h3>
                                                            <p className="text-xs text-gray-400 font-medium">Manage how others see your activity</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                                                            <div>
                                                                <h4 className="text-[14px] font-bold text-gray-800">Shortlist Notifications</h4>
                                                                <p className="text-[11px] text-gray-400 font-medium">Let members know you shortlisted them</p>
                                                            </div>
                                                            <button type="button" onClick={() => setFormData({ ...formData, showShortlist: !formData.showShortlist })} className={`w-12 h-6 rounded-full transition-all relative ${formData.showShortlist ? 'bg-[#800020]' : 'bg-gray-300'}`}>
                                                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${formData.showShortlist ? 'right-0.5' : 'left-0.5'}`} />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                                                            <div>
                                                                <h4 className="text-[14px] font-bold text-gray-800">Profile View Alerts</h4>
                                                                <p className="text-[11px] text-gray-400 font-medium">Let members know you viewed them</p>
                                                            </div>
                                                            <button type="button" onClick={() => setFormData({ ...formData, showViewed: !formData.showViewed })} className={`w-12 h-6 rounded-full transition-all relative ${formData.showViewed ? 'bg-[#800020]' : 'bg-gray-300'}`}>
                                                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${formData.showViewed ? 'right-0.5' : 'left-0.5'}`} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* COMMUNICATION SETTINGS TAB */}
                                    {activeTab === 'communication' && (
                                        <div className="flex flex-col h-full bg-gray-50/30">
                                            <div className="flex items-center gap-4 bg-[#800020] text-[#D4AF37] p-6 rounded-t-3xl shadow-lg z-10 sticky top-0">
                                                <button onClick={() => setActiveTab('settings')} className="hover:scale-110 transition-transform"><ArrowLeft size={24} /></button>
                                                <h3 className="text-xl font-bold tracking-tight">Communication Settings</h3>
                                            </div>

                                            <div className="p-6 space-y-6 overflow-y-auto">
                                                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                                            <Bell size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">Notification Alerts</h3>
                                                            <p className="text-xs text-gray-400 font-medium">Control how we contact you</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6">
                                                        {[
                                                            { id: 'emailAlerts', label: 'Email Notifications', desc: 'Receive updates via your registered email', icon: '📧' },
                                                            { id: 'whatsappAlerts', label: 'WhatsApp Notifications', desc: 'Get matches and interests on WhatsApp', icon: '💬' },
                                                            { id: 'smsAlerts', label: 'SMS Notifications', desc: 'Alerts via text message', icon: '📱' }
                                                        ].map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-2xl">{item.icon}</span>
                                                                    <div>
                                                                        <h4 className="text-[15px] font-bold text-gray-800">{item.label}</h4>
                                                                        <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
                                                                    </div>
                                                                </div>
                                                                <button type="button" onClick={() => setFormData({ ...formData, [item.id]: !formData[item.id] })} className={`w-12 h-6 rounded-full transition-all relative ${formData[item.id] ? 'bg-[#800020]' : 'bg-gray-200'}`}>
                                                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${formData[item.id] ? 'right-0.5' : 'left-0.5'}`} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* MEMBERSHIP PLANS TAB */}
                                    {activeTab === 'membership' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="bg-gradient-to-r from-[#800020] to-[#600318] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                                <div className="relative z-10">
                                                    <h3 className="text-2xl font-serif font-black italic mb-2">Upgrade Your Journey</h3>
                                                    <p className="text-white/70 text-sm font-medium max-w-md">Choose a plan that fits your needs and find your perfect life partner faster with premium features.</p>
                                                </div>
                                                <Sparkles className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white/10" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {plans.map((plan) => (
                                                    <div
                                                        key={plan._id}
                                                        className={`relative bg-white border rounded-[2rem] p-6 hover:shadow-2xl transition-all group flex flex-col ${formData.membership === plan._id ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-lg' : 'border-gray-100 hover:border-[#D4AF37]/20'}`}
                                                    >
                                                        {formData.membership === plan._id && (
                                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-[#800020] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Current Plan</div>
                                                        )}

                                                        <div className="mb-6">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-inner" style={{ backgroundColor: plan.color }}>
                                                                    <Heart size={24} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{plan.duration}</span>
                                                            </div>
                                                            <h4 className="text-xl font-serif font-black italic text-gray-900 mb-1">{plan.name}</h4>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="text-2xl font-black text-[#800020]">₹{plan.price}</span>
                                                                {plan.price > 0 && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">/ one time</span>}
                                                            </div>
                                                        </div>

                                                        <ul className="space-y-3 mb-8 flex-grow">
                                                            {plan.features.map((feature, idx) => (
                                                                <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-600 font-medium">
                                                                    <span className="text-[#800020] mt-0.5 mt-0.5 flex-shrink-0">✓</span>
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        <button
                                                            disabled={formData.membership === plan._id}
                                                            className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${formData.membership === plan._id ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-[#800020] hover:shadow-lg hover:shadow-[#800020]/20'}`}
                                                        >
                                                            {formData.membership === plan._id ? 'Current Plan' : 'Select Plan'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Comparison Table */}
                                            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 px-2">Detailed Comparison</h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b border-gray-50">
                                                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Features</th>
                                                                {plans.map(p => (
                                                                    <th key={p._id} className="text-center py-4 text-[11px] font-black text-gray-900 uppercase tracking-widest">{p.name}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50">
                                                            {[
                                                                'View Profiles',
                                                                'View Contact Details',
                                                                'Send Personalized Messages',
                                                                'Priority Customer Support',
                                                                'Profile Highlight',
                                                                'Privacy Controls'
                                                            ].map((feature, i) => (
                                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                                    <td className="py-4 text-[11px] font-bold text-gray-600">{feature}</td>
                                                                    {plans.map(p => (
                                                                        <td key={p._id} className="py-4 text-center">
                                                                            <CheckCircle size={14} className="mx-auto text-green-500 opacity-60" />
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* BLOCKED/IGNORED PROFILES TAB */}
                                    {(activeTab === 'blocked_profiles' || activeTab === 'ignored_profiles') && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                {activeTab === 'blocked_profiles' ? (
                                                    (formData.blockedProfiles && formData.blockedProfiles.length > 0) ? (
                                                        formData.blockedProfiles.map((profileId, i) => (
                                                            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between hover:shadow-md transition-all group">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 flex items-center justify-center">
                                                                        <User size={24} className="text-gray-300" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-black text-gray-900 leading-tight">Profile ID: {profileId}</h4>
                                                                        <p className="text-[10px] text-gray-500 font-medium mt-1">Status: Blocked</p>
                                                                    </div>
                                                                </div>
                                                                <button type="button" className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                                                                    <UserX size={20} />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="bg-gray-50/50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4 border border-gray-50"><UserX size={32} /></div>
                                                            <h3 className="text-lg font-serif font-black italic text-gray-900 mb-2">No Blocked Profiles</h3>
                                                            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">Profiles you block will appear here. They won't be able to see your profile or interact with you.</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    (formData.ignoredProfiles && formData.ignoredProfiles.length > 0) ? (
                                                        formData.ignoredProfiles.map((profileId, i) => (
                                                            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between hover:shadow-md transition-all group">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 flex items-center justify-center">
                                                                        <User size={24} className="text-gray-300" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-black text-gray-900 leading-tight">Profile ID: {profileId}</h4>
                                                                        <p className="text-[10px] text-gray-500 font-medium mt-1">Status: Ignored</p>
                                                                    </div>
                                                                </div>
                                                                <button type="button" className="p-3 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all">
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="bg-gray-50/50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4 border border-gray-100"><Trash2 size={32} /></div>
                                                            <h3 className="text-lg font-serif font-black italic text-gray-900 mb-2">No Ignored Profiles</h3>
                                                            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">Profiles you ignore will appear here. They will be removed from your search results and match suggestions.</p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ACCOUNT SETTINGS TAB (Image 3) */}
                                    {activeTab === 'account_settings' && (
                                        <div className="flex flex-col h-full bg-gray-50/30">
                                            <div className="flex items-center gap-4 bg-[#800020] text-[#D4AF37] p-6 rounded-t-3xl shadow-lg z-10 sticky top-0">
                                                <button onClick={() => setActiveTab('settings')} className="hover:scale-110 transition-transform"><ArrowLeft size={24} /></button>
                                                <h3 className="text-xl font-bold tracking-tight">Account Settings</h3>
                                            </div>

                                            <div className="p-6 space-y-6 overflow-y-auto">
                                                {isDeleting ? (
                                                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-red-100 shadow-md">
                                                        <div className="flex items-center gap-4 mb-8">
                                                            <button onClick={() => setIsDeleting(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors hover:scale-110"><ArrowLeft size={20} /></button>
                                                            <h2 className="text-xl font-black text-[#800020] uppercase tracking-widest">Delete Profile</h2>
                                                        </div>

                                                        <div className="bg-red-50/50 border border-[#800020]/10 rounded-2xl p-4 mb-8">
                                                            <p className="text-[11px] text-[#800020] font-bold text-center">Note: Once you delete your profile, it cannot be recovered.</p>
                                                        </div>

                                                        <p className="text-sm font-bold text-gray-700 mb-6 px-2">Please choose a reason for profile deletion.</p>

                                                        <div className="space-y-3 mb-12">
                                                            {[
                                                                { id: 'married', label: 'MARRIED', group: true },
                                                                { id: 'marriage_fixed', label: 'MARRIAGE FIXED', group: true },
                                                                {
                                                                    id: 'other', label: 'OTHER REASONS', group: true, options: [
                                                                        { id: 'search_later', label: 'Prefer to search later' },
                                                                        { id: 'no_matches', label: 'Not getting enough matches' },
                                                                        { id: 'not_specify', label: "I'll not specify" },
                                                                        { id: 'costly', label: 'Very costly from milanamatrimony.com' }
                                                                    ]
                                                                }
                                                            ].map((item) => (
                                                                <div key={item.id} className="space-y-2">
                                                                    {item.options ? (
                                                                        <>
                                                                            <div className="px-4 py-3 bg-gray-50 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</div>
                                                                            <div className="grid grid-cols-1 gap-2 pl-2">
                                                                                {item.options.map((opt) => (
                                                                                    <label key={opt.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                                                                                        <input
                                                                                            type="radio"
                                                                                            name="delete_reason"
                                                                                            checked={deleteReason === opt.label}
                                                                                            onChange={() => setDeleteReason(opt.label)}
                                                                                            className="w-5 h-5 accent-[#800020]"
                                                                                        />
                                                                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{opt.label}</span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <label className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#800020]/20 transition-all cursor-pointer group shadow-sm">
                                                                            <input
                                                                                type="radio"
                                                                                name="delete_reason"
                                                                                checked={deleteReason === item.label}
                                                                                onChange={() => setDeleteReason(item.label)}
                                                                                className="w-5 h-5 accent-[#800020]"
                                                                            />
                                                                            <span className="text-base font-black text-gray-900 group-hover:text-[#800020] italic font-serif uppercase tracking-widest">{item.label}</span>
                                                                            <ChevronDown size={16} className="ml-auto text-gray-300" />
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <button
                                                                onClick={confirmDelete}
                                                                className="py-4 bg-[#800020] text-[#D4AF37] rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#800020]/20 hover:bg-[#600318] transition-all active:scale-95"
                                                            >
                                                                Delete Account
                                                            </button>
                                                            <button
                                                                onClick={() => setIsDeleting(false)}
                                                                className="py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md">
                                                        {[
                                                            { icon: UserX, label: 'Blocked Profiles', tab: 'blocked_profiles', color: 'text-[#800020]' },
                                                            { icon: XIcon, label: 'Ignored Profiles', tab: 'ignored_profiles', color: 'text-[#800020]' },
                                                            { icon: Phone, label: 'Call Preferences', tab: 'communication', color: 'text-[#800020]' },
                                                            { icon: Lock, label: 'Change Password', tab: 'change_password', color: 'text-[#800020]' },
                                                            { icon: LogOut, label: 'Logout', id: 'logout', color: 'text-[#800020]' },
                                                            { icon: User, label: 'Deactivate/Hide Account', action: 'deactivate', color: 'text-[#800020]' },
                                                            { icon: Trash2, label: 'Delete Account', action: 'delete', color: 'text-[#800020]' }
                                                        ].map((item, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => {
                                                                    if (item.id === 'logout') {
                                                                        logout();
                                                                        navigate('/login');
                                                                        return;
                                                                    }
                                                                    if (item.tab) setActiveTab(item.tab);
                                                                    else if (item.action) handleAccountAction(item.action);
                                                                }}
                                                                className="flex items-center gap-4 py-5 px-6 border-b border-gray-50 hover:bg-gray-50 transition-all group text-left"
                                                            >
                                                                <div className={`${item.color} group-hover:scale-110 transition-transform`}><item.icon size={22} /></div>
                                                                <span className="text-[15px] font-bold text-gray-800 flex-grow">{item.label}</span>
                                                                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#800020] transition-transform group-hover:translate-x-1" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* LEGACY PLACEHOLDERS (Restore if needed, but replaced by above) */}
                                    {activeTab === 'change_password' && (
                                        <div className="flex flex-col h-full bg-gray-50/30">
                                            <div className="flex items-center gap-4 bg-[#800020] text-[#D4AF37] p-6 rounded-t-3xl shadow-lg z-10 sticky top-0">
                                                <button onClick={() => setActiveTab('account_settings')} className="hover:scale-110 transition-transform"><ArrowLeft size={24} /></button>
                                                <h3 className="text-xl font-bold tracking-tight">Change Password</h3>
                                            </div>

                                            <div className="p-6 space-y-6 overflow-y-auto">
                                                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <div className="w-12 h-12 bg-maroon-50 rounded-2xl flex items-center justify-center text-[#800020]">
                                                            <Lock size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900">Update Securely</h3>
                                                            <p className="text-xs text-gray-400">Ensure your account stays protected</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <FormRow label="Current Password">
                                                            <input type="password" placeholder="Enter current password" class="form-input-premium max-w-md" />
                                                        </FormRow>
                                                        <FormRow label="New Password">
                                                            <input type="password" placeholder="Enter new password" class="form-input-premium max-w-md" />
                                                        </FormRow>
                                                        <FormRow label="Confirm Password">
                                                            <input type="password" placeholder="Confirm new password" class="form-input-premium max-w-md" />
                                                        </FormRow>
                                                    </div>

                                                    <div className="mt-10 flex justify-end">
                                                        <button type="button" className="px-10 py-4 bg-[#800020] text-[#D4AF37] rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-[#600318] transition-all">
                                                            Update Password
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-6 -mb-6 p-6 md:relative md:bg-transparent md:m-0 md:p-0 md:border-t flex-shrink-0 z-30">
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
        </div >
    );
};

export default EditProfile;
