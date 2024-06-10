const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameOverDiv = document.getElementById('gameOver');
const replayButton = document.getElementById('replayButton');
const themeToggle = document.getElementById('themeToggle');
const pauseButton = document.getElementById('pauseButton');

let paddleX = (gameArea.clientWidth - paddle.offsetWidth) / 2;
let ballX = Math.random() * (gameArea.clientWidth - ball.offsetWidth);
let ballY = 0;
let ballSpeedY = 5;
let gameRunning = true;
let gamePaused = false;
let score = 0;

document.addEventListener('mousemove', function(event) {
    if (gamePaused) ;
    const rect = gameArea.getBoundingClientRect();
    paddleX = event.clientX - rect.left - paddle.offsetWidth / 2;
    paddleX = Math.max(0, Math.min(gameArea.clientWidth - paddle.offsetWidth, paddleX));
    paddle.style.left = paddleX + 'px';
});

function update() {
    if (!gameRunning || gamePaused) return;

    ballY += ballSpeedY;

    if (ballY <= 0) {
        ballSpeedY = Math.abs(ballSpeedY); 
    } else if (ballY + ball.offsetHeight >= gameArea.clientHeight) {
        if (ballX + ball.offsetWidth >= paddleX && ballX <= paddleX + paddle.offsetWidth) {
            ballX = Math.random() * (gameArea.clientWidth - ball.offsetWidth);
            ballY = 0;
            ballSpeedY = Math.abs(ballSpeedY); 
            score++; // Increment score
            scoreDisplay.textContent = `Score: ${score}`; 
        } else {
            gameOver(); 
            return;
        }
    }

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
    gamePaused = false;
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

function togglePause() {
    gamePaused = !gamePaused;
    pauseButton.innerHTML = gamePaused ?'<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    if (!gamePaused) {
        update();
    }
}

pauseButton.addEventListener('click', togglePause);

update();
