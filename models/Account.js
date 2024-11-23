const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    account_name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
