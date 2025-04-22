const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const auth = require('../middleware/auth');

// @route   POST /api/scores
// @desc    Submit a new score
// @access  Private
router.post('/', auth, scoreController.submitScore);

// @route   GET /api/scores/me
// @desc    Get user's scores
// @access  Private
router.get('/me', auth, scoreController.getUserScores);

// @route   GET /api/scores/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/leaderboard', scoreController.getLeaderboard);

module.exports = router; 