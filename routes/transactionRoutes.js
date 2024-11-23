const express = require('express');
const {
    editTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.put('/:transactionId', authenticateUser, editTransaction); // Edit transaction
router.delete('/:transactionId', authenticateUser, deleteTransaction); // Delete transaction

module.exports = router;
