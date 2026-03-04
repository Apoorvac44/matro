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
        enum: ['Free', 'Premium', 'Elite'],
        default: 'Free'
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
