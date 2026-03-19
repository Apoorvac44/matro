const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    religion: { type: String },
    caste: { type: String },
    location: { type: String },
    education: { type: String },
    profession: { type: String },
    mobile: { type: String },
    dob: { type: String },
    motherTongue: { type: String },
    maritalStatus: { type: String },
    height: { type: String },
    income: { type: String },
    workLocation: { type: String },
    prefAgeMin: { type: Number },
    prefAgeMax: { type: Number },
    prefLocation: { type: String },
    prefEducation: { type: String },
    prefProfession: { type: String },
    aadharCard: { type: String },
    casteCertificate: { type: String },
    weight: { type: String },
    bodyType: { type: String },
    profileCreatedBy: { type: String },
    eatingHabits: { type: String },
    smokingHabits: { type: String },
    drinkingHabits: { type: String },
    timeOfBirth: { type: String },
    star: { type: String },
    raasi: { type: String },
    kujaDosha: { type: String },
    kulaDaiva: { type: String },
    horoscope: { type: String },
    familyType: { type: String },
    familyStatus: { type: String },
    brothers: { type: String },
    sisters: { type: String },
    ancestralOrigin: { type: String },
    interests: [{ type: String }],
    aboutMe: { type: String },
    profilePicture: { type: String },
    photos: [{ type: String }], // Array for up to 6 additional photos
    isApproved: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    interestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    interestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    membership: {
        type: String,
        default: 'Basic'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
