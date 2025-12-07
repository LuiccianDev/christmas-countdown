import './style.css'
import { CountdownTimer } from './CountdownTimer';

// --- Christmas Countdown Config ---
// Constant to define the notification threshold (modifiable)
const NOTIFY_DAYS = 7; // Change this value to modify the notification threshold

// Main element
const appDiv = document.getElementById('app')!;
appDiv.innerHTML = `
  <canvas id="snow-canvas"></canvas>
  <div id="countdown"></div>
`;

// Configure canvas for snow
const canvas = document.getElementById('snow-canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Snow system with 2D canvas
const ctx = canvas.getContext('2d')!;
const snowflakes: Array<{x: number, y: number, size: number, speed: number, drift: number, symbol: string}> = [];
const snowSymbols = ['❄', '❅', '❆'];

// Create snowflakes
for (let i = 0; i < 150; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 10 + 10,
    speed: Math.random() * 2 + 0.5,
    drift: Math.random() * 0.1 - 0.25,
    symbol: snowSymbols[Math.floor(Math.random() * snowSymbols.length)]
  });
}

// Animate snow
function animateSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  snowflakes.forEach(flake => {
    ctx.font = `${flake.size}px Arial`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(flake.symbol, flake.x, flake.y);
    
    flake.y += flake.speed;
    flake.x += flake.drift;
    
    if (flake.y > canvas.height) {
      flake.y = -20;
      flake.x = Math.random() * canvas.width;
    }
    
    if (flake.x > canvas.width) {
      flake.x = 0;
    } else if (flake.x < 0) {
      flake.x = canvas.width;
    }
  });
  
  requestAnimationFrame(animateSnow);
}

animateSnow();

// --- Countdown Timer ---
const countdownTimer = new CountdownTimer('countdown', NOTIFY_DAYS);
countdownTimer.start();

// Adjust canvas on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// --- Background Music Control ---
const audio = document.getElementById('background-music') as HTMLAudioElement;
const musicToggle = document.getElementById('music-toggle') as HTMLButtonElement;
const musicIcon = document.getElementById('music-icon') as HTMLSpanElement;

let isPlaying = false;

// Set initial volume
audio.volume = 0.3;

musicToggle.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    musicIcon.textContent = '🔇';
    isPlaying = false;
  } else {
    audio.play().catch(err => console.log('Error playing audio:', err));
    musicIcon.textContent = '🔊';
    isPlaying = true;
  }
});

// Auto-play attempt (some browsers block this)
window.addEventListener('click', () => {
  if (!isPlaying) {
    audio.play().catch(err => console.log('Auto-play blocked:', err));
    musicIcon.textContent = '🔊';
    isPlaying = true;
  }
}, { once: true });
