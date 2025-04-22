// Leaderboard Controller
const Leaderboard = {
    // Initialize Leaderboard
    init: function() {
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Show leaderboard section
        document.getElementById('leaderboard-btn').addEventListener('click', async () => {
            await this.showLeaderboardSection();
        });
        
        // Back to menu
        document.getElementById('leaderboard-back-btn').addEventListener('click', () => {
            Auth.showMainMenu();
        });
    },
    
    // Show leaderboard section
    showLeaderboardSection: async function() {
        document.querySelectorAll('.section').forEach(section => section.classList.add('hide'));
        document.getElementById('leaderboard-section').classList.remove('hide');
        
        // Load leaderboard data
        await this.loadLeaderboard();
    },
    
    // Load leaderboard data
    loadLeaderboard: async function() {
        try {
            const leaderboardData = await api.getLeaderboard();
            this.renderLeaderboard(leaderboardData);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            document.getElementById('leaderboard-list').innerHTML = '<p>Error loading leaderboard. Please try again later.</p>';
        }
    },
    
    // Render leaderboard
    renderLeaderboard: function(scores) {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        
        if (scores.length === 0) {
            leaderboardList.innerHTML = '<p>No scores recorded yet. Be the first to play!</p>';
            return;
        }
        
        scores.forEach((score, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            // Highlight current user's score
            if (Auth.currentUser && score.userId === Auth.currentUser._id) {
                item.classList.add('current-user');
            }
            
            // Format date
            const scoreDate = new Date(score.date);
            const formattedDate = `${scoreDate.toLocaleDateString()} ${scoreDate.toLocaleTimeString()}`;
            
            item.innerHTML = `
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-username">${score.username}</div>
                    <div class="leaderboard-score">${score.score}</div>
                    <div class="leaderboard-date">${formattedDate}</div>
                    <div class="leaderboard-character">
                        ${score.characterUsed ? `
                            <img src="${score.characterUsed.image}" alt="${score.characterUsed.name}">
                            <span>${score.characterUsed.name}</span>
                        ` : 'Default Ship'}
                    </div>
                </div>
            `;
            
            leaderboardList.appendChild(item);
        });
    }
}; 