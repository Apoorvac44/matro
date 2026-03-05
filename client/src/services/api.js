// FRONTEND-ONLY MOCK API
const DUMMY_PROFILES = [
    { _id: '1', name: 'Priya Sharma', age: 26, gender: 'Female', religion: 'Hindu', location: 'Mumbai', profession: 'Software Engineer', education: 'B.Tech CS', income: '₹12 LPA', caste: 'Brahmin', profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg', aboutMe: 'Passionate about technology and classical dance. Looking for someone with a modern soul and traditional roots.', isApproved: true, interests: ['Tech', 'Salsa', 'Travel', 'Reading'], photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60'] },
    { _id: '2', name: 'Amit Patel', age: 29, gender: 'Male', religion: 'Hindu', location: 'Ahmedabad', profession: 'Doctor', education: 'MBBS, MD', income: '₹18 LPA', caste: 'Patel', profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg', aboutMe: 'A dedicated physician who loves cricket and travel. Believe in simple living and high thinking.', isApproved: true, interests: ['Fitness', 'Reading', 'Music', 'Hiking'], photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60'] },
    { _id: '3', name: 'Anjali Reddy', age: 24, gender: 'Female', religion: 'Hindu', location: 'Hyderabad', profession: 'Data Analyst', education: 'MBA', income: '₹10 LPA', caste: 'Reddy', profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg', aboutMe: 'Love cooking and exploring new cuisines. Looking for a partner who is adventurous.', isApproved: true, interests: ['Cooking', 'Cinema', 'Yoga'] },
    { _id: '4', name: 'Rahul Mehta', age: 31, gender: 'Male', religion: 'Jain', location: 'Surat', profession: 'Chartered Accountant', education: 'CA, CS', income: '₹15 LPA', caste: 'Oswal', profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg', aboutMe: 'Traditional values with a modern outlook. Family is my priority.', isApproved: true, interests: ['Investment', 'Social Work', 'Music'] },
    { _id: '5', name: 'Kavya Nair', age: 27, gender: 'Female', religion: 'Hindu', location: 'Kochi', profession: 'Architect', education: 'B.Arch', income: '₹14 LPA', caste: 'Nair', profilePicture: 'https://randomuser.me/api/portraits/women/55.jpg', aboutMe: 'Creative soul who loves design and music. I enjoy the serenity of nature.', isApproved: true, interests: ['Design', 'Photography', 'Music'] },
    { _id: '6', name: 'Vikram Singh', age: 33, gender: 'Male', religion: 'Sikh', location: 'Chandigarh', profession: 'Army Officer', education: 'B.Sc (NDA)', income: '₹20 LPA', caste: 'Jat', profilePicture: 'https://randomuser.me/api/portraits/men/60.jpg', aboutMe: 'Disciplined, adventurous and family-oriented. Love the mountains.', isApproved: true, interests: ['Sports', 'Trekking', 'Pets'] },
    { _id: '7', name: 'Sneha Iyer', age: 25, gender: 'Female', religion: 'Hindu', location: 'Chennai', profession: 'Teacher', education: 'M.Ed', income: '₹7 LPA', caste: 'Iyer', profilePicture: 'https://randomuser.me/api/portraits/women/72.jpg', aboutMe: 'Passionate about education and classical music. I value honesty and integrity.', isApproved: true, interests: ['Teaching', 'Karnatik Music', 'Books'] },
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
    _id: 'mock_user_1', name: 'Demo User', email: formData.email, token: 'mock_token'
});
export const register = (formData) => mockResolve({
    _id: 'mock_user_1', name: formData.name, email: formData.email, token: 'mock_token'
});
export const getProfile = (id) => {
    if (id) {
        return mockResolve(DUMMY_PROFILES.find(p => p._id === id || p.id === id) || DUMMY_PROFILES[0]);
    }
    return mockResolve({
        _id: 'mock_user_1', name: 'Demo User', email: 'demo@example.com', age: 28, gender: 'Male', religion: 'Hindu', caste: 'General', location: 'Mumbai', education: 'Masters in Management', profession: 'Senior Executive', income: '₹15 LPA', aboutMe: 'I am a balanced individual looking for a life partner who values family and dreams.', membership: 'Premium', interests: ['Reading', 'Travel', 'Movies'], profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
    });
};
export const updateProfile = (formData) => mockResolve(formData);
export const getProfiles = () => mockResolve(DUMMY_PROFILES);
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
export const getAdminUsers = () => mockResolve([]);
export const toggleApproval = (id) => mockResolve({ isApproved: true });
export const getDashboardStats = () => mockResolve({ viewedYou: 12, saved: 5, receivedInterested: 3, sentInterests: 8, gallery: 4 });
export const getFavorites = () => mockResolve(DUMMY_PROFILES.slice(0, 2));
export const getInterestsReceived = () => mockResolve(DUMMY_PROFILES.slice(2, 5));
export const getInterestsSent = () => mockResolve(DUMMY_PROFILES.slice(4, 7));
export const getGallery = () => mockResolve(DUMMY_PROFILES[0].photos || []);
export const addGalleryPhoto = (base64) => mockResolve({ url: base64 });
export const deleteGalleryPhoto = (id) => mockResolve({ message: 'Photo deleted' });

export default { login, register, getProfile, updateProfile, getProfiles, sendInterest, toggleFavorite, sendMessage, getConversations, getMessages, getAdminUsers, toggleApproval, getDashboardStats, getFavorites, getInterestsReceived, getInterestsSent, getGallery, addGalleryPhoto, deleteGalleryPhoto };
