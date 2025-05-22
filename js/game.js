const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
let players = {};

function startGame(gameId) {
    if (gameId === 'game-1') {
        gameCanvas.addEventListener('click', (event)
          
