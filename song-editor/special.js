export default function main() {
    const board = new Board();
}

export class Board {
    sizeX = 10;
    sizeY = 10;
    board;
    snake;
    intervalID;
    ticks = 600;
    gameState = "menu";

    constructor() {
        document.addEventListener('keydown', (event) => { this.keyPressed(event.key) });
        this.gameState = "menu";
        this.render();
    }

    spawnApple() {
        const emptyPositions = [];
        const emptyTypes = [];
        for (let i = 0; i < this.sizeX; i++) {
            for (let j = 0; j < this.sizeY; j++) {
                if (this.getPosition(i, j) == "none")
                    emptyPositions.push([i, j]);
                emptyTypes.push(this.getPosition(i, j));
            }
        }
        const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        if (emptyPositions.length == 0) {
            this.gameOver("You won!");
        }
        this.setPosition(randomPosition[0], randomPosition[1], "apple");
        // console.log("spawning apple at: (" + randomPosition[0] + ", " + randomPosition[1] + ") from list: ", emptyTypes);
    }

    getPosition(X, Y) {
        if (X >= this.sizeX || X < 0 || Y >= this.sizeY || Y < 0) return "OOB";
        return this.board[Y][X];
        //types = "apple", "snake", "none"
    }

    setPosition(X, Y, value) {
        if (X >= this.sizeX || X < 0 || Y >= this.sizeY || Y < 0) return false;
        this.board[Y][X] = value;
        return true;
    }

    startGame() {
        this.board = [];
        for (let i = 0; i < this.sizeY; i++) {
            this.board.push([]);
            for (let j = 0; j < this.sizeX; j++) {
                this.board[i].push("none");
            }
        }
        this.gameState = "game";
        this.snake = new Snake(this, Math.floor(this.sizeX / 2), Math.floor(this.sizeY / 2), 3, true);
        this.spawnApple();

        this.intervalID = setInterval(() => this.gameTick(), this.ticks);
    }

    gameTick() {
        this.snake.move();
        this.render();
    }

    render() {
        const canvas = document.getElementById("root");
        const boxWidth = 20;
        canvas.width = boxWidth * this.sizeX;
        canvas.height = boxWidth * this.sizeY;
        const ctx = canvas.getContext("2d");
        if (this.gameState == "menu") {
            ctx.fillStyle = "#222222";
            ctx.fillRect(0, 0, boxWidth * this.sizeX, boxWidth * this.sizeY);
            ctx.font = "50px Arial";
            ctx.strokeStyle = "white";
            ctx.strokeText("Press Space", 0, boxWidth * this.sizeY / 2, boxWidth * this.sizeX);
        } else if (this.gameState = "game") {
            for (let i = 0; i < this.sizeX; i++) {
                for (let j = 0; j < this.sizeY; j++) {
                    switch (this.getPosition(i, j)) {
                        // case undefined:
                        // case null: ctx.fillStyle = "black"; break;
                        case "none":
                            ctx.fillStyle = (i + j) % 2 == 0 ? "#ddddff" : "#8888aa";
                            ctx.fillRect(boxWidth * i, boxWidth * j, boxWidth, boxWidth);
                            break;
                        case "apple": ctx.fillStyle = "red";
                            ctx.fillRect(boxWidth * i, boxWidth * j, boxWidth, boxWidth);
                            break;
                        case "snake": ctx.fillStyle = "green";
                            ctx.fillRect(boxWidth * i, boxWidth * j, boxWidth, boxWidth);
                            if (this.snake.posX == i && this.snake.posY == j) {
                                switch (this.snake.directionInputed) {
                                    case directions.up:
                                        ctx.fillStyle = "#ffffff";
                                        ctx.fillRect(boxWidth * i + 2, boxWidth * j + 2, 4, 4);
                                        ctx.fillRect(boxWidth * i + boxWidth - 6, boxWidth * j + 2, 4, 4);
                                        ctx.fillStyle = "#000000";
                                        ctx.fillRect(boxWidth * i + 4, boxWidth * j + 2, 2, 2);
                                        ctx.fillRect(boxWidth * i + boxWidth - 6, boxWidth * j + 2, 2, 2);
                                        break;
                                    case directions.right:
                                        ctx.fillStyle = "#ffffff";
                                        ctx.fillRect(boxWidth * i + boxWidth - 6, boxWidth * j + 2, 4, 4);
                                        ctx.fillRect(boxWidth * i + boxWidth - 6, boxWidth * j + boxWidth - 6, 4, 4);
                                        ctx.fillStyle = "#000000";
                                        ctx.fillRect(boxWidth * i + boxWidth - 4, boxWidth * j + 4, 2, 2);
                                        ctx.fillRect(boxWidth * i + boxWidth - 4, boxWidth * j + boxWidth - 6, 2, 2);
                                        break;
                                    case directions.down:
                                        ctx.fillStyle = "#ffffff";
                                        ctx.fillRect(boxWidth * i + boxWidth - 6, boxWidth * j + boxWidth - 6, 4, 4);
                                        ctx.fillRect(boxWidth * i + 2, boxWidth * j + boxWidth - 6, 4, 4);
                                        ctx.fillStyle = "#000000";
                                        ctx.fillRect(boxWidth * i + boxWidth - 6, boxWidth * j + boxWidth - 4, 2, 2);
                                        ctx.fillRect(boxWidth * i + 4, boxWidth * j + boxWidth - 4, 2, 2);
                                        break;
                                    case directions.left:
                                        ctx.fillStyle = "#ffffff";
                                        ctx.fillRect(boxWidth * i + 2, boxWidth * j + boxWidth - 6, 4, 4);
                                        ctx.fillRect(boxWidth * i + 2, boxWidth * j + 2, 4, 4);
                                        ctx.fillStyle = "#000000";
                                        ctx.fillRect(boxWidth * i + 2, boxWidth * j + boxWidth - 6, 2, 2);
                                        ctx.fillRect(boxWidth * i + 2, boxWidth * j + 4, 2, 2);
                                        break;
                                }
                            }
                            break;
                    }

                }
            }
        }
    }

    keyPressed(key) {
        switch (key) {
            case "ArrowLeft":
            case "a":
                if (this.snake.direction != directions.right)
                    this.snake.directionInputed = directions.left;
                break;
            case "ArrowUp":
            case "w":
                if (this.snake.direction != directions.down)
                    this.snake.directionInputed = directions.up;
                break;
            case "ArrowRight":
            case "d":
                if (this.snake.direction != directions.left)
                    this.snake.directionInputed = directions.right;
                break;
            case "ArrowDown":
            case "s":
                if (this.snake.direction != directions.up)
                    this.snake.directionInputed = directions.down;
                break;
            case " ":
                if (this.gameState == "menu") {
                    this.startGame();
                }
                break;
            case "e":
                if (this.gameState == "menu") {
                    this.ticks /= 2;
                }
                break;
            case "q":
                if (this.gameState == "menu") {
                    this.ticks *= 2;
                }
                break;
        }

    }

    gameOver(message) {
        clearInterval(this.intervalID);
        console.log("game over: " + message);
        console.log("score: " + (this.snake.length - 3));
        console.log("speed: " + Math.round(1000/this.ticks));
        this.gameState = "menu";
        this.render();
    }
}

export class Snake {
    posX;
    posY;
    length;
    direction = directions.right;
    nextSegment;
    board;
    directionInputed = directions.right;
    prevX;
    prevY;

    constructor(board, X, Y, len) {
        this.board = board;
        this.posX = X;
        this.posY = Y;
        this.length = len;
        this.nextSegment = (len > 1) ? new Snake(board, X - 1, Y, len - 1) : null;

    }

    move() {
        this.direction = this.directionInputed;
        this.prevX = this.posX;
        this.prevY = this.posY;
        switch (this.direction) {
            case directions.right: {
                this.posX++;
                break;
            } case directions.left: {
                this.posX--;
                break;
            } case directions.up: {
                this.posY--;
                break;
            } case directions.down: {
                this.posY++;
                break;
            }
        }
        const lengthen = this.determineCollision();
        this.board.setPosition(this.prevX, this.prevY, "none");
        this.board.setPosition(this.posX, this.posY, "snake");
        if (this.nextSegment) {
            this.nextSegment.move();
            this.nextSegment.directionInputed = this.direction;
        }
        if (lengthen) {
            this.lengthen();
        }
    }

    determineCollision() {
        switch (this.board.getPosition(this.posX, this.posY)) {
            case "OOB": this.board.gameOver("Out of bounds"); break;
            case "apple": {
                this.board.spawnApple();
                return true;
            }
            case "snake": this.board.gameOver("collided with snake"); break;
        }
        return false;
    }

    lengthen() {
        this.length++;
        if (this.nextSegment == null) {
            this.nextSegment = new Snake(this.board, this.prevX, this.prevY, 1)
            this.nextSegment.directionInputed = this.direction;
        } else {
            this.nextSegment.lengthen();
        }
    }

    toString() {
        let d;
        switch (this.direction) {
            case directions.up: d = "up"; break;
            case directions.right: d = "right"; break;
            case directions.down: d = "down"; break;
            case directions.left: d = "left"; break;
        }
        return "(X = " + this.posX + ", Y = " + this.posY + ", Theta = " + d + (this.nextSegment ? (") <- " + this.nextSegment.toString()) : ")");
    }
}

export const directions = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
}