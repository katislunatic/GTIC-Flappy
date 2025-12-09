const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const deathScreen = document.getElementById("deathScreen");
const unlockScreen = document.getElementById("unlockScreen");

const finalScoreText = document.getElementById("finalScore");
const unlockCodeText = document.getElementById("theCode");

// Resize canvas to fill page
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- GAME VARIABLES ---
let birdY, birdVelocity, pipes, score, gameRunning;

// Unlock settings
const unlockScore = 25;
const redeemCode = "GTIC-SECRET-2025";

// --- RESET GAME VALUES ---
function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
}

// --- START GAME ---
function startGame() {
    resetGame();
    gameRunning = true;

    startScreen.classList.add("hidden");
    deathScreen.classList.add("hidden");
    unlockScreen.classList.add("hidden");

    requestAnimationFrame(loop);
}

// --- EVENTS ---
function flap() {
    if (!gameRunning) return;
    birdVelocity = -9;
}

document.addEventListener("keydown", e => {
    if (startScreen.classList.contains("hidden") === false) startGame();
    else if (unlockScreen.classList.contains("hidden") === false) startGame();
    else if (deathScreen.classList.contains("hidden") === false) startGame();
    else flap();
});

document.addEventListener("touchstart", () => {
    if (startScreen.classList.contains("hidden") === false) startGame();
    else if (unlockScreen.classList.contains("hidden") === false) startGame();
    else if (deathScreen.classList.contains("hidden") === false) startGame();
    else flap();
});

let frameCount = 0;

function spawnPipe() {
    const gap = canvas.height * 0.25;
    const topHeight = Math.random() * (canvas.height * 0.5) + 100;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap
    });
}

function showDeathScreen() {
    gameRunning = false;
    finalScoreText.textContent = "Score: " + score;
    deathScreen.classList.remove("hidden");
}

function showUnlockScreen() {
    gameRunning = false;
    unlockCodeText.textContent = redeemCode;
    unlockScreen.classList.remove("hidden");
}

function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    birdVelocity += 0.45;
    birdY += birdVelocity;

    ctx.fillStyle = "#00ffee";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.25, birdY, 18, 0, Math.PI * 2);
    ctx.fill();

    if (birdY > canvas.height || birdY < 0) return showDeathScreen();

    // Pipes
    if (frameCount % 100 === 0) spawnPipe();

    pipes.forEach(pipe => {
        pipe.x -= 4;

        ctx.fillStyle = "#ff7b00";
        ctx.fillRect(pipe.x, 0, 60, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 60, canvas.height - pipe.bottom);

        // Collision
        const birdX = canvas.width * 0.25;
        if (
            pipe.x < birdX + 18 &&
            pipe.x + 60 > birdX - 18 &&
            (birdY < pipe.top || birdY > pipe.bottom)
        ) {
            return showDeathScreen();
        }

        // Scoring
        if (pipe.x + 60 < birdX && !pipe.scored) {
            score++;
            pipe.scored = true;

            if (score === unlockScore) return showUnlockScreen();
        }
    });

    // Score text
    ctx.fillStyle = "white";
    ctx.font = "40px Inter";
    ctx.fillText(score, 30, 60);

    frameCount++;
    requestAnimationFrame(loop);
}
