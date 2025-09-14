const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

// This route is for creating a new user (operator)
router.post('/register', register);

module.exports = router;