// Game Controller
const Game = {
    // Game canvas and context
    canvas: null,
    ctx: null,
    
    // Game state
    isRunning: false,
    isPaused: false,
    gameOver: false,
    score: 0,
    lives: 3,
    level: 1,
    startTime: 0,
    playTime: 0,
    coinsEarned: 0,
    startingPlayerCoins: 0,
    
    // Game settings
    width: 800,
    height: 600,
    
    // Game objects
    player: null,
    bullets: [],
    enemies: [],
    enemyBullets: [],
    particles: [],
    defensiveWalls: [],
    enemyDirection: 1, // Add a property to track enemy direction
    
    // Character UI
    characterDisplay: null,
    abilityIndicator: null,
    
    // Animation frame
    animationId: null,
    
    // Main Game object
    state: {
        player: null,
        enemies: [],
        bullets: [],
        powerups: [],
        walls: [],
        score: 0,
        level: 1,
        gameOver: false,
        paused: false,
        lastEnemySpawn: 0,
        lastPowerupSpawn: 0,
        isUsingPower: false,
        powerCooldown: 0,
        enemiesDestroyed: 0,
        powerupsCollected: 0,
        playerCharacter: null,
        playerId: null,
        apiKey: null,
        playerImageLoaded: false
    },
    
    // Game settings
    settings: {
        canvas: null,
        ctx: null,
        width: 800,
        height: 600,
        enemySpawnRate: 2000, // ms between enemy spawns
        powerupSpawnRate: 15000, // ms between powerup spawns
        enemySpeed: 2,
        bulletSpeed: 7,
        fps: 60,
        debug: false
    },
    
    // Initialize the game
    init: function() {
        console.log('Initializing game');
        
        // Create canvas
        this.setupCanvas();
        
        // Setup input handlers
        this.setupInputHandlers();
        
        // Initialize game state
        this.initializeGameState();
        
        // Set player character if available from auth system
        if (window.Auth && window.Auth.selectedCharacter) {
            console.log('Using selected character:', window.Auth.selectedCharacter.name);
            this.state.playerCharacter = window.Auth.selectedCharacter;
        } else {
            // Use default character if none selected
            console.log('No character selected, using default');
            this.state.playerCharacter = {
                name: 'Default',
                rarity: 'common',
                stats: { health: 100, speed: 5, fireRate: 5 }
            };
        }
        
        // Log character details for debugging
        if (this.state.playerCharacter) {
            console.log('Character details:', this.state.playerCharacter);
            if (this.state.playerCharacter.image) {
                console.log('Character has image path:', this.state.playerCharacter.image);
            } else {
                console.log('Character does not have an image path, fallback will be created');
            }
            
            if (this.state.playerCharacter.fallbackImage) {
                console.log('Character has a fallback image');
            }
        }
        
        // Create player
        this.createPlayer();
        
        // Create defensive walls
        this.createDefensiveWalls();
        
        // Start game loop
        this.startGameLoop();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Game navigation buttons
        document.getElementById('start-game').addEventListener('click', () => {
            this.showGameSection();
            this.resetGame();
            this.startGame();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('quit-btn').addEventListener('click', () => {
            this.quitGame();
        });
        
        // Instructions button
        document.getElementById('instructions-btn').addEventListener('click', () => {
            document.getElementById('instructions-modal').classList.remove('hide');
            this.togglePause();
        });
        
        // Close instructions button
        document.getElementById('close-instructions').addEventListener('click', () => {
            document.getElementById('instructions-modal').classList.add('hide');
            if (document.getElementById('pause-menu').classList.contains('hide')) {
                this.togglePause();
            }
        });
        
        // Game over buttons
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-section').classList.add('hide');
            document.getElementById('game-section').classList.remove('hide');
            this.resetGame();
            this.startGame();
        });
        
        document.getElementById('menu-btn').addEventListener('click', () => {
            document.getElementById('game-over-section').classList.add('hide');
            Auth.showMainMenu();
        });
        
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            if (this.isRunning && !this.isPaused && !this.gameOver) {
                // Move left with left arrow or A
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    this.player.moveLeft = true;
                }
                
                // Move right with right arrow or D
                if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    this.player.moveRight = true;
                }
                
                // Fire with space
                if (e.key === ' ') {
                    this.fireBullet();
                }
                
                // Use special ability with Shift
                if ((e.key === 'Shift' || e.key === 'ShiftLeft' || e.key === 'ShiftRight') && 
                    this.player && this.player.character && this.player.character.specialAbility) {
                    this.useSpecialAbility();
                }
            }
            
            // Pause with Escape
            if (e.key === 'Escape' && this.isRunning && !this.gameOver) {
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (this.isRunning) {
                // Stop moving left
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    this.player.moveLeft = false;
                }
                
                // Stop moving right
                if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    this.player.moveRight = false;
                }
            }
        });
    },
    
    // Show game section
    showGameSection: function() {
        document.querySelectorAll('.section').forEach(section => section.classList.add('hide'));
        document.getElementById('game-section').classList.remove('hide');
        
        // Hide pause and game over menus
        document.getElementById('pause-menu').classList.add('hide');
        document.getElementById('game-over-section').classList.add('hide');
    },
    
    // Reset game
    resetGame: function() {
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        
        this.score = 0;
        this.level = 1;
        this.coinsEarned = 0; // Track coins earned in this game session
        this.startingPlayerCoins = Auth.currentUser ? Auth.currentUser.coins : 0;
        this.lives = 3; // Set initial lives
        
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.defensiveWalls = [];
        this.particles = [];
        this.floatingTexts = [];
        
        // Reset UI
        document.getElementById('game-score').querySelector('span').textContent = this.score;
        document.getElementById('game-level').querySelector('span').textContent = this.level;
        document.getElementById('game-coins').querySelector('span').textContent = this.startingPlayerCoins;
        document.getElementById('game-lives').querySelector('span').textContent = this.lives;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    // Start the game
    startGame: function() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.gameOver = false;
        
        this.startTime = Date.now();
        
        this.createPlayer();
        this.createEnemies();
        this.createDefensiveWalls();
        
        // Create character display if it doesn't exist
        if (!this.characterDisplay) {
            this.createCharacterDisplay();
        }
        
        // Update character display
        this.updateCharacterDisplay();
        
        // Start game loop
        this.gameLoop();
    },
    
    // Toggle pause
    togglePause: function() {
        if (!this.isRunning || this.gameOver) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            document.getElementById('pause-menu').classList.remove('hide');
        } else {
            document.getElementById('pause-menu').classList.add('hide');
            this.gameLoop();
        }
    },
    
    // Quit game
    quitGame: function() {
        this.resetGame();
        Auth.showMainMenu();
    },
    
    // Game loop
    gameLoop: function() {
        if (!this.isRunning || this.isPaused) return;
        
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    },
    
    // Update game state
    update: function() {
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemyBullets();
        this.updateEnemies();
        this.updateParticles();
        this.updateFloatingTexts();
        this.checkCollisions();
        this.updateAbilityCooldown();
    },
    
    // Draw game
    draw: function() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.drawDefensiveWalls();
        this.drawBullets();
        this.drawEnemyBullets();
        this.drawEnemies();
        this.drawPlayer();
        this.drawParticles();
        this.drawFloatingTexts();
    },
    
    // Handle game over
    handleGameOver: function() {
        this.isRunning = false;
        this.gameOver = true;
        
        // Calculate play time in seconds
        this.playTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Update high score
        if (Auth.currentUser && this.score > Auth.currentUser.highScore) {
            Auth.updateHighScore(this.score);
        }
        
        // Update player coins with earned coins
        if (Auth.currentUser) {
            const newCoinTotal = Auth.currentUser.coins + this.coinsEarned;
            Auth.updateCoins(newCoinTotal);
        }
        
        // Show game over screen
        document.getElementById('game-over-score').querySelector('span').textContent = this.score;
        document.getElementById('game-over-coins').querySelector('span').textContent = this.coinsEarned;
        document.getElementById('game-over-level').querySelector('span').textContent = this.level;
        document.getElementById('game-section').classList.add('hide');
        document.getElementById('game-over-section').classList.remove('hide');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    // Level up
    levelUp: function() {
        this.level++;
        
        // Update level display
        document.getElementById('game-level').querySelector('span').textContent = this.level;
        
        // Create level-up text indication
        this.createLevelUpText();
        
        // Create new enemies for this level
        this.createEnemies();
    },
    
    // Create level-up text animation
    createLevelUpText: function() {
        const levelUpText = {
            x: this.width / 2,
            y: this.height / 2,
            value: `LEVEL ${this.level}`,
            color: '#ffff00', // Yellow
            alpha: 1,
            life: 60,
            scale: 1
        };
        
        // Add to texts array if it doesn't exist
        if (!this.floatingTexts) {
            this.floatingTexts = [];
        }
        
        this.floatingTexts.push(levelUpText);
    },
    
    // Check collisions
    checkCollisions: function() {
        // Player bullets vs enemies
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            let bulletRemoved = false;
            
            // Skip wall collision for Ghost Bullets ability
            const ghostBullets = this.player.specialAbility.active && 
                              this.player.character.specialAbility && 
                              this.player.character.specialAbility.name.toLowerCase().includes("ghost");
            
            // Check collision with defensive walls first (unless using Ghost Bullets)
            if (!ghostBullets) {
                for (const wall of this.defensiveWalls) {
                    for (let j = 0; j < wall.segments.length; j++) {
                        const segment = wall.segments[j];
                        
                        if (this.isColliding(bullet, segment)) {
                            segment.health -= bullet.damage;
                            
                            // Create explosion particles
                            this.createExplosion(bullet.x, bullet.y, 3);
                            
                            // Remove bullet (unless it's explosive)
                            if (!bullet.isExplosive) {
                                this.bullets.splice(i, 1);
                                i--;
                                bulletRemoved = true;
                            }
                            
                            // Remove segment if health depleted
                            if (segment.health <= 0) {
                                wall.segments.splice(j, 1);
                                j--;
                            }
                            
                            break;
                        }
                    }
                    
                    if (bulletRemoved) break;
                }
            }
            
            if (bulletRemoved) continue;
            
            // Check collision with enemies
            for (let j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];
                
                if (this.isColliding(bullet, enemy)) {
                    enemy.health -= bullet.damage;
                    
                    // Create explosion particles
                    this.createExplosion(bullet.x, bullet.y);
                    
                    // Handle explosive bullets
                    if (bullet.isExplosive) {
                        // Create a large explosion effect
                        this.createExplosion(bullet.x, bullet.y, 30);
                        
                        // Damage enemies in the radius
                        const radius = bullet.explosionRadius || 60;
                        for (let k = 0; k < this.enemies.length; k++) {
                            if (k !== j) { // Skip the enemy that was directly hit
                                const otherEnemy = this.enemies[k];
                                const dx = otherEnemy.x + otherEnemy.width/2 - bullet.x;
                                const dy = otherEnemy.y + otherEnemy.height/2 - bullet.y;
                                const distance = Math.sqrt(dx*dx + dy*dy);
                                
                                if (distance < radius) {
                                    // Apply damage based on distance (more damage closer to center)
                                    const damageMultiplier = 1 - (distance / radius);
                                    const explosionDamage = bullet.damage * damageMultiplier;
                                    otherEnemy.health -= explosionDamage;
                                    
                                    // Create smaller explosion at affected enemy
                                    this.createExplosion(otherEnemy.x + otherEnemy.width/2, 
                                                        otherEnemy.y + otherEnemy.height/2, 
                                                        5);
                                    
                                    // Check if enemy is destroyed by explosion
                                    if (otherEnemy.health <= 0) {
                                        this.score += otherEnemy.points;
                                        
                                        // Award coins based on enemy type
                                        this.awardCoinsForEnemy(otherEnemy);
                                        
                                        document.getElementById('game-score').querySelector('span').textContent = this.score;
                                        
                                        this.createExplosion(otherEnemy.x + otherEnemy.width/2, 
                                                           otherEnemy.y + otherEnemy.height/2, 
                                                           15);
                                        this.enemies.splice(k, 1);
                                        k--;
                                    }
                                }
                            }
                        }
                        
                        // Remove the explosive bullet after it explodes
                        this.bullets.splice(i, 1);
                        i--;
                        bulletRemoved = true;
                    } 
                    // Only remove the bullet if not using Ghost Bullets or if it's not a special blast
                    else if (!ghostBullets && (!bullet.ghostBullet && !bullet.isBlast)) {
                        this.bullets.splice(i, 1);
                        i--;
                        bulletRemoved = true;
                    }
                    
                    // Remove enemy if health depleted
                    if (enemy.health <= 0) {
                        this.score += enemy.points;
                        
                        // Award coins based on enemy type
                        this.awardCoinsForEnemy(enemy);
                        
                        document.getElementById('game-score').querySelector('span').textContent = this.score;
                        
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20);
                        this.enemies.splice(j, 1);
                        j--;
                    }
                    
                    if (bulletRemoved) break;
                }
            }
        }
        
        // Enemy bullets vs defensive walls
        for (let i = 0; i < this.enemyBullets.length; i++) {
            const bullet = this.enemyBullets[i];
            let bulletRemoved = false;
            
            for (const wall of this.defensiveWalls) {
                for (let j = 0; j < wall.segments.length; j++) {
                    const segment = wall.segments[j];
                    
                    if (this.isColliding(bullet, segment)) {
                        segment.health -= 1;
                        
                        // Create explosion particles
                        this.createExplosion(bullet.x, bullet.y, 3);
                        
                        // Remove bullet
                        this.enemyBullets.splice(i, 1);
                        i--;
                        bulletRemoved = true;
                        
                        // Remove segment if health depleted
                        if (segment.health <= 0) {
                            wall.segments.splice(j, 1);
                            j--;
                        }
                        
                        break;
                    }
                }
                
                if (bulletRemoved) break;
            }
            
            if (bulletRemoved) continue;
            
            // Enemy bullets vs player
            if (this.isColliding(bullet, this.player)) {
                // Skip damage if player has Tank Shield active or any invincibility ability
                const hasShield = this.player.specialAbility.active && 
                              this.player.character.specialAbility && 
                              (this.player.character.specialAbility.name === "Tank Shield" || 
                               this.player.character.name === "Cappuccino Assassino");
                
                if (!hasShield) {
                    this.lives--;
                    document.getElementById('game-lives').querySelector('span').textContent = this.lives;
                    
                    this.createExplosion(bullet.x, bullet.y);
                }
                
                this.enemyBullets.splice(i, 1);
                i--;
                
                if (this.lives <= 0) {
                    this.handleGameOver();
                    return;
                }
            }
        }
    },
    
    // Check if two objects are colliding
    isColliding: function(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    },
    
    // Create explosion particles
    createExplosion: function(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                radius: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`,
                alpha: 1
            };
            
            this.particles.push(particle);
        }
    },
    
    // Draw player
    drawPlayer: function() {
        const ctx = this.settings.ctx;
        const player = this.state.player;
        
        ctx.save();
        
        // Draw player health bar
        this.drawHealthBar(player.x, player.y - 10, player.width, 5, player.health);
        
        // Draw player ship
        if (player.imageLoaded && player.image) {
            // Use the loaded character image
            ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
        } else if (player.fallbackImage) {
            // Use the fallback image (canvas or pre-generated image)
            if (player.fallbackImage instanceof HTMLCanvasElement) {
                ctx.drawImage(player.fallbackImage, player.x, player.y, player.width, player.height);
            } else {
                // Assuming fallbackImage is a data URL or path
                if (!player.fallbackImageObj) {
                    player.fallbackImageObj = new Image();
                    player.fallbackImageObj.src = player.fallbackImage;
                }
                if (player.fallbackImageObj.complete) {
                    ctx.drawImage(player.fallbackImageObj, player.x, player.y, player.width, player.height);
                } else {
                    // Draw default rectangle if fallback image is still loading
                    ctx.fillStyle = player.color;
                    ctx.fillRect(player.x, player.y, player.width, player.height);
                }
            }
        } else {
            // Default fallback - green rectangle
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
        
        ctx.restore();
    },
    
    // Draw defensive walls
    drawDefensiveWalls: function() {
        for (const wall of this.defensiveWalls) {
            for (const segment of wall.segments) {
                this.ctx.fillStyle = '#00aa00';
                this.ctx.fillRect(segment.x, segment.y, segment.width, segment.height);
            }
        }
    },
    
    // Draw bullets
    drawBullets: function() {
        for (const bullet of this.bullets) {
            // Check if bullet has custom color
            if (bullet.color) {
                this.ctx.fillStyle = bullet.color;
            } else {
                this.ctx.fillStyle = '#00ffff';
            }
            
            // Draw different bullet types differently
            if (bullet.isExplosive) {
                // Draw explosion-ready bullet (pulsing)
                const pulseSize = 2 * Math.sin(Date.now() / 100) + 1;
                
                // Draw main bullet
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
                
                // Draw pulsing glow around explosive bullet
                this.ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
                this.ctx.fillRect(
                    bullet.x - pulseSize, 
                    bullet.y - pulseSize, 
                    bullet.width + pulseSize * 2, 
                    bullet.height + pulseSize * 2
                );
            } else if (bullet.width > 6) {
                // Draw larger bullets with rounded corners for Chimpanzini
                this.ctx.beginPath();
                this.ctx.roundRect(bullet.x, bullet.y, bullet.width, bullet.height, 3);
                this.ctx.fill();
            } else {
                // Normal bullets
                this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            }
        }
    },
    
    // Draw enemy bullets
    drawEnemyBullets: function() {
        this.ctx.fillStyle = '#ff0000';
        
        for (const bullet of this.enemyBullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    },
    
    // Draw enemies
    drawEnemies: function() {
        for (const enemy of this.enemies) {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Draw enemy shape
            this.ctx.beginPath();
            this.ctx.moveTo(enemy.x, enemy.y);
            this.ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            this.ctx.lineTo(enemy.x + enemy.width, enemy.y);
            this.ctx.lineTo(enemy.x + enemy.width - 10, enemy.y + enemy.height);
            this.ctx.lineTo(enemy.x + 10, enemy.y + enemy.height);
            this.ctx.closePath();
            this.ctx.fillStyle = enemy.color;
            this.ctx.fill();
        }
    },
    
    // Draw particles
    drawParticles: function() {
        for (const particle of this.particles) {
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
    },

    // Use special ability
    useSpecialAbility: function() {
        // Log current state for debugging
        console.log("Ability status:", {
            active: this.player.specialAbility.active,
            cooldown: this.player.specialAbility.cooldown,
            lastUsed: this.player.specialAbility.lastUsed
        });
        
        if (!this.player.specialAbility || 
            this.player.specialAbility.active || 
            this.player.specialAbility.cooldown) {
            console.log("Cannot use ability - either already active or on cooldown");
            return;
        }
        
        if (!this.player.character || !this.player.character.specialAbility) {
            console.log("Cannot use ability - character or special ability is missing");
            return;
        }
        
        const now = Date.now();
        const ability = this.player.character.specialAbility;
        const characterName = this.player.character.name;
        
        console.log("Using special ability for character:", characterName);
        
        // Add a visual effect to show ability activation
        this.createExplosion(this.player.x + this.player.width/2, this.player.y, 5);
        
        // Implement specific character abilities
        if (characterName === "Brr Brr Patapim") {
            // Regenerate all defensive walls
            console.log("Activating wall regeneration");
            this.player.specialAbility.active = true;
            
            // Remove existing walls
            this.defensiveWalls = [];
            
            // Create new walls
            this.createDefensiveWalls();
            
            // Create a visual effect
            for (const wall of this.defensiveWalls) {
                this.createExplosion(wall.x + wall.width/2, wall.y + wall.height/2, 15);
            }
            
            // Reset after a short duration
            setTimeout(() => {
                this.player.specialAbility.active = false;
            }, 1000);
        }
        else if (characterName === "Chimpanzini Bananini") {
            // Shoot larger bullets
            console.log("Activating larger bullets");
            this.player.specialAbility.active = true;
            
            // Store original fire method
            const originalFireBullet = this.fireBullet;
            
            // Replace with larger bullets
            this.fireBullet = function() {
                const now = Date.now();
                
                // Check fire rate
                if (now - this.player.lastFired < this.player.fireRate) {
                    return;
                }
                
                this.player.lastFired = now;
                
                // Create a larger bullet
                const bullet = {
                    x: this.player.x + this.player.width / 2 - 6, // Centered wider bullet
                    y: this.player.y,
                    width: 12, // 3x wider
                    height: 15, // 1.5x taller
                    speed: 10,
                    damage: this.player.damage * 1.5 // More damage
                };
                
                this.bullets.push(bullet);
                
                // Visual feedback
                this.createExplosion(bullet.x + bullet.width/2, bullet.y, 2);
            };
            
            // Reset after 10 seconds
            setTimeout(() => {
                this.fireBullet = originalFireBullet;
                this.player.specialAbility.active = false;
            }, 10000);
        }
        else if (characterName === "Bombombini Gusini") {
            // Next bullet explodes and destroys enemies in 3x3 area
            console.log("Activating explosive bullet");
            this.player.specialAbility.active = true;
            
            // Store original fire method
            const originalFireBullet = this.fireBullet;
            
            // Flag to track if explosive bullet has been fired
            let explosiveBulletFired = false;
            
            // Replace with explosive bullet
            this.fireBullet = function() {
                if (explosiveBulletFired) {
                    // Reset to original after one shot
                    this.fireBullet = originalFireBullet;
                    this.fireBullet(); // Fire normally
                    return;
                }
                
                const now = Date.now();
                
                // Check fire rate
                if (now - this.player.lastFired < this.player.fireRate) {
                    return;
                }
                
                this.player.lastFired = now;
                
                // Create an explosive bullet
                const bullet = {
                    x: this.player.x + this.player.width / 2 - 4,
                    y: this.player.y,
                    width: 8,
                    height: 12,
                    speed: 12,
                    damage: this.player.damage * 2,
                    isExplosive: true,
                    explosionRadius: 60 // 3x3 grid approximately
                };
                
                // Add special coloring
                bullet.color = '#ff5500';
                
                this.bullets.push(bullet);
                explosiveBulletFired = true;
                
                // Set a timeout to deactivate the ability
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 1000);
            };
            
            // If not used in 10 seconds, revert
            setTimeout(() => {
                if (!explosiveBulletFired) {
                    this.fireBullet = originalFireBullet;
                    this.player.specialAbility.active = false;
                }
            }, 10000);
        }
        else if (characterName === "Cappuccino Assassino") {
            // Double bullet damage for 10 seconds
            console.log("Activating double damage");
            this.player.specialAbility.active = true;
            
            // Store original damage
            const originalDamage = this.player.damage;
            
            // Double damage
            this.player.damage *= 2;
            
            // Create a visual effect
            const damageInterval = setInterval(() => {
                if (this.player.specialAbility.active) {
                    // Create damage aura effect
                    for (let i = 0; i < 2; i++) {
                        const particle = {
                            x: this.player.x + Math.random() * this.player.width,
                            y: this.player.y + Math.random() * this.player.height/2,
                            vx: (Math.random() - 0.5) * 2,
                            vy: -Math.random() * 2 - 1,
                            radius: Math.random() * 2 + 1,
                            color: 'rgba(255, 0, 0, 0.7)',
                            alpha: 0.7
                        };
                        this.particles.push(particle);
                    }
                } else {
                    clearInterval(damageInterval);
                }
            }, 200);
            
            // Reset after 10 seconds
            setTimeout(() => {
                this.player.damage = originalDamage;
                this.player.specialAbility.active = false;
            }, 10000);
        }
        else if (characterName === "Trippi Troppi") {
            // Slow enemy movement for 5 seconds
            console.log("Activating enemy slowdown");
            this.player.specialAbility.active = true;
            
            // Store original direction value
            const originalDirection = this.enemyDirection;
            
            // Slow enemies by reducing the direction multiplier
            if (this.enemyDirection > 0) {
                this.enemyDirection = 0.2;
            } else {
                this.enemyDirection = -0.2;
            }
            
            // Create slow effect particles
            const slowInterval = setInterval(() => {
                if (this.player.specialAbility.active) {
                    // Create slow-mo effect across all enemies
                    for (const enemy of this.enemies) {
                        if (Math.random() > 0.7) {
                            const particle = {
                                x: enemy.x + Math.random() * enemy.width,
                                y: enemy.y + Math.random() * enemy.height,
                                vx: 0,
                                vy: Math.random() * 0.5,
                                radius: Math.random() * 2 + 1,
                                color: 'rgba(0, 0, 255, 0.5)',
                                alpha: 0.5
                            };
                            this.particles.push(particle);
                        }
                    }
                } else {
                    clearInterval(slowInterval);
                }
            }, 200);
            
            // Reset after 5 seconds
            setTimeout(() => {
                // Restore direction sign but keep current magnitude
                if (originalDirection > 0) {
                    this.enemyDirection = Math.abs(this.enemyDirection);
                } else {
                    this.enemyDirection = -Math.abs(this.enemyDirection);
                }
                this.player.specialAbility.active = false;
            }, 5000);
        }
        else if (characterName === "Frigo Camelo") {
            // Freeze all enemies for 2 seconds
            console.log("Activating enemy freeze");
            this.player.specialAbility.active = true;
            
            // Store current enemy positions
            const frozenEnemies = this.enemies.map(enemy => ({
                x: enemy.x,
                y: enemy.y,
                origX: enemy.x,
                origY: enemy.y
            }));
            
            // Store original update method
            const originalUpdateEnemies = this.updateEnemies;
            
            // Replace with freeze method
            this.updateEnemies = function() {
                // Don't update positions while frozen
                // Just keep enemies at their positions
                for (let i = 0; i < this.enemies.length && i < frozenEnemies.length; i++) {
                    // Keep position frozen but allow slight visual jitter
                    this.enemies[i].x = frozenEnemies[i].origX + (Math.random() - 0.5);
                    this.enemies[i].y = frozenEnemies[i].origY + (Math.random() - 0.5);
                }
            };
            
            // Create freeze effect
            const freezeInterval = setInterval(() => {
                if (this.player.specialAbility.active) {
                    // Create ice particles for all enemies
                    for (const enemy of this.enemies) {
                        if (Math.random() > 0.7) {
                            const particle = {
                                x: enemy.x + Math.random() * enemy.width,
                                y: enemy.y + Math.random() * enemy.height,
                                vx: (Math.random() - 0.5) * 1,
                                vy: -Math.random() * 1,
                                radius: Math.random() * 2 + 1,
                                color: 'rgba(200, 240, 255, 0.8)',
                                alpha: 0.8
                            };
                            this.particles.push(particle);
                        }
                    }
                } else {
                    clearInterval(freezeInterval);
                }
            }, 100);
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.updateEnemies = originalUpdateEnemies;
                this.player.specialAbility.active = false;
            }, 2000);
        }
        else if (characterName === "La Vaca Saturno") {
            // Destroy enemies in two columns
            console.log("Activating column destruction");
            this.player.specialAbility.active = true;
            
            // Determine player's current column
            const playerCenterX = this.player.x + this.player.width / 2;
            const gameWidth = this.width;
            
            // Calculate columns (divide into 10 columns)
            const columnWidth = gameWidth / 10;
            const playerColumn = Math.floor(playerCenterX / columnWidth);
            
            // Choose columns to destroy (current column and one adjacent)
            const columnsToDestroy = [playerColumn];
            
            // Add one adjacent column
            if (playerColumn < 9) {
                columnsToDestroy.push(playerColumn + 1);
            } else {
                columnsToDestroy.push(playerColumn - 1);
            }
            
            // Destroy enemies in those columns
            let destroyedCount = 0;
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyColumn = Math.floor(enemyCenterX / columnWidth);
                
                if (columnsToDestroy.includes(enemyColumn)) {
                    // Create explosion effect
                    this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20);
                    
                    // Add score
                    this.score += enemy.points;
                    document.getElementById('game-score').querySelector('span').textContent = this.score;
                    
                    // Remove enemy
                    this.enemies.splice(i, 1);
                    destroyedCount++;
                }
            }
            
            // Visual indicators for destroyed columns
            for (const col of columnsToDestroy) {
                const colX = col * columnWidth;
                for (let y = 0; y < this.height; y += 20) {
                    if (Math.random() > 0.7) {
                        this.createExplosion(colX + columnWidth/2, y, 3);
                    }
                }
            }
            
            console.log(`Destroyed ${destroyedCount} enemies in columns`);
            
            // Reset after a short duration
            setTimeout(() => {
                this.player.specialAbility.active = false;
            }, 1000);
        }
        // Handle other abilities using substring matching as fallback
        else {
            // Normalize ability name to handle case sensitivity
            const abilityName = ability.name.toLowerCase();
            
            if (abilityName.includes("dash") || abilityName.includes("dodge")) {
                // Double speed for 3 seconds
                const originalSpeed = this.player.speed;
                this.player.speed *= 2;
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 3000;
                
                // Create visual effect
                this.createExplosion(this.player.x + this.player.width/2, this.player.y, 15);
                
                setTimeout(() => {
                    this.player.speed = originalSpeed;
                    this.player.specialAbility.active = false;
                }, 3000);
            }
            else if (abilityName.includes("blast") || abilityName.includes("dingle")) {
                // Fire a powerful shot that destroys enemies in a line
                const blast = {
                    x: this.player.x + this.player.width / 2 - 5,
                    y: this.player.y,
                    width: 10,
                    height: 20,
                    speed: 15,
                    damage: 10,
                    isBlast: true
                };
                this.bullets.push(blast);
                this.player.specialAbility.active = true;
                
                // Reset after a short duration
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 1000);
            }
            else if (abilityName.includes("bomb") || abilityName.includes("carpet")) {
                // Drop multiple bombs that destroy all enemies below you
                this.player.specialAbility.active = true;
                
                // Create multiple blasts
                for (let i = 0; i < 7; i++) {
                    setTimeout(() => {
                        const bombX = this.player.x + (i % 3 - 1) * this.player.width;
                        const bomb = {
                            x: bombX,
                            y: this.player.y,
                            width: 8,
                            height: 15,
                            speed: 12,
                            damage: 5,
                            isBlast: true
                        };
                        this.bullets.push(bomb);
                    }, i * 150);
                }
                
                // Reset after all bombs are dropped
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 1500);
            }
            else if (abilityName.includes("shield") || abilityName.includes("tank")) {
                // Temporary invincibility
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 5000;
                
                // Create shield effect
                const shieldInterval = setInterval(() => {
                    if (this.player.specialAbility.active) {
                        this.createExplosion(
                            this.player.x + this.player.width/2, 
                            this.player.y + this.player.height/2, 
                            3
                        );
                    } else {
                        clearInterval(shieldInterval);
                    }
                }, 200);
                
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 5000);
            }
            else if (abilityName.includes("ghost") || abilityName.includes("bullet")) {
                // Next shots pass through walls and enemies
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 10000;
                
                // Create ghost effect
                const ghostInterval = setInterval(() => {
                    if (this.player.specialAbility.active) {
                        this.createGhostEffect();
                    } else {
                        clearInterval(ghostInterval);
                    }
                }, 300);
                
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 10000);
            }
            else if (abilityName.includes("bat") || abilityName.includes("swing")) {
                // Reflect enemy bullets for a short time
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 3000;
                
                // Reflect all enemy bullets
                const reflectInterval = setInterval(() => {
                    if (this.player.specialAbility.active) {
                        // Reflect any enemy bullets near the player
                        for (let i = 0; i < this.enemyBullets.length; i++) {
                            const bullet = this.enemyBullets[i];
                            
                            // Check if bullet is within reflection range
                            if (Math.abs(bullet.y - this.player.y) < 50 &&
                                Math.abs(bullet.x - this.player.x) < this.player.width * 2) {
                                
                                // Remove enemy bullet
                                this.enemyBullets.splice(i, 1);
                                i--;
                                
                                // Create a reflected bullet
                                const reflected = {
                                    x: bullet.x,
                                    y: bullet.y,
                                    width: bullet.width,
                                    height: bullet.height,
                                    speed: bullet.speed + 2,
                                    damage: 2
                                };
                                
                                this.bullets.push(reflected);
                                this.createExplosion(bullet.x, bullet.y, 2);
                            }
                        }
                    } else {
                        clearInterval(reflectInterval);
                    }
                }, 100);
                
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 3000);
            }
            else {
                // Generic boost for any other type of ability
                console.log("Using generic ability boost for:", ability.name);
                const originalDamage = this.player.damage;
                this.player.speed += 2;
                this.player.damage += 1;
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 3000;
                setTimeout(() => {
                    this.player.speed -= 2;
                    this.player.damage = originalDamage;
                    this.player.specialAbility.active = false;
                }, 3000);
            }
        }
        
        // Set cooldown
        this.player.specialAbility.cooldown = true;
        this.player.specialAbility.lastUsed = now;
        
        // Visual feedback for ability use
        if (this.characterDisplay) {
            this.updateAbilityCooldown();
        }
        
        // Reset cooldown after time passes
        setTimeout(() => {
            this.player.specialAbility.cooldown = false;
            console.log("Ability cooldown finished");
            
            // Update the UI
            if (this.characterDisplay) {
                this.updateAbilityCooldown();
            }
        }, this.player.specialAbility.cooldownTime);
    },
    
    // Create ghost effect for Ghost Bullets ability
    createGhostEffect: function() {
        if (!this.player) return;
        
        for (let i = 0; i < 3; i++) {
            const particle = {
                x: this.player.x + Math.random() * this.player.width,
                y: this.player.y + Math.random() * this.player.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                color: 'rgba(200, 230, 255, 0.7)',
                alpha: 0.7
            };
            
            this.particles.push(particle);
        }
    },

    // Update the character display in the game UI
    updateCharacterDisplay: function() {
        // Create a character display if it doesn't exist
        if (!this.characterDisplay) {
            this.createCharacterDisplay();
        }
        
        // Check if player has a character
        if (!this.player || !this.player.character) {
            console.log("No character to display");
            return;
        }
        
        // Update the character image
        const charImg = document.getElementById('game-character-img');
        if (charImg) {
            // Use pre-generated fallback if available and character image isn't loaded
            if ((!this.player.image || !this.player.image.complete || this.player.image.naturalWidth === 0) && 
                this.player.character.generatedFallback) {
                charImg.src = this.player.character.generatedFallback;
            } else if (this.player.image.complete && this.player.image.naturalWidth > 0) {
                charImg.src = this.player.image.src;
            } else if (this.player.character.fallbackImage) {
                charImg.src = this.player.character.fallbackImage;
            }
        }
        
        // Update character name
        const charName = document.getElementById('game-character-name');
        if (charName) {
            charName.textContent = this.player.character.name;
        }
        
        // Update ability info
        this.updateAbilityCooldown();
    },
    
    // Create the character display in the game UI
    createCharacterDisplay: function() {
        // Check if the display already exists
        if (document.getElementById('game-character-display')) {
            return;
        }
        
        // Create the display elements
        const displayDiv = document.createElement('div');
        displayDiv.id = 'game-character-display';
        displayDiv.style.position = 'absolute';
        displayDiv.style.bottom = '10px';
        displayDiv.style.left = '10px';
        displayDiv.style.display = 'flex';
        displayDiv.style.alignItems = 'center';
        displayDiv.style.background = 'rgba(0, 0, 0, 0.7)';
        displayDiv.style.padding = '5px';
        displayDiv.style.borderRadius = '5px';
        
        // Character image
        const img = document.createElement('img');
        img.id = 'game-character-img';
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.marginRight = '10px';
        img.alt = 'Character';
        
        // Character info
        const infoDiv = document.createElement('div');
        
        // Character name
        const nameDiv = document.createElement('div');
        nameDiv.id = 'game-character-name';
        nameDiv.style.color = '#fff';
        nameDiv.style.fontWeight = 'bold';
        
        // Ability status
        const abilityDiv = document.createElement('div');
        abilityDiv.id = 'game-ability-status';
        abilityDiv.style.color = '#aaa';
        abilityDiv.style.fontSize = '12px';
        
        // Add elements to the document
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(abilityDiv);
        displayDiv.appendChild(img);
        displayDiv.appendChild(infoDiv);
        
        // Add to game section (instead of game-container which might not exist)
        document.getElementById('game-section').appendChild(displayDiv);
        
        // Mark the character display as created
        this.characterDisplay = true;
    },
    
    // Update the ability cooldown display
    updateAbilityCooldown: function() {
        if (!this.player || !this.player.character || !this.player.character.specialAbility) {
            return;
        }
        
        const abilityStatusDiv = document.getElementById('game-ability-status');
        if (!abilityStatusDiv) {
            return;
        }
        
        if (this.player.specialAbility.active) {
            abilityStatusDiv.textContent = "Special ability active!";
            abilityStatusDiv.style.color = '#00ff00';
        } else if (this.player.specialAbility.cooldown) {
            const now = Date.now();
            const elapsed = now - this.player.specialAbility.lastUsed;
            const remaining = Math.max(0, Math.ceil((this.player.specialAbility.cooldownTime - elapsed) / 1000));
            
            abilityStatusDiv.textContent = `Ability ready in ${remaining}s`;
            abilityStatusDiv.style.color = '#ff9900';
        } else {
            abilityStatusDiv.textContent = "Ability ready (press Shift)";
            abilityStatusDiv.style.color = '#00ffff';
        }
    },
    
    // Award coins based on enemy type
    awardCoinsForEnemy: function(enemy) {
        // Base coin reward - 1 coin per enemy
        let coinReward = 1;
        
        // Bonus based on enemy type/color
        if (enemy.color === '#ff0000') { // Red enemies (top row, strongest)
            coinReward += 2; // 3 coins total
        } else if (enemy.color === '#ff7700') { // Orange enemies (middle rows)
            coinReward += 1; // 2 coins total
        }
        
        // Bonus based on level
        coinReward += Math.floor(this.level / 3);
        
        // Update coins earned
        this.coinsEarned += coinReward;
        
        // Update total coins (starting coins + earned coins)
        const totalCoins = this.startingPlayerCoins + this.coinsEarned;
        
        // Update UI
        document.getElementById('game-coins').querySelector('span').textContent = totalCoins;
        
        // Create coin floating text
        this.createCoinText(enemy.x + enemy.width/2, enemy.y, coinReward);
    },
    
    // Create floating text to show coins earned
    createCoinText: function(x, y, amount) {
        const text = {
            x: x,
            y: y,
            value: `+${amount}`,
            color: '#f1c40f', // Gold color
            alpha: 1,
            life: 30
        };
        
        // Add to texts array if it doesn't exist
        if (!this.floatingTexts) {
            this.floatingTexts = [];
        }
        
        this.floatingTexts.push(text);
    },
    
    // Update floating texts
    updateFloatingTexts: function() {
        if (!this.floatingTexts) return;
        
        for (let i = 0; i < this.floatingTexts.length; i++) {
            const text = this.floatingTexts[i];
            
            // Different behavior based on text type
            if (text.value.startsWith("LEVEL")) {
                // Level text stays in center and pulses
                if (text.life > 40) {
                    // Growing phase
                    text.scale = 1 + (60 - text.life) * 0.05;
                } else if (text.life < 20) {
                    // Shrinking phase
                    text.alpha -= 0.05;
                    text.scale = text.life * 0.05;
                }
            } else {
                // Coin text floats up
                text.y -= 1;
                text.alpha -= 0.03;
            }
            
            text.life--; // Decrease life
            
            if (text.life <= 0) {
                this.floatingTexts.splice(i, 1);
                i--;
            }
        }
    },
    
    // Draw floating texts
    drawFloatingTexts: function() {
        if (!this.floatingTexts) return;
        
        this.ctx.save();
        
        for (const text of this.floatingTexts) {
            this.ctx.globalAlpha = text.alpha;
            this.ctx.fillStyle = text.color;
            
            // Check if this is a level-up text (based on the value starting with "LEVEL")
            if (text.value.startsWith("LEVEL")) {
                // Draw level-up text with shadow and larger size
                this.ctx.shadowColor = "#000000";
                this.ctx.shadowBlur = 5;
                this.ctx.font = `bold ${32 * text.scale}px 'Press Start 2P', cursive`;
            } else {
                // Draw regular coin text
                this.ctx.font = 'bold 16px Arial';
            }
            
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text.value, text.x, text.y);
        }
        
        this.ctx.restore();
    },
    
    // Create the player based on the character
    createPlayer: function() {
        const character = this.state.playerCharacter || { 
            name: 'Default', 
            rarity: 'common',
            stats: { health: 100, speed: 5, fireRate: 5 }
        };
        
        // Use character stats or defaults
        const stats = character.stats || { health: 100, speed: 5, fireRate: 5 };
        
        this.state.player = {
            x: this.settings.width / 2 - 25,
            y: this.settings.height - 70,
            width: 50,
            height: 50,
            health: stats.health,
            speed: 3 + stats.speed / 3, // Adjusted speed formula
            fireRate: stats.fireRate,
            color: '#00FF00',
            lastFired: 0,
            lives: 3,
            image: null,
            fallbackImage: null,
            imageLoaded: false
        };
        
        // Attempt to load the character image if available
        if (character.image) {
            this.state.player.image = new Image();
            this.state.player.image.src = character.image;
            
            // Handle successful image load
            this.state.player.image.onload = () => {
                console.log('Player image loaded successfully');
                this.state.player.imageLoaded = true;
            };
            
            // Handle image load error
            this.state.player.image.onerror = () => {
                console.log('Failed to load player image, creating fallback');
                
                // Use pre-generated fallback if available
                if (character.fallbackImage) {
                    console.log('Using pre-generated fallback image');
                    this.state.player.fallbackImage = character.fallbackImage;
                } else {
                    // Create fallback image
                    this.createFallbackPlayerImage(character);
                }
            };
        } else {
            // No image specified, create a fallback
            this.createFallbackPlayerImage(character);
        }
    },
    
    // Create a fallback image for the player
    createFallbackPlayerImage: function(character) {
        // Get first letter of character name
        const initial = character.name ? character.name.charAt(0).toUpperCase() : 'P';
        
        // Set color based on rarity
        let color = '#aaaaaa'; // Default gray for common
        if (character.rarity === 'rare') color = '#3498db';
        if (character.rarity === 'epic') color = '#9b59b6';
        if (character.rarity === 'legendary') color = '#f1c40f';
        
        // Create canvas for fallback image
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initial, canvas.width / 2, canvas.height / 2);
        
        // Store the fallback image
        this.state.player.fallbackImage = canvas;
    },
    
    // Create defensive walls
    createDefensiveWalls: function() {
        // Create 4 defensive walls spaced across the bottom section
        const wallWidth = 80;
        const wallHeight = 60;
        const wallY = this.settings.height - 150;
        const spacing = this.settings.width / 5;
        
        for (let i = 0; i < 4; i++) {
            const wall = {
                x: spacing * (i + 1) - (wallWidth / 2),
                y: wallY,
                width: wallWidth,
                height: wallHeight,
                segments: [],
                color: '#8a8a8a'
            };
            
            // Create wall segments for destructible walls
            const segmentSize = 10;
            for (let row = 0; row < wallHeight / segmentSize; row++) {
                for (let col = 0; col < wallWidth / segmentSize; col++) {
                    // Shape the wall with a slight arch
                    if (row === 0 && (col < 2 || col > wallWidth / segmentSize - 3)) {
                        continue; // Skip corners for arch shape
                    }
                    
                    const segment = {
                        x: wall.x + col * segmentSize,
                        y: wall.y + row * segmentSize,
                        width: segmentSize,
                        height: segmentSize,
                        health: 3
                    };
                    wall.segments.push(segment);
                }
            }
            
            this.state.walls.push(wall);
        }
        
        console.log('Created defensive walls:', this.state.walls.length);
    },
    
    setupCanvas: function() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on container
        const container = document.getElementById('gameContainer');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Store dimensions for calculations
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        console.log('Canvas setup complete:', this.width, 'x', this.height);
    },
    
    setupInputHandlers: function() {
        // Set up keyboard input
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Special ability with Shift key
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.activateSpecialAbility();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        console.log('Input handlers initialized');
    },
    
    initializeGameState: function() {
        // Reset core game state
        this.state.score = 0;
        this.state.level = 1;
        this.state.lives = this.settings.startingLives;
        this.state.gameOver = false;
        this.state.paused = false;
        this.state.specialAbilityCooldown = 0;
        
        // Clear game objects
        this.state.player = null;
        this.state.enemies = [];
        this.state.bullets = [];
        this.state.walls = [];
        this.state.explosions = [];
        
        console.log('Game state initialized');
    },
    
    startGameLoop: function() {
        // Store timestamp for frame rate calculations
        this.lastTime = performance.now();
        
        // Initialize UI
        this.updateUI();
        
        // Check if API key is available for score submission
        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) {
            console.warn('No API key found - score submission will be disabled');
        }
        
        // Start the animation loop
        requestAnimationFrame(this.gameLoop.bind(this));
        console.log('Game loop started');
    }
}; 