const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
let players = {};
let keysPressed = {};
const moveSpeed = 5;

function startGame(gameId) {
    if (gameId === 'game-1') {
        // Click to move (still active)
        gameCanvas.addEventListener('click', (event) => {
            const rect = gameCanvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            window.updatePlayerPosition(x, y);
        });

        // Keyboard movement
        window.addEventListener('keydown', (e) => {
            keysPressed[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            delete keysPressed[e.key];
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
        for (const id in players) {
            const player = players[id];
            ctx.beginPath();
            ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
            ctx.fillStyle = id === window.playerId ? 'blue' : 'red';
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(id.substring(0, 5), player.x, player.y + 20);
        }
    } else if (currentGameId === 'game-2') {
        ctx.fillStyle = '#888';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game 2 Coming Soon', gameCanvas.width / 2, gameCanvas.height / 2);
    } else {
        ctx.fillStyle = '#555';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Select a Game', gameCanvas.width / 2, gameCanvas.height / 2);
    }
}

function gameLoop() {
    if (currentGameId === 'game-1' && window.playerId && players[window.playerId]) {
        let newX = players[window.playerId].x;
        let newY = players[window.playerId].y;

        if (keysPressed['ArrowLeft'] || keysPressed['a']) newX -= moveSpeed;
        if (keysPressed['ArrowRight'] || keysPressed['d']) newX += moveSpeed;
        if (keysPressed['ArrowUp'] || keysPressed['w']) newY -= moveSpeed;
        if (keysPressed['ArrowDown'] || keysPressed['s']) newY += moveSpeed;

        if (newX !== players[window.playerId].x || newY !== players[window.playerId].y) {
            window.updatePlayerPosition(newX, newY);
        }
    }

    requestAnimationFrame(gameLoop);
    drawGame();
}
