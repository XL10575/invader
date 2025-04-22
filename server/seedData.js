const mongoose = require('mongoose');
const Character = require('./models/Character');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://luolee486:B88or2WoxpoZj1R9@cluster0.8i9iafn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Initial characters
const initialCharacters = [
    {
        name: "Classic Defender",
        description: "The standard issue space defender. Reliable and balanced.",
        image: "/assets/ships/classic_defender.png",
        rarity: "common",
        dropRate: 40,
        stats: {
            speed: 5,
            fireRate: 5,
            health: 3,
            damage: 1
        },
        specialAbility: {
            name: "Shield Boost",
            description: "Temporarily increases health by 1",
            cooldown: 15
        }
    },
    {
        name: "Speed Racer",
        description: "A lightweight ship with enhanced maneuverability but lower durability.",
        image: "/assets/ships/speed_racer.png",
        rarity: "common",
        dropRate: 30,
        stats: {
            speed: 8,
            fireRate: 6,
            health: 2,
            damage: 1
        },
        specialAbility: {
            name: "Boost",
            description: "Temporarily increases speed for 3 seconds",
            cooldown: 10
        }
    },
    {
        name: "Heavy Crusher",
        description: "Slow but sturdy ship with high damage output.",
        image: "/assets/ships/heavy_crusher.png",
        rarity: "rare",
        dropRate: 15,
        stats: {
            speed: 3,
            fireRate: 3,
            health: 5,
            damage: 2
        },
        specialAbility: {
            name: "Power Shot",
            description: "Fires a piercing shot that can hit multiple enemies",
            cooldown: 12
        }
    },
    {
        name: "Rapid Blaster",
        description: "Specialized in rapid-fire attacks but with average stats otherwise.",
        image: "/assets/ships/rapid_blaster.png",
        rarity: "rare",
        dropRate: 10,
        stats: {
            speed: 5,
            fireRate: 9,
            health: 3,
            damage: 1
        },
        specialAbility: {
            name: "Bullet Spray",
            description: "Fires multiple bullets in a cone pattern",
            cooldown: 15
        }
    },
    {
        name: "Stealth Shadow",
        description: "Advanced ship with temporary invisibility capabilities.",
        image: "/assets/ships/stealth_shadow.png",
        rarity: "epic",
        dropRate: 4,
        stats: {
            speed: 7,
            fireRate: 6,
            health: 4,
            damage: 2
        },
        specialAbility: {
            name: "Cloaking",
            description: "Becomes temporarily invulnerable for 2 seconds",
            cooldown: 20
        }
    },
    {
        name: "Nova Guardian",
        description: "Legendary ship with balanced superior stats in all categories.",
        image: "/assets/ships/nova_guardian.png",
        rarity: "legendary",
        dropRate: 1,
        stats: {
            speed: 7,
            fireRate: 8,
            health: 5,
            damage: 3
        },
        specialAbility: {
            name: "Supernova",
            description: "Releases an energy burst damaging all enemies on screen",
            cooldown: 30
        }
    }
];

// Function to seed the database
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Clear existing characters
        await Character.deleteMany({});
        console.log('Cleared existing characters');
        
        // Insert new characters
        await Character.insertMany(initialCharacters);
        console.log('Successfully seeded characters');
        
        console.log('Database seeding completed!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
}

// Run the seed function
seedDatabase(); 