const express = require('express');
const router = express.Router();
const {
  getAllOperators,
  register,
} = require('../controllers/authController');

// All routes are now public
router.get('/', getAllOperators);
router.post('/', register);

module.exports = router;