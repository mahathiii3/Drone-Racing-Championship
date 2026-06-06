class Drone {

    constructor() {

       this.x = 850;
       this.y = 400;

        this.previousX = this.x;
        this.previousY = this.y;

        this.width = 60;
        this.height = 30;

        this.angle = 0;

        this.speed = 0;

        this.acceleration = 0.15;
        this.maxSpeed = 6;

        this.friction = 0.98;

        this.rotationSpeed = 0.05;

        this.boostMultiplier = 2;

        // Drone Image
        this.image = new Image();
        this.image.src = "assets/images/drone.png";

    }

    update(keys) {

        // Save previous position
        this.previousX = this.x;
        this.previousY = this.y;

        // Rotate Left
        if (keys["arrowleft"]) {
            this.angle -= this.rotationSpeed;
        }

        // Rotate Right
        if (keys["arrowright"]) {
            this.angle += this.rotationSpeed;
        }

        // Accelerate
        if (keys["arrowup"]) {

            let currentAcceleration =
                this.acceleration;

            if (keys["shift"]) {

                currentAcceleration *=
                    this.boostMultiplier;

            }

            this.speed += currentAcceleration;
        }

        // Brake / Reverse
        if (keys["arrowdown"]) {
            this.speed -= this.acceleration;
        }

        // Max Speed
        let currentMaxSpeed =
            this.maxSpeed;

        if (keys["shift"]) {

            currentMaxSpeed =
                this.maxSpeed * 1.5;

        }

        // Speed Limits
        if (this.speed > currentMaxSpeed) {
            this.speed = currentMaxSpeed;
        }

        if (this.speed < -2) {
            this.speed = -2;
        }

        // Friction
        this.speed *= this.friction;

        // Movement
        this.x +=
            Math.cos(this.angle) *
            this.speed;

        this.y +=
            Math.sin(this.angle) *
            this.speed;
    }

    draw(ctx) {

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );

        ctx.rotate(
            this.angle
        );

        // Draw Drone Image
        ctx.drawImage(
    this.image,
    -45,
    -45,
    90,
    90
);
      

        ctx.restore();

    }
}