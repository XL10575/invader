// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize Auth module
        Auth.init();
        
        // Initialize Game module
        Game.init();
        
        // Initialize Gacha module
        Gacha.init();
        
        // Initialize Characters module
        Characters.init();
        
        // Initialize Leaderboard module
        Leaderboard.init();
        
        console.log('Space Invaders Gacha initialized successfully');
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
}); 