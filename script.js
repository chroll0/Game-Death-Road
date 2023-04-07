const carBtn = document.querySelectorAll(".carBtn");
const startBtn = document.querySelector(".startBtn");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const requiredMessage = document.querySelector(".requiredMessage");
const activeCar = document.querySelector(".activeCar");
const collectedStars = document.querySelector(".collectedStars");
const timer = document.querySelector(".timer");
const gameLives = document.querySelector(".gameLives");
//Game end const
const gameEnd = document.querySelector(".gameEnd");
const restartBtn = document.querySelector(".restartBtn");
const playerStars = document.querySelector(".playerStars");
const playTime = document.querySelector(".playTime");

// Set up the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.7;
const carImage = new Image();
const barrierImage = new Image();
barrierImage.src = "Images/barrier.png";
const starImage = new Image();
starImage.src = "Images/star.png";

// Define the object
let car,
  barriers,
  stars,
  numBarriers,
  numStars,
  gameTime,
  playerLives,
  playing,
  timerFunction;
// Start the game
initialization();
playButton();
// Main animation loop
function startGame() {
  if (playing) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas and redraw the rectangle in its new position
    drawCar();
    document.addEventListener("keydown", moveCar);
    drawBarriers();
    drawStars();
    checkCollisions(); // Check for collisions on every animation frame
    requestAnimationFrame(startGame);
  }
}
function playButton() {
  carBtn.forEach((carIndex) => {
    carIndex.addEventListener("click", function () {
      carBtn.forEach((btn) => btn.classList.remove("activeCarBtn"));
      this.classList.add("activeCarBtn");
      carImage.src = this.src;
    });
  });
  startBtn.addEventListener("click", function () {
    if (carImage.src != "") {
      overlay.classList.add("hidden");
      modal.classList.add("hidden");
      playing = true;
      startGame();
      timerFunction = setInterval(() => {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        timer.textContent = `⏳ ${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;
        gameTime++;
      }, 1000);
    } else {
      requiredMessage.style.color = "#e32bce";
    }
  });
}
// Draw the rectangle on the canvas
function drawCar() {
  ctx.beginPath();
  ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
  ctx.fill();
  ctx.closePath();
}
// Move the rectangle based on user input
function moveCar(e) {
  switch (e.keyCode) {
    case 37: // Left arrow
      if (car.x > 0) {
        car.x -= car.speed;
      }
      break;
    case 38: // Up arrow
      if (car.y > 0) {
        car.y -= car.speed;
      }
      break;
    case 39: // Right arrow
      if (car.x + car.width < canvas.width) {
        car.x += car.speed;
      }
      break;
    case 40: // Down arrow
      if (car.y + car.height < canvas.height) {
        car.y += car.speed;
      }
      break;
  }
}
// Draw the barriers on the canvas
function drawBarriers() {
  // Draw the barriers
  for (var i = 0; i < barriers.length; i++) {
    ctx.drawImage(
      barrierImage,
      barriers[i].x,
      barriers[i].y,
      barriers[i].width,
      barriers[i].height
    );
  }
  for (var i = 0; i < barriers.length; i++) {
    barriers[i].y += barriers[i].speed;
  } // Check if the first barrier has reached the canvas height
  if (barriers[0].y >= canvas.height) {
    numBarriers++;
    console.log(numBarriers);
    barriers.shift(); // remove the first barrier
    barriers.push({
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: Math.floor(Math.random() * 3) + 1,
    });
    if (numBarriers % 10 == 0) {
      // Add a new barrier to the array
      barriers.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: Math.floor(Math.random() * 3) + 1,
      });
    }
  }
}
// Draw the barriers on the canvas
function drawStars() {
  // Draw the barriers
  for (var i = 0; i < stars.length; i++) {
    ctx.drawImage(
      starImage,
      stars[i].x,
      stars[i].y,
      stars[i].width,
      stars[i].height
    );
  }
}
// Check for collisions between the object and barriers
function checkCollisions() {
  for (var i = 0; i < barriers.length; i++) {
    var barrier = barriers[i];
    if (
      car.x <= barrier.x + barrier.width &&
      car.x + car.width >= barrier.x &&
      car.y <= barrier.y + barrier.height &&
      car.y + car.height >= barrier.y
    ) {
      playerLives--;
      if (playerLives == 2) {
        gameLives.textContent = "🤍❤️❤️";
        barriers = [
          {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 2,
          },
        ];
      }
      if (playerLives == 1) {
        gameLives.textContent = "🤍🤍❤️";
        barriers = [
          {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 2,
          },
        ];
      }
      if (playerLives == 0) {
        gameLives.textContent = "🤍🤍🤍";
        gameOver();
        initialization();
      }
    }
  }
  let star = stars[0];
  if (
    car.x <= star.x + star.width &&
    car.x + car.width >= star.x &&
    car.y <= star.y + star.height &&
    car.y + car.height >= star.y
  ) {
    numStars++;
    collectedStars.textContent = "⭐: " + numStars;
    stars[0].x = Math.random() * (canvas.width - 20);
    stars[0].y = Math.random() * (canvas.height - 20);
  }
}
function initialization() {
  // Define the object
  car = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 60,
    speed: 15,
  };
  // Define the barriers
  barriers = [
    {
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 2,
    },
  ];
  stars = [
    {
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      width: 20,
      height: 20,
    },
  ];
  numBarriers = 0;
  numStars = 0;
  playerLives = 3;
  gameTime = 0;
  playing = false;
  // Reset car position
  car.x = canvas.width / 2;
  car.y = canvas.height / 2;
  // Reset game
  numBarriers = 0;
  playing = false;
  // Start the game again
  collectedStars.textContent = "⭐: " + numStars;
  gameLives.textContent = "❤️❤️❤️";
  timer.textContent = "⏳ 0:00";
  clearInterval(timerFunction);
  overlay.classList.remove("hidden");
}
function gameOver() {
  gameEnd.classList.remove("hidden");
  playerStars.textContent = collectedStars.textContent;
  playTime.textContent = timer.textContent;
  restartBtn.addEventListener("click", function () {
    gameEnd.classList.add("hidden");
    modal.classList.remove("hidden");
  });
}
