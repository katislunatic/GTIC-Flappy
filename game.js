const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const deathScreen = document.getElementById("deathScreen");
const unlockScreen = document.getElementById("unlockScreen");
const finalScoreText = document.getElementById("finalScore");
const unlockCodeText = document.getElementById("theCode");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let running = false;
let birdY, birdVel, pipes, score, frame;

const gravity = 0.45;
const unlockAt = 25;
const unlockCode = "GTIC-2025";

function reset() {
    birdY = canvas.height * 0.4;
    birdVel = 0;
    pipes = [];
    score = 0;
    frame = 0;
}

function showScreen(screen) {
    startScreen.classList.remove("visible");
    deathScreen.classList.remove("visible");
    unlockScreen.classList.remove("visible");

    screen.classList.add("visible");
}

function startGame() {
    running = true;
    reset();
    showScreen(document.createElement("div")); // hide all
    loop();
}

function flap() {
    if (running) birdVel = -8.5;
}

document.addEventListener("keydown", () => {
    if (!running) startGame();
    else flap();
});

document.addEventListener("touchstart", () => {
    if (!running) startGame();
    else flap();
});

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
    showScreen(deathScreen);
}

function showUnlock() {
    running = false;
    unlockCodeText.textContent = unlockCode;
    showScreen(unlockScreen);
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

        if (
            bx + 20 > pipe.x &&
            bx - 20 < pipe.x + 70 &&
            (birdY < pipe.top || birdY > pipe.bottom)
        ) {
            return showDeath();
        }

        if (!pipe.scored && pipe.x + 70 < bx) {
            score++;
            pipe.scored = true;

            if (score === unlockAt) {
                return showUnlock();
            }
        }
    });

    ctx.fillStyle = "white";
    ctx.font = "50px Inter";
    ctx.fillText(score, 40, 70);

    frame++;
    requestAnimationFrame(loop);
}

// show start screen at load
showScreen(startScreen);
