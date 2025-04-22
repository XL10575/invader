const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', userController.register);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', userController.login);

// @route   GET /api/users/me
// @desc    Get user data
// @access  Private
router.get('/me', auth, userController.getUserData);

// @route   PUT /api/users/select-character
// @desc    Update user's selected character
// @access  Private
router.put('/select-character', auth, userController.selectCharacter);

// @route   PUT /api/users/high-score
// @desc    Update user's high score
// @access  Private
router.put('/high-score', auth, userController.updateHighScore);

// @route   PUT /api/users/coins
// @desc    Update user's coins
// @access  Private
router.put('/coins', auth, userController.updateCoins);

module.exports = router; 