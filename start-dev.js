const { spawn } = require('child_process');
const path = require('path');

console.log('Setting up Space Invaders Gacha...');

// Run seed script first
console.log('Seeding database with initial data...');
const seedProcess = spawn('node', [path.join(__dirname, 'server', 'seedData.js')], { 
    stdio: 'inherit',
    shell: true 
});

seedProcess.on('close', (code) => {
    if (code !== 0) {
        console.error(`Seed process exited with code ${code}`);
        return;
    }
    
    console.log('Database seeded successfully!');
    console.log('Starting application...');
    
    // Start the application
    const appProcess = spawn('nodemon', ['server.js'], { 
        stdio: 'inherit',
        shell: true 
    });
    
    appProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Application process exited with code ${code}`);
        }
    });
});

// Handle process termination
process.on('SIGINT', () => {
    seedProcess && seedProcess.kill();
    process.exit();
}); 