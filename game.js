/**
 * 经典飞机大战 - Core Logic
 */

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const hud = document.getElementById('hud');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Game constants
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 60;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;

// Game state
let gameActive = false;
let score = 0;
let player;
let bullets = [];
let enemies = [];
let stars = [];
let explosions = [];
let keys = {};
let lastEnemySpawn = 0;
let spawnRate = 1000; // ms

// Handle Resize
function resize() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

window.addEventListener('resize', resize);
resize();

// Input handling
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 2 + 1;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Explosion {
    constructor(x, y, color) {
        this.particles = [];
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
        });
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw() {
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 3, 3);
        });
        ctx.globalAlpha = 1.0;
    }
}

class Player {
    constructor() {
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = 7;
        this.lastShot = 0;
        this.shootDelay = 200;
    }

    update() {
        if (keys['ArrowLeft'] || keys['KeyA']) this.x -= this.speed;
        if (keys['ArrowRight'] || keys['KeyD']) this.x += this.speed;
        if (keys['ArrowUp'] || keys['KeyW']) this.y -= this.speed;
        if (keys['ArrowDown'] || keys['KeyS']) this.y += this.speed;

        // Clamp to boundaries
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));

        // Shooting
        const now = Date.now();
        if (keys['Space'] && now - this.lastShot > this.shootDelay) {
            this.shoot();
            this.lastShot = now;
        }
    }

    shoot() {
        bullets.push(new Bullet(this.x + this.width / 2 - BULLET_WIDTH / 2, this.y));
    }

    draw() {
        ctx.fillStyle = '#00aaff'; // HSL(200, 100%, 50%)
        // Simple plane shape
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + this.width / 2 - 5, this.y + 20, 10, 15);
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor() {
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2 + Math.random() * 3;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = '#ff4d6d'; // HSL(350, 100%, 60%)
        // Simple enemy shape
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 8, this.y + 8, 5, 5);
        ctx.fillRect(this.x + this.width - 13, this.y + 8, 5, 5);
    }
}

function initGame() {
    player = new Player();
    bullets = [];
    enemies = [];
    explosions = [];
    if (stars.length === 0) {
        for (let i = 0; i < 50; i++) stars.push(new Star());
    }
    score = 0;
    scoreElement.textContent = score;
    gameActive = true;
    lastEnemySpawn = Date.now();

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    hud.classList.remove('hidden');

    gameLoop();
}

function gameOver() {
    gameActive = false;
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function spawnEnemy() {
    const now = Date.now();
    if (now - lastEnemySpawn > spawnRate) {
        enemies.push(new Enemy());
        lastEnemySpawn = now;
        // Gradually increase difficulty
        if (spawnRate > 300) spawnRate -= 5;
    }
}

function checkCollisions() {
    // Bullet vs Enemy
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                explosions.push(new Explosion(enemies[j].x + enemies[j].width / 2, enemies[j].y + enemies[j].height / 2, '#ff4d6d'));
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 10;
                scoreElement.textContent = score;
                break;
            }
        }
    }

    // Player vs Enemy
    for (let i = 0; i < enemies.length; i++) {
        if (
            player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y
        ) {
            explosions.push(new Explosion(player.x + player.width / 2, player.y + player.height / 2, '#00aaff'));
            gameOver();
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background stars always run
    stars.forEach(s => {
        s.update();
        s.draw();
    });

    // Update & Draw Explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].update();
        explosions[i].draw();
        if (explosions[i].particles.length === 0) explosions.splice(i, 1);
    }

    if (!gameActive) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // Update & Draw Player
    player.update();
    player.draw();

    // Update & Draw Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
        } else {
            bullets[i].draw();
        }
    }

    // Spawn, Update & Draw Enemies
    spawnEnemy();
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            // Optionally penalize missing enemies
        } else {
            enemies[i].draw();
        }
    }

    checkCollisions();

    requestAnimationFrame(gameLoop);
}

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);

// Start the background animation immediately
for (let i = 0; i < 50; i++) stars.push(new Star());
gameLoop();
