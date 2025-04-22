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
            
            // Create card content with character image
            card.innerHTML = `
                <div class="character-img">
                    <img src="${character.image}" alt="${character.name}">
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
        
        // Update character details
        detailsSection.querySelector('.character-image').innerHTML = `<img src="${character.image}" alt="${character.name}">`;
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