// Character Data from Italian Brainrot
const characterData = [
    {
        _id: "char1",
        name: "Tralalero Tralala",
        description: "An AI-generated shark wearing Nike sneakers with incredible speed and agility.",
        image: "/img/characters/tralalero.png",
        fallbackImage: "/img/default.png",
        rarity: "legendary",
        stats: {
            speed: 8,
            fireRate: 5,
            health: 3,
            damage: 2
        },
        specialAbility: {
            name: "Shark Dash",
            description: "Increases speed dramatically and makes you invulnerable for 3 seconds",
            cooldown: 20
        }
    },
    {
        _id: "char2",
        name: "Bombardiro Crocodilo",
        description: "An anthropomorphic crocodile fused with a military bomber plane—complete with wings, bombs, and a warplane body.",
        image: "/img/characters/bombardiro.png",
        fallbackImage: "/img/default.png",
        rarity: "epic",
        stats: {
            speed: 4,
            fireRate: 3,
            health: 4,
            damage: 4
        },
        specialAbility: {
            name: "Carpet Bombing",
            description: "Drops multiple bombs in sequence that destroy enemies below you",
            cooldown: 25
        }
    },
    {
        _id: "char3",
        name: "Tung Tung Sahur",
        description: "A surreal character often shown wielding a baseball bat. Known for incredible attack power.",
        image: "/img/characters/tungtung.png",
        fallbackImage: "/img/default.png",
        rarity: "rare",
        stats: {
            speed: 3,
            fireRate: 2,
            health: 3,
            damage: 5
        },
        specialAbility: {
            name: "Bat Swing",
            description: "Reflects incoming enemy bullets back at enemies for 3 seconds",
            cooldown: 15
        }
    },
    {
        _id: "char4",
        name: "Lirili Larila",
        description: "A cactus-elephant hybrid, walking on two feet that sport sandals. Highly resistant to damage.",
        image: "/img/characters/lirili.png",
        fallbackImage: "/img/default.png",
        rarity: "epic",
        stats: {
            speed: 2,
            fireRate: 3,
            health: 6,
            damage: 2
        },
        specialAbility: {
            name: "Cactus Shield",
            description: "Creates a shield that protects from enemy bullets for 5 seconds",
            cooldown: 20
        }
    },
    {
        _id: "char5",
        name: "Boneca Ambalabu",
        description: "A frog-tire hybrid with human legs—a whimsical AI-generated Indonesian brainrot character.",
        image: "/img/characters/boneca.png",
        fallbackImage: "/img/default.png",
        rarity: "rare",
        stats: {
            speed: 6,
            fireRate: 4,
            health: 3,
            damage: 2
        },
        specialAbility: {
            name: "Rubber Bounce",
            description: "Bounces all incoming projectiles back at enemies for 3 seconds",
            cooldown: 18
        }
    },
    {
        _id: "char6",
        name: "Brr Brr Patapim",
        description: "A creature that's part forest tree, part long-nosed monkey, with oversized human feet.",
        image: "/img/characters/brrbrr.png",
        fallbackImage: "/img/default.png",
        rarity: "common",
        stats: {
            speed: 5,
            fireRate: 5,
            health: 3,
            damage: 1
        },
        specialAbility: {
            name: "Wall Regeneration",
            description: "Regenerates all defensive walls to full health instantly",
            cooldown: 15
        }
    },
    {
        _id: "char7",
        name: "Chimpanzini Bananini",
        description: "A chimp-banana fusion—essentially a chimpanzee whose body is half-banana—first popularized on TikTok.",
        image: "/img/characters/chimpanzini.png",
        fallbackImage: "/img/default.png",
        rarity: "rare",
        stats: {
            speed: 6,
            fireRate: 6,
            health: 2,
            damage: 2
        },
        specialAbility: {
            name: "Banana Bullets",
            description: "Fires larger, more powerful bullets for 10 seconds",
            cooldown: 20
        }
    },
    {
        _id: "char8",
        name: "Bombombini Gusini",
        description: "Bombardiro Crocodilo's goose-in-armor brother, equipped with jet engines and grenade launchers on its wings.",
        image: "/img/characters/bombombini.png",
        fallbackImage: "/img/default.png",
        rarity: "epic",
        stats: {
            speed: 5,
            fireRate: 7,
            health: 3,
            damage: 3
        },
        specialAbility: {
            name: "Explosive Round",
            description: "Fires a special explosive bullet that damages enemies in a large area",
            cooldown: 22
        }
    },
    {
        _id: "char9",
        name: "Cappuccino Assassino",
        description: "An anthropomorphic cup of cappuccino wielding dual katanas—renowned for extreme speed and precision.",
        image: "/img/characters/cappuccino.png",
        fallbackImage: "/img/default.png",
        rarity: "legendary",
        stats: {
            speed: 9,
            fireRate: 8,
            health: 2,
            damage: 3
        },
        specialAbility: {
            name: "Coffee Rush",
            description: "Doubles bullet damage for 10 seconds, creating a damaging aura effect",
            cooldown: 30
        }
    },
    {
        _id: "char10",
        name: "Trippi Troppi",
        description: "A hairy, pot-bellied bipedal creature with a fish head, often surrounded by giant mosquitoes in AI-generated memes.",
        image: "/img/characters/trippi.png",
        fallbackImage: "/img/default.png",
        rarity: "rare",
        stats: {
            speed: 4,
            fireRate: 4,
            health: 4,
            damage: 2
        },
        specialAbility: {
            name: "Time Warp",
            description: "Slows down all enemy movement for 5 seconds",
            cooldown: 25
        }
    },
    {
        _id: "char11",
        name: "Frigo Camelo",
        description: "A camel whose body is a refrigerator and whose feet are massive boots, lamenting its 'funny burden' in a narrated rhyme.",
        image: "/img/characters/frigo.png",
        fallbackImage: "/img/default.png",
        rarity: "common",
        stats: {
            speed: 3,
            fireRate: 3,
            health: 5,
            damage: 1
        },
        specialAbility: {
            name: "Cold Storage",
            description: "Freezes all enemies in place for 2 seconds",
            cooldown: 18
        }
    },
    {
        _id: "char12",
        name: "La Vaca Saturno",
        description: "A 'galaxy cow' with Saturn's rings as its body and giant human feet; it can fly and fire black-laser burps.",
        image: "/img/characters/lavaca.png",
        fallbackImage: "/img/default.png",
        rarity: "legendary",
        stats: {
            speed: 4,
            fireRate: 3,
            health: 4,
            damage: 5
        },
        specialAbility: {
            name: "Cosmic Column",
            description: "Destroys all enemies in two vertical columns with cosmic energy",
            cooldown: 35
        }
    }
];

// Create fallback images for all characters on page load
function createFallbackImagesForAllCharacters() {
    console.log("Pre-generating fallback images for all characters");
    
    characterData.forEach(character => {
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
        
        // Draw character shape
        ctx.fillStyle = color;
        ctx.fillRect(10, 10, 80, 80);
        
        // Draw character initial
        ctx.fillStyle = '#000000';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(character.name.charAt(0), 50, 50);
        
        // Set the fallback image
        character.generatedFallback = canvas.toDataURL('image/png');
        
        // Pre-emptively use fallback if we're on live server
        if (window.location.href.includes('herokuapp.com')) {
            character.image = character.generatedFallback;
            character._usedFallback = true;
        }
    });
}

// Run this when the script loads
createFallbackImagesForAllCharacters();

// Default available characters for new players
const defaultCharacters = ["char1"]; // Tralalero Tralala is the default character 

// Check environment to determine if we need to use fallback images
const isDeployedEnvironment = () => {
    // Check if we're on Heroku or similar deployment
    return window.location.href.includes('herokuapp.com') || 
           !window.location.href.includes('localhost');
};

// If in a deployed environment, set up fallback images
if (isDeployedEnvironment()) {
    console.log("Running in deployed environment - using fallback paths");
    characterData.forEach(character => {
        if (character.generatedFallback) {
            character.fallbackImage = character.generatedFallback;
        }
    });
}

// Make this available globally
window.characterData = characterData; 