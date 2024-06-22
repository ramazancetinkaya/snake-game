const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');
const gameArea = document.querySelector('.game-area');

const gridSize = 20;

function getNearestDivisibleBy20(number) {
    if (number % 20 !== 0) {
        let nearestDivisible = Math.floor(number / 20) * 20;
        return nearestDivisible
    }
}

nearestDivisible = getNearestDivisibleBy20(window.innerWidth - 50);

const canvasSize = (nearestDivisible) > 400 ? 400 : nearestDivisible;

let snake, food, score, direction, gameInterval, speed;

canvas.width = canvasSize;
canvas.height = canvasSize;

console.log(window.innerWidth, window.innerHeight);
console.log(nearestDivisible);

function initGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    score = 0;
    speed = 100;
    placeFood();
    clearInterval(gameInterval);
    gameArea.classList.remove('game-over');
    restartButton.style.display = 'none';
    gameInterval = setInterval(gameLoop, speed);
    scoreDisplay.textContent = "00";
}

function placeFood() {
    let foodOverlap = true;
    while (foodOverlap) {
        food = {
            x: Math.floor(Math.random() * canvasSize / gridSize) * gridSize,
            y: Math.floor(Math.random() * canvasSize / gridSize) * gridSize
        };
        foodOverlap = snakeCollision(food);
    }
}

function gameLoop() {
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score.toString().padStart(2, '0');
        snake.push({});
        placeFood();
        speed -= 5;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = { ...snake[i - 1] };
    }

    snake[0] = head;

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snakeCollision(head)) {
        gameOver();
    }
}

function draw() {
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = '#2c3e50';
    for (let i = 0; i < canvasSize / gridSize; i++) {
        for (let j = 0; j < canvasSize / gridSize; j++) {
            ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
    }

    ctx.fillStyle = '#ffffff';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function snakeCollision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    clearInterval(gameInterval);
    gameArea.classList.add('game-over');
    restartButton.style.display = 'block';
}

function setDirection(newDirection) {
    if ((newDirection.x !== 0 && direction.x === 0) || (newDirection.y !== 0 && direction.y === 0)) {
        direction = newDirection;
    }
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            setDirection({ x: 0, y: -gridSize });
            break;
        case 'ArrowDown':
            setDirection({ x: 0, y: gridSize });
            break;
        case 'ArrowLeft':
            setDirection({ x: -gridSize, y: 0 });
            break;
        case 'ArrowRight':
            setDirection({ x: gridSize, y: 0 });
            break;
    }
});

document.getElementById('up').addEventListener('click', () => setDirection({ x: 0, y: -gridSize }));
document.getElementById('down').addEventListener('click', () => setDirection({ x: 0, y: gridSize }));
document.getElementById('left').addEventListener('click', () => setDirection({ x: -gridSize, y: 0 }));
document.getElementById('right').addEventListener('click', () => setDirection({ x: gridSize, y: 0 }));

restartButton.addEventListener('click', initGame);

initGame();
