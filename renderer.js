let canvas, ctx;
let gameRunning = false;
let gameEnded = false;
const paddleHeight = 100, paddleWidth = 10;
let p1Y = 250, p2Y = 250;
let p1Up = false, p1Down = false, p2Up = false, p2Down = false;
let p1Score = 0, p2Score = 0;
let ballX = 400, ballY = 300, ballVX = 8, ballVY = 5;
const paddleSpeed = 10;
const maxScore = 10;

// New variables for speed boost and trail
let consecutiveHits = 0;
let ballSpeedMultiplier = 1;
let speedBoostLevel = 0; // 0 = normal, 1 = fast, 2 = faster, 3 = insane
let hitsInCurrentStage = 0; // Hits since reaching current stage
let ballTrail = [];
const maxTrailLength = 12;
const speedBoostThreshold = 3;
const speedBoostThreshold2 = 5; // Additional hits needed for next level
const speedMultipliers = [1, 1.5, 2.2, 3.0]; // Speed levels

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type, freq, duration = 0.15, volume = 0.25) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playStartSound() {
  playSound('square', 300, 0.1, 0.3);
  setTimeout(() => playSound('square', 600, 0.1, 0.3), 100);
}

function playHitSound() {
  playSound('triangle', 1200, 0.07, 0.5);
}

// New sound for speed boost
function playSpeedBoostSound() {
  const freq = 800 + (speedBoostLevel * 200); // Higher pitch for higher levels
  playSound('sawtooth', freq, 0.1, 0.4);
  setTimeout(() => playSound('sawtooth', freq + 200, 0.1, 0.4), 50);
}

function playScoreSound() {
  playSound('square', 600, 0.2, 0.3);
  setTimeout(() => playSound('square', 400, 0.15, 0.3), 150);
}

function playEndSound() {
  playSound('sawtooth', 200, 0.6, 0.3);
}

const menuMusic = new Audio('menu.mp3');
menuMusic.loop = true;
menuMusic.volume = 0.5;

const gameMusic = new Audio('game.mp3');
gameMusic.loop = true;
gameMusic.volume = 0;

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballVX = -ballVX;
  ballVY = (Math.random() * 6) - 3;
  
  // Reset speed boost and trail
  consecutiveHits = 0;
  hitsInCurrentStage = 0;
  ballSpeedMultiplier = 1;
  speedBoostLevel = 0;
  ballTrail = [];
}

function addToTrail() {
  ballTrail.push({ x: ballX, y: ballY });
  if (ballTrail.length > maxTrailLength) {
    ballTrail.shift();
  }
}

function drawTrail() {
  if (speedBoostLevel > 0 && ballTrail.length > 1) {
    ctx.save();
    for (let i = 0; i < ballTrail.length; i++) {
      const alpha = (i + 1) / ballTrail.length * 0.8;
      const size = (i + 1) / ballTrail.length * (15 + speedBoostLevel * 5) + 5;
      
      // Different colors for different speed levels
      let hue = 60; // Yellow
      if (speedBoostLevel === 2) hue = 30; // Orange
      if (speedBoostLevel === 3) hue = 0;  // Red
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `hsl(${hue + i * 10}, 100%, ${50 + speedBoostLevel * 10}%)`;
      ctx.fillRect(ballTrail[i].x - size/2, ballTrail[i].y - size/2, size, size);
    }
    ctx.restore();
  }
}

function startGame() {
  if (gameEnded) return;

  document.getElementById("menu").style.display = "none";
  gameRunning = false; // erst nach Countdown starten
  p1Score = 0;
  p2Score = 0;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  
  // Reset speed boost variables
  consecutiveHits = 0;
  hitsInCurrentStage = 0;
  ballSpeedMultiplier = 1;
  speedBoostLevel = 0;
  ballTrail = [];

  // Crossfade menu to game music
  let fadeInterval = setInterval(() => {
    if (menuMusic.volume > 0) {
      menuMusic.volume = Math.max(0, menuMusic.volume - 0.01);
      gameMusic.volume = Math.min(0.5, gameMusic.volume + 0.01);
    } else {
      menuMusic.pause();
      clearInterval(fadeInterval);
    }
  }, 50);

  gameMusic.play();

  countdown(3, () => {
    playStartSound();
    gameRunning = true;
    requestAnimationFrame(updateGame);
  });
}

function countdown(seconds, callback) {
  let count = seconds;

  function drawCountdown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawText(count.toString(), canvas.width / 2 - 20, canvas.height / 2 + 30, 80);
    count--;
    if (count < 0) {
      callback();
    } else {
      setTimeout(drawCountdown, 1000);
    }
  }

  drawCountdown();
}

function drawRect(x, y, w, h, color = "white") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 30) {
    drawRect(canvas.width / 2 - 2, i, 4, 15, "gray");
  }
}

function drawText(text, x, y, size = 32) {
  ctx.font = `${size}px 'PressStart'`;
  ctx.fillStyle = "white";
  ctx.fillText(text, x, y);
}

function updateGame() {
  if (!gameRunning) return;

  if (p1Up) p1Y -= paddleSpeed;
  if (p1Down) p1Y += paddleSpeed;
  if (p2Up) p2Y -= paddleSpeed;
  if (p2Down) p2Y += paddleSpeed;

  p1Y = Math.max(0, Math.min(canvas.height - paddleHeight, p1Y));
  p2Y = Math.max(0, Math.min(canvas.height - paddleHeight, p2Y));

  // Add current position to trail
  addToTrail();

  // Move ball with speed multiplier
  ballX += ballVX * ballSpeedMultiplier;
  ballY += ballVY * ballSpeedMultiplier;

  if (ballY <= 0 || ballY >= canvas.height) ballVY *= -1;

  // Ball collision with left paddle
  if (ballX < 20 && ballY > p1Y - 10 && ballY < p1Y + paddleHeight + 10) {
    ballVX *= -1;
    consecutiveHits++;
    hitsInCurrentStage++;
    playHitSound();
    
    // Check for speed boost levels
    if (speedBoostLevel === 0 && consecutiveHits === speedBoostThreshold) {
      speedBoostLevel = 1;
      ballSpeedMultiplier = speedMultipliers[1];
      hitsInCurrentStage = 0; // Reset hits for new stage
      playSpeedBoostSound();
    } else if (speedBoostLevel === 1 && hitsInCurrentStage === speedBoostThreshold2) {
      speedBoostLevel = 2;
      ballSpeedMultiplier = speedMultipliers[2];
      hitsInCurrentStage = 0; // Reset hits for new stage
      playSpeedBoostSound();
    } else if (speedBoostLevel === 2 && hitsInCurrentStage === speedBoostThreshold2) {
      speedBoostLevel = 3;
      ballSpeedMultiplier = speedMultipliers[3];
      hitsInCurrentStage = 0; // Reset hits for new stage
      playSpeedBoostSound();
    }
  } else if (ballX < 0) {
    p2Score++;
    playScoreSound();
    if (p2Score >= maxScore) {
      gameRunning = false;
      gameEnded = true;
      showWinner("Spieler 2 gewinnt!");
      return;
    }
    resetBall();
  }

  // Ball collision with right paddle
  if (ballX > canvas.width - 20 && ballY > p2Y - 10 && ballY < p2Y + paddleHeight + 10) {
    ballVX *= -1;
    consecutiveHits++;
    hitsInCurrentStage++;
    playHitSound();
    
    // Check for speed boost levels
    if (speedBoostLevel === 0 && consecutiveHits === speedBoostThreshold) {
      speedBoostLevel = 1;
      ballSpeedMultiplier = speedMultipliers[1];
      hitsInCurrentStage = 0; // Reset hits for new stage
      playSpeedBoostSound();
    } else if (speedBoostLevel === 1 && hitsInCurrentStage === speedBoostThreshold2) {
      speedBoostLevel = 2;
      ballSpeedMultiplier = speedMultipliers[2];
      hitsInCurrentStage = 0; // Reset hits for new stage
      playSpeedBoostSound();
    } else if (speedBoostLevel === 2 && hitsInCurrentStage === speedBoostThreshold2) {
      speedBoostLevel = 3;
      ballSpeedMultiplier = speedMultipliers[3];
      hitsInCurrentStage = 0; // Reset hits for new stage
      playSpeedBoostSound();
    }
  } else if (ballX > canvas.width) {
    p1Score++;
    playScoreSound();
    if (p1Score >= maxScore) {
      gameRunning = false;
      gameEnded = true;
      showWinner("Spieler 1 gewinnt!");
      return;
    }
    resetBall();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  
  // Draw trail first (behind ball)
  drawTrail();
  
  // Draw paddles
  drawRect(10, p1Y, paddleWidth, paddleHeight);
  drawRect(canvas.width - 20, p2Y, paddleWidth, paddleHeight);
  
  // Draw ball with different colors based on speed level
  let ballColor = "white";
  if (speedBoostLevel === 1) ballColor = "#FFD700"; // Gold
  if (speedBoostLevel === 2) ballColor = "#FF8C00"; // Dark orange
  if (speedBoostLevel === 3) ballColor = "#FF4500"; // Red orange
  
  drawRect(ballX - 10, ballY - 10, 20, 20, ballColor);

  // Draw scores
  drawText(p1Score.toString(), canvas.width / 4, 60, 48);
  drawText(p2Score.toString(), (canvas.width * 3) / 4 - 40, 60, 48);
  
  // Draw speed boost indicator
  if (speedBoostLevel > 0) {
    ctx.save();
    let boostText = "";
    let boostColor = "";
    
    if (speedBoostLevel === 1) {
      boostText = "SPEED BOOST!";
      boostColor = "#FFD700";
    } else if (speedBoostLevel === 2) {
      boostText = "SUPER SPEED!";
      boostColor = "#FF8C00";
    } else if (speedBoostLevel === 3) {
      boostText = "LUDICROUS SPEED!";
      boostColor = "#FF4500";
    }
    
    ctx.fillStyle = boostColor;
    ctx.font = "16px 'PressStart'";
    const textWidth = ctx.measureText(boostText).width;
    ctx.fillText(boostText, canvas.width / 2 - textWidth / 2, 100);
    ctx.restore();
  }

  requestAnimationFrame(updateGame);
}

function destroyFieldAnimation(callback) {
  let lines = [];
  for (let i = 0; i < canvas.height; i += 10) {
    lines.push({
      y: i,
      offset: 0,
      speed: (Math.random() - 0.5) * 30
    });
  }

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
      line.offset += line.speed;
      ctx.strokeStyle = `rgb(${100 + Math.random()*155},0,0)`;
      ctx.beginPath();
      ctx.moveTo(0, line.y + line.offset);
      ctx.lineTo(canvas.width, line.y + line.offset);
      ctx.stroke();
    });

    frames++;
    if (frames < 30) {
      requestAnimationFrame(animate);
    } else {
      // Linien komplett entfernen, Canvas komplett leeren
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      callback();
    }
  }

  animate();
}

function showWinner(winnerText) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const endScreen = document.getElementById("endScreen");
  endScreen.innerText = winnerText;
  endScreen.style.display = "block";

  playEndSound();

  setTimeout(() => {
    endScreen.style.display = "none";
    destroyFieldAnimation(() => {
      document.getElementById("menu").style.display = "block";
      gameEnded = false;

      gameMusic.pause();
      gameMusic.volume = 0;
      menuMusic.currentTime = 0;
      menuMusic.volume = 0.5;
      menuMusic.play();
    });
  }, 10000);
}

window.onload = () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyW") p1Up = true;
    if (e.code === "KeyS") p1Down = true;
    if (e.code === "ArrowUp") p2Up = true;
    if (e.code === "ArrowDown") p2Down = true;

    if ((p1Up && p2Up) && !gameRunning && !gameEnded) {
      startGame();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "KeyW") p1Up = false;
    if (e.code === "KeyS") p1Down = false;
    if (e.code === "ArrowUp") p2Up = false;
    if (e.code === "ArrowDown") p2Down = false;
  });

  document.getElementById("startButton").onclick = () => startGame();

  menuMusic.play();
};