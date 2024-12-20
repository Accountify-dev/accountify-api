const Account = require('../models/Account');
const Transaction = require('../models/Transaction')

// Create an account for a specific user
exports.createAccount = async (req, res) => {
    const { account_name } = req.body; // Account name from the request body
    const userId = req.user.id; // User ID from the authenticated user

    try {
        // Check if an account with the same name already exists for the user
        const existingAccount = await Account.findOne({ account_name, user: userId });
        if (existingAccount) {
            return res.status(400).json({
                message: 'Account name already exists.',
                //data: [req.body],
                success: false
            });
        }

        // Create a new account associated with the authenticated user
        const account = new Account({ account_name, user: userId });
        await account.save();

        res.status(201).json({
            message: 'Account created successfully.',
            data: [req.body], // Include the request body in the data array
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while creating the account',
           // data: [req.body],
            success: false
        });
    }
};


// Get account data for the authenticated user
exports.getAccounts = async (req, res) => {
    const userId = req.user.id; // The authenticated user's ID

    try {
        // Fetch all accounts associated with the authenticated user
        const accounts = await Account.find({ user: userId });

        if (accounts.length === 0) {
            return res.status(404).json({
                message: 'No accounts found for this user.',
                success: false
            });
        }

        // Respond with the list of accounts
        res.status(200).json({
            message: 'Accounts retrieved successfully.',
            data: accounts,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while retrieving accounts.',
            success: false
        });
    }
 };

 exports.getAccountDetailsWithTotals = async (req, res) => {
    const userId = req.user.id;

    try {
        const accounts = await Account.find({ user: userId });

        if (accounts.length === 0) {
            return res.status(404).json({
                message: 'No accounts found for this user.',
                success: false
            });
        }

        const accountDetails = await Promise.all(
            accounts.map(async (account) => {
                const totals = await Transaction.aggregate([
                    { $match: { account: account._id } },
                    {
                        $group: {
                            _id: "$type",
                            total: { $sum: "$amount" }
                        }
                    }
                ]);

                const creditTotal = totals.find(item => item._id === 'credit')?.total || 0;
                const debitTotal = totals.find(item => item._id === 'debit')?.total || 0;
                const netBalance = Math.abs(creditTotal - debitTotal);

                return {
                    accountName: account.account_name,
                    accountId: account._id,
                    creditTotal,
                    debitTotal,
                    netBalance
                };
            })
        );

        res.status(200).json({
            message: 'Accounts retrieved successfully.',
            data: accountDetails,
            success: true
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({
            message: 'An error occurred while retrieving accounts.',
            error: error.message,
            success: false
        });
    }
};