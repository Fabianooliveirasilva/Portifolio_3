const figure = document.querySelector<HTMLElement>('[data-hero-video]');
const video = figure?.querySelector('video');
const toggle = figure?.querySelector<HTMLButtonElement>('.toggle');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = (
  navigator as Navigator & { connection?: { saveData?: boolean } }
).connection?.saveData;

if (figure && video && toggle && !reduced && !saveData) {
  const small = matchMedia('(max-width: 48rem)').matches;
  const base = small ? figure.dataset.srcSm : figure.dataset.srcLg;
  const ext = video.canPlayType('video/webm; codecs="vp9"') ? 'webm' : 'mp4';
  let paused = false;
  let visible = false;

  const sync = () => {
    toggle.textContent = paused ? figure.dataset.play! : figure.dataset.pause!;
    if (visible && !paused) void video.play();
    else video.pause();
  };

  const start = () => {
    video.src = `${base}.${ext}`;
    video.hidden = false;
    toggle.hidden = false;
    video.addEventListener(
      'playing',
      () => video.setAttribute('data-live', ''),
      { once: true },
    );
    new IntersectionObserver(([entry]) => {
      visible = entry!.isIntersecting;
      sync();
    }).observe(video);
    toggle.addEventListener('click', () => {
      paused = !paused;
      sync();
    });
  };

  if (document.readyState === 'complete') start();
  else addEventListener('load', start, { once: true });
}
