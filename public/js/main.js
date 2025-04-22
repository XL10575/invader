// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create character placeholder images
        createCharacterPlaceholders();
        
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

// Create placeholder images for characters
function createCharacterPlaceholders() {
    // Create placeholder images with colored rectangles for each character
    const colors = {
        common: '#aaaaaa',
        rare: '#3498db',
        epic: '#9b59b6',
        legendary: '#f1c40f'
    };
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // For each character in the characterData
    characterData.forEach(character => {
        // Set the color based on rarity
        const color = colors[character.rarity] || '#ffffff';
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw character shape (just a simple colored rectangle with initial)
        ctx.fillStyle = color;
        ctx.fillRect(10, 10, 80, 80);
        
        // Draw character initial
        ctx.fillStyle = '#000000';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(character.name.charAt(0), 50, 50);
        
        // Set the character image to the canvas data URL
        character.image = canvas.toDataURL('image/png');
    });
} 