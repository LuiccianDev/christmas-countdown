import './style.css'
import * as THREE from 'three';
import { SnowSystem } from './SnowSystem';
import { CountdownTimer } from './CountdownTimer';

// --- Christmas Countdown Config ---
// Constante para definir el umbral de notificación (modificable)
const NOTIFY_DAYS = 7; // Cambia este valor para modificar el umbral de notificación

// Fecha objetivo: 25 de diciembre del año actual
const christmasDate = new Date(new Date().getFullYear(), 11, 25, 0, 0, 0, 0);

// Elemento principal para Three.js
const appDiv = document.getElementById('app')!;
appDiv.innerHTML = `<canvas id="christmas-canvas"></canvas><div id="countdown"></div>`;

// Inicializar Three.js y obtener el canvas después de crear el elemento
const canvas = document.getElementById('christmas-canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = new THREE.Scene();
// Fondo con gradiente navideño más colorido
scene.background = new THREE.Color(0x1a0a3a);
scene.fog = new THREE.Fog(0x1a0a3a, 8, 20);

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.width, canvas.height);

// Luces navideñas coloridas
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Luz roja y verde para ambiente navideño
const redLight = new THREE.PointLight(0xff0000, 0.5, 15);
redLight.position.set(-3, 3, 3);
scene.add(redLight);

const greenLight = new THREE.PointLight(0x00ff00, 0.5, 15);
greenLight.position.set(3, 3, 3);
scene.add(greenLight);

// Árbol nevado con múltiples capas
const treeGroup = new THREE.Group();

// Crear múltiples secciones del árbol con efecto nevado
const treeLayers = [
  { radius: 2.5, height: 2, y: 0.5 },
  { radius: 2.0, height: 1.8, y: 2.0 },
  { radius: 1.5, height: 1.5, y: 3.3 },
  { radius: 1.0, height: 1.2, y: 4.3 },
  { radius: 0.5, height: 1.0, y: 5.2 }
];

treeLayers.forEach(layer => {
  const coneGeo = new THREE.ConeGeometry(layer.radius, layer.height, 32, 1);
  const coneMat = new THREE.MeshPhongMaterial({ 
    color: 0xc8e6c9,
    shininess: 80,
    emissive: 0x4a7c59,
    emissiveIntensity: 0.3
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = layer.y;
  treeGroup.add(cone);
});

// Estrella en la punta (2D plana)
function createStarShape() {
  const shape = new THREE.Shape();
  const outerRadius = 0.4;
  const innerRadius = 0.15;
  const points = 5;
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points;
    const x = Math.cos(angle - Math.PI / 2) * radius;
    const y = Math.sin(angle - Math.PI / 2) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
}

const starShape = createStarShape();
const starGeo = new THREE.ShapeGeometry(starShape);
const starMat = new THREE.MeshBasicMaterial({ 
  color: 0xffd700,
  side: THREE.DoubleSide
});
const topStar = new THREE.Mesh(starGeo, starMat);
topStar.position.y = 6.2;
treeGroup.add(topStar);

// Tronco
const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.0, 16);
const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4a3728 });
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.position.y = 0;
treeGroup.add(trunk);

scene.add(treeGroup);
const tree = treeGroup; // Para mantener la rotación

// Regalos en la base
const giftColors = [0xff0000, 0x00ff00, 0xffd700, 0x0000ff, 0xff69b4];
const gifts: THREE.Mesh[] = [];
for (let i = 0; i < 8; i++) {
  const giftSize = 0.3 + Math.random() * 0.2;
  const giftGeo = new THREE.BoxGeometry(giftSize, giftSize, giftSize);
  const giftMat = new THREE.MeshPhongMaterial({ 
    color: giftColors[i % giftColors.length],
    shininess: 60
  });
  const gift = new THREE.Mesh(giftGeo, giftMat);
  const angle = (i / 8) * Math.PI * 2;
  const radius = 2.0 + Math.random() * 0.5;
  gift.position.set(
    Math.cos(angle) * radius,
    giftSize / 2,
    Math.sin(angle) * radius
  );
  gift.rotation.y = Math.random() * Math.PI;
  scene.add(gift);
  gifts.push(gift);
}

// --- Decoraciones graduales ---
// Parámetros de decoraciones
const maxBalls = 20;
const maxStars = 3;
const maxSparks = 30;

let balls: THREE.Mesh[] = [];
let stars: THREE.Mesh[] = [];
let sparks: THREE.Points | null = null;

// Animación manual de escala para decoraciones
function animateScale(mesh: THREE.Mesh, target: { x: number, y: number, z: number }, duration: number) {
  const start = { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z };
  const startTime = performance.now();
  function animateStep(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    mesh.scale.x = start.x + (target.x - start.x) * t;
    mesh.scale.y = start.y + (target.y - start.y) * t;
    mesh.scale.z = start.z + (target.z - start.z) * t;
    if (t < 1) {
      requestAnimationFrame(animateStep);
    }
  }
  requestAnimationFrame(animateStep);
}

function addDecorations(daysLeft: number) {
  // Limpiar decoraciones previas
  balls.forEach(b => scene.remove(b));
  stars.forEach(s => scene.remove(s));
  if (sparks) scene.remove(sparks);
  balls = [];
  stars = [];
  sparks = null;

  // Gradualidad: menos días, más decoraciones
  const ballsCount = Math.min(maxBalls, Math.floor((NOTIFY_DAYS - daysLeft + 1) * maxBalls / (NOTIFY_DAYS + 1)));
  const starsCount = Math.min(maxStars, Math.floor((NOTIFY_DAYS - daysLeft + 1) * maxStars / (NOTIFY_DAYS + 1)));
  const sparksCount = Math.min(maxSparks, Math.floor((NOTIFY_DAYS - daysLeft + 1) * maxSparks / (NOTIFY_DAYS + 1)));

  // Bolas
  for (let i = 0; i < ballsCount; i++) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI * 0.8 + 0.2;
    const r = 1.8 + Math.random() * 0.2;
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = 2.5 + r * Math.cos(theta);
    const z = r * Math.sin(theta) * Math.sin(phi);
    const ballGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const ballColors = [0xff0000, 0xffff00, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffa500, 0xff1493];
    const ballMat = new THREE.MeshPhongMaterial({ 
      color: ballColors[i % ballColors.length], 
      shininess: 100,
      emissive: ballColors[i % ballColors.length],
      emissiveIntensity: 0.3
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(x, y, z);
    ball.scale.set(0.1, 0.1, 0.1);
    scene.add(ball);
    balls.push(ball);
    // Animación de escala manual
    animateScale(ball, { x: 1, y: 1, z: 1 }, 600);
  }

  // Estrellas
  for (let i = 0; i < starsCount; i++) {
    const starGeo = new THREE.IcosahedronGeometry(0.35, 0);
    const starMat = new THREE.MeshPhongMaterial({ color: 0xfff700, emissive: 0xfff700, shininess: 100 });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.set(0, 5.2 + i * 0.3, 0);
    star.scale.set(0.1, 0.1, 0.1);
    scene.add(star);
    stars.push(star);
    // Animación de escala manual
    animateScale(star, { x: 1, y: 1, z: 1 }, 800);
  }

  // Chispas (efecto de partículas)
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = [];
  for (let i = 0; i < sparksCount; i++) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI * 0.8 + 0.2;
    const r = 2.1 + Math.random() * 0.3;
    sparkPositions.push(r * Math.sin(theta) * Math.cos(phi));
    sparkPositions.push(2.5 + r * Math.cos(theta));
    sparkPositions.push(r * Math.sin(theta) * Math.sin(phi));
  }
  sparkGeo.setAttribute('position', new THREE.Float32BufferAttribute(sparkPositions, 3));
  const sparkMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.8 });
  sparks = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparks);
}

// Actualizar decoraciones cada vez que cambian los días
let lastDays = -1;
function updateDecorations() {
  const now = new Date();
  const diff = christmasDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days !== lastDays) {
    addDecorations(days);
    lastDays = days;
  }
}

setInterval(updateDecorations, 2000);
updateDecorations();

// --- Countdown Timer ---
const countdownTimer = new CountdownTimer('countdown', NOTIFY_DAYS);
countdownTimer.start();

// --- Nieve cayendo con sprites de copos ---
const snowSystem = new SnowSystem(scene, 200);

// --- Animación principal ---
function animate() {
  requestAnimationFrame(animate);
  tree.rotation.y += 0.005;
  snowSystem.update();
  renderer.render(scene, camera);
}
animate();

// Ajustar canvas al redimensionar ventana
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.width, canvas.height);
});
