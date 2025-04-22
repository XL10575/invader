const Score = require('../models/Score');
const User = require('../models/User');

// Submit a new score
exports.submitScore = async (req, res) => {
  try {
    const { score, level, playTime } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Create new score entry
    const newScore = new Score({
      userId: req.user.id,
      username: user.username,
      score,
      characterUsed: user.selectedCharacter,
      level,
      playTime
    });
    
    await newScore.save();
    
    // Update user's high score if needed
    if (score > user.highScore) {
      user.highScore = score;
      
      // Award coins based on score
      const earnedCoins = Math.floor(score / 100);
      user.coins += earnedCoins;
      
      await user.save();
    }
    
    res.json({
      score: newScore,
      highScore: user.highScore,
      coins: user.coins
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user's scores
exports.getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id })
      .sort({ score: -1 })
      .populate('characterUsed');
    
    res.json(scores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get global leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .sort({ score: -1 })
      .limit(10)
      .populate('characterUsed');
    
    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 