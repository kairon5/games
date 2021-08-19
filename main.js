class Game {
    constructor(name) {
        this.name = name;
        this.gameS = document.createElement("script");
        this.gameC = document.createElement("canvas");
        this.gameS.src = `${name}/${name}.js`;
        this.gameC.id = `canvas-${name}`;
        this.documentIcon = document.createElement("link");
        this.documentIcon.rel = "icon";
        this.documentIcon.href = `${name}/assets/${name}.png`;
        this.window = document.getElementById(`${name}-img`);
    }
}

games = [new Game("Amazing-Skill"), new Game("Arena")];
let gameActive = false;
let currentGame = 0;
games.forEach((game) => {
    game.window.addEventListener("click", () => {
        for (var i = 0; i < games.length; i++) {
            if (gameActive) {
                let curGame = games[i];
                if (curGame == game || currentGame != i) {
                    continue;
                }
                document.head.removeChild(curGame.documentIcon);
                document.body.removeChild(curGame.gameS);
                document.body.removeChild(curGame.gameC);

                let musics = document.getElementsByTagName("audio");
                for (var j = 0; j < musics.length; j++) {
                    musics[j].pause();
                }
            }
        }
        currentGame = games.indexOf(game);
        if ((game.name = "Amazing-Skill")) {
            musicPlayingAS = false;
        }
        gameActive = true;
        document.getElementById("title").innerText = `GameHub - ${game.name}`;
        document.head.appendChild(game.documentIcon);
        document.body.appendChild(game.gameC);
        document.body.appendChild(game.gameS);
    });
});
