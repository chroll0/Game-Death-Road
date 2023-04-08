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
canvas.width = 500;
// window.innerWidth * 0.7;
canvas.height = 500;
// window.innerHeight * 0.7;
const carImage = new Image();
const yellowCarImage = new Image();
yellowCarImage.src = "Images/yellowCar.png";
const policeCarImage = new Image();
policeCarImage.src = "Images/policeCar.png";
const blackCarImage = new Image();
blackCarImage.src = "Images/blackCar.png";
const whiteCarImage = new Image();
whiteCarImage.src = "Images/whiteCar.png";
const purpleCarImage = new Image();
purpleCarImage.src = "Images/purpleCar.png";
const orangeCarImage = new Image();
orangeCarImage.src = "Images/orangeCar.png";
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
    drawRoadLines();
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
  for (let i = 0; i < barriers.length; i++) {
    ctx.drawImage(
      barriers[i].barrierImage,
      barriers[i].x,
      barriers[i].y,
      barriers[i].width,
      barriers[i].height
    );
    barriers[i].y += barriers[i].speed;
    // Check if the barrier has reached the canvas height
    if (barriers[i].y >= canvas.height) {
      barriers[i].x = Math.random() * (canvas.width - 30);
      barriers[i].y = -30;
      barriers[i].speed = Math.floor(Math.random() * 3) + 1;
      numBarriers++;
      console.log(numBarriers);
      if (numBarriers % 5 == 0) {
        // Add a new barrier to the array
        if (numBarriers == 5) {
          barriers.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 60,
            speed: Math.random() * 3 + 1,
            barrierImage: purpleCarImage,
          });
        }
        if (numBarriers >= 10 && numBarriers < 20) {
          // Add a new barrier to the array
          barriers.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 60,
            speed: Math.random() * 3.5 + 1,
            barrierImage: yellowCarImage,
          });
        }
        if (numBarriers >= 20 && numBarriers < 30) {
          // Add a new barrier to the array
          barriers.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 60,
            speed: Math.random() * 3.5 + 1.5,
            barrierImage: blackCarImage,
          });
        }
        if (numBarriers >= 30 && numBarriers < 40) {
          // Add a new barrier to the array
          barriers.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 60,
            speed: Math.random() * 3.5 + 2,
            barrierImage: whiteCarImage,
          });
        }
        if (numBarriers == 40) {
          // Add a new barrier to the array
          barriers.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 60,
            speed: Math.random() * 4 + 2,
            barrierImage: policeCarImage,
          });
        }
      }
    }
  }
}
// Draw the stars on the canvas
function drawStars() {
  // Draw the stars
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
  for (let i = 0; i < barriers.length; i++) {
    let barrier = barriers[i];
    if (
      car.x <= barrier.x + barrier.width &&
      car.x + car.width >= barrier.x &&
      car.y <= barrier.y + barrier.height &&
      car.y + car.height >= barrier.y
    ) {
      playerLives--;
      barriers.splice(i, 1);
      barriers.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 60,
        speed: Math.random() * 4 + 2.5,
        barrierImage: orangeCarImage,
      });
      if (playerLives == 2) {
        gameLives.textContent = "🤍❤️❤️";
        if (barriers.length < 1) {
          barriers = [
            {
              x: Math.random() * (canvas.width - 30),
              y: -30,
              width: 30,
              height: 60,
              speed: Math.random() * 2 + 1,
              barrierImage: purpleCarImage,
            },
          ];
        }
      }
      if (playerLives == 1) {
        gameLives.textContent = "🤍🤍❤️";
        if (barriers.length < 1) {
          barriers = [
            {
              x: Math.random() * (canvas.width - 30),
              y: -30,
              width: 30,
              height: 60,
              speed: Math.random() * 2 + 1,
              barrierImage: purpleCarImage,
            },
          ];
        }
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
    speed: 10,
  };
  // Define the barriers
  barriers = [
    {
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 60,
      speed: Math.random() * 2 + 1,
      barrierImage: purpleCarImage,
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
let roadLines = [
  {
    x: 0,
    y: 0,
    width: 15,
    height: 90,
    speed: 0.5,
  },
  {
    x: 0,
    y: 120,
    width: 15,
    height: 90,
    speed: 0.5,
  },
  {
    x: 0,
    y: 240,
    width: 15,
    height: 90,
    speed: 0.5,
  },
  {
    x: 0,
    y: 360,
    width: 15,
    height: 90,
    speed: 0.5,
  },
  {
    x: 0,
    y: 480,
    width: 15,
    height: 90,
    speed: 0.5,
  },
];
function drawRoadLines() {
  // Draw the road lines
  ctx.fillStyle = "#ffffff7b";
  for (let i = 0; i < roadLines.length; i++) {
    ctx.fillRect(
      roadLines[i].x,
      roadLines[i].y,
      roadLines[i].width,
      roadLines[i].height
    );
  }
  for (let i = 0; i < roadLines.length; i++) {
    // Add an offset to every other line's x value
    let x = roadLines[i].x + 125;
    ctx.fillRect(x, roadLines[i].y, roadLines[i].width, roadLines[i].height);
  }
  for (let i = 0; i < roadLines.length; i++) {
    // Add an offset to every other line's x value
    let x = roadLines[i].x + 250;
    ctx.fillRect(x, roadLines[i].y, roadLines[i].width, roadLines[i].height);
  }
  for (let i = 0; i < roadLines.length; i++) {
    // Add an offset to every other line's x value
    let x = roadLines[i].x + 375;
    ctx.fillRect(x, roadLines[i].y, roadLines[i].width, roadLines[i].height);
  }
  for (let i = 0; i < roadLines.length; i++) {
    // Add an offset to every other line's x value
    let x = roadLines[i].x + 485;
    ctx.fillRect(x, roadLines[i].y, roadLines[i].width, roadLines[i].height);
  }
  for (let i = 0; i < roadLines.length; i++) {
    roadLines[i].y += roadLines[i].speed;
    if (roadLines[i].y >= canvas.height) {
      // Set the y value of the road line to -100
      roadLines[i].y = -100;
    }
  } // Check if the first barrier has reached the canvas height
}
