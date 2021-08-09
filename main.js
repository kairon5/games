class Game {
    constructor(name) {
        this.gameS = document.createElement("script");
        this.gameC = document.createElement("canvas");
        this.gameS.src = `${name}.js`;
        this.gameC.id = `canvas-${name}`;
        this.documentIcon = document.createElement("link");
        this.documentIcon.rel = "icon";
        this.documentIcon.href = `files/${name.png}`;
        this.window = document.getElementById(`${name}-img`);
    }
}

games = [new Game("amazingSkill")];
games.forEach((game) => {
    game.window.addEventListener("click", () => {
        document.head.appendChild(game.documentIcon);
        document.body.appendChild(game.gameS);
        document.body.appendChild(game.gameC);
    });
});
