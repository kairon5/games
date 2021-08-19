function colliding(w1, w1w, w2, w2w) {
    deltaX = w1.x - w2.x;
    deltaY = w1.y - w2.y;
    let hypoLength = Math.hypot(deltaX, deltaY);
    let combinedWidth = w1w / 2 + w2w / 2;
    if (hypoLength <= combinedWidth) {
        return true;
    }
    return false;
}

const canvas = document.getElementById("canvas-Amazing-Skill");
const ctx = canvas.getContext("2d");
canvas.width = 1100;
canvas.height = 700;

let score = 0;
let highScore = 0;
ctx.font = "50px sans-serif";

let canvasPos = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    clicked: false,
};
window.addEventListener("resize", () => {
    canvasPos = canvas.getBoundingClientRect();
});
canvas.addEventListener("mousemove", (e) => {
    mouse.x = Math.round(e.clientX - canvasPos.left);
    mouse.y = Math.round(e.clientY - canvasPos.top);
});
canvas.addEventListener("mousedown", (e) => {
    mouse.clicked = true;
});
canvas.addEventListener("mouseup", () => {
    mouse.clicked = false;
});
class ghostTrail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.red = 100;
        this.green = 100;
        this.blue = 225;
        this.alive = true;
    }
    update() {
        this.blue -= 8;
        this.red -= 5;
        this.green -= 5;
        ctx.fillStyle = `rgb(${this.red},${this.green},${this.blue})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
    }
}
class Player {
    constructor() {
        this.alive = true;
        this.x = mouse.x;
        this.y = mouse.y;
        this.frame = 0;
        this.ghosts = [];
    }
    update() {
        this.frame++;
        if (this.frame == 3) {
            this.frame = 0;
            this.ghosts.push(new ghostTrail(this.x, this.y));
        }
        this.ghosts.forEach((ghost) => {
            if (ghost.alive) {
                if (ghost.blue <= 0) {
                    ghost.alive = false;
                    this.ghosts.splice(1, this.ghosts.indexOf(ghost));
                }
                ghost.update();
            }
        });

        this.x = mouse.x;
        this.y = mouse.y;

        ctx.fillStyle = "rgb(100,100,255)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
    }
}
let player = new Player();
player.alive = false;
class Bullet {
    constructor(x, y, radius, speed, color, offsetRots, cannonLength) {
        let mainCannon = offsetRots[1];
        this.color = color;
        this.x = x;
        this.y = y;
        let deltaX = player.x - x;
        let deltaY = player.y - y;
        let aLength = 0;
        let bLength = 0;
        let offsetRot = offsetRots[0];
        if (!mainCannon) {
            /* 
            took me a lot of digging and head scratching to figure this out.
            my saving grace: https://www.youtube.com/watch?v=78ApsxyKI5M

            I was also an idiot and spent a day stuck on a stupid problem. i gave Math.cos and Math.sin degress instead of radians.
            */
            let offset = Math.ceil(offsetRot / 90) * 90;
            let angle;
            if (offset == 270 || offset == 90) {
                angle = offset - offsetRot;
            } else if (offset == 180 || offset == 360) {
                angle = offsetRot - (offset - 90);
            }
            angle = Number(angle.toFixed(3));

            let aLength = Number(
                (cannonLength * Math.cos(angle * (Math.PI / 180))).toFixed(3)
            );
            let bLength = Number(
                (cannonLength * Math.sin(angle * (Math.PI / 180))).toFixed(3)
            );

            if (offsetRot > 90 && offsetRot < 270) {
                bLength *= -1;
            }
            if (offsetRot > 180) {
                aLength *= -1;
            }

            deltaX = aLength;
            deltaY = bLength;
        }
        let hypoLength = Math.hypot(deltaX, deltaY) / speed;
        this.dir = [deltaX / hypoLength, deltaY / hypoLength];
        this.radius = radius;
        this.alive = true;
    }
    aliveOrNot() {
        if (this.x <= 0 || this.y <= 0 || this.x >= 1100 || this.y >= 700) {
            return false;
        }
        return true;
    }
    update() {
        this.x += this.dir[0];
        this.y += this.dir[1];
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        this.alive = this.aliveOrNot();
    }
}
let bullets = [];
class Cannon {
    /*cannon syntax 
        Cannon(xcord,ycord,width,height,size of bullet,bullets speed,rate at which the bullets come out, its offset rotation);
    */
    constructor(
        x,
        y,
        width,
        height,
        bulletSize,
        bulletSpeed,
        bulletRate,
        offsetRot,
        mainCannon
    ) {
        this.mainCannon = mainCannon;
        this.offsetRot = offsetRot;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bulletSpeed = bulletSpeed;
        this.bulletRate = bulletRate;
        this.bulletSize = bulletSize;
        this.frame = 0;
    }
    update(rot) {
        if (rot > 360) {
            rot -= 360;
        }
        this.frame += this.bulletRate;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((rot * Math.PI) / -180);
        ctx.translate(-this.x, -this.y);
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        ctx.restore();
        if (this.frame >= 600) {
            this.frame = 0;
            bullets.push(
                new Bullet(
                    this.x,
                    this.y,
                    this.bulletSize,
                    this.bulletSpeed,
                    "rgb(255,80,80)",
                    [rot, this.mainCannon],
                    this.height
                )
            );
        }
    }
}
class Tank {
    constructor() {
        this.x = Math.random() * 970 + 65;
        this.y = Math.random() * 570 + 65;
        this.type = [
            "machine-gun",
            "three",
            "octa",
            "default",
            "default",
            "sniper",
            "three",
            "penta",
            "thicc",
            "quad",
            "three",
            "default",
            "default",
            "sniper",
            "default",
            "machine-gun",
            "thicc",
            "quad",
            "three",
            "machine-gun",
            "sniper",
            "octa",
            "default",
            "thicc",
            "machine-gun",
            "sniper",
            "default",
            "quad",
            "default",
            "three",
            "penta",
            "thicc",
            "sniper",
            "quad",
        ][Math.floor(Math.random() * 34)];
        switch (this.type) {
            case "default":
                this.fadeTime = 700;
                this.radius = 20;
                this.cannons = [
                    new Cannon(this.x, this.y, 20, 30, 10, 4.5, 10, 0, true),
                ];
                break;
            case "thicc":
                this.fadeTime = 800;
                this.radius = 40;
                this.cannons = [
                    new Cannon(this.x, this.y, 70, 60, 35, 7, 5, 0, true),
                ];
                break;
            case "machine-gun":
                this.radius = 20;
                this.fadeTime = 300;
                this.cannons = [
                    new Cannon(this.x, this.y, 20, 40, 6, 5, 40, 0, true),
                ];
                break;
            case "sniper":
                this.radius = 20;
                this.fadeTime = 750;
                this.cannons = [
                    new Cannon(this.x, this.y, 20, 50, 10, 11, 5, 0, true),
                ];
                break;
            case "three":
                this.radius = 20;
                this.fadeTime = 800;
                this.cannons = [
                    new Cannon(this.x, this.y, 20, 40, 10, 4.5, 10, 0, true),
                    new Cannon(this.x, this.y, 20, 40, 10, 4.5, 10, 45, false),
                    new Cannon(this.x, this.y, 20, 40, 10, 4.5, 10, 315, false),
                ];
                break;
            case "quad":
                this.radius = 20;
                this.fadeTime = 650;
                this.cannons = [
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 0, true),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 90, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 180, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 270, false),
                ];
                break;
            case "octa":
                this.radius = 20;
                this.fadeTime = 450;
                this.cannons = [
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 0, true),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 45, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 90, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 135, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 180, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 225, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 270, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 315, false),
                ];
                break;
            case "penta":
                this.radius = 20;
                this.fadetime = 500;
                this.cannons = [
                    new Cannon(this.x, this.y, 15, 60, 10, 4.5, 15, 0, true),
                    new Cannon(this.x, this.y, 15, 50, 10, 4.5, 15, 15, false),
                    new Cannon(this.x, this.y, 15, 50, 10, 4.5, 15, 345, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 30, false),
                    new Cannon(this.x, this.y, 15, 40, 10, 4.5, 15, 330, false),
                ];
                break;
        }
        this.cannonAngle = 0;
        this.frame = 0;
        this.color = "rgb(255,80,80)";
        this.alive = true;
        this.red = 255;
        this.green = 80;
        this.blue = 80;
    }
    fade() {
        if (this.red <= 0) {
            this.alive = false;
        }
        this.red -= 1.5;
        this.green -= 0.7;
        this.blue -= 0.7;
        this.color = `rgb(${this.red},${this.green},${this.blue})`;
    }
    update() {
        this.frame++;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        let deltaX = player.x - this.x;
        let deltaY = player.y - this.y;
        this.cannonAngle = (Math.atan2(deltaX, deltaY) * 180) / Math.PI;
        if (this.cannonAngle < 0) {
            this.cannonAngle = 360 + this.cannonAngle;
        }
        this.cannons.forEach((cannon) => {
            cannon.mainCannon
                ? cannon.update(this.cannonAngle)
                : cannon.update(this.cannonAngle + cannon.offsetRot);
        });
        if (this.frame > this.fadeTime) this.fade();
    }
}
let tanks = [];
let gameFrame = 0;
let guaranteedSpawn = 0;
let spawnRate = 2;
let musicPlayingAS = false;

canvas.addEventListener("click", () => {
    if (!musicPlayingAS) {
        musicPlayingAS = true;
        let music = document.getElementById("courtesy");
        music.loop = true;
        music.play();
    }
});

function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore-amazingSkill", highScore);
    }
}
function readHighScore() {
    return highScore;
}
highScore = localStorage.getItem("highScore-amazingSkill");
if (highScore === null) {
    highScore = 0;
}
let playScreen = true;
function gameLoop() {
    setTimeout(() => {
        if (spawnRate >= 5) {
            spawnRate = 5;
        }
        let highScorePos = 955;
        for (var i = 0; i < (highScore + "").length; i++) {
            highScorePos -= 20;
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1100, 700);
        if (player.alive) {
            score = Math.round(gameFrame / 10);
            spawnRate -= 0.0002;
            gameFrame++;
            guaranteedSpawn++;
            player.update();
            if (Math.floor(Math.random() * 1000) < spawnRate) {
                tanks.push(new Tank());
            }
            if (guaranteedSpawn > 1000) {
                guaranteedSpawn = 0;
                tanks.push(new Tank());
            }
        }
        let tankColliding = false;
        tanks.forEach((tank) => {
            if (tank.alive) tank.update();
            if (colliding(player, 15, tank, tank.radius) && tank.alive) {
                tankColliding = true;
            }
        });
        bullets.forEach((bullet) => {
            if (bullet.alive) {
                bullet.update();
                if (
                    colliding(player, 15, bullet, bullet.radius) ||
                    tankColliding
                ) {
                    spawnrate = 10;
                    gameFrame = 0;
                    bullets = [];
                    tanks = [];
                    player.alive = false;
                    playScreen = true;
                    saveHighScore();
                }
            }
        });
        ctx.fillStyle = "rgb(77,196,255)";
        ctx.fillText(`Score:${score}`, 20, 60);
        ctx.fillText(`Best:${highScore}`, highScorePos, 60);

        if (playScreen) {
            canvas.style.cursor = "auto";
            ctx.fillStyle = "rgb(77,196,255)";
            ctx.fillRect(475, 320, 150, 60);
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillText("Play", 505, 365);
            if (mouse.clicked) {
                if (mouse.x > 475 && mouse.x < 625) {
                    tanks = [new Tank()];
                    playScreen = false;
                    player.alive = true;
                    canvas.style.cursor = "none";
                }
            }
        }
        gameLoop();
    }, 16);
}
gameLoop();
