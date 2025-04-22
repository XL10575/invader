// Character Data from Italian Brainrot
const characterData = [
    {
        _id: "char1",
        name: "Gakutaghi",
        description: "A hikikomori cat boy who prefers to stay at home. He has enhanced reflexes for dodging enemy bullets.",
        image: "img/characters/gakutaghi.png",
        rarity: "rare",
        stats: {
            speed: 7,
            fireRate: 4,
            health: 3,
            damage: 1
        },
        specialAbility: {
            name: "Dodge Master",
            description: "Temporarily increases movement speed by 100% for 3 seconds",
            cooldown: 15
        }
    },
    {
        _id: "char2",
        name: "Quandale Dingle",
        description: "A legendary troublemaker with powerful attack capabilities but slow movement.",
        image: "img/characters/quandale.png",
        rarity: "legendary",
        stats: {
            speed: 3,
            fireRate: 6,
            health: 2,
            damage: 3
        },
        specialAbility: {
            name: "Dingle Blast",
            description: "Fires a massive blast that destroys all enemies in a straight line",
            cooldown: 20
        }
    },
    {
        _id: "char3",
        name: "Fat Hog",
        description: "A robust and resilient character with high health but slow movement and firing rate.",
        image: "img/characters/fathog.png",
        rarity: "epic",
        stats: {
            speed: 2,
            fireRate: 2,
            health: 6,
            damage: 2
        },
        specialAbility: {
            name: "Tank Shield",
            description: "Creates a temporary shield that blocks all damage for 5 seconds",
            cooldown: 25
        }
    },
    {
        _id: "char4",
        name: "Sematary",
        description: "A spooky character with enhanced bullet speed and damage but low health.",
        image: "img/characters/sematary.png",
        rarity: "epic",
        stats: {
            speed: 5,
            fireRate: 7,
            health: 2,
            damage: 2
        },
        specialAbility: {
            name: "Ghost Bullets",
            description: "Bullets pass through defensive walls and can hit multiple enemies",
            cooldown: 18
        }
    },
    {
        _id: "char5",
        name: "Squimpus McGrimpus",
        description: "A mysterious character with balanced stats and unpredictable abilities.",
        image: "img/characters/squimpus.png",
        rarity: "rare",
        stats: {
            speed: 5,
            fireRate: 5,
            health: 4,
            damage: 1
        },
        specialAbility: {
            name: "Random Glitch",
            description: "Randomly enhances one stat to maximum for 4 seconds",
            cooldown: 15
        }
    },
    {
        _id: "char6",
        name: "Felix",
        description: "A default character with balanced stats. Nothing special but reliable.",
        image: "img/characters/felix.png",
        rarity: "common",
        stats: {
            speed: 5,
            fireRate: 5,
            health: 3,
            damage: 1
        },
        specialAbility: {
            name: "Basic Boost",
            description: "Slightly increases all stats for 3 seconds",
            cooldown: 12
        }
    },
    {
        _id: "char7",
        name: "Daniel",
        description: "An engineer character who can repair defensive walls during gameplay.",
        image: "img/characters/daniel.png",
        rarity: "rare",
        stats: {
            speed: 4,
            fireRate: 4,
            health: 3,
            damage: 1
        },
        specialAbility: {
            name: "Wall Repair",
            description: "Repairs all defensive walls by 50% of their max health",
            cooldown: 30
        }
    },
    {
        _id: "char8",
        name: "Mike Ehrmantraut",
        description: "A seasoned veteran with enhanced precision and tactical advantages.",
        image: "img/characters/mike.png",
        rarity: "legendary",
        stats: {
            speed: 4,
            fireRate: 8,
            health: 4,
            damage: 2
        },
        specialAbility: {
            name: "No Half Measures",
            description: "Instantly eliminates the two strongest enemies on the screen",
            cooldown: 35
        }
    }
];

// Default available characters for new players
const defaultCharacters = ["char6"]; // Felix is the default character 