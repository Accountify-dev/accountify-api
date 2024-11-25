// const express = require('express');
// const {
//     editTransaction,
//     deleteTransaction,
// } = require('../controllers/transactionController');
// const { authenticateUser } = require('../middleware/authMiddleware');
// const router = express.Router();

// router.put('/:transactionId', authenticateUser, editTransaction); // Edit transaction
// router.delete('/:transactionId', authenticateUser, deleteTransaction); // Delete transaction

// module.exports = router;


const express = require('express');
const { postTransaction , getCreditTransactions , getDebitTransactions , getAllTransactions , getTransactionTotals } = require('../controllers/transactionController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// POST credit transaction
router.post('/credit/:accountId', authenticateUser, (req, res, next) => {
    req.body.type = 'credit'; // Predefine the transaction type
    next();
}, postTransaction);

// POST debit transaction
router.post('/debit/:accountId', authenticateUser, (req, res, next) => {
    req.body.type = 'debit'; // Predefine the transaction type
    next();
}, postTransaction);

// GET credit transactions
router.get('/credit/:accountId/', authenticateUser, getCreditTransactions);

// GET debit transactions
router.get('/debit/:accountId/', authenticateUser, getDebitTransactions);

// GET all transactions
router.get('/all/:accountId/', authenticateUser, getAllTransactions);

// GET total credit, debit, and net balance
router.get('/totals/:accountId', authenticateUser, getTransactionTotals);

module.exports = router;
