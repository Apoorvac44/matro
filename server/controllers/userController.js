const User = require('../models/User');
const generateToken = require('../config/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
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

        const userExists = await User.findOne({ email });

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
            paymentStatus: (membership && membership !== 'Basic') ? 'Completed' : 'Pending'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
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
    const user = await User.findById(req.user._id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        console.log("Update profile requested by:", req.user._id);
        const user = await User.findById(req.user._id);

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

            const updatedUser = await user.save();
            console.log("Saved successfully. Photos count:", updatedUser.photos.length);

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                photos: updatedUser.photos,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: error.message || 'Server Error updating profile' });
    }
};

// @desc    Send interest to a user
// @route   POST /api/users/interest/:id
const sendInterest = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize arrays if they don't exist
        if (!targetUser.interestsReceived) targetUser.interestsReceived = [];
        if (!currentUser.interestsSent) currentUser.interestsSent = [];

        // Check if interest already sent using string comparison for ObjectIds
        const alreadySent = targetUser.interestsReceived.some(
            id => id.toString() === currentUser._id.toString()
        );

        if (alreadySent) {
            return res.status(400).json({ message: 'Interest already sent' });
        }

        // Auto-Save: Add to favorites if not already there
        if (!currentUser.favorites) currentUser.favorites = [];
        if (!currentUser.favorites.some(id => id.toString() === targetUser._id.toString())) {
            currentUser.favorites.push(targetUser._id);
        }

        targetUser.interestsReceived.push(currentUser._id);
        currentUser.interestsSent.push(targetUser._id);

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
        const currentUser = await User.findById(req.user._id);

        // Initialize if undefined
        if (!currentUser.favorites) currentUser.favorites = [];

        const index = currentUser.favorites.indexOf(req.params.id);

        if (index > -1) {
            currentUser.favorites.splice(index, 1);
            await currentUser.save();
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            currentUser.favorites.push(req.params.id);
            await currentUser.save();
            res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (error) {
        console.error("Toggle favorite error:", error);
        res.status(500).json({ message: error.message || 'Server Error toggling favorite' });
    }
};

const getUsers = async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id }, isAdmin: false }).select('-password');
    res.json(users);
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
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
        const user = await User.findById(req.user._id).populate('favorites', '-password');
        res.json(user.favorites || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sent interests list
// @route   GET /api/users/interests-sent
const getInterestsSent = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('interestsSent', '-password');
        res.json(user.interestsSent || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get received interests list
// @route   GET /api/users/interests-received
const getInterestsReceived = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('interestsReceived', '-password');
        res.json(user.interestsReceived || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users for admin
// @route   GET /api/users/admin
const getAllUsersAdmin = async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
};

// @desc    Approve or Block user
// @route   PUT /api/users/approve/:id
const toggleApproval = async (req, res) => {
    const user = await User.findById(req.params.id);
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
    getDashboardStats, getFavorites, getInterestsReceived, getInterestsSent
};
