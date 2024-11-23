const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// Edit a transaction (credit or debit)
exports.editTransaction = async (req, res) => {
    const { transactionId } = req.params;
    const { amount, notes, date } = req.body;
    const userId = req.user.id;

    try {
        // Find the transaction and verify the user owns the account
        const transaction = await Transaction.findById(transactionId).populate('account');
        if (!transaction || transaction.account.user.toString() !== userId) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        // Update transaction details
        transaction.amount = amount || transaction.amount;
        transaction.notes = notes || transaction.notes;
        transaction.date = date || transaction.date;
        await transaction.save();

        res.status(200).json({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a transaction (credit or debit)
exports.deleteTransaction = async (req, res) => {
    const { transactionId } = req.params;
    const userId = req.user.id;

    try {
        // Find the transaction and verify the user owns the account
        const transaction = await Transaction.findById(transactionId).populate('account');
        if (!transaction || transaction.account.user.toString() !== userId) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        // Delete the transaction
        await transaction.remove();
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
