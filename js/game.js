const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
let players = {};

function startGame(gameId) {
    if (gameId === 'game-1') {
        gameCanvas.addEventListener('click', (event) => {
            const rect = gameCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            // Assuming updatePlayerPosition is in multiplayer.js and accessible
            window.updatePlayerPosition(x, y);
        });
    } else if (gameId === 'game-2') {
        // Initialize logic for game 2 here later
    }
    gameLoop();
}

function updatePlayers(playersData) {
    players = playersData;
    drawGame();
}

function updateGameState(gameState) {
    console.log('Game State Updated:', gameState);
    // Update local game state based on Firebase data for more complex games
}

function drawGame() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    if (currentGameId === 'game-1') {
        // Draw circles for each player
        for (const id in players) {
            const player = players[id];
            ctx.beginPath();
            ctx.arc(player.x, player.y, 15, 0, Math.PI * 2); // Slightly larger circles
            ctx.fillStyle = id === window.playerId ? 'blue' : 'red';
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(id.substring(0, 5), player.x, player.y + 20); // Show basic ID
        }
    } else if (currentGameId === 'game-2') {
        // Drawing logic for game 2 will go here
        ctx.fillStyle = '#888';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game 2 Coming Soon', gameCanvas.width / 2, gameCanvas.height / 2);
    } else {
        // Default drawing if no game is selected or recognized
        ctx.fillStyle = '#555';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Select a Game', gameCanvas.width / 2, gameCanvas.height / 2);
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    drawGame();
    // Add any continuous game logic here (e.g., animations, more complex interactions)
}
