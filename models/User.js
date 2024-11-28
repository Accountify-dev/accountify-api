const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String, unique: true }, // Bearer token
}, { timestamps: true });

// Hash password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// Generate a unique Bearer token
userSchema.methods.generateToken = function () {
    this.token = crypto.randomBytes(30).toString('hex'); // 30 random bytes
};

module.exports = mongoose.model('User', userSchema);
