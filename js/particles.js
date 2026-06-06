class Particle {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.size = Math.random() * 4 + 2;

        this.speedX =
            (Math.random() - 0.5) * 2;

        this.speedY =
            (Math.random() - 0.5) * 2;

        this.life = 30;
    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        this.life--;
    }

    draw(ctx) {

        ctx.fillStyle =
            "rgba(0,255,136," +
            this.life / 30 +
            ")";

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

}