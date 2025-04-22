const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const userRoutes = require('./server/routes/userRoutes');
const characterRoutes = require('./server/routes/characterRoutes');
const scoreRoutes = require('./server/routes/scoreRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://luolee486:B88or2WoxpoZj1R9@cluster0.8i9iafn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/scores', scoreRoutes);

// Serve the game
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 