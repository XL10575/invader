# Space Invaders Gacha

A modern take on the classic Space Invaders game with a gacha mechanic, allowing players to collect different ships with unique abilities and stats.

## Features

- Classic Space Invaders gameplay
- User authentication system
- Gacha system for collecting different ship characters
- Character selection with unique stats and abilities
- Leaderboard system
- Responsive design for various screen sizes

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Heroku

## Prerequisites

- Node.js (v14 or later)
- MongoDB Atlas account or local MongoDB installation
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/space-invaders-gacha.git
   cd space-invaders-gacha
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   PORT=3000
   ```

4. Seed the database with initial characters:
   ```
   node server/seedData.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Deployment to Heroku

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI
3. Login to Heroku via CLI:
   ```
   heroku login
   ```
4. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
5. Add MongoDB add-on or set your MongoDB URI:
   ```
   heroku config:set MONGODB_URI=your_mongodb_uri
   ```
6. Set the JWT secret:
   ```
   heroku config:set JWT_SECRET=your_jwt_secret
   ```
7. Push to Heroku:
   ```
   git push heroku main
   ```

## Game Instructions

1. Register or login to your account
2. Navigate to the Characters section to select your ship
3. Use the Gacha section to pull for new ships
4. Play the game with your selected ship
5. Earn coins based on your score (1 coin per 100 points)
6. Check the leaderboard to see how you compare with other players

## Controls

- **Left/Right Arrow Keys or A/D:** Move ship
- **Spacebar:** Fire
- **ESC:** Pause game

## Adding More Characters

To add more characters, you can modify the `server/seedData.js` file and run it again, or use the API endpoint to create characters:

```
POST /api/characters
```

With the following JSON body:
```json
{
  "name": "Character Name",
  "description": "Character description",
  "image": "/assets/ships/image_name.png",
  "rarity": "common|rare|epic|legendary",
  "dropRate": 10,
  "stats": {
    "speed": 5,
    "fireRate": 5,
    "health": 3,
    "damage": 1
  },
  "specialAbility": {
    "name": "Ability Name",
    "description": "Ability description",
    "cooldown": 15
  }
}
```

## License

MIT License

## Author

Your Name 