const express = require('express');
const router = express.Router();
const { getOnlyOperators } = require('../controllers/authController');

// GET /api/operators - Fetches only users with the 'operator' role
router.get('/', getOnlyOperators);

module.exports = router;