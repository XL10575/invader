const Character = require('../models/Character');
const User = require('../models/User');

// Get all available characters
exports.getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a specific character
exports.getCharacter = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ msg: 'Character not found' });
    }
    
    res.json(character);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Character not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Create a new character (admin only)
exports.createCharacter = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      rarity,
      dropRate,
      stats,
      specialAbility
    } = req.body;
    
    // Create character
    const character = new Character({
      name,
      description,
      image,
      rarity,
      dropRate,
      stats,
      specialAbility
    });
    
    await character.save();
    
    res.json(character);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Gacha pull
exports.gachaPull = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user has enough coins
    if (user.coins < 10) {
      return res.status(400).json({ msg: 'Not enough coins' });
    }
    
    // Deduct coins
    user.coins -= 10;
    
    // Get all characters with their drop rates
    const characters = await Character.find();
    
    // Calculate weighted probability
    const weightedCharacters = [];
    
    characters.forEach(character => {
      for (let i = 0; i < character.dropRate; i++) {
        weightedCharacters.push(character);
      }
    });
    
    // Randomly select a character
    const randomIndex = Math.floor(Math.random() * weightedCharacters.length);
    const selectedCharacter = weightedCharacters[randomIndex];
    
    // Check if user already has this character
    if (!user.characters.includes(selectedCharacter._id)) {
      user.characters.push(selectedCharacter._id);
    }
    
    await user.save();
    
    res.json({ 
      character: selectedCharacter,
      newCharacter: !user.characters.includes(selectedCharacter._id),
      remainingCoins: user.coins
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Multi-pull (10+1)
exports.multiPull = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user has enough coins
    if (user.coins < 100) {
      return res.status(400).json({ msg: 'Not enough coins' });
    }
    
    // Deduct coins
    user.coins -= 100;
    
    // Get all characters with their drop rates
    const characters = await Character.find();
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    
    // Calculate weighted probability
    const weightedCharactersByRarity = {};
    
    rarities.forEach(rarity => {
      weightedCharactersByRarity[rarity] = [];
    });
    
    characters.forEach(character => {
      for (let i = 0; i < character.dropRate; i++) {
        weightedCharactersByRarity[character.rarity].push(character);
      }
    });
    
    // Pull 10+1 characters (guaranteed at least one rare or higher)
    const pulls = [];
    let hasRareOrBetter = false;
    
    // First do 10 pulls
    for (let i = 0; i < 10; i++) {
      const rarityRoll = Math.random() * 100;
      let rarity;
      
      if (rarityRoll < 70) {
        rarity = 'common';
      } else if (rarityRoll < 90) {
        rarity = 'rare';
        hasRareOrBetter = true;
      } else if (rarityRoll < 98) {
        rarity = 'epic';
        hasRareOrBetter = true;
      } else {
        rarity = 'legendary';
        hasRareOrBetter = true;
      }
      
      const pool = weightedCharactersByRarity[rarity];
      const randomIndex = Math.floor(Math.random() * pool.length);
      const selectedCharacter = pool[randomIndex];
      
      pulls.push(selectedCharacter);
      
      // Check if user already has this character
      if (!user.characters.includes(selectedCharacter._id)) {
        user.characters.push(selectedCharacter._id);
      }
    }
    
    // If no rare or better, guarantee the 11th pull is at least rare
    let rarity;
    if (!hasRareOrBetter) {
      const rarityRoll = Math.random() * 100;
      
      if (rarityRoll < 80) {
        rarity = 'rare';
      } else if (rarityRoll < 95) {
        rarity = 'epic';
      } else {
        rarity = 'legendary';
      }
    } else {
      // Normal rates for the bonus pull
      const rarityRoll = Math.random() * 100;
      
      if (rarityRoll < 70) {
        rarity = 'common';
      } else if (rarityRoll < 90) {
        rarity = 'rare';
      } else if (rarityRoll < 98) {
        rarity = 'epic';
      } else {
        rarity = 'legendary';
      }
    }
    
    const pool = weightedCharactersByRarity[rarity];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const bonusCharacter = pool[randomIndex];
    
    pulls.push(bonusCharacter);
    
    // Check if user already has this character
    if (!user.characters.includes(bonusCharacter._id)) {
      user.characters.push(bonusCharacter._id);
    }
    
    await user.save();
    
    res.json({ 
      pulls,
      remainingCoins: user.coins
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 