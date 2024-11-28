// const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Signup
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email, password });
        user.generateToken(); // Generate Bearer token
        await user.save();

        // Exclude password from the response
        const { password: _, ...responseData } = { ...req.body, token: user.token };

        res.status(201).json({ 
            message: "Signup successful",
            data: [responseData], 
            success: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Email already in use. Try another email", 
           // data: [req.body], 
            success: false 
        });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ 
            message: "Invalid email!", 
           // data: [req.body], 
            success: false
        });

        if (user.password !== password) return res.status(401).json({ 
            message: "Invalid password!", 
           // data: [req.body], 
            success: false
        });

        user.generateToken(); // Generate new Bearer token on login
        await user.save();

        // Exclude password from the response
        const { password: _, ...responseData } = { ...req.body, token: user.token };

        res.status(200).json({ 
            message: "Login successful", 
            data: [responseData], 
            success: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Login failed!", 
           // data: [req.body], 
            success: false
        });
    }
};
