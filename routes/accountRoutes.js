const express = require('express');
const { createAccount } = require('../controllers/accountController');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// POST request to create an account
router.post('/', authenticateUser, createAccount);

module.exports = router;
