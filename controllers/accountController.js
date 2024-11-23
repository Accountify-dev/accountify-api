const Account = require('../models/Account');

// Create an account for a specific user
exports.createAccount = async (req, res) => {
    const { account_name } = req.body; // Account name from the request body
    const userId = req.user.id; // User ID from the authenticated user

    try {
        // Create a new account associated with the authenticated user
        const account = new Account({ account_name, user: userId });
        await account.save();

        res.status(201).json({
            message: 'Account created successfully',
            account
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
