const User = require('../models/User');

exports.authenticateUser = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer header

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
