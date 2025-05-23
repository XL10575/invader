// Utility to check if character images are loading properly
function checkCharacterImages() {
    console.log("Checking character image paths...");
    console.log("Current location:", window.location.href);
    
    // Check if the characterData is defined
    if (typeof characterData === 'undefined') {
        console.error("Character data not found. Aborting image check.");
        return;
    }
    
    // For debugging purposes, list all characters and their image paths
    console.log("All characters:", characterData.map(c => ({
        name: c.name,
        imagePath: c.image,
        alreadyHasFallback: c.image && c.image.startsWith('data:image')
    })));
    
    // For each character, check if the image is already a data URL
    // and only try to load if it's not
    characterData.forEach(character => {
        // Skip if image is already a data URL (means fallback is applied)
        if (character.image && character.image.startsWith('data:image')) {
            console.log(`Character ${character.name} already has a fallback image`);
            character._usedFallback = true;
            character._imageLoaded = true;
            
            // Update in-game character if needed
            updateInGameCharacterIfNeeded(character);
            return;
        }
        
        // Log detailed debugging information
        console.log(`Processing character: ${character.name}, image path: ${character.image}`);
        
        // Try to load the image
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Image loaded successfully for ${character.name}: ${character.image}`);
            // Store the information that this image is loaded correctly
            character._imageLoaded = true;
            
            // Update in-game character if this is the current character
            updateInGameCharacterIfNeeded(character);
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load image for ${character.name}: ${character.image}`);
            
            // If character has generatedFallback, use that
            if (character.generatedFallback) {
                console.log(`Using pre-generated fallback for ${character.name}`);
                character.image = character.generatedFallback;
                character.fallbackImage = character.generatedFallback;
                character._usedFallback = true;
            } else {
                console.log(`Creating new fallback for ${character.name}...`);
                // Image failed to load, create a fallback right away
                createDynamicImage(character);
            }
            
            // Update in-game character if this is the current character
            updateInGameCharacterIfNeeded(character);
        };
        
        // Set the source (this will trigger onload or onerror)
        img.src = character.image;
    });
    
    // Check if any character is using the default character in-game
    if (typeof Game !== 'undefined' && Game && Game.player && Game.player.character) {
        console.log("Current in-game character:", Game.player.character.name);
        if (!Game.player.image || !Game.player.image.complete || Game.player.image.naturalWidth === 0) {
            console.log("In-game character image not loaded, creating fallback...");
            
            // Use pre-generated fallback if available
            if (Game.player.character.generatedFallback) {
                console.log("Using pre-generated fallback for in-game character");
                Game.player.image.src = Game.player.character.generatedFallback;
            } else if (typeof Game.createFallbackImage === 'function') {
                console.log("Creating new fallback for in-game character");
                Game.createFallbackImage(Game.player.character);
            }
            
            // Also update the character display in the UI
            if (Game.characterDisplay) {
                Game.updateCharacterDisplay();
            }
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

// Update in-game character image if this is the current character
function updateInGameCharacterIfNeeded(character) {
    if (typeof Game !== 'undefined' && Game && Game.player && Game.player.character && 
        Game.player.character._id === character._id) {
        
        console.log("Updating in-game character image");
        
        // Update the player image
        Game.player.image.src = character.image;
        
        // Also update the character display in the UI
        if (Game.characterDisplay) {
            Game.updateCharacterDisplay();
        }
    }
}

// Retry loading in-game character images if they failed initially
function retryInGameCharacterImage() {
    if (typeof Game !== 'undefined' && Game && Game.player && Game.player.character) {
        const character = Game.player.character;
        
        if (!Game.player.image || !Game.player.image.complete || Game.player.image.naturalWidth === 0) {
            console.log("Retrying in-game character image load");
            
            // Use pre-generated fallback if available
            if (character.generatedFallback) {
                console.log("Using pre-generated fallback for in-game character");
                Game.player.image.src = character.generatedFallback;
            } else if (character.fallbackImage) {
                console.log("Using existing fallback for in-game character");
                Game.player.image.src = character.fallbackImage;
            } else {
                console.log("Creating new fallback for in-game character");
                
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
                const dataURL = canvas.toDataURL('image/png');
                Game.player.image.src = dataURL;
                
                // Store this as a fallback for the character
                character.fallbackImage = dataURL;
                
                console.log("Created fallback for in-game character");
            }
            
            // Also update the character display in the UI
            if (Game.characterDisplay) {
                Game.updateCharacterDisplay();
            }
        }
    }
}

// Pre-load all character images when viewing the gallery
function preloadCharacterGalleryImages() {
    // Check if the Characters object exists
    if (typeof Characters === 'undefined' || !Characters.characters || !Characters.characters.length) {
        console.log("Characters gallery not yet available, skipping preload");
        return;
    }
    
    console.log("Preloading images for character gallery");
    
    // For each character in the gallery
    Characters.characters.forEach(character => {
        // Skip if image is already a data URL (means fallback is applied)
        if (character.image && character.image.startsWith('data:image')) {
            console.log(`Character ${character.name} already has a data URL image`);
            return;
        }
        
        // Try to load the image
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Gallery image loaded for ${character.name}`);
            character._imageLoaded = true;
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load gallery image for ${character.name}`);
            
            // If character has generatedFallback, use that
            if (character.generatedFallback) {
                console.log(`Using pre-generated fallback for ${character.name} in gallery`);
                character.image = character.generatedFallback;
                character.fallbackImage = character.generatedFallback;
                character._usedFallback = true;
            }
        };
        
        // Set the source (this will trigger onload or onerror)
        img.src = character.image;
    });
}

// Run the check when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to let other scripts initialize
    setTimeout(() => {
        checkCharacterImages();
        
        // Try to fix in-game character image after a few seconds
        setTimeout(retryInGameCharacterImage, 2000);
        
        // Add repeated checks to handle game initialization
        const intervalId = setInterval(() => {
            if (typeof Game !== 'undefined' && Game && Game.player && Game.player.character) {
                retryInGameCharacterImage();
                clearInterval(intervalId); // Stop checking once we've fixed the game character
            }
        }, 500);
    }, 1000);
    
    // Add repeated checks for UI updates
    setInterval(() => {
        if (typeof Game !== 'undefined' && Game && Game.player && Game.player.character && Game.characterDisplay) {
            Game.updateCharacterDisplay();
            if (typeof Game.updateAbilityCooldown === 'function') {
                Game.updateAbilityCooldown();
            }
        }
        
        // Check if Characters gallery is open and preload images if needed
        if (typeof Characters !== 'undefined' && Characters.characters && 
            !document.getElementById('characters-section').classList.contains('hide')) {
            preloadCharacterGalleryImages();
        }
    }, 1000);
});

// Add event listener for character gallery button clicks
document.addEventListener('DOMContentLoaded', () => {
    // Listen for clicks on the characters button
    const charactersBtn = document.getElementById('characters-btn');
    if (charactersBtn) {
        charactersBtn.addEventListener('click', () => {
            // Run preload after a short delay to allow the gallery to initialize
            setTimeout(preloadCharacterGalleryImages, 500);
        });
    }
}); 