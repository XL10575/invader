const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username already taken' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Create and return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'space_invaders_secret_token',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT error:', err);
          return res.status(500).json({ msg: 'Error creating authentication token' });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if required fields are provided
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'space_invaders_secret_token',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT error:', err);
          return res.status(500).json({ msg: 'Error creating authentication token' });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Get user data
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('characters')
      .populate('selectedCharacter');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Update user's selected character
exports.selectCharacter = async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // Check if the character belongs to the user
    const user = await User.findById(req.user.id);
    
    if (!user.characters.includes(characterId)) {
      return res.status(400).json({ msg: 'Character not owned by user' });
    }
    
    user.selectedCharacter = characterId;
    await user.save();
    
    res.json({ msg: 'Character selected successfully', selectedCharacter: characterId });
  } catch (err) {
    console.error('Character selection error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Update user's high score
exports.updateHighScore = async (req, res) => {
  try {
    const { score } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }
    
    res.json({ highScore: user.highScore });
  } catch (err) {
    console.error('High score update error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// Update user's coins
exports.updateCoins = async (req, res) => {
  try {
    const { coins } = req.body;
    
    const user = await User.findById(req.user.id);
    user.coins += parseInt(coins);
    await user.save();
    
    res.json({ coins: user.coins });
  } catch (err) {
    console.error('Coins update error:', err);
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
}; 