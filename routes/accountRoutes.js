const express = require('express');
const { createAccount , getAccounts } = require('../controllers/accountController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// POST request to create an account
router.post('/create', authenticateUser, createAccount);

// Route to get all accounts for the authenticated user
router.get('/fetch', authenticateUser, getAccounts);

module.exports = router;
