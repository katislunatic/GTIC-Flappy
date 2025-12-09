const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdY = 250;
let birdVelocity = 0;
let gravity = 0.4;

let pipes = [];
let frameCount = 0;
let score = 0;
let gameOver = false;

// Set your GTIC unlock score + code here:
const unlockScore = 25;
const redeemCode = "GTIC-SECRET-2025";

function spawnPipe() {
    const gap = 140;
    let topHeight = Math.random() * 300 + 50;
    pipes.push({
        x: 400,
        top: topHeight,
        bottom: topHeight + gap
    });
}

function resetGame() {
    birdY = 250;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    gameOver = false;
}

document.addEventListener("keydown", () => {
    if (gameOver) {
        resetGame();
    } else {
        birdVelocity = -7;
    }
});

function loop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, 400, 600);

    // Bird
    birdVelocity += gravity;
    birdY += birdVelocity;

    ctx.fillStyle = "#00ffee"; // GTIC cyan color
    ctx.beginPath();
    ctx.arc(100, birdY, 15, 0, Math.PI * 2);
    ctx.fill();

    if (birdY > 585 || birdY < 0) {
        triggerGameOver();
    }

    // Pipes
    if (frameCount % 120 === 0) {
        spawnPipe();
    }

    pipes.forEach(pipe => {
        pipe.x -= 2.5;

        ctx.fillStyle = "#ff7b00";

        ctx.fillRect(pipe.x, 0, 50, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 50, 600 - pipe.bottom);

        // Collision
        if (
            pipe.x < 115 &&
            pipe.x + 50 > 85 &&
            (birdY < pipe.top || birdY > pipe.bottom)
        ) {
            triggerGameOver();
        }

        // Score
        if (pipe.x + 50 < 85 && !pipe.scored) {
            score++;
            pipe.scored = true;

            // Unlock check
            if (score === unlockScore) {
                showUnlockScreen();
                return;
            }
        }
    });

    // Score display
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score, 20, 40);

    frameCount++;
    requestAnimationFrame(loop);
}

function triggerGameOver() {
    gameOver = true;

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 100, 300);

    ctx.font = "20px Arial";
    ctx.fillText("Press any key to restart", 100, 350);
}

function showUnlockScreen() {
    gameOver = true;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 600);

    ctx.fillStyle = "#00ffee";
    ctx.font = "26px Arial";
    ctx.fillText("🎉 GTIC CODE UNLOCKED! 🎉", 25, 200);

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText("Redeem this in the GTIC Discord:", 25, 260);

    ctx.fillStyle = "#00ff99";
    ctx.font = "28px Arial";
    ctx.fillText(redeemCode, 45, 320);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press any key to restart", 90, 420);
}

loop();
