const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const auth = require('../middleware/auth');

// @route   GET /api/characters
// @desc    Get all characters
// @access  Public
router.get('/', characterController.getAllCharacters);

// @route   GET /api/characters/:id
// @desc    Get a specific character
// @access  Public
router.get('/:id', characterController.getCharacter);

// @route   POST /api/characters
// @desc    Create a new character (admin only)
// @access  Private (admin)
router.post('/', characterController.createCharacter);

// @route   POST /api/characters/gacha
// @desc    Pull from gacha
// @access  Private
router.post('/gacha', auth, characterController.gachaPull);

// @route   POST /api/characters/multi-gacha
// @desc    Multi-pull from gacha (10+1)
// @access  Private
router.post('/multi-gacha', auth, characterController.multiPull);

module.exports = router; 