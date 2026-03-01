// game.js

// --- Global Variables & Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let cw, ch;

// Scenes
const sceneTransition = document.getElementById('transition-scene');
const sceneStart = document.getElementById('start-scene');
const sceneGame = document.getElementById('game-scene');
const sceneEnd = document.getElementById('end-scene');

// UI
const btnPlay = document.getElementById('btn-play');
const btnReplay = document.getElementById('btn-replay');
const heartsContainer = document.getElementById('hearts-container');
const killCountEl = document.getElementById('kill-count');
const endTitle = document.getElementById('end-title');
const endText = document.getElementById('end-text');

let isPlaying = false;
let animationId;
let lastTime = 0;

// Game State
const TILE_SIZE = 40;
let mapRows, mapCols;
let grid = [];
let particles = [];
let enemies = [];
let doors = [];
let player;

const COLORS = {
    bg: '#050505',
    wall: '#1a0d0d',
    wallLine: '#331111',
    floor: '#0a0a0a',
    door: '#4a0000',
    player: '#000000',
    playerAura: 'rgba(255,255,255,0.1)',
    blood: '#8B0000',
    enemySmall: '#301010',
    enemyMedium: '#4a1515',
    enemyBig: '#1c0505'
};

// Map configuration: 0 = floor, 1 = wall, 2 = red multiplier door
const levels = [
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 2, 1, 1, 1, 2, 1, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        enemies: [
            { x: 2, y: 2, t: 'small' },
            { x: 18, y: 2, t: 'small' },
            { x: 2, y: 13, t: 'medium' },
            { x: 18, y: 13, t: 'medium' }
        ]
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        enemies: [
            { x: 2, y: 2, t: 'small' },
            { x: 18, y: 2, t: 'small' },
            { x: 2, y: 13, t: 'small' },
            { x: 18, y: 13, t: 'small' },
            { x: 10, y: 7, t: 'medium' },
            { x: 10, y: 3, t: 'medium' }
        ]
    },
    {
        map: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        enemies: [
            { x: 2, y: 2, t: 'small' },
            { x: 18, y: 2, t: 'small' },
            { x: 2, y: 13, t: 'small' },
            { x: 18, y: 13, t: 'small' },
            { x: 10, y: 4, t: 'big' },
            { x: 10, y: 9, t: 'medium' },
            { x: 5, y: 7, t: 'medium' },
            { x: 15, y: 7, t: 'medium' }
        ]
    }
];

let currentLevel = 0;



// --- Input Handling ---
const keys = { w: false, a: false, s: false, d: false, dash: false };

window.addEventListener('keydown', e => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.w = true;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.a = true;
    if (e.key === 's' || e.key === 'ArrowDown') keys.s = true;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.d = true;
    if (e.key === ' ') {
        e.preventDefault(); // Prevent scrolling or button clicking
        if (!keys.dash) {
            keys.dash = true;
            if (player) player.dash();
        }
    }
});

window.addEventListener('keyup', e => {
    if (e.key === 'w' || e.key === 'ArrowUp') keys.w = false;
    if (e.key === 'a' || e.key === 'ArrowLeft') keys.a = false;
    if (e.key === 's' || e.key === 'ArrowDown') keys.s = false;
    if (e.key === 'd' || e.key === 'ArrowRight') keys.d = false;
    if (e.key === ' ') keys.dash = false;
});

// Resize
function resize() {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- Audio Engine (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgOsc, bgGain, heartbeatOsc, heartbeatGain;

function createNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

const noiseBuffer = createNoiseBuffer();

function initAudio() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Dissonant Ambient Drone (3 oscillators)
    bgGain = audioCtx.createGain();
    bgGain.gain.value = 0.08;
    bgGain.connect(audioCtx.destination);

    const freqs = [35, 36.5, 39]; // Dissonant low frequencies
    bgOsc = []; // changed to array for heartbeat speedup logic later

    for (let i = 0; i < freqs.length; i++) {
        let osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';

        // Lowpass filter to make it rumbling rather than harsh
        let filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 80;

        osc.frequency.setValueAtTime(freqs[i], audioCtx.currentTime);

        // LFO for slow pulsing
        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + (i * 0.05); // slightly different pulse rates
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(filter);
        filter.connect(bgGain);
        osc.start();
        lfo.start();
        bgOsc.push(osc);
    }
}

function playWhisper() {
    // Filtered noise swoosh (sounds like a ghostly breath/whisper)
    const dur = 1.2;
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 4;
    // Sweep filter frequency for whisper effect
    filter.frequency.setValueAtTime(400, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, audioCtx.currentTime + dur / 2);
    filter.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + dur);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + dur * 0.3);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);

    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noiseSrc.start();
    noiseSrc.stop(audioCtx.currentTime + dur);
}

function playHitSound() {
    // Meatier thud + noise crunch
    const dur = 0.3;
    const t = audioCtx.currentTime;

    // Sub-bass punch
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + dur);

    const gainOsc = audioCtx.createGain();
    gainOsc.gain.setValueAtTime(0.8, t);
    gainOsc.gain.exponentialRampToValueAtTime(0.01, t + dur);

    osc.connect(gainOsc);
    gainOsc.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur);

    // Noise crunch
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0.5, t);
    gainNoise.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noiseSrc.connect(filter);
    filter.connect(gainNoise);
    gainNoise.connect(audioCtx.destination);
    noiseSrc.start(t);
    noiseSrc.stop(t + dur);
}

function playKillSound(type) {
    // Screeching distorted down-sweep
    const dur = type === 'big' ? 1.2 : 0.4;
    const t = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'square';

    const startFreq = type === 'big' ? 150 : 400;
    const endFreq = type === 'big' ? 30 : 80;

    osc1.frequency.setValueAtTime(startFreq, t);
    osc1.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    osc2.frequency.setValueAtTime(startFreq * 1.05, t); // detuned
    osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.05, t + dur);

    const distort = audioCtx.createWaveShaper();
    distort.curve = makeDistortionCurve(type === 'big' ? 400 : 100);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4000, t);
    filter.frequency.linearRampToValueAtTime(200, t + dur);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(type === 'big' ? 0.4 : 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    osc1.connect(distort);
    osc2.connect(distort);
    distort.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(); osc2.start();
    osc1.stop(t + dur); osc2.stop(t + dur);
}

function makeDistortionCurve(amount) {
    let k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for (; i < n_samples; ++i) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
}


// --- Utility ---
function AABB(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function getGridPos(px, py, width, height) {
    return {
        c: Math.floor((px + width / 2) / TILE_SIZE),
        r: Math.floor((py + height / 2) / TILE_SIZE)
    };
}

function isWall(r, c) {
    if (r < 0 || r >= mapRows || c < 0 || c >= mapCols) return true;
    return grid[r][c] === 1;
}

// --- Classes ---

class Particle {
    constructor(x, y, color, size, speed, lifeTime) {
        this.x = x; this.y = y;
        this.color = color;
        this.size = size;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.life = lifeTime;
        this.maxLife = lifeTime;
    }
    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= dt;
    }
    draw(ctx, offsetX, offsetY) {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - offsetX, this.y - offsetY, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

class StaticBloodStain {
    constructor(x, y, size) {
        this.x = x; this.y = y;
        this.size = size;
        this.alpha = 0.5;
    }
    draw(ctx, offsetX, offsetY) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = COLORS.blood;
        ctx.fillRect(this.x - offsetX, this.y - offsetY, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}
const bloodStains = [];

class Player {
    constructor() {
        this.width = 24;
        this.height = 24;
        this.x = 10 * TILE_SIZE + (TILE_SIZE - this.width) / 2;
        this.y = 11 * TILE_SIZE + (TILE_SIZE - this.height) / 2;
        this.speed = 200; // px per second
        this.vx = 0; this.vy = 0;
        this.hp = 3;
        this.maxHp = 3;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCD = 0;
        this.invulnTimer = 0;
        this.trail = [];
    }

    dash() {
        if (this.dashCD <= 0) {
            this.isDashing = true;
            this.dashTimer = 0.2; // 200ms dash
            this.dashCD = 1.0; // 1s cooldown
            playWhisper(); // Dash sound
        }
    }

    damage(amount) {
        if (this.invulnTimer > 0) return;
        this.hp -= amount;
        this.invulnTimer = 1.5;
        playHitSound();
        updateUI();

        // Screen flash
        const overlay = document.createElement('div');
        overlay.id = 'damage-overlay';
        overlay.style.opacity = '1';
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 100);
        }, 50);

        // Screen shake
        canvas.style.transform = `translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`;
        setTimeout(() => canvas.style.transform = 'translate(0,0)', 100);

        if (this.hp <= 0) {
            endGame(false);
        }
    }

    update(dt) {
        // Cooldowns
        if (this.dashTimer > 0) this.dashTimer -= dt;
        else this.isDashing = false;
        if (this.dashCD > 0) this.dashCD -= dt;
        if (this.invulnTimer > 0) this.invulnTimer -= dt;

        // Trail logic
        if (Math.random() > 0.5) {
            this.trail.push({ x: this.x, y: this.y, life: 0.3, maxLife: 0.3 });
        }
        for (let i = this.trail.length - 1; i >= 0; i--) {
            this.trail[i].life -= dt;
            if (this.trail[i].life <= 0) this.trail.splice(i, 1);
        }

        // Movement
        let mult = this.isDashing ? 3 : 1;
        this.vx = 0; this.vy = 0;
        if (keys.w) this.vy -= this.speed * mult;
        if (keys.s) this.vy += this.speed * mult;
        if (keys.a) this.vx -= this.speed * mult;
        if (keys.d) this.vx += this.speed * mult;

        // Normalize diagonal
        if (this.vx !== 0 && this.vy !== 0) {
            this.vx *= 0.707;
            this.vy *= 0.707;
        }

        // Collision logic (AABB against walls)
        let nX = this.x + this.vx * dt;
        let nY = this.y + this.vy * dt;

        let tl = getGridPos(nX, this.y, this.width, this.height);
        let br = getGridPos(nX + this.width, this.y + this.height, this.width, this.height);

        let collideX = false;
        if (this.vx < 0) { // left
            if (isWall(Math.floor(this.y / TILE_SIZE), tl.c) || isWall(Math.floor((this.y + this.height - 1) / TILE_SIZE), tl.c)) collideX = true;
        } else if (this.vx > 0) { // right
            let trC = Math.floor((nX + this.width - 1) / TILE_SIZE);
            if (isWall(Math.floor(this.y / TILE_SIZE), trC) || isWall(Math.floor((this.y + this.height - 1) / TILE_SIZE), trC)) collideX = true;
        }
        if (!collideX) this.x = nX;

        let collideY = false;
        if (this.vy < 0) { // up
            let tR = Math.floor(nY / TILE_SIZE);
            let lC = Math.floor(this.x / TILE_SIZE);
            let rC = Math.floor((this.x + this.width - 1) / TILE_SIZE);
            if (isWall(tR, lC) || isWall(tR, rC)) collideY = true;
        } else if (this.vy > 0) { // down
            let bR = Math.floor((nY + this.height - 1) / TILE_SIZE);
            let lC = Math.floor(this.x / TILE_SIZE);
            let rC = Math.floor((this.x + this.width - 1) / TILE_SIZE);
            if (isWall(bR, lC) || isWall(bR, rC)) collideY = true;
        }
        if (!collideY) this.y = nY;
    }

    draw(ctx, offsetX, offsetY) {
        // Draw trail
        for (let t of this.trail) {
            ctx.fillStyle = `rgba(0,0,0,${t.life / t.maxLife * 0.5})`;
            ctx.fillRect(t.x - offsetX, t.y - offsetY, this.width, this.height);
        }

        // Draw Player Aura
        ctx.fillStyle = COLORS.playerAura;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - offsetX, this.y + this.height / 2 - offsetY, this.width * 1.5 + Math.sin(Date.now() / 150) * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw Player core
        if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 10) % 2 === 0) {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = COLORS.player;
        }
        ctx.fillRect(this.x - offsetX, this.y - offsetY, this.width, this.height);

        // Minimal eye glow
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(this.x + 14 - offsetX, this.y + 6 - offsetY, 4, 4);
        ctx.fillRect(this.x + 6 - offsetX, this.y + 6 - offsetY, 4, 4);
    }
}

class Enemy {
    constructor(x, y, type) {
        this.type = type; // 'small', 'medium', 'big'
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.hp = 1;
        this.speed = 100;
        this.damage = 1;
        this.width = 20;
        this.height = 20;
        this.color = COLORS.enemySmall;
        this.vx = 0; this.vy = 0;
        this.stateTimer = 0;

        if (type === 'medium') {
            this.hp = 2;
            this.speed = 140;
            this.width = 28; this.height = 28;
            this.color = COLORS.enemyMedium;
        } else if (type === 'big') {
            this.hp = 5;
            this.speed = 60;
            this.damage = 2;
            this.width = 60; this.height = 60;
            this.color = COLORS.enemyBig;
            // Align slightly differently due to size
            this.x = x * TILE_SIZE - 10;
            this.y = y * TILE_SIZE - 10;
        }
        this.maxHp = this.hp;

        // Pick initial direction
        this.pickDir();
    }

    pickDir() {
        // Random move logic
        const dirs = [{ vx: 1, vy: 0 }, { vx: -1, vy: 0 }, { vx: 0, vy: 1 }, { vx: 0, vy: -1 }];
        let d = dirs[Math.floor(Math.random() * dirs.length)];
        this.vx = d.vx * this.speed;
        this.vy = d.vy * this.speed;
        this.stateTimer = 1.0 + Math.random();
    }

    update(dt) {
        this.stateTimer -= dt;

        // Simple approach player if medium or big
        if (this.type !== 'small' && this.stateTimer <= 0) {
            let dx = player.x - this.x;
            let dy = player.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 400) {
                this.vx = (dx / dist) * this.speed;
                this.vy = (dy / dist) * this.speed;
            } else {
                this.pickDir();
            }
            this.stateTimer = 0.5 + Math.random();
        } else if (this.type === 'small' && this.stateTimer <= 0) {
            this.pickDir();

            // Multiply logic near red doors
            let pos = getGridPos(this.x, this.y, this.width, this.height);
            if (grid[pos.r] && grid[pos.r][pos.c] === 2 && Math.random() < 0.2) {
                // duplicate
                let numEnemies = enemies.length;
                if (numEnemies < 20) { // cap
                    enemies.push(new Enemy(pos.c, pos.r, 'small'));
                }
            }
        }

        // Basic map collision (bouncing)
        let nX = this.x + this.vx * dt;
        let nY = this.y + this.vy * dt;

        let tl = getGridPos(nX, this.y, this.width, this.height);
        let collideX = false;
        if (this.vx < 0) {
            if (isWall(Math.floor(this.y / TILE_SIZE), tl.c) || isWall(Math.floor((this.y + this.height - 1) / TILE_SIZE), tl.c)) collideX = true;
        } else if (this.vx > 0) {
            let trC = Math.floor((nX + this.width - 1) / TILE_SIZE);
            if (isWall(Math.floor(this.y / TILE_SIZE), trC) || isWall(Math.floor((this.y + this.height - 1) / TILE_SIZE), trC)) collideX = true;
        }

        if (collideX) { this.vx *= -1; this.pickDir(); }
        else this.x = nX;

        let collideY = false;
        if (this.vy < 0) {
            let tR = Math.floor(nY / TILE_SIZE);
            let lC = Math.floor(this.x / TILE_SIZE);
            let rC = Math.floor((this.x + this.width - 1) / TILE_SIZE);
            if (isWall(tR, lC) || isWall(tR, rC)) collideY = true;
        } else if (this.vy > 0) {
            let bR = Math.floor((nY + this.height - 1) / TILE_SIZE);
            let lC = Math.floor(this.x / TILE_SIZE);
            let rC = Math.floor((this.x + this.width - 1) / TILE_SIZE);
            if (isWall(bR, lC) || isWall(bR, rC)) collideY = true;
        }

        if (collideY) { this.vy *= -1; this.pickDir(); }
        else this.y = nY;

        // Player collision
        if (AABB(this, player)) {
            if (player.isDashing) {
                // Damage enemy
                this.hp -= 1;
                spawnBlood(this.x + this.width / 2, this.y + this.height / 2, this.type === 'big' ? 50 : 20);
                playKillSound(this.type);
                player.dashCD = 0; // reset dash on hit

                if (this.hp <= 0) {
                    this.dead = true;
                    bloodStains.push(new StaticBloodStain(this.x, this.y, this.width));
                } else {
                    // Knockback
                    let dx = this.x - player.x;
                    let dy = this.y - player.y;
                    let m = Math.sqrt(dx * dx + dy * dy);
                    this.x += (dx / m) * 20;
                    this.y += (dy / m) * 20;
                }
            } else {
                // Damage player
                player.damage(this.damage);
            }
        }
    }

    draw(ctx, offsetX, offsetY) {
        // Red flashing if damaged
        if (this.hp < this.maxHp && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = this.color;
            if (this.type === 'big' && Math.random() > 0.8) {
                // Glitch effect for big boss
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(this.x - offsetX + (Math.random() * 10 - 5), this.y - offsetY + (Math.random() * 10 - 5), this.width, this.height);
            }
        }

        ctx.fillRect(this.x - offsetX, this.y - offsetY, this.width, this.height);

        // Evil eyes
        ctx.fillStyle = 'white';
        if (this.type === 'big') {
            ctx.fillRect(this.x + 10 - offsetX, this.y + 10 - offsetY, 10, 5);
            ctx.fillRect(this.x + 40 - offsetX, this.y + 10 - offsetY, 10, 5);
        } else {
            ctx.fillRect(this.x + 4 - offsetX, this.y + 4 - offsetY, 4, 2);
            ctx.fillRect(this.x + 12 - offsetX, this.y + 4 - offsetY, 4, 2);
        }
    }
}

// --- Systems ---
function spawnBlood(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        let size = Math.random() * 4 + 2;
        let speed = Math.random() * 100 + 50;
        particles.push(new Particle(x, y, COLORS.blood, size, speed, 0.5 + Math.random()));
    }
}

function initGame() {
    grid = JSON.parse(JSON.stringify(levels[currentLevel].map)); // deep copy map
    mapRows = grid.length;
    mapCols = grid[0].length;
    player = new Player();
    enemies = [];
    particles = [];
    bloodStains.length = 0;

    // Spawn enemies
    for (let e of levels[currentLevel].enemies) {
        enemies.push(new Enemy(e.x, e.y, e.t));
    }

    updateUI();
    isPlaying = true;
    lastTime = performance.now();

    cancelAnimationFrame(animationId);
    loop(lastTime);
}

function updateUI() {
    heartsContainer.innerHTML = '';
    for (let i = 0; i < player.maxHp; i++) {
        let h = document.createElement('div');
        h.className = 'heart ' + (i < player.hp ? 'full' : 'empty');
        heartsContainer.appendChild(h);
    }

    killCountEl.innerText = enemies.length;
}

function endGame(win) {
    isPlaying = false;
    sceneGame.classList.remove('active');
    sceneGame.classList.add('hidden');
    sceneEnd.classList.remove('hidden');
    sceneEnd.classList.add('active');

    if (win) {
        endTitle.innerText = "They were never real.";
        endText.innerText = "Or were they?";
        endTitle.style.color = '#fff';
    } else {
        endTitle.innerText = "You couldn't escape them.";
        endText.innerText = "The abyss takes over.";
        endTitle.style.color = 'var(--blood-red)';
    }
}

// --- Main Loop ---
function loop(time) {
    if (!isPlaying) return;

    let dt = (time - lastTime) / 1000;
    lastTime = time;
    if (dt > 0.1) dt = 0.1; // cap if tabbed out

    update(dt);
    draw();

    animationId = requestAnimationFrame(loop);
}

function update(dt) {
    player.update(dt);

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update(dt);
        if (enemies[i].dead) {
            enemies.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(dt);
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    updateUI();

    // Win Condition
    if (enemies.length === 0) {
        currentLevel++;
        if (currentLevel >= levels.length) {
            endGame(true);
        } else {
            // Next level delay effect
            isPlaying = false;
            // Screen flash white
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100vw'; overlay.style.height = '100vh';
            overlay.style.background = 'white';
            overlay.style.zIndex = '999';
            overlay.style.transition = 'opacity 1s ease-out';
            document.body.appendChild(overlay);

            setTimeout(() => {
                overlay.style.opacity = '0';
                initGame();
                setTimeout(() => overlay.remove(), 1000);
            }, 500);
        }
    }

    // Heartbeat Audio Logic
    if (player.hp === 1 && bgOsc && bgOsc.length) {
        if (!heartbeatOsc) {
            // Speed up ambient LF hum dynamically
            for (let i = 0; i < bgOsc.length; i++) {
                bgOsc[i].frequency.setValueAtTime(80 + i, audioCtx.currentTime);
            }
        }
    } else if (bgOsc && bgOsc.length) {
        for (let i = 0; i < bgOsc.length; i++) {
            bgOsc[i].frequency.setValueAtTime(35 + i * 1.5, audioCtx.currentTime);
        }
    }
}

function draw() {
    // Determine camera offset to keep player centered
    let offsetX = player.x + player.width / 2 - cw / 2;
    let offsetY = player.y + player.height / 2 - ch / 2;

    // Fill background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, cw, ch);

    // Draw Map
    for (let r = 0; r < mapRows; r++) {
        for (let c = 0; c < mapCols; c++) {
            let t = grid[r][c];
            let tx = c * TILE_SIZE - offsetX;
            let ty = r * TILE_SIZE - offsetY;

            // Only draw visible tiles (culling)
            if (tx < -TILE_SIZE || tx > cw || ty < -TILE_SIZE || ty > ch) continue;

            if (t === 1) {
                // Wall
                ctx.fillStyle = COLORS.wall;
                ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = COLORS.wallLine;
                ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE);
            } else if (t === 0) {
                // Floor
                ctx.fillStyle = COLORS.floor;
                ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                // Grid lines slightly visible
                ctx.strokeStyle = '#0f0f0f';
                ctx.strokeRect(tx, ty, TILE_SIZE, TILE_SIZE);
            } else if (t === 2) {
                // Red glowing door (Multiplier)
                ctx.fillStyle = COLORS.door;
                ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                ctx.beginPath();
                ctx.arc(tx + TILE_SIZE / 2, ty + TILE_SIZE / 2, TILE_SIZE * 0.8 + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Draw Blood Stains
    for (let bs of bloodStains) bs.draw(ctx, offsetX, offsetY);

    // Draw Particles
    for (let p of particles) p.draw(ctx, offsetX, offsetY);

    // Draw Player
    player.draw(ctx, offsetX, offsetY);

    // Draw Enemies
    // Sort by Y for slight depth
    enemies.sort((a, b) => a.y - b.y);
    for (let e of enemies) e.draw(ctx, offsetX, offsetY);

    // Vignette / Shadows (Darkness) - Made Brighter!
    let maxDist = Math.max(cw, ch) * 0.9;
    let grad = ctx.createRadialGradient(cw / 2, ch / 2, 80, cw / 2, ch / 2, maxDist);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
}

// --- Sequence Flow ---

// 1. Initial Load -> show transition scene
setTimeout(() => {
    // After 4 seconds of whispering/abyss, fade to title
    sceneTransition.style.opacity = '0';
    setTimeout(() => {
        sceneTransition.classList.remove('active');
        sceneTransition.classList.add('hidden');
        sceneStart.classList.remove('hidden');
        sceneStart.classList.add('active');
    }, 2000);
}, 4000);

btnPlay.addEventListener('click', () => {
    btnPlay.blur();
    initAudio(); // Must initialize after user interaction
    sceneStart.style.opacity = '0';
    setTimeout(() => {
        sceneStart.classList.remove('active');
        sceneStart.classList.add('hidden');
        sceneGame.classList.remove('hidden');
        sceneGame.classList.add('active');
        initGame();
        sceneGame.style.opacity = '1';
    }, 1000);
});

btnReplay.addEventListener('click', () => {
    btnReplay.blur();
    sceneEnd.style.opacity = '0';
    setTimeout(() => {
        sceneEnd.classList.remove('active');
        sceneEnd.classList.add('hidden');
        sceneStart.classList.remove('hidden');
        sceneStart.classList.add('active');
        sceneStart.style.opacity = '1';
        currentLevel = 0; // Reset level on replay
    }, 1000);
});
