const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  characterUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  playTime: {
    type: Number, // Time in seconds
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for faster querying
ScoreSchema.index({ score: -1 });
ScoreSchema.index({ userId: 1, score: -1 });

const Score = mongoose.model('Score', ScoreSchema);

module.exports = Score; 