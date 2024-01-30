// Define the Gold class
class Gold {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.value = size > 30 ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 15) + 1; // Random value between 1 and 15, larger golds worth more points
    }

    // Draw gold on canvas
    draw() {
        ctx.drawImage(goldImg, this.x, this.y, this.size, this.size);
    }

    // Update gold position
    update() {
        this.y += this.speed;
        this.draw();
    }
}

// Define the Bomb class
class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Draw bomb on canvas
    draw() {
        ctx.drawImage(bombImg, this.x, this.y, 30, 30);
    }
}

// Load images and sounds
const basketImg = new Image();
basketImg.src = 'https://pages.mtu.edu/~cai/cyberhusky/goldgame/rocket.png'; // Basket image URL

const goldImg = new Image();
goldImg.src = 'https://pages.mtu.edu/~cai/cyberhusky/goldgame/rock.png'; // Gold image URL

const bombImg = new Image();
bombImg.src = 'bomb.jpg'; // Bomb image URL

const collectSound = new Audio('https://pages.mtu.edu/~cai/cyberhusky/goldgame/hit.mp3'); // Collect sound URL

// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize game variables
let basketX = canvas.width / 2;
let basketY = canvas.height - 50;
const basketWidth = 50;
const basketHeight = 50;
let score = 0;
let timeLeft = 60; // Set initial time to 60 seconds
let bombCounter = 0;
let dollarSignVisible = false; // Flag to control visibility of dollar sign

// Arrays to store golds and bombs
let golds = [];
let bombs = [];

// Update bomb counter display
function updateBombCounter() {
    document.getElementById('bombCount').innerText = bombCounter;
}

// Function to display dollar sign over the basket
function showDollarSignEffect() {
    dollarSignVisible = true;
    setTimeout(() => {
        dollarSignVisible = false;
    }, 1000); // Duration: 1 second
}

// Function to display "Uh oh" text
function showUhOhText() {
    const uhOhText = document.getElementById('uhOhText');
    uhOhText.classList.remove('hidden');
    setTimeout(() => {
        uhOhText.classList.add('hidden');
    }, 1000); // Duration: 1 second
}

// Start button click event listener
document.getElementById('startButton').addEventListener('click', startGame);

// Timer function to decrement time left every second
function startTimer() {
    const timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerInterval); // Stop timer when time runs out
            endGame();
        }
    }, 1000); // Update every second (1000 milliseconds)
}

// Game loop function
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw basket
    ctx.drawImage(basketImg, basketX, basketY, basketWidth, basketHeight);

    // Draw dollar sign over the basket if visible
    if (dollarSignVisible) {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText('$', basketX + basketWidth / 2, basketY - 10);
    }

    // Draw and update golds
    golds.forEach((gold, index) => {
        gold.update();

        // Check collision with basket
        if (
            gold.x < basketX + basketWidth &&
            gold.x + gold.size > basketX &&
            gold.y < basketY + basketHeight &&
            gold.y + gold.size > basketY
        ) {
            golds.splice(index, 1);
            score += gold.value;
            collectSound.play();
            showDollarSignEffect(); // Show dollar sign over the basket
        }

        // Remove gold if it reaches bottom of canvas
        if (gold.y > canvas.height) {
            golds.splice(index, 1);
        }
    });

    // Draw and update bombs
    bombs.forEach((bomb, index) => {
        bomb.y += 2; // Bomb falls at a constant speed
        bomb.draw();

        // Check collision with basket
        if (
            bomb.x < basketX + basketWidth &&
            bomb.x + 30 > basketX &&
            bomb.y < basketY + basketHeight &&
            bomb.y + 30 > basketY
        ) {
            bombs.splice(index, 1);
            score -= 10; // Deduct 10 points for collecting a bomb
            bombCounter++; // Increment bomb counter
            collectSound.play();
            updateBombCounter(); // Update bomb counter display
            showUhOhText(); // Show "Uh oh" text
            if (bombCounter === 3) {
                endGame();
            }
        }

        // Remove bomb if it reaches bottom of canvas
        if (bomb.y > canvas.height) {
            bombs.splice(index, 1);
        }
    });

    // Spawn new golds and bombs
    if (Math.random() < 0.02) {
        spawnGold();
    }
    if (Math.random() < 0.005) {
        spawnBomb();
    }

    // Update scoreboard
    document.getElementById('score').innerText = score;

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
    // Reset game variables
    score = 0;
    timeLeft = 60;
    bombCounter = 0;
    updateBombCounter();

    // Update display
    document.getElementById('score').innerText = score;
    document.getElementById('time').innerText = timeLeft;

    // Start game loop
    gameLoop();

    // Start timer countdown
    startTimer();
}

// End the game
function endGame() {
    alert('Game over! Your final score is: ' + score);
    location.reload(); // Reload the page
}

// Spawn gold
function spawnGold() {
    const x = Math.random() * (canvas.width - 50);
    const y = 0;
    const size = Math.random() * 30 + 20; // Random size between 20 and 50
    const speed = Math.random() * 2 + 1; // Random speed between 1 and 3
    golds.push(new Gold(x, y, size, speed));
}

// Spawn bomb
function spawnBomb() {
    const x = Math.random() * (canvas.width - 30);
    const y = 0;
    bombs.push(new Bomb(x, y));
}

// Handle keyboard input for basket movement
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && basketX > 0) {
        basketX -= 10;
    } else if (event.key === 'ArrowRight' && basketX < canvas.width - basketWidth) {
        basketX += 10;
    } else if (event.key === 'ArrowUp' && basketY > 0) {
        basketY -= 10;
    } else if (event.key === 'ArrowDown' && basketY < canvas.height - basketHeight) {
        basketY += 10;
    }
});
