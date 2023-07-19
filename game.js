const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; 
const canvasSize = 400; 
const cols = canvasSize / gridSize; 
const rows = canvasSize / gridSize; 
const directionQueue = [];

let snake = [{ x: 5, y: 5 }]; 
let food = { x: 15, y: 10 }; 
let score = 0; 
let bestScore = localStorage.getItem("bestScore");
let direction = "";
let snakeSpeed = 115;

console.log(bestScore);

if (!bestScore) {
    bestScore = 0;
    localStorage.setItem("bestScore", bestScore);
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawGrid() {
    ctx.strokeStyle = "#ccc";
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }

function moveSnake() {
    const head = { ...snake[0] };
    if(direction === "right") head.x += 1;
    if(direction === "left") head.x -= 1;
    if(direction === "up") head.y -= 1;
    if(direction === "down") head.y +=1;

    snake.unshift(head);
    snake.pop();
}

function resetGame() {
    showGameOverPopup();
    snake = [{ x: 5, y: 5 }];
    food = { x: 15, y: 10 }; 
    direction = "";
}

function checkCollisions() {
    const head = { ...snake[0] };
    const snakeWithoutHead = [...snake].slice(1);

    let isOnSnake = snakeWithoutHead.some((segment) => segment.x === head.x && segment.y === head.y);

    if(head.x === 21 || head.x === -1 || head.y === -1 || head.y === 21 || isOnSnake){
        resetGame()
    }
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = "Score: " + score + " , Best Score: " + bestScore;
}

function checkFoodCollision() {
    const head = { ...snake[0] };

    if(head.x === food.x && head.y === food.y) {
        score += 1;
        if(score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore);
        }

        updateScoreDisplay();
        increaseSnakeSize();
        generateFood();
    }
}

function increaseSnakeSize() {
    const tail = snake[snake.length - 1];

    if(direction === "right") snake.push({x: tail.x - 1, y: tail.y});
    if(direction === "left") snake.push({x: tail.x + 1, y: tail.y});
    if(direction === "up") snake.push({x: tail.x, y: tail.y + 1});
    if(direction === "down") snake.push({x: tail.x, y: tail.y - 1});
}

function generateFood() {
    let newFoodX = Math.floor(Math.random() * cols);
    let newFoodY = Math.floor(Math.random() * rows);
  
    let isOnSnake = snake.some((segment) => segment.x === newFoodX && segment.y === newFoodY);
  
    while (isOnSnake) {
      newFoodX = Math.floor(Math.random() * cols);
      newFoodY = Math.floor(Math.random() * rows);
      isOnSnake = snake.some((segment) => segment.x === newFoodX && segment.y === newFoodY);
    }
  
    food = { x: newFoodX, y: newFoodY };
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  moveSnake();
  checkCollisions();
  checkFoodCollision();

  drawGrid();
  drawSnake();
  drawFood();
  
  setTimeout(gameLoop, snakeSpeed);
}

gameLoop(); 
updateScoreDisplay();

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "down") directionQueue.push("up");
  else if (event.key === "ArrowDown" && direction !== "up") directionQueue.push("down");
  else if (event.key === "ArrowLeft" && direction !== "right") directionQueue.push("left");
  else if (event.key === "ArrowRight" && direction !== "left") directionQueue.push("right");
});

async function handleDirectionChanges() {
    while (true) {
      if (directionQueue.length > 0) {
        direction = directionQueue.shift();
      }
      await new Promise((resolve) => setTimeout(resolve, snakeSpeed / 2));
    }
}

handleDirectionChanges();

function showGameOverPopup() {
    const popupContainer = document.createElement("div");
    popupContainer.style.position = "fixed";
    popupContainer.style.top = "0";
    popupContainer.style.left = "0";
    popupContainer.style.width = "100%";
    popupContainer.style.height = "100%";
    popupContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    popupContainer.style.display = "flex";
    popupContainer.style.justifyContent = "center";
    popupContainer.style.alignItems = "center";
  
    const popupContent = document.createElement("div");
    popupContent.style.backgroundColor = "#fff";
    popupContent.style.padding = "20px";
    popupContent.style.borderRadius = "5px";
    popupContent.style.textAlign = "center";
  
    const popupText = document.createElement("p");
    popupText.textContent = "Game Over! Vous avez perdu.";
    popupContent.appendChild(popupText);
  
    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Rejouer";
    playAgainButton.style.marginTop = "10px";
    playAgainButton.onclick = () => {
      window.location.reload();
    };
    popupContent.appendChild(playAgainButton);
  
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);
  }
  
