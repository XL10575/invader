// Utility to check if character images are loading properly
function checkCharacterImages() {
    console.log("Checking character image paths...");
    
    // For each character, directly use proper image paths
    characterData.forEach(character => {
        // Make sure the image path is correct
        if (!character.image.startsWith('http') && !character.image.startsWith('data:')) {
            // Make path absolute from root
            if (!character.image.startsWith('/')) {
                character.image = '/' + character.image;
            }
        }
        
        const img = new Image();
        const imgPath = character.image;
        
        img.onload = () => {
            console.log(`✅ Image loaded: ${imgPath} for ${character.name}`);
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load image: ${imgPath} for ${character.name}`);
            console.log(`Using fallback mechanism for ${character.name}...`);
            
            // Try fallback image
            if (character.fallbackImage) {
                console.log(`Trying fallback image: ${character.fallbackImage}`);
                
                // Make fallback path absolute
                let fallbackPath = character.fallbackImage;
                if (!fallbackPath.startsWith('http') && !fallbackPath.startsWith('data:') && !fallbackPath.startsWith('/')) {
                    fallbackPath = '/' + fallbackPath;
                }
                
                const fallbackImg = new Image();
                fallbackImg.onload = () => {
                    console.log(`✅ Fallback image loaded for ${character.name}`);
                    character.image = fallbackPath;
                };
                
                fallbackImg.onerror = () => {
                    console.error(`❌ Fallback image also failed for ${character.name}. Creating dynamic image.`);
                    createDynamicImage(character);
                };
                
                fallbackImg.src = fallbackPath;
                character.fallbackImage = fallbackPath;
            } else {
                createDynamicImage(character);
            }
        };
        
        img.src = imgPath;
    });
}

// Create a dynamic image for a character based on their rarity
function createDynamicImage(character) {
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
    character.image = canvas.toDataURL('image/png');
    console.log(`✅ Created dynamic image for ${character.name}`);
}

// Run the check when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to let other scripts initialize
    setTimeout(checkCharacterImages, 1000);
}); 