// Characters Controller
const Characters = {
    // Characters data
    characters: [],
    selectedCharacter: null,
    
    // Initialize Characters
    init: function() {
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Show characters section
        document.getElementById('characters-btn').addEventListener('click', async () => {
            await this.showCharactersSection();
        });
        
        // Back to menu
        document.getElementById('characters-back-btn').addEventListener('click', () => {
            Auth.showMainMenu();
        });
        
        // Back to character list
        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            document.getElementById('character-details').classList.add('hide');
            document.getElementById('character-list').parentElement.classList.remove('hide');
        });
        
        // Select character
        document.getElementById('select-character-btn').addEventListener('click', async () => {
            if (this.selectedCharacter) {
                try {
                    await this.selectCharacter(this.selectedCharacter._id);
                    alert(`${this.selectedCharacter.name} selected as your character!`);
                    Auth.showMainMenu();
                } catch (error) {
                    console.error('Error selecting character:', error);
                    alert('Error selecting character. Please try again.');
                }
            }
        });
    },
    
    // Show characters section
    showCharactersSection: async function() {
        document.querySelectorAll('.section').forEach(section => section.classList.add('hide'));
        document.getElementById('characters-section').classList.remove('hide');
        
        // Hide character details
        document.getElementById('character-details').classList.add('hide');
        document.getElementById('character-list').parentElement.classList.remove('hide');
        
        // Load characters
        await this.loadCharacters();
    },
    
    // Load user's characters
    loadCharacters: async function() {
        try {
            // Get all characters
            const allCharacters = await api.getAllCharacters();
            
            // Map to store if user has each character
            const userCharacterMap = new Map();
            Auth.currentUser.characters.forEach(char => {
                userCharacterMap.set(char._id, true);
            });
            
            // Store characters data
            this.characters = allCharacters.map(char => {
                return {
                    ...char,
                    owned: userCharacterMap.has(char._id)
                };
            });
            
            // Set selected character
            this.selectedCharacter = Auth.currentUser.selectedCharacter;
            
            // Render characters
            this.renderCharacterList();
        } catch (error) {
            console.error('Error loading characters:', error);
            alert('Error loading characters. Please try again.');
        }
    },
    
    // Render character list
    renderCharacterList: function() {
        const characterList = document.getElementById('character-list');
        characterList.innerHTML = '';
        
        this.characters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-card';
            
            // Add selected class if this is the selected character
            if (this.selectedCharacter && character._id === this.selectedCharacter._id) {
                card.classList.add('selected');
            }
            
            // Add "locked" style if not owned
            if (!character.owned) {
                card.classList.add('locked');
            }
            
            // Pre-load the character image to check if it exists
            const preloadImg = new Image();
            preloadImg.onload = () => {
                // Image loaded successfully, update the card
                card.querySelector('.character-img img').src = character.image;
            };
            preloadImg.onerror = () => {
                // Image failed to load, create a colored block with initial
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
                
                // Update the image source
                card.querySelector('.character-img img').src = canvas.toDataURL('image/png');
            };
            preloadImg.src = character.image;
            
            // Create card content with character image placeholder first
            card.innerHTML = `
                <div class="character-img">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="${character.name}">
                </div>
                <h3>${character.name}</h3>
                <div class="rarity ${character.rarity}">${character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)}</div>
                ${!character.owned ? '<div class="locked-label">LOCKED</div>' : ''}
            `;
            
            // Add event listener to view character details
            card.addEventListener('click', () => {
                this.viewCharacterDetails(character);
            });
            
            characterList.appendChild(card);
        });
    },
    
    // View character details
    viewCharacterDetails: function(character) {
        const detailsSection = document.getElementById('character-details');
        
        // Pre-load the character image to check if it exists
        const preloadImg = new Image();
        preloadImg.onload = () => {
            // Image loaded successfully, update the details
            detailsSection.querySelector('.character-image').innerHTML = `<img src="${character.image}" alt="${character.name}">`;
        };
        preloadImg.onerror = () => {
            // Image failed to load, create a colored block with initial
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
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
            ctx.fillRect(20, 20, 160, 160);
            
            // Draw character initial
            ctx.fillStyle = '#000000';
            ctx.font = '80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(character.name.charAt(0), 100, 100);
            
            // Update the image source
            detailsSection.querySelector('.character-image').innerHTML = `<img src="${canvas.toDataURL('image/png')}" alt="${character.name}">`;
        };
        preloadImg.src = character.image;
        
        // Set a loading placeholder initially
        detailsSection.querySelector('.character-image').innerHTML = `
            <div class="loading-placeholder" style="width:200px;height:200px;background:#222;display:flex;align-items:center;justify-content:center;">
                <span>Loading...</span>
            </div>
        `;
        
        detailsSection.querySelector('.character-name').textContent = character.name;
        
        const rarityElement = detailsSection.querySelector('.character-rarity');
        rarityElement.textContent = `Rarity: ${character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)}`;
        rarityElement.className = 'character-rarity';
        rarityElement.classList.add(character.rarity);
        
        detailsSection.querySelector('.character-description').textContent = character.description;
        
        // Update stats
        detailsSection.querySelector('.character-stats').innerHTML = `
            <h4>Stats:</h4>
            <div>Speed: ${character.stats.speed}</div>
            <div>Fire Rate: ${character.stats.fireRate}</div>
            <div>Health: ${character.stats.health}</div>
            <div>Damage: ${character.stats.damage}</div>
        `;
        
        // Update ability
        if (character.specialAbility && character.specialAbility.name) {
            detailsSection.querySelector('.character-ability').innerHTML = `
                <h4>Special Ability:</h4>
                <div class="ability-name">${character.specialAbility.name}</div>
                <div class="ability-desc">${character.specialAbility.description}</div>
                <div class="ability-cooldown">Cooldown: ${character.specialAbility.cooldown}s</div>
            `;
        } else {
            detailsSection.querySelector('.character-ability').innerHTML = '';
        }
        
        // Enable/disable select button based on ownership
        const selectButton = document.getElementById('select-character-btn');
        if (character.owned) {
            selectButton.removeAttribute('disabled');
            selectButton.textContent = 'Select';
        } else {
            selectButton.setAttribute('disabled', 'disabled');
            selectButton.textContent = 'Not Owned';
        }
        
        // Store reference to selected character
        this.selectedCharacter = character;
        
        // Show details section
        document.getElementById('character-list').parentElement.classList.add('hide');
        detailsSection.classList.remove('hide');
    },
    
    // Select character
    selectCharacter: async function(characterId) {
        try {
            const result = await api.selectCharacter(characterId);
            
            if (result.success) {
                // Update selected character in game logic
                Game.selectedCharacter = this.characters.find(char => char._id === characterId);
                
                return true;
            } else {
                throw new Error('Failed to select character');
            }
        } catch (error) {
            console.error('Error selecting character:', error);
            throw error;
        }
    }
}; 