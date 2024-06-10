const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameOverDiv = document.getElementById('gameOver');
const replayButton = document.getElementById('replayButton');
const themeToggle = document.getElementById('themeToggle');

let paddleX = (gameArea.clientWidth - paddle.offsetWidth) / 2;
let ballX = Math.random() * (gameArea.clientWidth - ball.offsetWidth);
let ballY = 0;
let ballSpeedY = 5;
let gameRunning = true;
let score = 0;

// Move the paddle with the mouse
document.addEventListener('mousemove', function(event) {
    const rect = gameArea.getBoundingClientRect();
    paddleX = event.clientX - rect.left - paddle.offsetWidth / 2;
    paddleX = Math.max(0, Math.min(gameArea.clientWidth - paddle.offsetWidth, paddleX));
    paddle.style.left = paddleX + 'px';
});

function update() {
    if (!gameRunning) return;

    ballY += ballSpeedY;

    // Ball hits the top
    if (ballY <= 0) {
        ballSpeedY = Math.abs(ballSpeedY); // Bounce the ball downwards
    } else if (ballY + ball.offsetHeight >= gameArea.clientHeight) {
        if (ballX + ball.offsetWidth >= paddleX && ballX <= paddleX + paddle.offsetWidth) {
            // Randomize ball position and reset it to the top
            ballX = Math.random() * (gameArea.clientWidth - ball.offsetWidth);
            ballY = 0;
            ballSpeedY = Math.abs(ballSpeedY); // Ensure the ball is falling downwards
            score++; // Increment score
            scoreDisplay.textContent = `Score: ${score}`; // Update score display
        } else {
            gameOver(); // Game over
            return;
        }
    }

    // Update ball position
    ball.style.top = ballY + 'px';
    ball.style.left = ballX + 'px';
    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    gameOverDiv.classList.remove('hidden');
    gameOverDiv.style.display = 'block';
}

function resetGame() {
    ballX = Math.random() * (gameArea.clientWidth - ball.offsetWidth);
    ballY = 0;
    ballSpeedY = 5;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameRunning = true;
    gameOverDiv.classList.add('hidden');
    gameOverDiv.style.display = 'none';
    update();
}

replayButton.addEventListener('click', resetGame);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

update();
