// API Base URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Helper function for making API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    // For demo purposes, we'll mock some responses
    if (endpoint.includes('/characters')) {
        return mockCharacterAPI(endpoint, method, data);
    }

    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['x-auth-token'] = token;
    }

    const config = {
        method,
        headers
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.msg || 'Something went wrong');
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Mock character API for local testing
function mockCharacterAPI(endpoint, method, data) {
    // Simulate network delay
    return new Promise(resolve => {
        setTimeout(() => {
            if (endpoint === '/characters') {
                // Get all characters
                resolve(characterData);
            } else if (endpoint.includes('/characters/gacha')) {
                // Handle gacha pull
                const randomIndex = Math.floor(Math.random() * characterData.length);
                const character = characterData[randomIndex];
                
                // Check if user already has this character
                const isNew = !Auth.currentUser.characters.find(c => c._id === character._id);
                
                // Add character to user's collection if it's new
                if (isNew) {
                    Auth.currentUser.characters.push(character);
                }
                
                // Deduct 10 coins
                Auth.currentUser.coins -= 10;
                
                resolve({
                    character,
                    newCharacter: isNew,
                    remainingCoins: Auth.currentUser.coins
                });
            } else if (endpoint.includes('/characters/multi-gacha')) {
                // Handle multi-pull (10+1)
                const pulls = [];
                const usedIndexes = new Set();
                
                // Guarantee at least one rare or higher character
                let guaranteedPull = null;
                do {
                    const idx = Math.floor(Math.random() * characterData.length);
                    const char = characterData[idx];
                    if (char.rarity !== 'common') {
                        guaranteedPull = char;
                        usedIndexes.add(idx);
                        break;
                    }
                } while (!guaranteedPull);
                
                pulls.push(guaranteedPull);
                
                // Add 10 more random pulls
                for (let i = 0; i < 10; i++) {
                    let idx;
                    do {
                        idx = Math.floor(Math.random() * characterData.length);
                    } while (usedIndexes.has(idx));
                    
                    usedIndexes.add(idx);
                    pulls.push(characterData[idx]);
                }
                
                // Check for new characters and add them to user's collection
                pulls.forEach(character => {
                    const isNew = !Auth.currentUser.characters.find(c => c._id === character._id);
                    if (isNew) {
                        Auth.currentUser.characters.push(character);
                    }
                });
                
                // Deduct 100 coins
                Auth.currentUser.coins -= 100;
                
                resolve({
                    pulls,
                    remainingCoins: Auth.currentUser.coins
                });
            }
        }, 500); // 500ms delay to simulate network
    });
}

// Auth API Functions
const api = {
    // Auth
    register: async (userData) => {
        return apiRequest('/users/register', 'POST', userData);
    },
    
    login: async (userData) => {
        return apiRequest('/users/login', 'POST', userData);
    },
    
    getUserData: async () => {
        const token = localStorage.getItem('token');
        return apiRequest('/users/me', 'GET', null, token);
    },

    // Characters
    getAllCharacters: async () => {
        return characterData; // Return mock character data directly
    },
    
    getCharacter: async (id) => {
        return characterData.find(char => char._id === id);
    },
    
    selectCharacter: async (characterId) => {
        // Check if character exists and is owned
        const character = characterData.find(char => char._id === characterId);
        const isOwned = Auth.currentUser.characters.some(c => c._id === characterId);
        
        if (!character || !isOwned) {
            throw new Error('Character not found or not owned');
        }
        
        // Update selected character
        Auth.currentUser.selectedCharacter = character;
        
        return { success: true };
    },
    
    gachaPull: async () => {
        // Mock gacha pull with local data
        return mockCharacterAPI('/characters/gacha', 'POST', {});
    },
    
    multiPull: async () => {
        // Mock multi gacha pull with local data
        return mockCharacterAPI('/characters/multi-gacha', 'POST', {});
    },

    // Scores
    submitScore: async (scoreData) => {
        const token = localStorage.getItem('token');
        return apiRequest('/scores', 'POST', scoreData, token);
    },
    
    getUserScores: async () => {
        const token = localStorage.getItem('token');
        return apiRequest('/scores/me', 'GET', null, token);
    },
    
    getLeaderboard: async () => {
        return apiRequest('/scores/leaderboard');
    },
    
    updateHighScore: async (score) => {
        // Update local high score
        if (!Auth.currentUser.highScore || score > Auth.currentUser.highScore) {
            Auth.currentUser.highScore = score;
        }
        return { success: true, highScore: Auth.currentUser.highScore };
    },
    
    updateCoins: async (coins) => {
        // Update local coins
        Auth.currentUser.coins = coins;
        return { success: true, coins: Auth.currentUser.coins };
    }
}; 