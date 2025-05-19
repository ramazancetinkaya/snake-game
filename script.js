const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgMusic = document.getElementById("bg-music");
const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("game-over-sound");
canvas.width = canvas.height = Math.min(window.innerWidth * 0.9, 600);

const box = canvas.width / 30;
let score = 0;
let speed = 150;
let snake = [{ x: box * 5, y: box * 5 }];
let direction = 'RIGHT';
let food = generateFood();
let gameLoop;
let gameMode = 'infinite';
let timeLeft = 60;
let countdownInterval=null;

function startGame(mode) {
    gameMode = mode;
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('timer').style.display = mode === 'timed' ? 'block' : 'none';
    document.getElementById('score').style.display = 'block';
    document.getElementById('gameCanvas').style.display = 'block';
    if (mode === 'timed') {
        timeLeft = 60;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}`;
        countdownInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').innerText = `Time Left: ${timeLeft}`;
            if (timeLeft <= 0) endGame();
        }, 1000);
    }
    restartGame();
    document.addEventListener("click", () => {
        bgMusic.muted = false;
        bgMusic.play().catch(() => {});
    }, { once: true });
}

function showStartMenu() {
    document.getElementById('startMenu').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    clearInterval(gameLoop);
    clearInterval(countdownInterval);
}

function generateFood() {
    let foodX, foodY;
    do {
        foodX = Math.floor((Math.random() * canvas.width) / box) * box;
        foodY = Math.floor((Math.random() * canvas.height) / box) * box;
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
    return { x: foodX, y: foodY };
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const key = event.key;
    const oppositeDirections = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
    };
    const newDirection = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT'
    }[key];
    if (newDirection && newDirection !== oppositeDirections[direction]) {
        direction = newDirection;
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff88' : '#00cc66';
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = '#161b22';
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

function drawFood() {
    ctx.fillStyle = '#ff0033';
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    const head = { ...snake[0] };
    if (direction === 'UP') head.y -= box;
    else if (direction === 'DOWN') head.y += box;
    else if (direction === 'LEFT') head.x -= box;
    else if (direction === 'RIGHT') head.x += box;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').innerText = `Score: ${score}`;
        food = generateFood();
        if (speed > 50) speed -= 5;
        clearInterval(gameLoop);
        gameLoop = setInterval(update, speed);
        eatSound.currentTime = 0;
        eatSound.play();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameLoop);
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    const gameOverDiv = document.getElementById('gameOver');
    gameOverDiv.style.display = 'block';
    gameOverDiv.innerHTML = `
        Game Over!<br>
        <button onclick="restartGame()">Restart Game</button>
        <button onclick="showStartMenu()">Select Mode</button>
    `;
    gameOverSound.play();
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function restartGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    direction = 'RIGHT';
    score = 0;
    speed = 150;
    document.getElementById('score').innerText = `Score: 0`;
    document.getElementById('gameOver').style.display = 'none';
    food = generateFood();
    clearInterval(gameLoop);
    gameLoop = setInterval(update, speed);

    if (gameMode === 'timed') {
        timeLeft = 60;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}`;
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').innerText = `Time Left: ${timeLeft}`;
            if (timeLeft <= 0) endGame();
        }, 1000);
    }
    bgMusic.play();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    moveSnake();
    drawSnake();
    checkCollision();
}

gameLoop = setInterval(update, speed);
document.getElementById('gameOver').style.display = 'none';
document.getElementById('timer').style.display = 'none';
document.getElementById('score').style.display = 'none';
document.getElementById('gameCanvas').style.display = 'none';

window.addEventListener('resize', () => {
    canvas.width = canvas.height = Math.min(window.innerWidth * 0.9, 600);
});
