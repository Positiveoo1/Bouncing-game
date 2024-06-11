
document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


(function() {
    var devtools = {
        open: false,
        orientation: null
    };
    var threshold = 160;
    setInterval(function() {
        var widthThreshold = window.outerWidth - window.innerWidth > threshold;
        var heightThreshold = window.outerHeight - window.innerHeight > threshold;
        var orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (!(heightThreshold && widthThreshold) &&
            ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
            if (!devtools.open || devtools.orientation !== orientation) {
                devtools.open = true;
                devtools.orientation = orientation;
                window.location.reload();  
            }
        } else {
            devtools.open = false;
            devtools.orientation = null;
        }
    }, 500);
})();
const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameOverDiv = document.getElementById('gameOver');
const replayButton = document.getElementById('replayButton');
const themeToggle = document.getElementById('themeToggle');
const pauseButton = document.getElementById('pauseButton');
const bgMusic = document.querySelector('audio');
const instructionsModal = document.getElementById('instructionsModal');
const startButton = document.getElementById('startButton');

function playBackgroundMusic() {
    bgMusic.play();
}

let paddleX = (gameArea.clientWidth - paddle.offsetWidth) / 2;
let ballX = Math.random() * (gameArea.clientWidth - ball.offsetWidth);
let ballY = 0;
let ballSpeedY = 5;
let gameRunning = false;
let gamePaused = false;
let score = 0;

document.addEventListener('mousemove', function(event) {
    if (!gameRunning || gamePaused) return;
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
            score++;
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
    pauseButton.innerHTML = gamePaused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
    if (!gamePaused) {
        update();
    }
}

pauseButton.addEventListener('click', togglePause);

startButton.addEventListener('click', () => {
    instructionsModal.classList.add('hidden');
    gameRunning = true;
    playBackgroundMusic();
    update();
});

playBackgroundMusic();


window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('gameArea').classList.remove('hidden');
    }, 6000);
});
