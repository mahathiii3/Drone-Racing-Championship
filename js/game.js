const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const drone = new Drone();
const track = new Track();
const engineSound = new Audio(
    "assets/sounds/drone-engine.mp3"
);

engineSound.loop = true;
engineSound.volume = 0.2;
const particles = [];

let raceStarted = false;
let startTime = 0;
let raceCompleted = false;
let finalTime = "0.00";
let newRecord = false;
let bestTime =
    localStorage.getItem("bestTime");

if (!bestTime) {

    bestTime = "--";

}

const keys = {};

const startButton = {

    x: canvas.width / 2 - 150,
    y: canvas.height / 2 - 45,
    width: 300,
    height: 90

};

window.addEventListener("keydown", (event) => {

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});

window.addEventListener("keydown", (event) => {

    if (
        event.key.toLowerCase() === "r" &&
        raceCompleted
    ) {

        // Reset Drone
drone.x = 850;
drone.y = 400;

drone.speed = 0;
drone.angle = 0;

        drone.previousX = drone.x;
        drone.previousY = drone.y;

        // Reset Checkpoints
        track.checkpoints.forEach(
            checkpoint => {
                checkpoint.passed = false;
            }
        );

        // Reset Race
        raceStarted = false;
        raceCompleted = false;

        startTime = 0;
        finalTime = "0.00";
        newRecord = false;
        drone.speed = 0;

        engineSound.pause();
        engineSound.currentTime = 0;

    }

});

canvas.addEventListener("click", (event) => {

    if (

        !raceStarted &&

        event.offsetX > startButton.x &&
        event.offsetX < startButton.x + startButton.width &&

        event.offsetY > startButton.y &&
        event.offsetY < startButton.y + startButton.height

    ) {

        raceStarted = true;
        startTime = Date.now();

    }

});

function gameLoop() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
);

const gradient =
    ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );

gradient.addColorStop(
    0,
    "#0f172a"
);

gradient.addColorStop(
    1,
    "#111827"
);

ctx.fillStyle = gradient;

ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);

    if (raceStarted) {

    drone.update(keys);

    if (Math.abs(drone.speed) > 0.3) {

        if (engineSound.paused) {

            engineSound.play();

        }

    } else {

        engineSound.pause();

    }

    if (Math.abs(drone.speed) > 0.5) {

        particles.push(
            new Particle(
                drone.x,
                drone.y
            )
        );

    }

}
    // Collision Detection
    track.walls.forEach(wall => {

        if (Collision.check(drone, wall)) {

            drone.x = drone.previousX;
            drone.y = drone.previousY;

            drone.speed = 0;

        }

    });

    // Checkpoint Detection
    track.checkpoints.forEach(checkpoint => {

        if (

            drone.x > checkpoint.x &&
            drone.x < checkpoint.x + checkpoint.width &&
            drone.y > checkpoint.y &&
            drone.y < checkpoint.y + checkpoint.height

        ) {

            checkpoint.passed = true;

        }

    });

    // Timer
    let elapsedTime = "0.00";

if (raceStarted && !raceCompleted) {

    elapsedTime =
        ((Date.now() - startTime) / 1000)
        .toFixed(2);

}
else if (raceCompleted) {

    elapsedTime = finalTime;

}


    // Finish Line Detection
    const allCheckpointsPassed =
        track.checkpoints.every(
            checkpoint => checkpoint.passed
        );

    if (

    allCheckpointsPassed &&
    !raceCompleted &&

    drone.x > track.finishLine.x &&
    drone.x < track.finishLine.x + track.finishLine.width &&
    drone.y > track.finishLine.y &&
    drone.y < track.finishLine.y + track.finishLine.height

) {

    raceCompleted = true;

finalTime =
    ((Date.now() - startTime) / 1000)
    .toFixed(2);

// Update Best Time

if (

    bestTime === "--" ||

    parseFloat(finalTime) <
    parseFloat(bestTime)

) {

   bestTime = finalTime;

localStorage.setItem(
    "bestTime",
    bestTime
);

newRecord = true;
}
} 
    // Draw Track
    track.draw(ctx);

    // Update Particles

for (let i = particles.length - 1; i >= 0; i--) {

    particles[i].update();

    particles[i].draw(ctx);

    if (particles[i].life <= 0) {

        particles.splice(i, 1);

    }

}

// Draw Drone

drone.draw(ctx);

if (raceStarted && !raceCompleted) {

// =====================
// HUD PANEL
// =====================

ctx.fillStyle = "rgba(10,10,10,0.95)";

ctx.shadowColor = "#00ff88";
ctx.shadowBlur = 15;

ctx.fillRect(
    15,
    70,
    260,
    240
);

ctx.shadowBlur = 0;

ctx.strokeStyle = "#00ff88";
ctx.lineWidth = 2;

ctx.strokeRect(
    15,
    70,
    260,
    240
);

// =====================
// GAME UI
// =====================

ctx.fillStyle = "white";
ctx.font = "30px 'Russo One'";

ctx.shadowColor = "#00ff88";
ctx.shadowBlur = 10;

ctx.textAlign = "center";

ctx.fillText(
    "🚁 DRONE RACING CHAMPIONSHIP",
    canvas.width / 2,
    50
);

ctx.textAlign = "left";

ctx.shadowBlur = 0;

ctx.font = "24px 'Russo One'";

ctx.fillStyle = "white";
ctx.font = "22px 'Russo One'";

ctx.fillText(
    "🚁 SPEED",
    30,
    105
);

ctx.textAlign = "right";

ctx.fillText(
    drone.speed.toFixed(2),
    250,
    105
);

ctx.textAlign = "left";

    const speedPercent =
    Math.max(
        0,
        drone.speed / (drone.maxSpeed * 1.5)
    );

ctx.fillStyle = "#222";

ctx.fillRect(
    30,
    120,
    200,
    20
);

ctx.fillStyle = "#00ff88";
ctx.shadowColor = "#00ff88";
ctx.shadowBlur = 10;

ctx.fillRect(
    30,
    120,
    200 * speedPercent,
    20
);

ctx.shadowBlur = 0;

    const completedCheckpoints =
        track.checkpoints.filter(
            checkpoint => checkpoint.passed
        ).length;

ctx.fillStyle = "#00ff88";

ctx.fillText(
    "📍 Checkpoints: " +
    completedCheckpoints +
    "/" +
    track.checkpoints.length,
    30,
    180
);

ctx.fillStyle = "#00ff88";

ctx.fillText(
    "⏱ Time: " + elapsedTime + "s",
    30,
    220
);

ctx.fillStyle = "#00ff88";

ctx.fillText(
    "🏆 Best Time: " + bestTime + "s",
    30,
    260
);

}

    // Race Complete
    if (raceCompleted) {

    ctx.fillStyle = "rgba(0,0,0,0.8)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.textAlign = "center";

    ctx.font = "80px 'Russo One'";

    ctx.fillText(
        "🏆",
        canvas.width / 2,
        180
    );

    ctx.fillStyle = "gold";

    ctx.font = "60px 'Russo One'";

    ctx.shadowColor = "gold";
    ctx.shadowBlur = 20;

    ctx.fillText(
        "RACE COMPLETED!",
        canvas.width / 2,
        280
    );

    ctx.shadowBlur = 0;

    ctx.fillStyle = "white";
    ctx.font = "36px 'Russo One'";

    ctx.fillText(
        "Finished in " + finalTime + " seconds",
        canvas.width / 2,
        350
    );

    ctx.fillStyle = "#00aaff";

ctx.font = "30px 'Russo One'";

ctx.fillText(
    "Best Time: " + bestTime + " seconds",
    canvas.width / 2,
    400
);

if (newRecord) {

    ctx.fillStyle = "#00ff88";

    ctx.font = "32px 'Russo One'";

    ctx.fillText(
        "🎉 NEW RECORD!",
        canvas.width / 2,
        450
    );

}


    ctx.fillStyle = "#00ff88";

    ctx.font = "28px 'Russo One'";

    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 15;

    ctx.fillText(
        "Press R to Restart",
        canvas.width / 2,
        500
    );

    ctx.shadowBlur = 0;

    ctx.textAlign = "left";

}

    // START SCREEN
    if (!raceStarted) {

        // Dark Overlay
        ctx.fillStyle = "rgba(0,0,0,0.85)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Title
        ctx.fillStyle = "white";
        ctx.font = "48px 'Russo One'";

        ctx.textAlign = "center";

        ctx.shadowColor = "white";
        ctx.shadowBlur = 8;

        ctx.fillText(
            "DRONE RACING CHAMPIONSHIP",
            canvas.width / 2,
            180
        );

        ctx.shadowBlur = 0;

        // Subtitle
        ctx.fillStyle = "#cccccc";
        ctx.font = "22px 'Russo One'";

        ctx.fillText(
            "Complete all checkpoints and reach the finish line",
            canvas.width / 2,
            230
        );

        // Neon Button
        ctx.shadowColor = "#00ff88";
        ctx.shadowBlur = 20;

        ctx.fillStyle = "#00cc66";

        ctx.fillRect(
            startButton.x,
            startButton.y,
            startButton.width,
            startButton.height
        );

        ctx.shadowBlur = 0;

        // Button Text
        ctx.fillStyle = "white";
        ctx.font = "30px 'Russo One'";

        ctx.fillText(
            "▶ START RACE",
            startButton.x + startButton.width / 2,
            startButton.y + 55
        );

        // Controls
        ctx.fillStyle = "#aaaaaa";
        ctx.font = "18px 'Russo One'";

        ctx.fillText(
            "↑ Accelerate   ↓ Brake   ← Turn   → Turn   SHIFT Boost",
            canvas.width / 2,
            startButton.y + 140
        );

        ctx.textAlign = "left";

    }
requestAnimationFrame(gameLoop);

}

gameLoop();