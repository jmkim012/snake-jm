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

let game; // Declare the game interval variable
let isPaused = false; // Variable to track the pause state

// Function to start the game
function startGame() {
    if (!game) {
        game = setInterval(draw, 100); // Adjust the interval as needed
    }
}

// Function to pause the game
function pauseGame() {
    if (game) {
        clearInterval(game);
        game = null;
    }
}

// Event listeners for play and pause buttons
document.getElementById('playButton').addEventListener('click', () => {
    isPaused = false;
    startGame();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = true;
    pauseGame();
});

// Your existing game loop function
function draw() {
    if (isPaused) return; // Skip the game loop if the game is paused

    // Your existing game logic here
    // Clear the canvas
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        gameCtx.fillStyle = snakeColor;
        gameCtx.fillRect(snake[i].x, snake[i].y, box, box);
        gameCtx.strokeStyle = 'black';
        gameCtx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    gameCtx.fillStyle = 'red';
    gameCtx.fillRect(food.x, food.y, box, box);

    // Old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Direction
    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    // If the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eatSound.play();
        food = {
            x: Math.floor(Math.random() * (gameCanvas.width / box)) * box,
            y: Math.floor(Math.random() * (gameCanvas.height / box)) * box
        };
        snakeColor = getRandomColor();
    } else {
        // Remove the tail
        snake.pop();
    }

    // Add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Go through the wall functionality
    if (newHead.x < 0) {
        newHead.x = gameCanvas.width - box;
        console.log(`newHead.x after boundary check: ${newHead.x}`);
    } else if (newHead.x >= gameCanvas.width) {
        newHead.x = 0;
        console.log(`newHead.x after boundary check: ${newHead.x}`);
    }

    if (newHead.y < 0) {
        newHead.y = gameCanvas.height - box;
        console.log(`newHead.y after boundary check: ${newHead.y}`);
    } else if (newHead.y >= gameCanvas.height) {
        newHead.y = 0;
        console.log(`newHead.y after boundary check: ${newHead.y}`);
    }

    // Game over
    if (collision(newHead, snake)) {
        console.log(`Collision detected! newHead: ${JSON.stringify(newHead)}, snake: ${JSON.stringify(snake)}`);
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

// Collision detection function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function getRandomColor() {
    const colors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080']; // Red, Orange, Yellow, Green, Blue, Bright Purple
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
/* 
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color;
    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    } while (color === '#000000');
    return color;
} */

// Start the game initially
startGame();