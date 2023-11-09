/**
 * @typedef {Object} Position - X and Y coordinates.
 * @property {number} x - X coordinate.
 * @property {number} y - Y coordinate.
 */

/**
 * The canvas element.
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("gameCanvas");

/**
 * The canvas rendering context.
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");

/**
 * The snake's body parts.
 * @type {Position[]}
 */
let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
];

/**
 * The change in the X direction for the snake's movement.
 * @type {number}
 */
let dx = 10;

/**
 * The change in the Y direction for the snake's movement.
 * @type {number}
 */
let dy = 0;

/**
 * The player's score.
 * @type {number}
 */
let score = 0;

/**
 * The X coordinate for the food.
 * @type {number}
 */
let foodX;

/**
 * The Y coordinate for the food.
 * @type {number}
 */
let foodY;

/**
 * The size of the food.
 * @type {number}
 */
const foodSize = 10;

/**
 * The size of each grid unit.
 * @type {number}
 */
const gridSize = 10;

/**
 * The number of tiles.
 * @type {number}
 */
const tileCount = 40;

/**
 * Starts the game by drawing the initial snake, placing food, and starting the game loop.
 */
function startGame() {
    drawSnake();
    createFood();
    main();
}

/**
 * Draws the snake on the canvas.
 */
function drawSnake() {
    snake.forEach(drawSnakePart);
}

/**
 * Draws a single part of the snake.
 * @param {Position} snakePart - The part of the snake to be drawn.
 */
function drawSnakePart(snakePart) {
    ctx.fillStyle = "#FFFFFF"; // Snake color is white
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

/**
 * Creates food and places it randomly on the canvas.
 */
function createFood() {
    foodX = Math.floor(Math.random() * tileCount) * gridSize;
    foodY = Math.floor(Math.random() * tileCount) * gridSize;

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if (foodIsOnSnake)
            createFood();
    });
}

/**
 * Draws the food on the canvas.
 */
function drawFood() {
    ctx.fillStyle = "#FF0000"; // Food color is red
    ctx.fillRect(foodX, foodY, foodSize, foodSize);
}

/**
 * The main game loop controlling the game flow.
 */
function main() {
    if (didGameEnd()) {
        document.getElementById("finalScore").innerText = score;
        document.querySelector(".game-over").style.display = "block";
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        main();
    }, 100);
}

/**
 * Advances the snake's movement and handles eating food.
 */
function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        document.querySelector(".score").innerText = "Score: " + score;
        createFood();
    } else {
        snake.pop();
    }
}

/**
 * Checks if the game has ended due to collision or out-of-bounds.
 * @returns {boolean} - Whether the game has ended or not.
 */
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - gridSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

/**
 * Clears the canvas for the next frame.
 */
function clearCanvas() {
    ctx.fillStyle = "#333"; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Handles user input for changing the snake's direction.
 * @param {KeyboardEvent} event - The key event object.
 */
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}

// User interaction
document.addEventListener("keydown", changeDirection);

// Start game
startGame();
