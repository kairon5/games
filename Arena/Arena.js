let canvasa = document.getElementById("canvas-Arena");
canvasa.width = 1000;
canvasa.height = 700;
let screen = initScreen(canvasa);

let background = createRect(0, 0, canvasa.width, canvasa.height);
background.color = "rgb(80,80,80)";

function loop() {
    setTimeout(function () {
        screen.draw(background);
        loop();
    }, 17);
}
loop();
//functions

function adjustX(xVal) {
    let xDif = 1000 / xVal;
    return (xDif * canvasa.width) / xVal;
}
function adjustX(xVal) {
    let xDif = 1000 / xVal;
    return (xDif * canvasa.width) / xVal;
}

//classes

class Tile {
    constructor(x, y, src) {
        this.width = adjust(50);
        this.height = adjust(50);
        this.rect = createImage(x, y, this.width, this.height, src);
    }
}
