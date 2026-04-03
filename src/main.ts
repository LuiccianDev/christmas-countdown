import './style.css';
import { CountdownTimer } from './scripts/CountdownTimer';
import { initSnowSystem } from './scripts/SnowSystem';
import { initMusicControl } from './scripts/MusicControl';

// Main element
const appDiv = document.getElementById('app');
if (!appDiv) throw new Error('Element #app not found');
appDiv.innerHTML = `
  <canvas id="snow-canvas"></canvas>
  <div id="countdown"></div>
`;

// Initialize Canvas Snow System
initSnowSystem('snow-canvas');

// --- Countdown Timer ---
const countdownTimer = new CountdownTimer('countdown');
countdownTimer.start();

// Initialize Background Music Control
initMusicControl();
