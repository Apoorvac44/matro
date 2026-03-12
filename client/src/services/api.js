const INITIAL_PROFILES = [
    {
        _id: '1', name: 'Priya Hegde', email: 'priya.hegde@example.com', age: 26, gender: 'Female', religion: 'Hindu', location: 'Mysuru',
        profession: 'Software Engineer', education: 'B.E CS', income: '₹12 LPA', caste: 'Brahmin',
        profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
        aboutMe: 'Passionate about technology and classical music. Looking for someone with a modern soul and traditional roots.',
        isApproved: true, interests: ['Veena', 'Yoga', 'Travel', 'Reading'],
        photos: [
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9876543210', dob: '1998-05-15', motherTongue: 'Kannada', maritalStatus: 'Single', height: "5'4\"",
        workLocation: 'Bengaluru', prefAgeRange: '27-32', prefLocation: 'Mysuru/Bengaluru', prefEducation: 'Masters', prefProfession: 'IT Professional',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60',
        casteCertificate: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '2', name: 'Rahul Gowda', email: 'rahul.gowda@example.com', age: 29, gender: 'Male', religion: 'Hindu', location: 'Bengaluru',
        profession: 'Business Owner', education: 'MBA', income: '₹25 LPA', caste: 'Vokkaliga',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
        aboutMe: 'Dedicated to my family business. Love exploring the temples and nature of Karnataka.',
        isApproved: true, interests: ['Cricket', 'Travel', 'Music', 'Hiking'],
        photos: [
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9123456789', dob: '1995-10-20', motherTongue: 'Kannada', maritalStatus: 'Single', height: "5'11\"",
        workLocation: 'Bengaluru', prefAgeRange: '24-28', prefLocation: 'Anywhere', prefEducation: 'Post Graduate', prefProfession: 'Professional',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '3', name: 'Sindhu Bhat', email: 'sindhu.bhat@example.com', age: 27, gender: 'Female', religion: 'Hindu', location: 'Hubballi',
        profession: 'Doctor', education: 'MBBS', income: '₹15 LPA', caste: 'Brahmin',
        profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
        aboutMe: 'Love cooking traditional dishes and helping others. Looking for a partner with similar values.',
        isApproved: true, interests: ['Classical Music', 'Cooking', 'Yoga'],
        photos: [
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9988776655', dob: '1997-01-12', motherTongue: 'Kannada', maritalStatus: 'Single', height: "5'6\"",
        workLocation: 'Hubballi', prefAgeRange: '28-33', prefLocation: 'Karnataka', prefEducation: 'Medical', prefProfession: 'Doctor/Professional',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60',
        casteCertificate: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '4', name: 'Karthik Rao', email: 'karthik.rao@example.com', age: 31, gender: 'Male', religion: 'Hindu', location: 'Mangaluru',
        profession: 'Chartered Accountant', education: 'CA', income: '₹18 LPA', caste: 'Brahmin',
        profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
        aboutMe: 'Focused on career with deep respect for our heritage. Enjoy the coastal lifestyle.',
        isApproved: true, interests: ['Investment', 'Beach Walks', 'Yakshagana'],
        photos: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1492447105260-2e947425b5cc?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1533038590840-1c798b14a275?w=500&auto=format&fit=crop&q=60',
            'https://plus.unsplash.com/premium_photo-1663045437877-6bcfc7fd0952?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9443322110', dob: '1993-07-08', motherTongue: 'Kannada', maritalStatus: 'Single', height: "5'9\"",
        workLocation: 'Mangaluru', prefAgeRange: '25-29', prefLocation: 'Coastal Karnataka', prefEducation: 'CA/Professional', prefProfession: 'Finance',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '5', name: 'Deepa Kulkarni', email: 'deepa.k@example.com', age: 27, gender: 'Female', religion: 'Hindu', location: 'Belagavi',
        profession: 'Teacher', education: 'M.Sc, B.Ed', income: '₹8 LPA', caste: 'Brahmin',
        profilePicture: 'https://randomuser.me/api/portraits/women/55.jpg',
        aboutMe: 'Passionate about education. I value simple living and honest conversations.',
        isApproved: true, interests: ['Teaching', 'Literature', 'Classical Music'],
        photos: [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9008007006', dob: '1997-12-04', motherTongue: 'Kannada', maritalStatus: 'Single', height: "5'5\"",
        workLocation: 'Belagavi', prefAgeRange: '28-33', prefLocation: 'North Karnataka', prefEducation: 'Post Graduate', prefProfession: 'Any Professional',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60',
        casteCertificate: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '6', name: 'Manoj Patil', email: 'manoj.patil@example.com', age: 33, gender: 'Male', religion: 'Hindu', location: 'Dharwad',
        profession: 'Farmer & Entrepreneur', education: 'B.Sc Agriculture', income: '₹12 LPA', caste: 'Lingayat',
        profilePicture: 'https://randomuser.me/api/portraits/men/60.jpg',
        aboutMe: 'Grounded in our soil with a vision for modern agriculture. Looking for a family-oriented partner.',
        isApproved: true, interests: ['Agriculture', 'Nature Walks', 'Socializing'],
        photos: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9556677889', dob: '1991-03-22', motherTongue: 'Kannada', maritalStatus: 'Single', height: "6'1\"",
        workLocation: 'Dharwad', prefAgeRange: '24-29', prefLocation: 'North Karnataka', prefEducation: 'Graduate', prefProfession: 'Homemaker/Professional',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '7', name: 'Rakshitha Shet', email: 'rakshitha.s@example.com', age: 25, gender: 'Female', religion: 'Hindu', location: 'Udupi',
        profession: 'UI/UX Designer', education: 'B.Des', income: '₹9 LPA', caste: 'Shet',
        profilePicture: 'https://randomuser.me/api/portraits/women/72.jpg',
        aboutMe: 'Creative mind with a love for our coastal traditions. I enjoy design and folk arts.',
        isApproved: false, interests: ['Design', 'Coastal Cuisine', 'Photography'],
        photos: [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9112233445', dob: '1999-09-09', motherTongue: 'Kannada', maritalStatus: 'Single', height: "5'3\"",
        workLocation: 'Mangaluru', prefAgeRange: '26-30', prefLocation: 'Udupi/Mangaluru', prefEducation: 'Bachelors', prefProfession: 'Creative'
    },
    {
        _id: '8', name: 'Abhishek Nayak', email: 'abhishek.n@example.com', age: 28, gender: 'Male', religion: 'Hindu', location: 'Shivamogga',
        profession: 'Marketing Manager', education: 'MBA', income: '₹14 LPA', caste: 'Nayak',
        profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg',
        aboutMe: 'Dynamic professional who values our cultural roots. Looking for a partner who is balanced.',
        isApproved: false, interests: ['Marketing', 'Travel', 'Classical Dance'],
        photos: [
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60'
        ],
        mobile: '9334455667', dob: '1996-05-30', motherTongue: 'Kannada', maritalStatus: 'Single', height: "5'10\"",
        workLocation: 'Bengaluru', prefAgeRange: '23-27', prefLocation: 'Karnataka', prefEducation: 'Masters', prefProfession: 'Professional'
    },
];

// Helper to get profiles from LocalStorage or use initial data
const getStoredProfiles = () => {
    const stored = localStorage.getItem('dummy_profiles_v3');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('dummy_profiles_v3', JSON.stringify(INITIAL_PROFILES));
    return INITIAL_PROFILES;
};

let DUMMY_PROFILES = getStoredProfiles();

const updateStoredProfiles = (profiles) => {
    DUMMY_PROFILES = profiles;
    localStorage.setItem('dummy_profiles_v2', JSON.stringify(profiles));
};

let DUMMY_PLANS = [
    { _id: 'p1', name: 'Free', price: 0, duration: 'Lifetime', features: ['View Profiles', 'Send 5 Interests/Day'], color: '#9CA3AF' },
    { _id: 'p2', name: 'Silver', price: 1999, duration: '3 Months', features: ['Unlimited Interests', 'Basic Support', 'View Contact Details (10)'], color: '#C0C0C0' },
    { _id: 'p3', name: 'Gold', price: 4999, duration: '6 Months', features: ['Priority Listing', 'Standard Support', 'View Contact Details (50)'], color: '#D4AF37' },
    { _id: 'p4', name: 'Premium', price: 9999, duration: '12 Months', features: ['Profile Highlight', 'Premium Support', 'Unlimited Contact Views', 'Personal Matchmaker'], color: '#800020' },
];

const MOCK_MESSAGES = {
    '1': [
        { _id: 'm1', sender: '1', content: 'Hi there!', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { _id: 'm2', sender: 'mock_user_1', content: 'Hello! How are you?', createdAt: new Date(Date.now() - 7100000).toISOString() },
        { _id: 'm3', sender: '1', content: 'I am doing great, saw your profile and wanted to connect.', createdAt: new Date(Date.now() - 7000000).toISOString() },
        { _id: 'm4', sender: 'mock_user_1', content: 'That is wonderful. I would love to chat more.', createdAt: new Date(Date.now() - 6900000).toISOString() },
        { _id: 'm5', sender: '1', content: 'That sounds like a plan!', createdAt: new Date(Date.now() - 6800000).toISOString() },
    ]
};

const SENT_INTERESTS = [];

const mockResolve = (data) => Promise.resolve({ data });

export const login = (formData) => {
    // Admin override
    if (formData.email === 'admin@milana.com') {
        return mockResolve({
            _id: 'admin_001',
            name: 'Admin User',
            email: formData.email,
            token: 'mock_token',
            isAdmin: true,
            role: 'MAIN_ADMIN'
        });
    }

    const profiles = getStoredProfiles();
    const user = profiles.find(p => p.email === formData.email);

    if (user) {
        if (!user.isApproved) {
            return Promise.reject(new Error("Your account is pending admin verification. You will be able to log in once approved."));
        }
        return mockResolve({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: 'mock_token',
            isAdmin: false
        });
    }

    // Fallback for demo users that might not be in the dummy profile list yet
    return mockResolve({
        _id: 'mock_user_1',
        name: 'Demo User',
        email: formData.email,
        token: 'mock_token',
        isAdmin: false
    });
};
export const register = (formData) => {
    const newUser = {
        ...formData,
        _id: 'u_' + Date.now(),
        isApproved: false,
        isBlocked: false,
        interests: [],
        photos: [],
        createdAt: new Date().toISOString()
    };

    // Convert age Min/Max to a single range for display if applicable
    if (formData.prefAgeMin && formData.prefAgeMax) {
        newUser.prefAgeRange = `${formData.prefAgeMin}-${formData.prefAgeMax}`;
    }

    const updatedProfiles = [...getStoredProfiles(), newUser];
    updateStoredProfiles(updatedProfiles);

    return mockResolve({
        _id: newUser._id, name: formData.name, email: formData.email, token: 'mock_token'
    });
};
export const getProfile = (id) => {
    if (id) {
        return mockResolve(DUMMY_PROFILES.find(p => p._id === id || p.id === id) || DUMMY_PROFILES[0]);
    }
    return mockResolve({
        _id: 'mock_user_1', name: 'Demo User', email: 'demo@example.com', age: 28, gender: 'Male', religion: 'Hindu', caste: 'General', location: 'Mumbai', education: 'Masters in Management', profession: 'Senior Executive', income: '₹15 LPA', aboutMe: 'I am a balanced individual looking for a life partner who values family and dreams.', membership: 'Premium', interests: ['Reading', 'Travel', 'Movies'], profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
    });
};
export const updateProfile = (formData) => mockResolve(formData);
export const getProfiles = () => mockResolve(getStoredProfiles());
export const sendInterest = (id) => {
    if (!SENT_INTERESTS.includes(id)) SENT_INTERESTS.push(id);
    return mockResolve({ message: 'Interest sent' });
};
export const getSentInterestsList = () => mockResolve(SENT_INTERESTS);
export const toggleFavorite = (id) => mockResolve({ message: 'Favorite toggled' });
export const sendMessage = (data) => {
    const { receiverId, content } = data;
    if (!MOCK_MESSAGES[receiverId]) MOCK_MESSAGES[receiverId] = [];
    MOCK_MESSAGES[receiverId].push({
        _id: Date.now().toString(),
        sender: 'mock_user_1',
        content,
        createdAt: new Date().toISOString()
    });
    return mockResolve(data);
};
export const getConversations = () => mockResolve([
    { _id: '1', name: 'Priya Sharma', profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg', lastMessage: MOCK_MESSAGES['1']?.[MOCK_MESSAGES['1'].length - 1]?.content || 'That sounds like a plan!', lastMessageDate: MOCK_MESSAGES['1']?.[MOCK_MESSAGES['1'].length - 1]?.createdAt || new Date().toISOString(), unreadCount: 1 },
    { _id: '2', name: 'Amit Patel', profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg', lastMessage: 'Hello, how are you?', lastMessageDate: new Date(Date.now() - 3600000).toISOString(), unreadCount: 0 },
    { _id: '5', name: 'Kavya Nair', profilePicture: 'https://randomuser.me/api/portraits/women/55.jpg', lastMessage: 'I loved your profile!', lastMessageDate: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0 },
]);
export const getMessages = (userId) => mockResolve(MOCK_MESSAGES[userId] || []);
export const getAdminUsers = () => mockResolve(getStoredProfiles());
export const toggleApproval = (id) => {
    const profiles = getStoredProfiles();
    const userIndex = profiles.findIndex(u => u._id === id);
    if (userIndex > -1) {
        profiles[userIndex].isApproved = !profiles[userIndex].isApproved;
        updateStoredProfiles(profiles);
        return mockResolve({ isApproved: profiles[userIndex].isApproved });
    }
    return mockResolve({ isApproved: true });
};
export const getMembershipPlans = () => mockResolve(DUMMY_PLANS);
export const createMembershipPlan = (data) => {
    const newPlan = { ...data, _id: 'p' + Date.now() };
    DUMMY_PLANS.push(newPlan);
    return mockResolve(newPlan);
};
export const updateMembershipPlan = (id, data) => {
    const index = DUMMY_PLANS.findIndex(p => p._id === id);
    if (index > -1) {
        DUMMY_PLANS[index] = { ...DUMMY_PLANS[index], ...data };
        return mockResolve(DUMMY_PLANS[index]);
    }
    return Promise.reject(new Error('Plan not found'));
};
export const deleteMembershipPlan = (id) => {
    const index = DUMMY_PLANS.findIndex(p => p._id === id);
    if (index > -1) {
        DUMMY_PLANS.splice(index, 1);
        return mockResolve({ message: 'Plan deleted' });
    }
    return Promise.reject(new Error('Plan not found'));
};
export const getDashboardStats = () => mockResolve({ viewedYou: 12, saved: 5, receivedInterested: 3, sentInterests: 8, gallery: 4 });
export const getFavorites = () => mockResolve(DUMMY_PROFILES.slice(0, 2));
export const getInterestsReceived = () => mockResolve(DUMMY_PROFILES.slice(2, 5));
export const getInterestsSent = () => mockResolve(DUMMY_PROFILES.slice(4, 7));
export const getGallery = () => mockResolve(DUMMY_PROFILES[0].photos || []);
export const addGalleryPhoto = (base64) => mockResolve({ url: base64 });
export const deleteGalleryPhoto = (id) => mockResolve({ message: 'Photo deleted' });
export const updateSettings = (data) => {
    localStorage.setItem('siteSettings', JSON.stringify(data));
    return mockResolve(data);
};
export const getSettings = () => {
    const settings = localStorage.getItem('siteSettings');
    return mockResolve(settings ? JSON.parse(settings) : {
        siteName: 'Milana',
        siteEmail: 'admin@milana.com',
        autoApprove: false,
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
        maxPhotos: 5,
        minAge: 18,
        maxAge: 60,
        darkMode: false,
    });
};

export default { login, register, getProfile, updateProfile, getProfiles, sendInterest, toggleFavorite, sendMessage, getConversations, getMessages, getAdminUsers, toggleApproval, getDashboardStats, getFavorites, getInterestsReceived, getInterestsSent, getGallery, addGalleryPhoto, deleteGalleryPhoto, createMembershipPlan, updateMembershipPlan, deleteMembershipPlan, getMembershipPlans, updateSettings, getSettings };
