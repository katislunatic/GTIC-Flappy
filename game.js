const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI elements
const startScreen = document.getElementById("startScreen");
const deathScreen = document.getElementById("deathScreen");
const unlockScreen = document.getElementById("unlockScreen");
const finalScoreText = document.getElementById("finalScore");
const unlockCodeText = document.getElementById("theCode");

// Resize full-screen
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Game variables
let running = false;
let birdY, birdVel, pipes, score, frame;
const gravity = 0.45;

// Code unlock settings
const unlockAt = 25;
const unlockCode = "GTIC-2025-SPECIAL";

function reset() {
    birdY = canvas.height * 0.4;
    birdVel = 0;
    pipes = [];
    score = 0;
    frame = 0;
}

function startGame() {
    reset();
    running = true;

    startScreen.classList.add("hidden");
    deathScreen.classList.add("hidden");
    unlockScreen.classList.add("hidden");

    loop();
}

function flap() {
    if (!running) return;
    birdVel = -8.5;
}

document.addEventListener("keydown", () => {
    if (!running) startGame();
    else flap();
});

document.addEventListener("touchstart", () => {
    if (!running) startGame();
    else flap();
});

// Spawn pipes
function spawnPipe() {
    const gap = canvas.height * 0.25;
    const top = Math.random() * (canvas.height * 0.5) + 100;

    pipes.push({
        x: canvas.width,
        top,
        bottom: top + gap,
        scored: false
    });
}

function showDeath() {
    running = false;
    finalScoreText.textContent = "Score: " + score;
    deathScreen.classList.remove("hidden");
}

function showUnlock() {
    running = false;
    unlockCodeText.textContent = unlockCode;
    unlockScreen.classList.remove("hidden");
}

function loop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird
    birdVel += gravity;
    birdY += birdVel;

    ctx.fillStyle = "#00ffee";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.25, birdY, 20, 0, Math.PI * 2);
    ctx.fill();

    if (birdY > canvas.height || birdY < 0) {
        return showDeath();
    }

    // Pipes
    if (frame % 100 === 0) spawnPipe();

    pipes.forEach(pipe => {
        pipe.x -= 4;

        ctx.fillStyle = "#ff7b00";
        ctx.fillRect(pipe.x, 0, 70, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 70, canvas.height - pipe.bottom);

        const bx = canvas.width * 0.25;

        // Collision
        if (
            bx + 20 > pipe.x &&
            bx - 20 < pipe.x + 70 &&
            (birdY < pipe.top || birdY > pipe.bottom)
        ) {
            return showDeath();
        }

        // Score
        if (!pipe.scored && pipe.x + 70 < bx) {
            score++;
            pipe.scored = true;

            if (score >= unlockAt) return showUnlock();
        }
    });

    // Score text
    ctx.fillStyle = "white";
    ctx.font = "50px Inter";
    ctx.fillText(score, 40, 70);

    frame++;
    requestAnimationFrame(loop);
}
