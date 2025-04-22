// API Base URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Helper function for making API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
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
        return apiRequest('/characters');
    },
    
    getCharacter: async (id) => {
        return apiRequest(`/characters/${id}`);
    },
    
    selectCharacter: async (characterId) => {
        const token = localStorage.getItem('token');
        return apiRequest('/users/select-character', 'PUT', { characterId }, token);
    },
    
    gachaPull: async () => {
        const token = localStorage.getItem('token');
        return apiRequest('/characters/gacha', 'POST', {}, token);
    },
    
    multiPull: async () => {
        const token = localStorage.getItem('token');
        return apiRequest('/characters/multi-gacha', 'POST', {}, token);
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
        const token = localStorage.getItem('token');
        return apiRequest('/users/high-score', 'PUT', { score }, token);
    },
    
    updateCoins: async (coins) => {
        const token = localStorage.getItem('token');
        return apiRequest('/users/coins', 'PUT', { coins }, token);
    }
}; 