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
                await this.login(email, password);
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
                await this.register(username, email, password);
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
    
    // Check if user is logged in
    checkAuthStatus: function() {
        const token = localStorage.getItem('token');
        
        if (token) {
            this.fetchUserData()
                .then(() => {
                    this.showMainMenu();
                })
                .catch(() => {
                    this.logout();
                });
        } else {
            this.showLoginSection();
        }
    },
    
    // Fetch user data
    fetchUserData: async function() {
        try {
            this.currentUser = await api.getUserData();
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
            const data = await api.login({ email, password });
            localStorage.setItem('token', data.token);
            await this.fetchUserData();
            this.showMainMenu();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Register user
    register: async function(username, email, password) {
        try {
            const data = await api.register({ username, email, password });
            localStorage.setItem('token', data.token);
            await this.fetchUserData();
            this.showMainMenu();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },
    
    // Logout user
    logout: function() {
        localStorage.removeItem('token');
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
        }
    },
    
    // Update user high score
    updateHighScore: function(score) {
        if (this.currentUser && score > this.currentUser.highScore) {
            this.currentUser.highScore = score;
            document.getElementById('user-high-score').querySelector('span').textContent = score;
        }
    }
}; 