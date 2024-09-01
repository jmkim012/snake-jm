const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');

const scoreCanvas = document.getElementById('scoreCanvas');
const scoreCtx = scoreCanvas.getContext('2d');

const highScoreCanvas = document.getElementById('highScoreCanvas');
const highScoreCtx = highScoreCanvas.getContext('2d');

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * (gameCanvas.width / box)) * box,
    y: Math.floor(Math.random() * (gameCanvas.height / box)) * box
};

let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Initialize high score from local storage
let d = 'RIGHT'; // Initialize the direction
let snakeColor = 'green'; // Initial color of the snake

// Load sound effects
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

function draw() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    for (let i = 0; i < snake.length; i++) {
        gameCtx.fillStyle = (i == 0) ? snakeColor : 'white';
        gameCtx.fillRect(snake[i].x, snake[i].y, box, box);
        gameCtx.strokeStyle = 'red';
        gameCtx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    gameCtx.fillStyle = 'red';
    gameCtx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eatSound.play(); // Play eat sound
        food = {
            x: Math.floor(Math.random() * (gameCanvas.width / box)) * box,
            y: Math.floor(Math.random() * (gameCanvas.height / box)) * box
        };
        snakeColor = getRandomColor(); // Change snake color randomly
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= gameCanvas.width || snakeY >= gameCanvas.height || collision(newHead, snake)) {
        gameOverSound.play(); // Play game over sound
        clearInterval(game);
        alert("Game Over! Click OK to restart.");
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore); // Save new high score to local storage
        }
        location.reload(); // Reload the page to restart the game
    }

    snake.unshift(newHead);

    // Draw the score on the score canvas
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreCtx.fillStyle = 'white';
    scoreCtx.font = '25px Changa one';
    scoreCtx.fillText("Score: " + score, 10, 40);

    // Draw the high score on the high score canvas
    highScoreCtx.clearRect(0, 0, highScoreCanvas.width, highScoreCanvas.height);
    highScoreCtx.fillStyle = 'white';
    highScoreCtx.font = '25px Changa one';
    highScoreCtx.fillText("High Score: " + highScore, 10, 40);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let game = setInterval(draw, 100);