const express = require('express');
const router = express.Router();
const {
    authUser, registerUser, getUserProfile, updateUserProfile,
    getUsers, sendInterest, toggleFavorite, getAllUsersAdmin, toggleApproval,
    getDashboardStats, getFavorites, getInterestsReceived, getInterestsSent,
    blockUser, ignoreUser, deleteUserAccount,
    forgotPassword, resetPassword
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/').get(protect, getUsers);
router.post('/interest/:id', protect, sendInterest);
router.post('/favorite/:id', protect, toggleFavorite);
router.get('/dashboard', protect, getDashboardStats);
router.get('/favorites', protect, getFavorites);
router.get('/interests-received', protect, getInterestsReceived);
router.get('/interests-sent', protect, getInterestsSent);

// Admin Routes
router.get('/admin', protect, admin, getAllUsersAdmin);
router.put('/approve/:id', protect, admin, toggleApproval);
router.put('/privacy-settings', protect, updateUserProfile);
router.put('/account-settings', protect, updateUserProfile);
router.post('/block/:id', protect, blockUser);
router.post('/ignore/:id', protect, ignoreUser);
router.delete('/account', protect, deleteUserAccount);

module.exports = router;
