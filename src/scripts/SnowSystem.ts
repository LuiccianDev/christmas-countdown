export function initSnowSystem(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d')!;
  const snowflakes: Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    drift: number;
    symbol: string;
  }> = [];
  const snowSymbols = ['❄', '❅', '❆'];

  for (let i = 0; i < 150; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 10 + 10,
      speed: Math.random() * 2 + 0.5,
      drift: Math.random() * 0.1 - 0.25,
      symbol: snowSymbols[Math.floor(Math.random() * snowSymbols.length)],
    });
  }

  function animateSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach((flake) => {
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

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
