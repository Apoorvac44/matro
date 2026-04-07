const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
    religion: { type: DataTypes.STRING },
    caste: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    education: { type: DataTypes.STRING },
    profession: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    dob: { type: DataTypes.STRING },
    motherTongue: { type: DataTypes.STRING },
    maritalStatus: { type: DataTypes.STRING },
    height: { type: DataTypes.STRING },
    income: { type: DataTypes.STRING },
    workLocation: { type: DataTypes.STRING },
    prefAgeMin: { type: DataTypes.INTEGER },
    prefAgeMax: { type: DataTypes.INTEGER },
    prefLocation: { type: DataTypes.STRING },
    prefEducation: { type: DataTypes.STRING },
    prefProfession: { type: DataTypes.STRING },
    aadharCard: { type: DataTypes.STRING },
    casteCertificate: { type: DataTypes.STRING },
    weight: { type: DataTypes.STRING },
    bodyType: { type: DataTypes.STRING },
    profileCreatedBy: { type: DataTypes.STRING },
    eatingHabits: { type: DataTypes.STRING },
    smokingHabits: { type: DataTypes.STRING },
    drinkingHabits: { type: DataTypes.STRING },
    timeOfBirth: { type: DataTypes.STRING },
    star: { type: DataTypes.STRING },
    raasi: { type: DataTypes.STRING },
    kujaDosha: { type: DataTypes.STRING },
    kulaDaiva: { type: DataTypes.STRING },
    horoscope: { type: DataTypes.STRING },
    familyType: { type: DataTypes.STRING },
    familyStatus: { type: DataTypes.STRING },
    brothers: { type: DataTypes.STRING },
    sisters: { type: DataTypes.STRING },
    ancestralOrigin: { type: DataTypes.STRING },
    interests: { type: DataTypes.JSON }, // Store as JSON array
    aboutMe: { type: DataTypes.TEXT },
    profilePicture: { type: DataTypes.STRING },
    photos: { type: DataTypes.JSON }, // Store as JSON array
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    favorites: { type: DataTypes.JSON }, // Store as JSON array of IDs
    interestsReceived: { type: DataTypes.JSON }, // Store as JSON array of IDs
    interestsSent: { type: DataTypes.JSON }, // Store as JSON array of IDs
    membership: {
        type: DataTypes.STRING,
        defaultValue: 'Basic'
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    },
    // Settings & Privacy
    photoPrivacy: { type: DataTypes.STRING, defaultValue: 'Visible to all' },
    horoscopePrivacy: { type: DataTypes.STRING, defaultValue: 'Visible to all' },
    phonePrivacy: { type: DataTypes.STRING, defaultValue: 'Show to paid members' },
    showShortlist: { type: DataTypes.BOOLEAN, defaultValue: true },
    showViewed: { type: DataTypes.BOOLEAN, defaultValue: true },
    blockedProfiles: { type: DataTypes.JSON, defaultValue: [] },
    ignoredProfiles: { type: DataTypes.JSON, defaultValue: [] },
    isDeactivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    deactivationReason: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpires: { type: DataTypes.DATE },
}, {
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
