/**
 * Utility function to check character images and provide fallbacks
 */
function checkCharacterImages() {
    console.log("Running character image check");
    console.log("Current location:", window.location.href);
    
    // Check if we're running on Heroku or similar deployment
    const isDeployed = window.location.href.includes('herokuapp.com') || 
                       !window.location.href.includes('localhost');
    
    // Get all characters  
    let characters = [];
    try {
        characters = window.characterData || [];
        if (characters.length === 0) {
            console.error("No character data available");
        }
    } catch (e) {
        console.error("Error accessing character data:", e);
        return;
    }
    
    // Log all characters for debugging
    console.log("All characters:", characters.map(c => c.name));
    
    // Process each character for image loading
    characters.forEach(character => {
        console.log(`Processing character: ${character.name}, Image path: ${character.image}`);

        // Create an image element to test loading
        const img = new Image();
        
        img.onload = function() {
            console.log(`✅ Image loaded successfully for: ${character.name}`);
            
            // Update any in-game character that might be using this character
            retryInGameCharacterImage(character);
        };
        
        img.onerror = function() {
            console.log(`❌ Failed to load image for: ${character.name}`);
            
            // Use the pre-generated fallback if available
            if (character.generatedFallback) {
                console.log(`Using pre-generated fallback for: ${character.name}`);
                character.fallbackImage = character.generatedFallback;
                retryInGameCharacterImage(character);
            } else {
                // Create a fallback image if no pre-generated one exists
                console.log(`Creating dynamic fallback for: ${character.name}`);
                
                // Get color based on rarity
                let color = '#aaaaaa'; // default/common
                if (character.rarity === 'rare') color = '#3498db';
                if (character.rarity === 'epic') color = '#9b59b6';
                if (character.rarity === 'legendary') color = '#f1c40f';
                
                // Create a canvas to draw the fallback
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext('2d');
                
                // Draw colored background
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 100, 100);
                
                // Draw text (first character of name)
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(character.name.charAt(0), 50, 50);
                
                // Convert to data URL
                character.fallbackImage = canvas.toDataURL('image/png');
                
                // Update any in-game character
                retryInGameCharacterImage(character);
            }
        };
        
        // Start loading the image
        img.src = character.image;
    });
}

// Function to update in-game character images if they failed to load
function retryInGameCharacterImage(character) {
    // Check if we have a player with this character
    if (window.game && window.game.player && window.game.player.character && 
        window.game.player.character.name === character.name) {
        
        console.log(`Updating in-game player character: ${character.name}`);
        
        // If we have a fallback image, use it
        if (character.fallbackImage) {
            // Create a new image with the fallback
            const playerImg = new Image();
            playerImg.onload = function() {
                window.game.player.image = playerImg;
                console.log(`Player image updated with fallback for ${character.name}`);
            };
            playerImg.src = character.fallbackImage;
        }
    }
    
    // Also check character gallery
    preloadCharacterGalleryImages();
}

// Function to preload images for the character gallery
function preloadCharacterGalleryImages() {
    // Only run if we're on the character gallery page
    const galleryContainer = document.querySelector('.characters-container');
    if (!galleryContainer) return;
    
    console.log("Preloading character gallery images");
    
    // Get all character cards
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach(card => {
        const imgEl = card.querySelector('.character-img');
        const nameEl = card.querySelector('.character-name');
        
        if (imgEl && nameEl) {
            const characterName = nameEl.textContent.trim();
            const character = window.characterData.find(c => c.name === characterName);
            
            if (character && character.fallbackImage && imgEl.naturalWidth === 0) {
                console.log(`Updating gallery image for ${characterName}`);
                imgEl.src = character.fallbackImage;
            }
        }
    });
}

// Run checks when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, running character image checks");
    
    // Wait a bit to allow other scripts to initialize
    setTimeout(function() {
        checkCharacterImages();
        
        // Set interval to periodically check
        setInterval(checkCharacterImages, 5000);
    }, 1000);
}); 