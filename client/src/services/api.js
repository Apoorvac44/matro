import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('API Base URL:', baseURL);
const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return req;
});

export const login = (formData) => API.post('/users/login', formData);
export const register = (formData) => API.post('/users', formData);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (formData) => API.put('/users/profile', formData);
export const getProfiles = () => API.get('/users');
export const sendInterest = (id) => API.post(`/users/interest/${id}`);
export const toggleFavorite = (id) => API.post(`/users/favorite/${id}`);
export const sendMessage = (data) => API.post('/messages', data);
export const getConversations = () => API.get('/messages/conversations');
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const getAdminUsers = () => API.get('/users/admin');
export const toggleApproval = (id) => API.put(`/users/approve/${id}`);
export const getDashboardStats = () => API.get('/users/dashboard');
export const getFavorites = () => API.get('/users/favorites');
export const getInterestsReceived = () => API.get('/users/interests-received');
export const getInterestsSent = () => API.get('/users/interests-sent');

export default API;
