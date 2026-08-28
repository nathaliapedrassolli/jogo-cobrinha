const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("finalScore");
const gameOverElement = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");
const controlButtons = document.querySelectorAll(".control");

const gridSize = 30;
const tileSize = canvas.width / gridSize;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameRunning;
let gameLoop;

function startGame() {
  snake = [
    { x: 15, y: 15 },
    { x: 14, y: 15 },
    { x: 13, y: 15 }
  ];

  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  gameRunning = true;

  scoreElement.textContent = score;
  gameOverElement.classList.add("hidden");

  generateFood();

  clearInterval(gameLoop);
  gameLoop = setInterval(update, 130);
  draw();
}

function generateFood() {
  let validPosition = false;

  while (!validPosition) {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };

    validPosition = !snake.some(
      segment => segment.x === food.x && segment.y === food.y
    );
  }
}

function update() {
  if (!gameRunning) return;

  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  drawSnake();
}

function drawGrid() {
  ctx.strokeStyle = "#202020";
  ctx.lineWidth = 1;

  for (let i = 0; i <= gridSize; i++) {
    const position = i * tileSize;

    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, position);
    ctx.lineTo(canvas.width, position);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const padding = 2;
    const x = segment.x * tileSize + padding;
    const y = segment.y * tileSize + padding;
    const size = tileSize - padding * 2;

    ctx.fillStyle = index === 0 ? "#ffffff" : "#bdbdbd";

    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 5);
    ctx.fill();
  });

  drawEyes();
}

function drawEyes() {
  const head = snake[0];
  const x = head.x * tileSize;
  const y = head.y * tileSize;

  ctx.fillStyle = "#171717";

  let eyePositions;

  if (direction.x === 1) {
    eyePositions = [
      { x: x + 21, y: y + 9 },
      { x: x + 21, y: y + 21 }
    ];
  } else if (direction.x === -1) {
    eyePositions = [
      { x: x + 9, y: y + 9 },
      { x: x + 9, y: y + 21 }
    ];
  } else if (direction.y === -1) {
    eyePositions = [
      { x: x + 9, y: y + 9 },
      { x: x + 21, y: y + 9 }
    ];
  } else {
    eyePositions = [
      { x: x + 9, y: y + 21 },
      { x: x + 21, y: y + 21 }
    ];
  }

  eyePositions.forEach(eye => {
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFood() {
  const centerX = food.x * tileSize + tileSize / 2;
  const centerY = food.y * tileSize + tileSize / 2;

  ctx.fillStyle = "#ffffff";

  ctx.beginPath();
  ctx.arc(centerX, centerY, tileSize * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#171717";
  ctx.beginPath();
  ctx.arc(centerX + 3, centerY - 3, 2, 0, Math.PI * 2);
  ctx.fill();
}

function changeDirection(newDirection) {
  if (!gameRunning) return;

  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const selected = directions[newDirection];

  if (
    selected.x === -direction.x &&
    selected.y === -direction.y
  ) {
    return;
  }

  nextDirection = selected;
}

function endGame() {
  gameRunning = false;
  clearInterval(gameLoop);

  finalScoreElement.textContent = score;
  gameOverElement.classList.remove("hidden");
}

document.addEventListener("keydown", event => {
  const keys = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right"
  };

  const newDirection = keys[event.key];

  if (newDirection) {
    event.preventDefault();
    changeDirection(newDirection);
  }
});

controlButtons.forEach(button => {
  button.addEventListener("click", () => {
    changeDirection(button.dataset.direction);
  });

  button.addEventListener(
    "touchstart",
    event => {
      event.preventDefault();
      changeDirection(button.dataset.direction);
    },
    { passive: false }
  );
});

restartButton.addEventListener("click", startGame);

startGame();