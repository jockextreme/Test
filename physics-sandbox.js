class PhysicsSandbox {
    constructor() {
        this.entities = new Map();
        this.gravityWells = [];
        this.temporalZones = [];
        this.quantumFields = [];
        this.particles = [];
        this.spatialGrid = new SpatialHashGrid(100);
        this.realityIntegrity = 1.0;
        this.quantumEngine = null;
    }

    init(quantumEngine) {
        this.quantumEngine = quantumEngine;
        this.setupQuantumEntanglement();
    }

    setupQuantumEntanglement() {
        // Entangle physics with quantum states
        this.quantumEngine.entanglementChannel.onmessage = (e) => {
            if (e.data.type === 'reality-shift') {
                this.applyRealityDistortion(e.data.severity);
            }
        };
    }

    createEntity(id, config) {
        const entity = {
            position: { x: config.x, y: config.y },
            velocity: { x: 0, y: 0 },
            mass: config.mass || 1,
            charge: config.charge || 0,
            quantumState: Math.random(),
            temporalFactor: 1.0,
            inTunnel: false,
            bounds: new BoundingCircle(config.x, config.y, config.radius)
        };
        
        this.entities.set(id, entity);
        this.spatialGrid.insert(entity.bounds);
        return entity;
    }

    applyRealityDistortion(severity) {
        // Warp physics parameters
        this.realityIntegrity = Math.max(0.1, 1 - severity);
        
        this.entities.forEach(entity => {
            entity.velocity.x *= (1 + (severity * 2 - 1));
            entity.velocity.y *= (1 + (severity * 2 - 1));
            entity.quantumState = Math.random();
        });
    }

    addGravityWell(x, y, strength, eventHorizon = 100) {
        this.gravityWells.push({
            position: { x, y },
            strength,
            eventHorizon,
            quantumTunnel: null
        });
    }

    addTemporalZone(x, y, radius, timeFactor) {
        this.temporalZones.push({
            position: { x, y },
            radius,
            timeFactor,
            bounds: new BoundingCircle(x, y, radius)
        });
    }

    quantumTunnelEffect(entity) {
        // Chance to teleport through barriers
        if (Math.random() < 0.02 * (1 - this.realityIntegrity)) {
            entity.inTunnel = true;
            entity.position.x = Math.random() * window.innerWidth;
            entity.position.y = Math.random() * window.innerHeight;
            this.generateParticles(entity.position.x, entity.position.y, 20);
        }
    }

    generateParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03
            });
        }
    }

    update(deltaTime) {
        this.processTemporalEffects(deltaTime);
        this.applyQuantumGravity();
        this.processCollisions();
        this.updateEntities(deltaTime);
        this.updateParticles(deltaTime);
    }

    processTemporalEffects(deltaTime) {
        this.entities.forEach(entity => {
            entity.temporalFactor = 1.0;
            this.temporalZones.forEach(zone => {
                if (this.checkCollision(entity.bounds, zone.bounds)) {
                    entity.temporalFactor = zone.timeFactor;
                }
            });
        });
    }

    applyQuantumGravity() {
        this.entities.forEach(entity => {
            this.gravityWells.forEach(well => {
                const dx = well.position.x - entity.position.x;
                const dy = well.position.y - entity.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < well.eventHorizon) {
                    const force = (well.strength * entity.mass) / (dist * dist);
                    const dir = { x: dx / dist, y: dy / dist };
                    
                    entity.velocity.x += dir.x * force * this.realityIntegrity;
                    entity.velocity.y += dir.y * force * this.realityIntegrity;
                    
                    if (dist < well.eventHorizon * 0.3) {
                        this.quantumTunnelEffect(entity);
                    }
                }
            });
        });
    }

    processCollisions() {
        const candidates = new Map();
        
        this.entities.forEach(entity => {
            entity.bounds.x = entity.position.x;
            entity.bounds.y = entity.position.y;
            this.spatialGrid.update(entity.bounds);
            
            const nearby = this.spatialGrid.query(entity.bounds);
            candidates.set(entity, nearby);
        });

        candidates.forEach((nearby, entity) => {
            nearby.forEach(other => {
                if (entity !== other && this.checkCollision(entity.bounds, other.bounds)) {
                    this.resolveCollision(entity, other);
                }
            });
        });
    }

    resolveCollision(a, b) {
        // Quantum superposition resolution
        if (Math.random() < a.quantumState * this.realityIntegrity) {
            [a.velocity.x, b.velocity.x] = [b.velocity.x, a.velocity.x];
            [a.velocity.y, b.velocity.y] = [b.velocity.y, a.velocity.y];
        } else {
            const dx = b.position.x - a.position.x;
            const dy = b.position.y - a.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = a.bounds.radius + b.bounds.radius;
            
            const correction = (distance - minDist) / distance;
            a.position.x += dx * correction * 0.5;
            a.position.y += dy * correction * 0.5;
            b.position.x -= dx * correction * 0.5;
            b.position.y -= dy * correction * 0.5;
        }
    }

    updateEntities(deltaTime) {
        this.entities.forEach(entity => {
            if (entity.inTunnel) {
                this.generateParticles(entity.position.x, entity.position.y, 2);
                entity.inTunnel = false;
            }
            
            const effectiveDelta = deltaTime * entity.temporalFactor;
            entity.position.x += entity.velocity.x * effectiveDelta;
            entity.position.y += entity.velocity.y * effectiveDelta;
            
            entity.velocity.x *= 0.99 ** effectiveDelta;
            entity.velocity.y *= 0.99 ** effectiveDelta;
        });
    }

    updateParticles(deltaTime) {
        this.particles = this.particles.filter(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= p.decay * deltaTime;
            return p.life > 0;
        });
    }
}

class BoundingCircle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

class SpatialHashGrid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    getCellKey(x, y) {
        return `${Math.floor(x/this.cellSize)},${Math.floor(y/this.cellSize)}`;
    }

    insert(bounds) {
        const keys = this.getCellKeys(bounds);
        keys.forEach(key => {
            if (!this.grid.has(key)) this.grid.set(key, new Set());
            this.grid.get(key).add(bounds);
        });
    }

    query(bounds) {
        const keys = this.getCellKeys(bounds);
        const results = new Set();
        keys.forEach(key => {
            if (this.grid.has(key)) {
                this.grid.get(key).forEach(item => {
                    if (item !== bounds) results.add(item);
                });
            }
        });
        return Array.from(results);
    }

    update(bounds) {
        // Optimized spatial grid update
        const newKeys = this.getCellKeys(bounds);
        if (!bounds._gridKeys || !arraysEqual(newKeys, bounds._gridKeys)) {
            if (bounds._gridKeys) {
                bounds._gridKeys.forEach(oldKey => {
                    if (this.grid.has(oldKey)) {
                        this.grid.get(oldKey).delete(bounds);
                    }
                });
            }
            this.insert(bounds);
            bounds._gridKeys = newKeys;
        }
    }

    getCellKeys(bounds) {
        const minX = Math.floor((bounds.x - bounds.radius) / this.cellSize);
        const maxX = Math.floor((bounds.x + bounds.radius) / this.cellSize);
        const minY = Math.floor((bounds.y - bounds.radius) / this.cellSize);
        const maxY = Math.floor((bounds.y + bounds.radius) / this.cellSize);
        
        const keys = [];
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                keys.push(`${x},${y}`);
            }
        }
        return keys;
    }
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}

// Export for quantum entanglement
if (typeof module !== 'undefined') module.exports = PhysicsSandbox;
