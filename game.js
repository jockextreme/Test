const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io();
const playerList = document.getElementById('playerList');

const players = {};
const projectiles = {};
let playerName = '';
const flashDuration = 100; // Milliseconds for hit flash
const hitPlayers = {};

// Prompt for player name
while (!playerName) {
    playerName = prompt('Enter your name:', `Player ${Math.floor(Math.random() * 1000)}`) || `Player ${Math.floor(Math.random() * 1000)}`;
}
socket.emit('newPlayer', { name: playerName });

// Handle new player connection
socket.on('newPlayer', (playerData) => {
    players[playerData.id] = playerData;
    console.log('New player connected:', playerData.id, playerData.name);
});

// Handle player updates
socket.on('playerUpdate', (updatedPlayer) => {
    if (players[updatedPlayer.id]) {
        players[updatedPlayer.id] = updatedPlayer;
    }
});

// Handle player disconnection
socket.on('playerDisconnected', (playerId) => {
    delete players[playerId];
    console.log('Player disconnected:', playerId);
});

// Handle game state
socket.on('gameState', (gameState) => {
    for (const id in gameState.players) {
        players[id] = gameState.players[id];
    }
    for (const id in gameState.projectiles) {
        projectiles[id] = gameState.projectiles[id];
    }
});

// Handle new projectile
socket.on('newProjectile', (projectileData) => {
    projectiles[projectileData.id] = projectileData;
});

// Handle projectile updates
socket.on('projectileUpdate', (updatedProjectile) => {
    if (projectiles[updatedProjectile.id]) {
        projectiles[updatedProjectile.id] = updatedProjectile;
    }
});

// Handle projectile removal
socket.on('projectileRemoved', (projectileId) => {
    delete projectiles[projectileId];
});

// Handle player hit
socket.on('playerHit', (playerId) => {
    hitPlayers[playerId] = Date.now();
});

// Handle leaderboard update
socket.on('leaderboardUpdate', (leaderboardData) => {
    playerList.innerHTML = '';
    leaderboardData.sort((a, b) => b.score - a.score).forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.score} (HP: ${player.health})`;
        playerList.appendChild(li);
    });
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw players
    for (const id in players) {
        const player = players[id];
        const isHit = hitPlayers[id] && Date.now() - hitPlayers[id] < flashDuration;
        ctx.fillStyle = isHit ? 'orange' : (player.color || 'blue');
        ctx.fillRect(player.x - 10, player.y - 10, 20, 20);

        // Draw health bar
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(player.x - 15, player.y + 25, 30, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x - 15, player.y + 25, 30 * (player.health / 100), 5);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(player.x - 15, player.y + 25, 30, 5);

        ctx.fillStyle = 'black';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, player.x, player.y - 15);
    }

    // Draw projectiles
    for (const id in projectiles) {
        const projectile = projectiles[id];
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(gameLoop);
}

// Handle user input
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    delete keys[event.key];
});

canvas.addEventListener('click', (event) => {
    if (players[socket.id] && players[socket.id].health > 0) {
        const angle = Math.atan2(event.clientY - canvas.offsetTop - players[socket.id].y, event.clientX - canvas.offsetLeft - players[socket.id].x);
        socket.emit('shoot', { angle: angle });
    }
});

function handleInput() {
    if (!players[socket.id] || players[socket.id].health <= 0) return;
    const speed = 2;
    let dx = 0;
    let dy = 0;

    if (keys['ArrowLeft'] || keys['a']) dx -= speed;
    if (keys['ArrowRight'] || keys['d']) dx += speed;
    if (keys['ArrowUp'] || keys['w']) dy -= speed;
    if (keys['ArrowDown'] || keys['s']) dy += speed;

    if (dx !== 0 || dy !== 0) {
        socket.emit('playerInput', { dx: dx, dy: dy });
    }
}

setInterval(handleInput, 20);

gameLoop();
