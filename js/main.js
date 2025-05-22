import { auth } from './firebase-config.js';
import './localstorage.js';
import * as multiplayer from './multiplayer.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameButtons = document.querySelectorAll('.game-button');

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.dataset.gameId;
            if (gameId) {
                multiplayer.createNewGame(gameId);
            }
        });
    });

    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is signed in:', user.uid);
            window.playerId = user.uid;
        } else {
            console.log('User is signed out');
            window.playerId = null;
        }
    });

    window.updatePlayerPosition = multiplayer.updatePlayerPosition;
});
      
