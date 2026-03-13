export function initMusicControl() {
  const audio = document.getElementById('background-music') as HTMLAudioElement;
  const musicToggle = document.getElementById('music-toggle') as HTMLButtonElement;
  const musicIcon = document.getElementById('music-icon') as HTMLSpanElement;

  if (!audio || !musicToggle || !musicIcon) return;

  let isPlaying = false;
  audio.volume = 0.3;

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      musicIcon.textContent = '🔇';
      isPlaying = false;
    } else {
      audio.play().catch((err) => console.log('Error playing audio:', err));
      musicIcon.textContent = '🔊';
      isPlaying = true;
    }
  });

  window.addEventListener(
    'click',
    () => {
      if (!isPlaying) {
        audio.play().catch((err) => console.log('Auto-play blocked:', err));
        musicIcon.textContent = '🔊';
        isPlaying = true;
      }
    },
    { once: true }
  );
}
