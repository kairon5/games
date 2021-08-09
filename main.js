class Game {
    constructor(name) {
        this.name = name;
        this.gameS = document.createElement("script");
        this.gameC = document.createElement("canvas");
        this.gameS.src = `${name}.js`;
        this.gameC.id = `canvas-${name}`;
        this.documentIcon = document.createElement("link");
        this.documentIcon.rel = "icon";
        this.documentIcon.href = `files/${name}.png`;
        this.window = document.getElementById(`${name}-img`);
    }
}

games = [new Game("Amazing-Skill")];
games.forEach((game) => {
    game.window.addEventListener("click", () => {
        for (var i = 0; i < games.length; i++) {
            let curGame = games[i];
            if (curGame == game) {
                continue;
            }
            document.head.removeChild(game.documentIcon);
            document.body.removeChild(game.gameS);
            document.body.removeChild(game.gameC);
        }
        document.getElementById(
            "title"
        ).innerText = `Games at GameHub - ${game.name}`;
        document.head.appendChild(game.documentIcon);
        document.body.appendChild(game.gameS);
        document.body.appendChild(game.gameC);
    });
});
