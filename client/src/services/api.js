// FRONTEND-ONLY MOCK API
const INITIAL_PROFILES = [
    {
        _id: '1', name: 'Priya Sharma', email: 'priya.sharma@example.com', age: 26, gender: 'Female', religion: 'Hindu', location: 'Mumbai',
        profession: 'Software Engineer', education: 'B.Tech CS', income: '₹12 LPA', caste: 'Brahmin',
        profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
        aboutMe: 'Passionate about technology and classical dance. Looking for someone with a modern soul and traditional roots.',
        isApproved: true, interests: ['Tech', 'Salsa', 'Travel', 'Reading'],
        photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60'],
        mobile: '9876543210', dob: '1998-05-15', motherTongue: 'Hindi', maritalStatus: 'Single', height: "5'4\"",
        workLocation: 'Pune', prefAgeRange: '27-32', prefLocation: 'Mumbai/Pune', prefEducation: 'Masters', prefProfession: 'IT Professional',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60',
        casteCertificate: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '2', name: 'Amit Patel', email: 'amit.patel@example.com', age: 29, gender: 'Male', religion: 'Hindu', location: 'Ahmedabad',
        profession: 'Doctor', education: 'MBBS, MD', income: '₹18 LPA', caste: 'Patel',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
        aboutMe: 'A dedicated physician who loves cricket and travel. Believe in simple living and high thinking.',
        isApproved: true, interests: ['Fitness', 'Reading', 'Music', 'Hiking'],
        photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60'],
        mobile: '9123456789', dob: '1995-10-20', motherTongue: 'Gujarati', maritalStatus: 'Single', height: "5'11\"",
        workLocation: 'Ahmedabad', prefAgeRange: '24-28', prefLocation: 'Anywhere', prefEducation: 'Medical', prefProfession: 'Healthcare',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '3', name: 'Anjali Reddy', email: 'anjali.reddy@example.com', age: 24, gender: 'Female', religion: 'Hindu', location: 'Hyderabad',
        profession: 'Data Analyst', education: 'MBA', income: '₹10 LPA', caste: 'Reddy',
        profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
        aboutMe: 'Love cooking and exploring new cuisines. Looking for a partner who is adventurous.',
        isApproved: true, interests: ['Cooking', 'Cinema', 'Yoga'],
        mobile: '9988776655', dob: '2000-01-12', motherTongue: 'Telugu', maritalStatus: 'Single', height: "5'6\"",
        workLocation: 'Hyderabad', prefAgeRange: '25-30', prefLocation: 'Hyderabad', prefEducation: 'Bachelors/Masters', prefProfession: 'Analyst',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60',
        casteCertificate: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '4', name: 'Rahul Mehta', email: 'rahul.mehta@example.com', age: 31, gender: 'Male', religion: 'Jain', location: 'Surat',
        profession: 'Chartered Accountant', education: 'CA, CS', income: '₹15 LPA', caste: 'Oswal',
        profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
        aboutMe: 'Traditional values with a modern outlook. Family is my priority.',
        isApproved: true, interests: ['Investment', 'Social Work', 'Music'],
        mobile: '9443322110', dob: '1993-07-08', motherTongue: 'Gujarati', maritalStatus: 'Single', height: "5'9\"",
        workLocation: 'Surat', prefAgeRange: '25-29', prefLocation: 'Gujarat', prefEducation: 'Professional Degree', prefProfession: 'Finance',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '5', name: 'Kavya Nair', email: 'kavya.nair@example.com', age: 27, gender: 'Female', religion: 'Hindu', location: 'Kochi',
        profession: 'Architect', education: 'B.Arch', income: '₹14 LPA', caste: 'Nair',
        profilePicture: 'https://randomuser.me/api/portraits/women/55.jpg',
        aboutMe: 'Creative soul who loves design and music. I enjoy the serenity of nature.',
        isApproved: true, interests: ['Design', 'Photography', 'Music'],
        mobile: '9008007006', dob: '1997-12-04', motherTongue: 'Malayalam', maritalStatus: 'Single', height: "5'5\"",
        workLocation: 'Kochi', prefAgeRange: '28-33', prefLocation: 'Kerala', prefEducation: 'Bachelors/Masters', prefProfession: 'Architect',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60',
        casteCertificate: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '6', name: 'Vikram Singh', email: 'vikram.singh@example.com', age: 33, gender: 'Male', religion: 'Sikh', location: 'Chandigarh',
        profession: 'Army Officer', education: 'B.Sc (NDA)', income: '₹20 LPA', caste: 'Jat',
        profilePicture: 'https://randomuser.me/api/portraits/men/60.jpg',
        aboutMe: 'Disciplined, adventurous and family-oriented. Love the mountains.',
        isApproved: true, interests: ['Sports', 'Trekking', 'Pets'],
        mobile: '9556677889', dob: '1991-03-22', motherTongue: 'Punjabi', maritalStatus: 'Single', height: "6'1\"",
        workLocation: 'Border Area', prefAgeRange: '24-29', prefLocation: 'North India', prefEducation: 'Graduate', prefProfession: 'Any',
        aadharCard: 'https://images.unsplash.com/photo-1544383333-5cf9833b378e?w=800&auto=format&fit=crop&q=60'
    },
    {
        _id: '7', name: 'Sneha Iyer', email: 'sneha.iyer@example.com', age: 25, gender: 'Female', religion: 'Hindu', location: 'Chennai',
        profession: 'Teacher', education: 'M.Ed', income: '₹7 LPA', caste: 'Iyer',
        profilePicture: 'https://randomuser.me/api/portraits/women/72.jpg',
        aboutMe: 'Passionate about education and classical music. I value honesty and integrity.',
        isApproved: false, interests: ['Teaching', 'Karnatik Music', 'Books'],
        mobile: '9112233445', dob: '1999-09-09', motherTongue: 'Tamil', maritalStatus: 'Single', height: "5'3\"",
        workLocation: 'Chennai', prefAgeRange: '26-30', prefLocation: 'Chennai', prefEducation: 'Post Graduate', prefProfession: 'Teacher'
    },
    {
        _id: '8', name: 'Rohan Deshmukh', email: 'rohan.desh@example.com', age: 28, gender: 'Male', religion: 'Hindu', location: 'Pune',
        profession: 'Graphic Designer', education: 'BFA', income: '₹9 LPA', caste: 'Maratha',
        profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg',
        aboutMe: 'Creative mind looking for a soulmate who appreciates art.',
        isApproved: false,
        mobile: '9334455667', dob: '1996-05-30', motherTongue: 'Marathi', maritalStatus: 'Single', height: "5'10\"",
        workLocation: 'Pune', prefAgeRange: '23-27', prefLocation: 'Pune', prefEducation: 'Bachelors', prefProfession: 'Creative'
    },
];

// Helper to get profiles from LocalStorage or use initial data
const getStoredProfiles = () => {
    const stored = localStorage.getItem('dummy_profiles');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('dummy_profiles', JSON.stringify(INITIAL_PROFILES));
    return INITIAL_PROFILES;
};

let DUMMY_PROFILES = getStoredProfiles();

const updateStoredProfiles = (profiles) => {
    DUMMY_PROFILES = profiles;
    localStorage.setItem('dummy_profiles', JSON.stringify(profiles));
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

export const login = (formData) => mockResolve({
    _id: formData.email === 'admin@milana.com' ? 'admin_001' : 'mock_user_1',
    name: formData.email === 'admin@milana.com' ? 'Admin User' : 'Demo User',
    email: formData.email,
    token: 'mock_token',
    isAdmin: formData.email === 'admin@milana.com'
});
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
