const User = require('../models/User');
const generateToken = require('../config/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = async (req, res) => {
    try {
        const {
            name, email, password, gender, dob, mobile,
            religion, motherTongue, maritalStatus, height,
            location, education, profession, income, workLocation,
            prefAgeMin, prefAgeMax, prefReligion, prefEducation,
            membership, aadharCard, casteCertificate,
            weight, bodyType, profileCreatedBy, eatingHabits, smokingHabits, drinkingHabits,
            timeOfBirth, star, raasi, kujaDosha, kulaDaiva, horoscope,
            familyType, familyStatus, brothers, sisters, ancestralOrigin
        } = req.body;

        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name, email, password, gender,
            mobile, dob, motherTongue, maritalStatus, height,
            income, workLocation, prefAgeMin, prefAgeMax,
            prefReligion, prefEducation, prefProfession: req.body.prefProfession, prefLocation: req.body.prefLocation,
            aadharCard, casteCertificate,
            weight, bodyType, profileCreatedBy, eatingHabits, smokingHabits, drinkingHabits,
            timeOfBirth, star, raasi, kujaDosha, kulaDaiva, horoscope,
            familyType, familyStatus, brothers, sisters, ancestralOrigin,
            age: dob ? (new Date().getFullYear() - new Date(dob).getFullYear()) : undefined,
            religion, location, education, profession,
            membership: membership || 'Basic',
            paymentStatus: (membership && membership !== 'Basic') ? 'Completed' : 'Pending',
            interests: [], photos: [], favorites: [], interestsReceived: [], interestsSent: []
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: error.message || 'Server Error during registration' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        console.log("Update profile requested by:", req.user.id);
        const user = await User.findByPk(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }

            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            user.religion = req.body.religion || user.religion;
            user.caste = req.body.caste || user.caste;
            user.location = req.body.location || user.location;
            user.education = req.body.education || user.education;
            user.profession = req.body.profession || user.profession;
            user.interests = req.body.interests || user.interests;
            user.aboutMe = req.body.aboutMe || user.aboutMe;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            // New fields
            user.mobile = req.body.mobile || user.mobile;
            user.dob = req.body.dob || user.dob;
            user.motherTongue = req.body.motherTongue || user.motherTongue;
            user.maritalStatus = req.body.maritalStatus || user.maritalStatus;
            user.height = req.body.height || user.height;
            user.income = req.body.income || user.income;
            user.workLocation = req.body.workLocation || user.workLocation;

            // Astrological, Lifestyle, Family
            user.weight = req.body.weight || user.weight;
            user.bodyType = req.body.bodyType || user.bodyType;
            user.profileCreatedBy = req.body.profileCreatedBy || user.profileCreatedBy;
            user.eatingHabits = req.body.eatingHabits || user.eatingHabits;
            user.smokingHabits = req.body.smokingHabits || user.smokingHabits;
            user.drinkingHabits = req.body.drinkingHabits || user.drinkingHabits;

            user.timeOfBirth = req.body.timeOfBirth || user.timeOfBirth;
            user.star = req.body.star || user.star;
            user.raasi = req.body.raasi || user.raasi;
            user.kujaDosha = req.body.kujaDosha || user.kujaDosha;
            user.kulaDaiva = req.body.kulaDaiva || user.kulaDaiva;
            user.horoscope = req.body.horoscope || user.horoscope;

            user.familyType = req.body.familyType || user.familyType;
            user.familyStatus = req.body.familyStatus || user.familyStatus;
            user.brothers = req.body.brothers || user.brothers;
            user.sisters = req.body.sisters || user.sisters;
            user.ancestralOrigin = req.body.ancestralOrigin || user.ancestralOrigin;

            // Preferences
            user.prefAgeMin = req.body.prefAgeMin || user.prefAgeMin;
            user.prefAgeMax = req.body.prefAgeMax || user.prefAgeMax;
            user.prefLocation = req.body.prefLocation || user.prefLocation;
            user.prefEducation = req.body.prefEducation || user.prefEducation;
            user.prefProfession = req.body.prefProfession || user.prefProfession;

            user.aadharCard = req.body.aadharCard || user.aadharCard;
            user.casteCertificate = req.body.casteCertificate || user.casteCertificate;
            user.membership = req.body.membership || user.membership;
            if (req.body.membership && req.body.membership !== 'p1' && req.body.membership !== 'Free' && req.body.membership !== 'Basic') {
                user.paymentStatus = 'Completed';
            }

            if (req.body.photos) {
                console.log("Received photos array. Length:", req.body.photos.length);
                user.photos = req.body.photos.slice(0, 6);
            }

            // Privacy & Settings fields
            user.photoPrivacy = req.body.photoPrivacy || user.photoPrivacy;
            user.horoscopePrivacy = req.body.horoscopePrivacy || user.horoscopePrivacy;
            user.phonePrivacy = req.body.phonePrivacy || user.phonePrivacy;
            user.showShortlist = req.body.showShortlist !== undefined ? req.body.showShortlist : user.showShortlist;
            user.showViewed = req.body.showViewed !== undefined ? req.body.showViewed : user.showViewed;
            user.isDeactivated = req.body.isDeactivated !== undefined ? req.body.isDeactivated : user.isDeactivated;
            user.deactivationReason = req.body.deactivationReason || user.deactivationReason;

            await user.save();
            console.log("Saved successfully. Photos count:", user.photos ? user.photos.length : 0);

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                photos: user.photos,
                // Include settings in response
                photoPrivacy: user.photoPrivacy,
                horoscopePrivacy: user.horoscopePrivacy,
                phonePrivacy: user.phonePrivacy,
                showShortlist: user.showShortlist,
                showViewed: user.showViewed,
                isDeactivated: user.isDeactivated,
                token: generateToken(user.id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: error.message || 'Server Error updating profile' });
    }
};

// @desc    Block a user
// @route   POST /api/users/block/:id
const blockUser = async (req, res) => {
    try {
        const currentUser = await User.findByPk(req.user.id);
        if (!currentUser.blockedProfiles) currentUser.blockedProfiles = [];

        const targetId = parseInt(req.params.id);
        if (!currentUser.blockedProfiles.includes(targetId)) {
            currentUser.blockedProfiles.push(targetId);
            currentUser.changed('blockedProfiles', true);
            await currentUser.save();
        }
        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Ignore a user
// @route   POST /api/users/ignore/:id
const ignoreUser = async (req, res) => {
    try {
        const currentUser = await User.findByPk(req.user.id);
        if (!currentUser.ignoredProfiles) currentUser.ignoredProfiles = [];

        const targetId = parseInt(req.params.id);
        if (!currentUser.ignoredProfiles.includes(targetId)) {
            currentUser.ignoredProfiles.push(targetId);
            currentUser.changed('ignoredProfiles', true);
            await currentUser.save();
        }
        res.json({ message: 'User ignored successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
const deleteUserAccount = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = await User.findByPk(req.user.id);
        if (user) {
            console.log(`User ${user.email} (ID: ${user.id}) is deleting account. Reason: ${reason || 'Not specified'}`);
            await user.destroy();
            res.json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send interest to a user
// @route   POST /api/users/interest/:id
const sendInterest = async (req, res) => {
    try {
        const targetUser = await User.findByPk(req.params.id);
        const currentUser = await User.findByPk(req.user.id);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize arrays if they don't exist
        if (!targetUser.interestsReceived) targetUser.interestsReceived = [];
        if (!currentUser.interestsSent) currentUser.interestsSent = [];

        // Check if interest already sent
        const alreadySent = targetUser.interestsReceived.some(
            id => id.toString() === currentUser.id.toString()
        );

        if (alreadySent) {
            return res.status(400).json({ message: 'Interest already sent' });
        }

        // Auto-Save: Add to favorites if not already there
        if (!currentUser.favorites) currentUser.favorites = [];
        if (!currentUser.favorites.some(id => id.toString() === targetUser.id.toString())) {
            currentUser.favorites.push(targetUser.id);
        }

        targetUser.interestsReceived.push(currentUser.id);
        currentUser.interestsSent.push(targetUser.id);

        // Ensure we mark them as changed for Sequelize if using JSON
        targetUser.changed('interestsReceived', true);
        currentUser.changed('interestsSent', true);
        currentUser.changed('favorites', true);

        await targetUser.save();
        await currentUser.save();

        res.json({ message: 'Interest sent and profile saved!' });
    } catch (error) {
        console.error("Send interest error:", error);
        res.status(500).json({ message: error.message || 'Server Error sending interest' });
    }
};

// @desc    Toggle favorite
// @route   POST /api/users/favorite/:id
const toggleFavorite = async (req, res) => {
    try {
        const currentUser = await User.findByPk(req.user.id);

        // Initialize if undefined
        if (!currentUser.favorites) currentUser.favorites = [];

        const index = currentUser.favorites.indexOf(parseInt(req.params.id));

        if (index > -1) {
            currentUser.favorites.splice(index, 1);
            currentUser.changed('favorites', true);
            await currentUser.save();
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            currentUser.favorites.push(parseInt(req.params.id));
            currentUser.changed('favorites', true);
            await currentUser.save();
            res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (error) {
        console.error("Toggle favorite error:", error);
        res.status(500).json({ message: error.message || 'Server Error toggling favorite' });
    }
};

const getUsers = async (req, res) => {
    const { Op } = require('sequelize');
    const users = await User.findAll({
        where: {
            id: { [Op.ne]: req.user.id },
            isAdmin: false
        },
        attributes: { exclude: ['password'] }
    });
    res.json(users);
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            viewedYou: 0, // placeholder
            saved: user.favorites?.length || 0,
            receivedInterested: user.interestsReceived?.length || 0,
            sentInterests: user.interestsSent?.length || 0,
            gallery: user.photos?.length || 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's favorites list
// @route   GET /api/users/favorites
const getFavorites = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const user = await User.findByPk(req.user.id);
        const favorites = await User.findAll({
            where: { id: { [Op.in]: user.favorites || [] } },
            attributes: { exclude: ['password'] }
        });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sent interests list
// @route   GET /api/users/interests-sent
const getInterestsSent = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const user = await User.findByPk(req.user.id);
        const sent = await User.findAll({
            where: { id: { [Op.in]: user.interestsSent || [] } },
            attributes: { exclude: ['password'] }
        });
        res.json(sent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get received interests list
// @route   GET /api/users/interests-received
const getInterestsReceived = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const user = await User.findByPk(req.user.id);
        const received = await User.findAll({
            where: { id: { [Op.in]: user.interestsReceived || [] } },
            attributes: { exclude: ['password'] }
        });
        res.json(received);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users for admin
// @route   GET /api/users/admin
const getAllUsersAdmin = async (req, res) => {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json(users);
};

// @desc    Approve or Block user
// @route   PUT /api/users/approve/:id
const toggleApproval = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    user.isApproved = !user.isApproved;
    await user.save();
    res.json({ message: user.isApproved ? 'User Approved' : 'User Blocked', isApproved: user.isApproved });
};

module.exports = {
    authUser, registerUser, getUserProfile, updateUserProfile,
    getUsers, sendInterest, toggleFavorite, getAllUsersAdmin, toggleApproval,
    getDashboardStats, getFavorites, getInterestsReceived, getInterestsSent,
    blockUser, ignoreUser, deleteUserAccount
};
