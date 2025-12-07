import './style.css'
import { CountdownTimer } from './CountdownTimer';

// --- Christmas Countdown Config ---
// Constante para definir el umbral de notificación (modificable)
const NOTIFY_DAYS = 7; // Cambia este valor para modificar el umbral de notificación

// Fecha objetivo: 25 de diciembre del año actual
const christmasDate = new Date(new Date().getFullYear(), 11, 25, 0, 0, 0, 0);

// Elemento principal
const appDiv = document.getElementById('app')!;
appDiv.innerHTML = `
  <canvas id="snow-canvas"></canvas>
  <div id="countdown"></div>
`;

// Configurar canvas para nieve
const canvas = document.getElementById('snow-canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Sistema de nieve con canvas 2D
const ctx = canvas.getContext('2d')!;
const snowflakes: Array<{x: number, y: number, size: number, speed: number, drift: number, symbol: string}> = [];
const snowSymbols = ['❄', '❅', '❆'];

// Crear copos de nieve
for (let i = 0; i < 150; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 20 + 15,
    speed: Math.random() * 1 + 0.5,
    drift: Math.random() * 0.5 - 0.25,
    symbol: snowSymbols[Math.floor(Math.random() * snowSymbols.length)]
  });
}

// Animar nieve
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

// Ajustar canvas al redimensionar ventana
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
