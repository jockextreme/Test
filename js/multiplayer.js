import { database, auth } from './firebase-config.js';
import { ref, push, set, onValue, update, remove, onDisconnect, off } from "firebase/database";

const gameArea = document.getElementById('game-area');
const currentGameTitleElement = document.getElementById('current-game-title');
const chatMessagesElement = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');

let currentGameRef = null;
let playerId = null;
let currentGameId = null;

function createNewGame(gameId) {
    currentGameId = gameId;
    const newGameRef = push(ref(database, `games/${gameId}`));
    const gameKey = newGameRef.key;
    playerId = auth.currentUser ? auth.currentUser.uid : generateRandomId();
    set(ref(database, `games/${gameId}/${gameKey}`), {
        players: {
            [playerId]: {
                x: Math.random() * 500 + 50, // Spread initial positions
                y: Math.random() * 300 + 50
            }
        },
        gameState: {},
        chat: {} // Initialize chat node
    }).then(() => {
        joinGame(gameId, gameKey);
    });
}

function joinGame(gameId, gameKey) {
    currentGameId = gameId;
    currentGameRef = ref(database, `games/${gameId}/${gameKey}`);
    playerId = auth.currentUser ? auth.currentUser.uid : generateRandomId();
    set(ref(database, `games/${gameId}/${gameKey}/players/${playerId}`), {
        x: Math.random() * 500 + 50, // Spread initial positions
        y: Math.random() * 300 + 50
    }).then(() => {
        setupRealtimeListeners(gameId, gameKey);
        document.getElementById('game-selection').style.display = 'none';
        gameArea.style.display = 'flex'; // Changed to flex for layout
        currentGameTitleElement.textContent = getGameDisplayName(gameId);
        startGame(gameId);
    });
}

function setupRealtimeListeners(gameId, gameKey) {
    const playersRef = ref(database, `games/${gameId}/${gameKey}/players`);
    onValue(playersRef, (snapshot) => {
        const playersData = snapshot.val();
        if (playersData) {
            updatePlayers(playersData);
        }
    });

    const gameStateRef = ref(database, `games/${gameId}/${gameKey}/gameState`);
    onValue(gameStateRef, (snapshot) => {
        const gameState = snapshot.val();
        if (gameState) {
            updateGameState(gameState);
        }
    });

    const chatRef = ref(database, `games/${gameId}/${gameKey}/chat`);
    onValue(chatRef, (snapshot) => {
        const chatData = snapshot.val();
        if (chatData) {
            displayChatMessages(chatData);
        } else {
            chatMessagesElement.innerHTML = ''; // Clear messages if none
        }
    });

    onDisconnect(ref(database, `games/${gameId}/${gameKey}/players/${playerId}`)).remove();
}

function updatePlayerPosition(x, y) {
    if (currentGameRef && playerId) {
        update(ref(database, `games/${currentGameRef.key}/players/${playerId}`), {
            x: x,
            y: y
        });
    }
}

function updateGameStateInDatabase(newState) {
    if (currentGameRef) {
        update(ref(database, `games/${currentGameRef.key}/gameState`), newState);
    }
}

function leaveGame(gameId, gameKey) {
    if (currentGameRef && playerId) {
        remove(ref(database, `games/${gameId}/${gameKey}/players/${playerId}`)).then(() => {
            if (currentGameRef) {
                offAllListeners(gameId, gameKey);
                currentGameRef = null;
            }
            playerId = null;
            currentGameId = null;
            document.getElementById('game-selection').style.display = 'flex';
            gameArea.style.display = 'none';
        });
    }
}

function sendMessage() {
    if (currentGameRef && playerId && chatInput.value.trim() !== "") {
        push(ref(database, `games/${currentGameRef.key}/chat`), {
            userId: playerId,
            message: chatInput.value.trim(),
            timestamp: Date.now()
        });
        chatInput.value = "";
    }
}

function displayChatMessages(chatData) {
    chatMessagesElement.innerHTML = "";
    const messages = Object.values(chatData).sort((a, b) => a.timestamp - b.timestamp);
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${msg.userId.substring(0, 5)}: ${msg.message}`; // Basic display
        chatMessagesElement.appendChild(messageDiv);
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight; // Scroll to bottom
    });
}

function getGameDisplayName(gameId) {
    if (gameId === 'game-1') return 'Simple Circles';
    if (gameId === 'game-2') return 'Coming Soon Game';
    return 'Unknown Game';
}

function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
}

function offAllListeners(gameId, gameKey) {
    if (gameId && gameKey) {
        off(ref(database, `games/${gameId}/${gameKey}/players`));
        off(ref(database, `games/${gameId}/${gameKey}/gameState`));
        off(ref(database, `games/${gameId}/${gameKey}/chat`));
    }
}

// Event listeners for chat
document.addEventListener('DOMContentLoaded', () => {
    if (sendChatButton) {
        sendChatButton.addEventListener('click', sendMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
