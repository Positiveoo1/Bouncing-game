const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameOverDiv = document.getElementById('gameOver');
const replayButton = document.getElementById('replayButton');

let paddleX = (gameArea.clientWidth - paddle.offsetWidth) / 2;
let ballX = Math.random() * (gameArea.clientWidth - ball.offsetWidth);
let ballY = 0;
let ballSpeedY = 5;
let gameRunning = true;
let score = 0;


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
        ballSpeedY *= -1; 
    } else if (ballY + ball.offsetHeight >= gameArea.clientHeight) {
        if (ballX + ball.offsetWidth >= paddleX && ballX <= paddleX + paddle.offsetWidth) {
            ballSpeedY *= -1; 
            score++; 
            scoreDisplay.textContent = `Score: ${score}`; 
        } else {
            gameOver(); 
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
    scoreDisplay.textContent = `Score: ${score}`; // Reset score display
    gameRunning = true;
    gameOverDiv.classList.add('hidden');
    gameOverDiv.style.display = 'none';
    update();
}

replayButton.addEventListener('click', resetGame);

update();
