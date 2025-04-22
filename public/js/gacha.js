// Gacha Controller
const Gacha = {
    // Initialize Gacha
    init: function() {
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Show gacha section
        document.getElementById('gacha-btn').addEventListener('click', () => {
            this.showGachaSection();
        });
        
        // Back to menu
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            Auth.showMainMenu();
        });
        
        // Single pull
        document.getElementById('single-pull-btn').addEventListener('click', async () => {
            try {
                if (Auth.currentUser.coins < 10) {
                    alert('Not enough coins! You need 10 coins for a single pull.');
                    return;
                }
                
                await this.singlePull();
            } catch (error) {
                console.error('Error during gacha pull:', error);
                alert('Error during gacha pull. Please try again.');
            }
        });
        
        // Multi pull
        document.getElementById('multi-pull-btn').addEventListener('click', async () => {
            try {
                if (Auth.currentUser.coins < 100) {
                    alert('Not enough coins! You need 100 coins for a multi pull.');
                    return;
                }
                
                await this.multiPull();
            } catch (error) {
                console.error('Error during multi gacha pull:', error);
                alert('Error during multi gacha pull. Please try again.');
            }
        });
        
        // Continue after pull
        document.getElementById('continue-btn').addEventListener('click', () => {
            document.getElementById('pull-result').classList.add('hide');
            document.querySelector('.gacha-options').classList.remove('hide');
        });
        
        // Continue after multi pull
        document.getElementById('multi-continue-btn').addEventListener('click', () => {
            document.getElementById('multi-pull-result').classList.add('hide');
            document.querySelector('.gacha-options').classList.remove('hide');
        });
    },
    
    // Show gacha section
    showGachaSection: function() {
        document.querySelectorAll('.section').forEach(section => section.classList.add('hide'));
        document.getElementById('gacha-section').classList.remove('hide');
        
        // Update coins display
        document.getElementById('gacha-user-coins').querySelector('span').textContent = Auth.currentUser.coins;
        
        // Hide pull results
        document.getElementById('pull-result').classList.add('hide');
        document.getElementById('multi-pull-result').classList.add('hide');
        document.querySelector('.gacha-options').classList.remove('hide');
    },
    
    // Single gacha pull
    singlePull: async function() {
        // Hide options
        document.querySelector('.gacha-options').classList.add('hide');
        
        // Show loading indicator
        document.getElementById('character-image').innerHTML = '<div class="loading">Pulling...</div>';
        document.getElementById('pull-result').classList.remove('hide');
        
        try {
            // Perform gacha pull
            const result = await api.gachaPull();
            
            // Update user's coins
            Auth.updateCoins(result.remainingCoins);
            
            // Display the character
            this.displayCharacter(result.character, result.newCharacter);
        } catch (error) {
            console.error('Error during gacha pull:', error);
            // Show error in the results area instead of an alert
            document.getElementById('character-image').innerHTML = '<div class="error">Error occurred</div>';
            document.getElementById('character-name').textContent = 'Error during gacha pull';
            document.getElementById('character-rarity').textContent = '';
            document.getElementById('character-description').textContent = 'Please try again.';
            document.getElementById('character-stats').innerHTML = '';
        }
    },
    
    // Multi gacha pull (10+1)
    multiPull: async function() {
        // Hide options
        document.querySelector('.gacha-options').classList.add('hide');
        
        // Show loading indicator
        document.querySelector('.multi-result-container').innerHTML = '<div class="loading">Pulling...</div>';
        document.getElementById('multi-pull-result').classList.remove('hide');
        
        try {
            // Perform multi gacha pull
            const result = await api.multiPull();
            
            // Update user's coins
            Auth.updateCoins(result.remainingCoins);
            
            // Display the characters
            this.displayMultiPull(result.pulls);
        } catch (error) {
            console.error('Error during multi gacha pull:', error);
            // Show error in the results area
            document.querySelector('.multi-result-container').innerHTML = 
                '<div class="error">Error during multi gacha pull. Please try again.</div>';
        }
    },
    
    // Display a character after gacha pull
    displayCharacter: function(character, isNew) {
        const characterImage = document.getElementById('character-image');
        const characterName = document.getElementById('character-name');
        const characterRarity = document.getElementById('character-rarity');
        const characterDescription = document.getElementById('character-description');
        const characterStats = document.getElementById('character-stats');
        
        // Set character image
        characterImage.innerHTML = `<img src="${character.image}" alt="${character.name}">`;
        
        // Set character info
        characterName.textContent = character.name;
        characterName.style.color = isNew ? '#f1c40f' : 'white';
        
        // Set rarity
        characterRarity.textContent = `Rarity: ${character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)}`;
        characterRarity.className = '';
        characterRarity.classList.add(character.rarity);
        
        // Set description
        characterDescription.textContent = character.description;
        
        // Set stats
        characterStats.innerHTML = `
            <div>Speed: ${character.stats.speed}</div>
            <div>Fire Rate: ${character.stats.fireRate}</div>
            <div>Health: ${character.stats.health}</div>
            <div>Damage: ${character.stats.damage}</div>
        `;
        
        // Add special ability information if available
        if (character.specialAbility && character.specialAbility.name) {
            characterStats.innerHTML += `
                <h4>Special Ability:</h4>
                <div class="ability">${character.specialAbility.name}</div>
                <div class="ability-desc">${character.specialAbility.description}</div>
            `;
        }
        
        // Add special notification for new character
        if (isNew) {
            characterName.innerHTML += ' <span class="new-label">NEW!</span>';
        }
    },
    
    // Display characters from multi pull
    displayMultiPull: function(characters) {
        const container = document.querySelector('.multi-result-container');
        container.innerHTML = '';
        
        characters.forEach(character => {
            const item = document.createElement('div');
            item.className = 'multi-result-item';
            
            // Check if this is a new character for the user
            const isNew = Auth.currentUser.characters.filter(c => c._id === character._id).length === 1;
            
            item.innerHTML = `
                <div class="character-img ${isNew ? 'new' : ''}">
                    <img src="${character.image}" alt="${character.name}">
                    ${isNew ? '<span class="new-badge">NEW!</span>' : ''}
                </div>
                <h4>${character.name}</h4>
                <div class="rarity ${character.rarity}">${character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)}</div>
            `;
            
            // Event listener to show character details
            item.addEventListener('click', () => {
                this.displayCharacter(character, isNew);
                document.getElementById('pull-result').classList.remove('hide');
                document.getElementById('multi-pull-result').classList.add('hide');
            });
            
            container.appendChild(item);
        });
    }
}; 