// const Transaction = require('../models/Transaction');
// const Account = require('../models/Account');

// // Edit a transaction (credit or debit)
// exports.editTransaction = async (req, res) => {
//     const { transactionId } = req.params;
//     const { amount, notes, date } = req.body;
//     const userId = req.user.id;

//     try {
//         // Find the transaction and verify the user owns the account
//         const transaction = await Transaction.findById(transactionId).populate('account');
//         if (!transaction || transaction.account.user.toString() !== userId) {
//             return res.status(404).json({ message: 'Transaction not found or unauthorized' });
//         }

//         // Update transaction details
//         transaction.amount = amount || transaction.amount;
//         transaction.notes = notes || transaction.notes;
//         transaction.date = date || transaction.date;
//         await transaction.save();

//         res.status(200).json({ message: 'Transaction updated successfully', transaction });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Delete a transaction (credit or debit)
// exports.deleteTransaction = async (req, res) => {
//     const { transactionId } = req.params;
//     const userId = req.user.id;

//     try {
//         // Find the transaction and verify the user owns the account
//         const transaction = await Transaction.findById(transactionId).populate('account');
//         if (!transaction || transaction.account.user.toString() !== userId) {
//             return res.status(404).json({ message: 'Transaction not found or unauthorized' });
//         }

//         // Delete the transaction
//         await transaction.remove();
//         res.status(200).json({ message: 'Transaction deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Post a credit or debit transaction
exports.postTransaction = async (req, res) => {
    const { type, amount, notes, date } = req.body; // Transaction details from the request
    const accountId = req.params.accountId; // Account ID from the route parameter
    const userId = req.user.id; // User ID from the authenticated user

    try {
        // Check if the account exists and belongs to the authenticated user
        const account = await Account.findOne({ _id: accountId, user: userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found or access denied' });
        }

        // Create the transaction
        const transaction = new Transaction({
            type,
            amount,
            notes,
            date,
            account: accountId
        });

        await transaction.save();

        res.status(201).json({
            message: `${type} transaction added successfully`,
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all credit transactions for a particular account
exports.getCreditTransactions = async (req, res) => {
    const accountId = req.params.accountId;
    const userId = req.user.id;

    try {
        // Ensure the account belongs to the authenticated user
        const account = await Account.findOne({ _id: accountId, user: userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found or access denied' });
        }

        // Fetch credit transactions
        const transactions = await Transaction.find({ account: accountId, type: 'credit' });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all debit transactions for a particular account
exports.getDebitTransactions = async (req, res) => {
    const accountId = req.params.accountId;
    const userId = req.user.id;

    try {
        // Ensure the account belongs to the authenticated user
        const account = await Account.findOne({ _id: accountId, user: userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found or access denied' });
        }

        // Fetch debit transactions
        const transactions = await Transaction.find({ account: accountId, type: 'debit' });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all transactions (credit and debit) for a particular account
exports.getAllTransactions = async (req, res) => {
    const accountId = req.params.accountId;
    const userId = req.user.id;

    try {
        // Ensure the account belongs to the authenticated user
        const account = await Account.findOne({ _id: accountId, user: userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found or access denied' });
        }

        // Fetch all transactions
        const transactions = await Transaction.find({ account: accountId });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get the total of credit, debit, and net balance for a specific account
exports.getTransactionTotals = async (req, res) => {
    const accountId = req.params.accountId;
    const userId = req.user.id;

    try {
        // Ensure the account belongs to the authenticated user
        const account = await Account.findOne({ _id: accountId, user: userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found or access denied' });
        }

        // Convert accountId to ObjectId using 'new' keyword
        const accountObjectId = new mongoose.Types.ObjectId(accountId);

        // Calculate total credit amount
        const totalCredit = await Transaction.aggregate([
            { $match: { account: accountObjectId, type: 'credit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Calculate total debit amount
        const totalDebit = await Transaction.aggregate([
            { $match: { account: accountObjectId, type: 'debit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const creditAmount = totalCredit.length > 0 ? totalCredit[0].total : 0;
        const debitAmount = totalDebit.length > 0 ? totalDebit[0].total : 0;

        // Calculate net balance
        const netBalance = creditAmount - debitAmount;

        res.status(200).json({
            accountId,
            creditTotal: creditAmount,
            debitTotal: debitAmount,
            netBalance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
