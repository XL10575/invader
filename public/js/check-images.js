// Utility to check if character images are loading properly
function checkCharacterImages() {
    console.log("Checking character image paths...");
    console.log("Current location:", window.location.href);
    
    // For debugging purposes, list all characters and their image paths
    console.log("All characters:", characterData.map(c => ({
        name: c.name,
        imagePath: c.image 
    })));
    
    // For each character, fix image paths and create fallbacks if needed
    characterData.forEach(character => {
        // Log detailed debugging information
        console.log(`Processing character: ${character.name}, image path: ${character.image}`);
        
        // Try to load the image
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Image loaded successfully for ${character.name}: ${character.image}`);
            // Store the information that this image is loaded correctly
            character._imageLoaded = true;
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load image for ${character.name}: ${character.image}`);
            console.log(`Creating fallback for ${character.name}...`);
            
            // Image failed to load, create a fallback right away
            createDynamicImage(character);
            
            // Store the information that fallback was used
            character._usedFallback = true;
        };
        
        // Set the source (this will trigger onload or onerror)
        img.src = character.image;
    });
    
    // Check if any character is using the default character in-game
    if (Game && Game.player && Game.player.character) {
        console.log("Current in-game character:", Game.player.character.name);
        if (!Game.player.image || !Game.player.image.complete || Game.player.image.naturalWidth === 0) {
            console.log("In-game character image not loaded, creating fallback...");
            Game.createFallbackImage(Game.player.character);
        }
    }
}

// Create a dynamic image for a character based on their rarity
function createDynamicImage(character) {
    console.log(`Creating dynamic image for ${character.name}`);
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Color based on rarity
    const colors = {
        common: '#aaaaaa',
        rare: '#3498db',
        epic: '#9b59b6',
        legendary: '#f1c40f'
    };
    
    // Set the color based on rarity
    const color = colors[character.rarity] || '#ffffff';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw character shape
    ctx.fillStyle = color;
    ctx.fillRect(10, 10, 80, 80);
    
    // Draw character initial
    ctx.fillStyle = '#000000';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character.name.charAt(0), 50, 50);
    
    // Set the character image to the canvas data URL
    const dataURL = canvas.toDataURL('image/png');
    character.image = dataURL;
    
    // Store this as a fallback image too
    character.fallbackImage = dataURL;
    
    console.log(`✅ Created dynamic image for ${character.name}`);
}

// Retry loading in-game character images if they failed initially
function retryInGameCharacterImage() {
    if (Game && Game.player && Game.player.character) {
        const character = Game.player.character;
        
        if (!Game.player.image || !Game.player.image.complete || Game.player.image.naturalWidth === 0) {
            console.log("Retrying in-game character image load");
            
            // Create a dynamic image for the current character
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            
            // Color based on rarity
            const colors = {
                common: '#aaaaaa',
                rare: '#3498db',
                epic: '#9b59b6',
                legendary: '#f1c40f'
            };
            
            // Set the color based on rarity
            const color = colors[character.rarity] || '#ffffff';
            
            // Draw character shape
            ctx.fillStyle = color;
            ctx.fillRect(10, 10, 80, 80);
            
            // Draw character initial
            ctx.fillStyle = '#000000';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(character.name.charAt(0), 50, 50);
            
            // Update the in-game character image
            Game.player.image.src = canvas.toDataURL('image/png');
            
            console.log("Created fallback for in-game character");
        }
    }
}

// Run the check when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to let other scripts initialize
    setTimeout(() => {
        checkCharacterImages();
        
        // Try to fix in-game character image after a few seconds
        setTimeout(retryInGameCharacterImage, 2000);
    }, 1000);
}); 