// Character Data from Italian Brainrot
const characterData = [
    {
        _id: "char1",
        name: "Tralalero Tralala",
        description: "An AI-generated shark wearing Nike sneakers with incredible speed and agility.",
        image: "/img/characters/tralalero.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "legendary",
        stats: {
            speed: 8,
            fireRate: 5,
            health: 3,
            damage: 2
        },
        specialAbility: {
            name: "Shark Dash",
            description: "Increases speed dramatically and makes you invulnerable for 2 seconds",
            cooldown: 20
        }
    },
    {
        _id: "char2",
        name: "Bombardiro Crocodilo",
        description: "An anthropomorphic crocodile fused with a military bomber plane—complete with wings, bombs, and a warplane body.",
        image: "/img/characters/bombardiro.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "epic",
        stats: {
            speed: 4,
            fireRate: 3,
            health: 4,
            damage: 4
        },
        specialAbility: {
            name: "Carpet Bombing",
            description: "Drops multiple bombs that destroy all enemies below you",
            cooldown: 25
        }
    },
    {
        _id: "char3",
        name: "Tung Tung Sahur",
        description: "A surreal character often shown wielding a baseball bat. Known for incredible attack power.",
        image: "/img/characters/tungtung.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "rare",
        stats: {
            speed: 3,
            fireRate: 2,
            health: 3,
            damage: 5
        },
        specialAbility: {
            name: "Bat Swing",
            description: "Swings the bat to reflect enemy bullets back at them for 3 seconds",
            cooldown: 15
        }
    },
    {
        _id: "char4",
        name: "Lirili Larila",
        description: "A cactus-elephant hybrid, walking on two feet that sport sandals. Highly resistant to damage.",
        image: "/img/characters/lirili.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "epic",
        stats: {
            speed: 2,
            fireRate: 3,
            health: 6,
            damage: 2
        },
        specialAbility: {
            name: "Cactus Shield",
            description: "Creates a thorny shield that damages enemies on contact for 5 seconds",
            cooldown: 20
        }
    },
    {
        _id: "char5",
        name: "Boneca Ambalabu",
        description: "A frog-tire hybrid with human legs—a whimsical AI-generated Indonesian brainrot character.",
        image: "/img/characters/boneca.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "rare",
        stats: {
            speed: 6,
            fireRate: 4,
            health: 3,
            damage: 2
        },
        specialAbility: {
            name: "Rubber Bounce",
            description: "Bounces all incoming projectiles back to enemies for 3 seconds",
            cooldown: 18
        }
    },
    {
        _id: "char6",
        name: "Brr Brr Patapim",
        description: "A creature that's part forest tree, part long-nosed monkey, with oversized human feet.",
        image: "/img/characters/brrbrr.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "common",
        stats: {
            speed: 5,
            fireRate: 5,
            health: 3,
            damage: 1
        },
        specialAbility: {
            name: "Golden Hat",
            description: "Summons a blue frog named Slim who shoots additional bullets for 5 seconds",
            cooldown: 15
        }
    },
    {
        _id: "char7",
        name: "Chimpanzini Bananini",
        description: "A chimp-banana fusion—essentially a chimpanzee whose body is half-banana—first popularized on TikTok.",
        image: "/img/characters/chimpanzini.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "rare",
        stats: {
            speed: 6,
            fireRate: 6,
            health: 2,
            damage: 2
        },
        specialAbility: {
            name: "Banana Split",
            description: "Fires in 3 directions simultaneously for 4 seconds",
            cooldown: 20
        }
    },
    {
        _id: "char8",
        name: "Bombombini Gusini",
        description: "Bombardiro Crocodilo's goose-in-armor brother, equipped with jet engines and grenade launchers on its wings.",
        image: "/img/characters/bombombini.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "epic",
        stats: {
            speed: 5,
            fireRate: 7,
            health: 3,
            damage: 3
        },
        specialAbility: {
            name: "Grenade Barrage",
            description: "Launches grenades that explode on impact, damaging multiple enemies",
            cooldown: 22
        }
    },
    {
        _id: "char9",
        name: "Cappuccino Assassino",
        description: "An anthropomorphic cup of cappuccino wielding dual katanas—renowned for extreme speed and precision.",
        image: "/img/characters/cappuccino.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "legendary",
        stats: {
            speed: 9,
            fireRate: 8,
            health: 2,
            damage: 3
        },
        specialAbility: {
            name: "Dual Slash",
            description: "Performs lightning-fast slashes that destroy all bullets and enemies in close range",
            cooldown: 30
        }
    },
    {
        _id: "char10",
        name: "Trippi Troppi",
        description: "A hairy, pot-bellied bipedal creature with a fish head, often surrounded by giant mosquitoes in AI-generated memes.",
        image: "/img/characters/trippi.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "rare",
        stats: {
            speed: 4,
            fireRate: 4,
            health: 4,
            damage: 2
        },
        specialAbility: {
            name: "Mosquito Swarm",
            description: "Summons giant mosquitoes that attack nearby enemies for 5 seconds",
            cooldown: 25
        }
    },
    {
        _id: "char11",
        name: "Frigo Camelo",
        description: "A camel whose body is a refrigerator and whose feet are massive boots, lamenting its 'funny burden' in a narrated rhyme.",
        image: "/img/characters/frigo.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "common",
        stats: {
            speed: 3,
            fireRate: 3,
            health: 5,
            damage: 1
        },
        specialAbility: {
            name: "Cold Storage",
            description: "Freezes all enemies temporarily, making them move slower for 4 seconds",
            cooldown: 18
        }
    },
    {
        _id: "char12",
        name: "La Vaca Saturno",
        description: "A 'galaxy cow' with Saturn's rings as its body and giant human feet; it can fly and fire black-laser burps.",
        image: "/img/characters/lavaca.png",
        fallbackImage: "/img/characters/default.png",
        rarity: "legendary",
        stats: {
            speed: 4,
            fireRate: 3,
            health: 4,
            damage: 5
        },
        specialAbility: {
            name: "Black Laser Burp",
            description: "Fires a massive black laser beam that destroys everything in its path",
            cooldown: 35
        }
    }
];

// Default available characters for new players
const defaultCharacters = ["char1"]; // Tralalero Tralala is the default character 