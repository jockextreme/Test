const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const players = {};
const projectiles = {};
const leaderboard = [];
const hitCooldown = 1000; // Milliseconds of invulnerability after getting hit
const respawnDelay = 3000; // Milliseconds before respawning

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('newPlayer', (data) => {
        const newPlayer = {
            id: socket.id,
            x: Math.random() * 780 + 10,
            y: Math.random() * 580 + 10,
            name: data.name,
            score: 0,
            health: 100,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            lastHitTime: 0,
            isEliminated: false,
        };
        players[socket.id] = newPlayer;

        socket.emit('newPlayer', newPlayer);
        socket.broadcast.emit('newPlayer', newPlayer);

        socket.emit('gameState', { players, projectiles });
        socket.emit('leaderboardUpdate', getLeaderboard());
    });

    socket.on('playerInput', (data) => {
        if (players[socket.id] && !players[socket.id].isEliminated) {
            players[socket.id].x += data.dx || 0;
            players[socket.id].y += data.dy || 0;

            players[socket.id].x = Math.max(10, Math.min(players[socket.id].x, 790));
            players[socket.id].y = Math.max(10, Math.min(players[socket.id].y, 590));

            socket.broadcast.emit('playerUpdate', players[socket.id]);
        }
    });

    socket.on('shoot', (data) => {
        if (players[socket.id] && !players[socket.id].isEliminated) {
            const projectileId = uuidv4();
            const projectile = {
                id: projectileId,
                playerId: socket.id,
                x: players[socket.id].x,
                y: players[socket.id].y,
                angle: data.angle,
                speed: 5,
            };
            projectiles[projectileId] = projectile;
            io.emit('newProjectile', projectile);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
        io.emit('leaderboardUpdate', getLeaderboard());
    });
});

setInterval(() => {
    for (const id in projectiles) {
        const projectile = projectiles[id];
        projectile.x += Math.cos(projectile.angle) * projectile.speed;
        projectile.y += Math.sin(projectile.angle) * projectile.speed;

        if (projectile.x < 0 || projectile.x > 800 || projectile.y < 0 || projectile.y > 600) {
            delete projectiles[id];
            io.emit('projectileRemoved', id);
            continue;
        }

        for (const playerId in players) {
            if (playerId !== projectile.playerId && !players[playerId].isEliminated) {
                const player = players[playerId];
                const distance = Math.sqrt(
                    Math.pow(projectile.x - player.x, 2) + Math.pow(projectile.y - player.y, 2)
                );
                if (distance < 15 && Date.now() - player.lastHitTime > hitCooldown) {
                    console.log(`Player ${players[projectile.playerId].name} hit ${player.name}`);
                    player.health -= 25;
                    player.lastHitTime = Date.now();
                    io.to(playerId).emit('playerHit', playerId); // Notify the hit player
                    io.emit('playerUpdate', player);

                    delete projectiles[id];
                    io.emit('projectileRemoved', id);

                    if (player.health <= 0) {
                        console.log(`${player.name} eliminated!`);
                        player.isEliminated = true;
                        players[projectile.playerId].score += 50; // Award points for elimination
                        io.emit('playerUpdate', players[projectile.playerId]);
                        io.emit('leaderboardUpdate', getLeaderboard());

                        // Respawn timer
                        setTimeout(() => {
                            player.health = 100;
                            player.isEliminated = false;
                            player.x = Math.random() * 780 + 10;
                            player.y = Math.random() * 580 + 10;
                            io.emit('playerUpdate', player);
                            console.log(`${player.name} respawned.`);
                        }, respawnDelay);
                    }
                    break;
                }
            }
        }
    }
}, 20);

function getLeaderboard() {
    const leaderboardData = [];
    for (const id in players) {
        leaderboardData.push({
            id: players[id].id,
            name: players[id].name,
            score: players[id].score,
            health: players[id].health,
        });
    }
    leaderboardData.sort((a, b) => b.score - a.score);
    return leaderboardData;
}

setInterval(() => {
    io.emit('leaderboardUpdate', getLeaderboard());
}, 5000); // Update leaderboard periodically

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
                  
