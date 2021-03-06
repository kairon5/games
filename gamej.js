class Screen {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
    draw(obj) {
        this.ctx.fillStyle = obj.color;
        switch (obj.type) {
            case "rect":
                if (obj.rotation != 0) {
                    this.ctx.save();
                    if (obj.rotateAroundCenter) {
                        obj.x += obj.width / 2;
                        obj.y += obj.height / 2;
                    }
                    this.ctx.translate(
                        obj.x + obj.rotationOffsetX,
                        obj.y + obj.rotationOffsetY
                    );
                    this.ctx.rotate(obj.rotation * (Math.PI / 180));
                    this.ctx.translate(
                        -obj.x - obj.rotationOffsetX,
                        -obj.y - obj.rotationOffsetY
                    );
                    if (obj.rotateAroundCenter) {
                        obj.x -= obj.width / 2;
                        obj.y -= obj.height / 2;
                    }
                    if (obj.confirmationType == "rect") {
                        this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                    } else {
                        let img = new Image();
                        img.src = obj.image;
                        this.ctx.drawImage(
                            img,
                            obj.x,
                            obj.y,
                            obj.width,
                            obj.height
                        );
                    }
                    this.ctx.restore();
                } else {
                    if (obj.confirmationType == "rect") {
                        this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
                    } else {
                        let img = new Image();
                        img.src = obj.image;
                        this.ctx.drawImage(
                            img,
                            obj.x,
                            obj.y,
                            obj.width,
                            obj.height
                        );
                    }
                }
                break;
            case "circle":
                this.ctx.beginPath();
                this.ctx.arc(obj.x, obj.y, obj.radius / 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
        }
    }
    fill(rgb) {
        this.ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
class Rect {
    constructor(x, y, w, h) {
        this.rotation = 0;
        this.rotateAroundCenter = false;
        this.rotationOffsetX = 0;
        this.rotationOffsetY = 0;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "black";
        this.confirmationType = "rect";
        this.type = "rect";
    }
    colliding(other) {
        let otherw;
        let otherh;
        other.type == "circle"
            ? (otherw = other.radius)
            : (otherw = other.width);
        other.type == "circle"
            ? (otherh = other.radius)
            : (otherh = other.height);

        if (
            this.x < other.x + otherw &&
            this.x + this.width > other.x &&
            this.y < other.y + otherh &&
            this.y + this.height > other.y
        ) {
            return true;
        }
        return false;
    }
}
class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = "black";
        this.type = "circle";
    }
    colliding(other) {
        let otherw;
        let otherh;
        other.type == "circle"
            ? (otherw = other.radius)
            : (otherw = other.width);
        other.type == "circle"
            ? (otherh = other.radius)
            : (otherh = other.height);

        if (
            this.x < other.x + otherw &&
            this.x + this.radius > other.x &&
            this.y < other.y + otherh &&
            this.y + this.radius > other.y
        ) {
            return true;
        }
        return false;
    }
}
class Img {
    constructor(x, y, w, h, src) {
        this.rotation = 0;
        this.rotateAroundCenter = false;
        this.rotationOffsetX = 0;
        this.rotationOffsetY = 0;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.confirmationType = "img";
        this.type = "rect";
        this.image = src;
    }
    colliding(other) {
        let otherw;
        let otherh;
        other.type == "circle"
            ? (otherw = other.radius)
            : (otherw = other.width);
        other.type == "circle"
            ? (otherh = other.radius)
            : (otherh = other.height);

        if (
            this.x < other.x + otherw &&
            this.x + this.width > other.x &&
            this.y < other.y + otherh &&
            this.y + this.height > other.y
        ) {
            return true;
        }
        return false;
    }
}

function randint(start, end) {
    end -= start;
    return Math.floor(Math.random() * end) + start;
}
function rad(deg) {
    return deg * (Math.PI / 180);
}
function deg(rad) {
    return rad * (180 / Math.PI);
}
function initScreen(canvas) {
    return new Screen(canvas);
}
function createRect(x, y, w, h) {
    return new Rect(x, y, w, h);
}
function createCircle(x, y, r) {
    return new Circle(x, y, r);
}
function createImage(x, y, w, h, src) {
    return new Img(x, y, w, h, src);
}
let curRefreshRes = 0;
let deltaTime = 0;
let multiplier = 0;
function refreshRate() {
    curRefreshRes = 0;
    deltaTime = 0;
    multiplier = 0;
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame =
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame;
    }

    let t = [];
    let results = [];
    let sum = 0;
    let testingDone = false;
    setTimeout(function(){
        testingDone = true;
        results.forEach(i => {
            sum += i;
        });
        curRefreshRes = Math.round(sum/results.length);
        deltaTime = Math.round(1000/curRefreshRes);
        multiplier = deltaTime/16;
        //60fps is the standard, so its what the game is programmed for at the base. 16 is the delta time for 60, (1000/60) so we use that as a multiplier. if the hz is 120, we multiply everything by 0.5, while for 30 fps we multiply it by 2.
    },200);
    function animate(now) {
        t.unshift(now);
        if (t.length > 10) {
            var t0 = t.pop();
            var fps = Math.floor(1000 * 10 / (now - t0));
            results.push(fps); 
        }
        if(!testingDone) {
            window.requestAnimationFrame(animate);
        }
    };
    window.requestAnimationFrame(animate);
}
