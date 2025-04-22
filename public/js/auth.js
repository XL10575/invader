// Auth Controller
const Auth = {
    // Current user data
    currentUser: null,
    
    // Initialize Auth
    init: function() {
        this.setupEventListeners();
        this.checkAuthStatus();
    },
    
    // Setup event listeners for login/register forms
    setupEventListeners: function() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.form-content form').forEach(form => form.classList.remove('active'));
                document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
            });
        });
        
        // Login form
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                // Check if user exists in localStorage
                const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '{}');
                if (savedUsers[email]) {
                    // Load existing user
                    this.loadUser(savedUsers[email]);
                    alert(`Welcome back, ${savedUsers[email].username}!`);
                } else {
                    // Create new user if not found
                    await this.createMockUser(email);
                    alert('New account created!');
                }
            } catch (error) {
                alert(error.message);
            }
        });
        
        // Register form
        const registerForm = document.getElementById('register-form');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            try {
                // Check if user already exists
                const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '{}');
                if (savedUsers[email]) {
                    alert('An account with this email already exists. Please login instead.');
                } else {
                    // Create new user
                    await this.createMockUser(email, username);
                    alert('Account created successfully!');
                }
            } catch (error) {
                alert(error.message);
            }
        });
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => {
            this.logout();
        });
    },
    
    // Create a mock user for testing
    createMockUser: async function(email, username = 'Player') {
        // Create a mock user with default character
        let defaultChar = characterData.find(char => char._id === defaultCharacters[0]);
        
        if (!defaultChar) {
            console.error("Default character not found! Using first character instead.");
            defaultChar = characterData[0];
        }
        
        this.currentUser = {
            email: email,
            username: username,
            coins: 10, // Changed from 500 to 10
            highScore: 0,
            characters: [defaultChar],
            selectedCharacter: defaultChar
        };
        
        // Save to localStorage
        this.saveUser();
        
        this.showMainMenu();
        return this.currentUser;
    },
    
    // Save current user data to localStorage
    saveUser: function() {
        if (!this.currentUser) return;
        
        // Get all saved users
        const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '{}');
        
        // Update this user's data
        savedUsers[this.currentUser.email] = this.currentUser;
        
        // Save back to localStorage
        localStorage.setItem('savedUsers', JSON.stringify(savedUsers));
        
        // Also save current user email for session
        localStorage.setItem('currentUserEmail', this.currentUser.email);
    },
    
    // Load user data from localStorage
    loadUser: function(userData) {
        this.currentUser = userData;
        
        // Save current user email for session
        localStorage.setItem('currentUserEmail', this.currentUser.email);
        
        this.showMainMenu();
    },
    
    // Check auth status
    checkAuthStatus: function() {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        
        if (currentUserEmail) {
            const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '{}');
            if (savedUsers[currentUserEmail]) {
                // Auto-login with saved data
                this.loadUser(savedUsers[currentUserEmail]);
                return;
            }
        }
        
        // If no saved user or invalid data, show login
        this.showLoginSection();
    },
    
    // Fetch user data
    fetchUserData: async function() {
        try {
            if (!this.currentUser) {
                throw new Error("No user data available");
            }
            
            document.getElementById('user-coins').querySelector('span').textContent = this.currentUser.coins;
            document.getElementById('user-high-score').querySelector('span').textContent = this.currentUser.highScore;
            return this.currentUser;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    },
    
    // Login user
    login: async function(email, password) {
        try {
            // Try to find user in saved users
            const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '{}');
            if (savedUsers[email]) {
                this.loadUser(savedUsers[email]);
                return this.currentUser;
            } else {
                // Create new user if not found
                return this.createMockUser(email);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Register user
    register: async function(username, email, password) {
        try {
            // Check if user already exists
            const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '{}');
            if (savedUsers[email]) {
                throw new Error('User already exists');
            }
            
            // Create new user
            return this.createMockUser(email, username);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },
    
    // Logout user
    logout: function() {
        // Remove current user email but keep user data
        localStorage.removeItem('currentUserEmail');
        this.currentUser = null;
        this.showLoginSection();
    },
    
    // Show login section
    showLoginSection: function() {
        document.querySelectorAll('.section').forEach(section => section.classList.add('hide'));
        document.getElementById('login-section').classList.remove('hide');
        
        // Clear forms
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
    },
    
    // Show main menu
    showMainMenu: function() {
        document.querySelectorAll('.section').forEach(section => section.classList.add('hide'));
        document.getElementById('main-menu').classList.remove('hide');
        
        // Update user info
        if (this.currentUser) {
            document.getElementById('user-coins').querySelector('span').textContent = this.currentUser.coins;
            document.getElementById('user-high-score').querySelector('span').textContent = this.currentUser.highScore;
        }
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
        return this.currentUser !== null;
    },
    
    // Update user coins
    updateCoins: function(coins) {
        if (this.currentUser) {
            this.currentUser.coins = coins;
            document.getElementById('user-coins').querySelector('span').textContent = coins;
            document.getElementById('game-coins').querySelector('span').textContent = coins;
            
            if (document.getElementById('gacha-user-coins')) {
                document.getElementById('gacha-user-coins').querySelector('span').textContent = coins;
            }
            
            // Save updated data
            this.saveUser();
        }
    },
    
    // Update user high score
    updateHighScore: function(score) {
        if (this.currentUser && score > this.currentUser.highScore) {
            this.currentUser.highScore = score;
            document.getElementById('user-high-score').querySelector('span').textContent = score;
            
            // Save updated data
            this.saveUser();
        }
    }
}; 