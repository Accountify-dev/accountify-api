const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Signup
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email, password });
        user.generateToken(); // Generate Bearer token
        await user.save();

        res.status(201).json({ 
            message: 'User registered successfully', 
            token: user.token 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        user.generateToken(); // Generate new Bearer token on login
        await user.save();

        res.status(200).json({ token: user.token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
