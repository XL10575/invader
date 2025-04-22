const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: true
  },
  dropRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  stats: {
    speed: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    fireRate: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    health: {
      type: Number,
      required: true,
      min: 1
    },
    damage: {
      type: Number,
      required: true,
      min: 1
    }
  },
  specialAbility: {
    name: String,
    description: String,
    cooldown: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character; 