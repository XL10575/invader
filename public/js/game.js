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
    
    // Animation frame
    animationId: null,
    
    // Initialize the game
    init: function() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Setup event listeners
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Game navigation buttons
        document.getElementById('start-game').addEventListener('click', () => {
            this.showGameSection();
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
        
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });
        
        document.getElementById('return-menu-btn').addEventListener('click', () => {
            this.quitGame();
        });
        
        // Show instructions button
        document.getElementById('instructions-btn').addEventListener('click', () => {
            document.getElementById('instructions-modal').classList.remove('hide');
            this.togglePause();
        });
        
        // Close instructions modal
        document.getElementById('close-instructions').addEventListener('click', () => {
            document.getElementById('instructions-modal').classList.add('hide');
            if (document.getElementById('pause-modal').classList.contains('hide')) {
                this.togglePause();
            }
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
                if (e.key === 'Shift' && this.player.character && this.player.character.specialAbility) {
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
        document.getElementById('game-over').classList.add('hide');
    },
    
    // Start the game
    startGame: function() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.gameOver = false;
        
        // Initialize game state
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.startTime = Date.now();
        
        // Create player
        this.createPlayer();
        
        // Create defensive walls
        this.createDefensiveWalls();
        
        // Create enemies
        this.createEnemies();
        
        // Update score display
        document.getElementById('game-score').querySelector('span').textContent = this.score;
        document.getElementById('game-lives').querySelector('span').textContent = this.lives;
        
        // Make sure game over menu is hidden
        document.getElementById('game-over').classList.add('hide');
        document.getElementById('pause-menu').classList.add('hide');
        
        // Start game loop
        this.gameLoop();
    },
    
    // Reset the game
    resetGame: function() {
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.particles = [];
        this.defensiveWalls = [];
        
        document.getElementById('game-score').querySelector('span').textContent = this.score;
        document.getElementById('game-lives').querySelector('span').textContent = this.lives;
        
        // Hide game over menu
        document.getElementById('game-over').classList.add('hide');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
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
    
    // Game over
    handleGameOver: function() {
        this.isRunning = false;
        this.gameOver = true;
        
        // Calculate play time in seconds
        this.playTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Show game over menu
        document.getElementById('game-over').classList.remove('hide');
        document.getElementById('final-score').querySelector('span').textContent = this.score;
        
        // Calculate coins earned (1 coin per 100 points)
        const coinsEarned = Math.floor(this.score / 100);
        document.getElementById('coins-earned').querySelector('span').textContent = coinsEarned;
        
        // Submit score to server
        this.submitScore(this.score, this.level, this.playTime);
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    // Submit score to server
    submitScore: async function(score, level, playTime) {
        try {
            const result = await api.submitScore({ score, level, playTime });
            Auth.updateCoins(result.coins);
            Auth.updateHighScore(result.highScore);
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    },
    
    // Create player
    createPlayer: function() {
        // Get selected character or use default if none selected
        let character = Auth.currentUser.selectedCharacter;
        
        // If no character is selected, use the default
        if (!character) {
            const defaultChar = characterData.find(char => char._id === defaultCharacters[0]);
            if (defaultChar) {
                character = defaultChar;
                // Update Auth.currentUser
                if (Auth.currentUser) {
                    Auth.currentUser.selectedCharacter = character;
                }
                console.log("Using default character:", character.name);
            } else {
                // Fallback to first character if default not found
                character = characterData[0];
                console.log("Using first character as fallback:", character.name);
            }
        }
        
        // Ensure character has stats
        const stats = character.stats || {
            speed: 5,
            fireRate: 5,
            health: 3,
            damage: 1
        };
        
        this.player = {
            x: this.width / 2 - 25,
            y: this.height - 60,
            width: 50,
            height: 30,
            speed: 5 + stats.speed / 2,
            fireRate: 300 - stats.fireRate * 20, // ms between shots
            lastFired: 0,
            damage: stats.damage,
            health: stats.health,
            moveLeft: false,
            moveRight: false,
            character: character,
            specialAbility: {
                active: false,
                cooldown: false,
                lastUsed: 0,
                duration: 0,
                cooldownTime: character.specialAbility ? character.specialAbility.cooldown * 1000 : 10000,
                use: function() {
                    // Will be implemented when we add special ability functionality
                }
            },
            // Store the image for the player
            image: new Image()
        };
        
        // Set the player image
        if (character.image) {
            console.log("Setting player image:", character.image);
            this.player.image.src = character.image;
        }
        
        // Update lives based on character health
        this.lives = this.player.health;
        document.getElementById('game-lives').querySelector('span').textContent = this.lives;
    },
    
    // Create enemies
    createEnemies: function() {
        this.enemies = [];
        this.enemyDirection = 1; // Reset direction when creating new enemies
        
        const rows = 5;
        const cols = 10;
        const enemyWidth = 40;
        const enemyHeight = 30;
        const padding = 20;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const enemy = {
                    x: col * (enemyWidth + padding) + padding,
                    y: row * (enemyHeight + padding) + padding + 30,
                    width: enemyWidth,
                    height: enemyHeight,
                    health: row === 0 ? 3 : row < 3 ? 2 : 1, // First row tougher
                    points: row === 0 ? 30 : row < 3 ? 20 : 10, // First row worth more points
                    color: row === 0 ? '#ff0000' : row < 3 ? '#ff7700' : '#ffff00'
                };
                
                this.enemies.push(enemy);
            }
        }
    },

    // Create defensive walls
    createDefensiveWalls: function() {
        this.defensiveWalls = [];
        
        const wallWidth = 60;
        const wallHeight = 40;
        const wallCount = 4;
        const gap = (this.width - (wallCount * wallWidth)) / (wallCount + 1);
        
        for (let i = 0; i < wallCount; i++) {
            const wall = {
                x: gap + i * (wallWidth + gap),
                y: this.height - 120,
                width: wallWidth,
                height: wallHeight,
                health: 20,
                segments: []
            };
            
            // Create wall segments (smaller blocks that make up the wall)
            const segmentSize = 10;
            const segmentRows = wallHeight / segmentSize;
            const segmentCols = wallWidth / segmentSize;
            
            for (let row = 0; row < segmentRows; row++) {
                for (let col = 0; col < segmentCols; col++) {
                    // Create an arch-like shape for the wall
                    if (row === 0 && (col === 0 || col === segmentCols - 1)) continue;
                    if (row === 1 && (col === 0 || col === segmentCols - 1)) continue;
                    
                    const segment = {
                        x: wall.x + col * segmentSize,
                        y: wall.y + row * segmentSize,
                        width: segmentSize,
                        height: segmentSize,
                        health: 2
                    };
                    
                    wall.segments.push(segment);
                }
            }
            
            this.defensiveWalls.push(wall);
        }
    },
    
    // Fire bullet
    fireBullet: function() {
        const now = Date.now();
        
        // Check fire rate
        if (now - this.player.lastFired < this.player.fireRate) {
            return;
        }
        
        this.player.lastFired = now;
        
        const bullet = {
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            speed: 10,
            damage: this.player.damage
        };
        
        this.bullets.push(bullet);
    },
    
    // Enemy fire bullet
    enemyFireBullet: function(enemy) {
        // Random chance to fire based on level, reduced to make it fairer
        if (Math.random() < 0.0005 * this.level) {
            const bullet = {
                x: enemy.x + enemy.width / 2 - 2,
                y: enemy.y + enemy.height,
                width: 4,
                height: 10,
                speed: 2 + this.level * 0.5 // Reduced enemy bullet speed
            };
            
            this.enemyBullets.push(bullet);
        }
    },
    
    // Game loop
    gameLoop: function() {
        if (!this.isRunning || this.isPaused) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update game objects
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updateEnemyBullets();
        this.updateParticles();
        
        // Check collisions
        this.checkCollisions();
        
        // Draw everything
        this.drawPlayer();
        this.drawDefensiveWalls();
        this.drawBullets();
        this.drawEnemies();
        this.drawEnemyBullets();
        this.drawParticles();
        
        // Continue the loop
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    },
    
    // Update player
    updatePlayer: function() {
        // Move player
        if (this.player.moveLeft) {
            this.player.x -= this.player.speed;
        }
        
        if (this.player.moveRight) {
            this.player.x += this.player.speed;
        }
        
        // Keep player within bounds
        if (this.player.x < 0) {
            this.player.x = 0;
        } else if (this.player.x + this.player.width > this.width) {
            this.player.x = this.width - this.player.width;
        }
    },
    
    // Update bullets
    updateBullets: function() {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.y -= bullet.speed;
            
            // Remove bullets that go off-screen
            if (bullet.y + bullet.height < 0) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    },
    
    // Update enemy bullets
    updateEnemyBullets: function() {
        for (let i = 0; i < this.enemyBullets.length; i++) {
            const bullet = this.enemyBullets[i];
            bullet.y += bullet.speed;
            
            // Remove bullets that go off-screen
            if (bullet.y > this.height) {
                this.enemyBullets.splice(i, 1);
                i--;
            }
        }
    },
    
    // Update enemies
    updateEnemies: function() {
        let changeDirection = false;
        
        // Check if any enemy is at the edge
        for (const enemy of this.enemies) {
            if ((enemy.x + enemy.width > this.width && this.enemyDirection > 0) || 
                (enemy.x < 0 && this.enemyDirection < 0)) {
                changeDirection = true;
                break;
            }
        }
        
        // If we need to change direction, flip the direction
        if (changeDirection) {
            this.enemyDirection *= -1;
        }
        
        // Update each enemy
        for (const enemy of this.enemies) {
            // Move enemies horizontally based on current direction
            enemy.x += this.enemyDirection * (0.5 + this.level * 0.1);
            
            // Check if enemy reached the bottom
            if (enemy.y + enemy.height > this.player.y) {
                this.handleGameOver();
                return;
            }
            
            // Enemy might fire
            this.enemyFireBullet(enemy);
        }
        
        // Check if all enemies are defeated
        if (this.enemies.length === 0) {
            this.levelUp();
        }
    },
    
    // Update particles
    updateParticles: function() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= 0.02;
            
            if (particle.alpha <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    },
    
    // Level up
    levelUp: function() {
        this.level++;
        this.createEnemies();
    },
    
    // Check collisions
    checkCollisions: function() {
        // Player bullets vs enemies
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            let bulletRemoved = false;
            
            // Check collision with defensive walls first
            for (const wall of this.defensiveWalls) {
                for (let j = 0; j < wall.segments.length; j++) {
                    const segment = wall.segments[j];
                    
                    if (this.isColliding(bullet, segment)) {
                        segment.health -= bullet.damage;
                        
                        // Create explosion particles
                        this.createExplosion(bullet.x, bullet.y, 3);
                        
                        // Remove bullet
                        this.bullets.splice(i, 1);
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
            
            // Check collision with enemies
            for (let j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];
                
                if (this.isColliding(bullet, enemy)) {
                    enemy.health -= bullet.damage;
                    
                    // Create explosion particles
                    this.createExplosion(bullet.x, bullet.y);
                    
                    // Remove bullet
                    this.bullets.splice(i, 1);
                    i--;
                    bulletRemoved = true;
                    
                    // Remove enemy if health depleted
                    if (enemy.health <= 0) {
                        this.score += enemy.points;
                        document.getElementById('game-score').querySelector('span').textContent = this.score;
                        
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20);
                        this.enemies.splice(j, 1);
                        j--;
                    }
                    
                    break;
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
                this.lives--;
                document.getElementById('game-lives').querySelector('span').textContent = this.lives;
                
                this.createExplosion(bullet.x, bullet.y);
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
        // Create a placeholder for the player if the image isn't loaded or available
        if (!this.player.image || !this.player.image.complete || !this.player.character || this.player.image.naturalWidth === 0) {
            // Fallback to default triangle ship
            this.ctx.fillStyle = '#00ff00';
            this.ctx.beginPath();
            this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y);
            this.ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
            this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Try loading the image again if it failed
            if (this.player.character && this.player.character.image && (!this.player.image || this.player.image.naturalWidth === 0)) {
                console.log("Retrying image load for:", this.player.character.name);
                this.player.image = new Image();
                this.player.image.src = this.player.character.image;
            }
        } else {
            // Draw character image if available and loaded
            this.ctx.drawImage(
                this.player.image,
                this.player.x, 
                this.player.y - 10, // Adjust position to make it look better
                this.player.width,
                this.player.height + 10 // Make the image slightly taller
            );
        }
        
        // Draw special ability indicator if available
        if (this.player.character && this.player.character.specialAbility && this.player.specialAbility.active) {
            // Show active special ability indicator
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx.fillRect(this.player.x - 5, this.player.y - 5, this.player.width + 10, this.player.height + 10);
        }
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
        this.ctx.fillStyle = '#00ffff';
        
        for (const bullet of this.bullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
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
        if (!this.player.specialAbility || 
            this.player.specialAbility.active || 
            this.player.specialAbility.cooldown) {
            return;
        }
        
        const now = Date.now();
        const ability = this.player.character.specialAbility;
        
        // Implement special ability based on character
        switch (ability.name) {
            case "Dodge Master":
                // Double speed for 3 seconds
                this.player.speed *= 2;
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 3000;
                setTimeout(() => {
                    this.player.speed /= 2;
                    this.player.specialAbility.active = false;
                }, 3000);
                break;
                
            case "Dingle Blast":
                // Fire a powerful shot that destroys enemies in a line
                const blast = {
                    x: this.player.x + this.player.width / 2 - 5,
                    y: this.player.y,
                    width: 10,
                    height: 20,
                    speed: 15,
                    damage: 10
                };
                this.bullets.push(blast);
                break;
                
            case "Tank Shield":
                // Temporary invincibility
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 5000;
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 5000);
                break;
                
            case "Ghost Bullets":
                // Next 5 shots pass through walls and enemies
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 10000;
                setTimeout(() => {
                    this.player.specialAbility.active = false;
                }, 10000);
                break;
            
            default:
                // Generic boost
                this.player.speed += 2;
                this.player.damage += 1;
                this.player.specialAbility.active = true;
                this.player.specialAbility.duration = 3000;
                setTimeout(() => {
                    this.player.speed -= 2;
                    this.player.damage -= 1;
                    this.player.specialAbility.active = false;
                }, 3000);
        }
        
        // Set cooldown
        this.player.specialAbility.cooldown = true;
        this.player.specialAbility.lastUsed = now;
        
        // Reset cooldown after time passes
        setTimeout(() => {
            this.player.specialAbility.cooldown = false;
        }, this.player.specialAbility.cooldownTime);
    }
}; 