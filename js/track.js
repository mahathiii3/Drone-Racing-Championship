class Track {

    constructor() {

        this.walls = [

            // Top Wall
            {x:400, y:140, width:900, height:20},

            // Bottom Wall
            {x:400, y:640, width:900, height:20},

            // Left Wall
            {x:400, y:140, width:20, height:520},

            // Right Wall
            {x:1280, y:140, width:20, height:520}

        ];

        this.checkpoints = [

            {
                x:550,
                y:250,
                width:50,
                height:50,
                passed:false
            },

            {
                x:850,
                y:180,
                width:50,
                height:50,
                passed:false
            },

            {
                x:1100,
                y:380,
                width:50,
                height:50,
                passed:false
            }

        ];

        // Full Width Finish Line

        this.finishLine = {

            x:420,
            y:560,

            width:860,
            height:20

        };

    }

draw(ctx)
 {

    // =====================
    // GRID
    // =====================

    ctx.strokeStyle = "#1a1a1a";

    for(let x = 450; x < 1280; x += 50){

        ctx.beginPath();

        ctx.moveTo(x, 160);

        ctx.lineTo(x, 640);

        ctx.stroke();

    }

    for(let y = 160; y < 640; y += 50){

        ctx.beginPath();

        ctx.moveTo(450, y);

        ctx.lineTo(1280, y);

        ctx.stroke();

    }

    // =====================
    // WALLS
    // =====================

    ctx.fillStyle = "#3a3a3a";

    this.walls.forEach(wall => {

        ctx.fillRect(
            wall.x,
            wall.y,
            wall.width,
            wall.height
        );

    });

    // =====================
    // CHECKPOINTS
    // =====================

    this.checkpoints.forEach(checkpoint => {

        ctx.fillStyle =
            checkpoint.passed
            ? "#00ff88"
            : "#ff9900";

        ctx.fillRect(
            checkpoint.x,
            checkpoint.y,
            checkpoint.width,
            checkpoint.height
        );

    });

    // =====================
    // FINISH LINE
    // =====================

    for (let i = 0; i < this.finishLine.width; i += 20) {

        ctx.fillStyle =
            i % 40 === 0
            ? "white"
            : "black";

        ctx.fillRect(
            this.finishLine.x + i,
            this.finishLine.y,
            20,
            this.finishLine.height
        );

    }

    // =====================
    // FINISH LABEL
    // =====================

    ctx.fillStyle = "white";

    ctx.font = "24px 'Russo One'";

    ctx.textAlign = "center";

    ctx.fillText(
        "🏁 FINISH LINE",
        this.finishLine.x + this.finishLine.width / 2,
        this.finishLine.y - 25
    );

    ctx.textAlign = "left"; } }