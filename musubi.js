const MAX = 12;
let revealed = 0, done = false;
let threadLines = [], fragEls = [];
let scene_img = 0; // 0 = 2 halves, 1 = just left, 2 = just right, 3 = ending
let W = 0, H = 0;
let stars = [];

const MEMS = [
  { side:'left',  rx:0.20, ry:0.36, text:'braiding her\ngrandmother\'s hair' },
  { side:'right', rx:0.78, ry:0.30, text:'a name on the palm\nalready fading' },
  { side:'left',  rx:0.16, ry:0.60, text:'the taste of\nsomething\nshe cannot place' },
  { side:'right', rx:0.80, ry:0.55, text:'sketching a face\nhe\'s never met' },
  { side:'left',  rx:0.25, ry:0.78, text:'the comet overhead\nand the festival below' },
  { side:'right', rx:0.75, ry:0.70, text:'running through\na city he doesn\'t own' },
  { side:'left',  rx:0.14, ry:0.48, text:'waking up crying\nwithout knowing why' },
  { side:'right', rx:0.82, ry:0.42, text:'Tokyo at 3am,\nalone on the train' },
  { side:'left',  rx:0.27, ry:0.22, text:'the lake reflecting\nwhat is not there' },
  { side:'right', rx:0.74, ry:0.80, text:'a call\nthat doesn\'t connect' },
  { side:'left',  rx:0.21, ry:0.88, text:'musubi —\nthe god of joining' },
  { side:'right', rx:0.72, ry:0.18, text:'her name\nin his own handwriting' },
];

const scene = document.getElementById('scene');
const bgCanvas = document.getElementById('bg-canvas');
const ctx = bgCanvas.getContext('2d');
const threadSVG = document.getElementById('thread-layer');
const fragLayer = document.getElementById('frag-layer');
const counterEl = document.getElementById('counter');
const hintEl = document.getElementById('hint');
const endingEl = document.getElementById('ending');
const resetBtn = document.getElementById('reset-btn');
const dhLeft = document.getElementById('dh-left');
const dhRight = document.getElementById('dh-right');
const lblLeft = document.getElementById('lbl-left');
const lblRight = document.getElementById('lbl-right');
const trackLeft = document.getElementById('track-left');
const trackRight = document.getElementById('track-right');
const bgLeft = document.getElementById('bg-left');
const bgRight = document.getElementById('bg-right');
const divider = document.getElementById('divider');
const audio = document.getElementById('bgm');

document.addEventListener('click', () => {
  audio.muted = false;
  audio.volume = 0;
  audio.play();
  let vol = 0;
  const fade = setInterval(() => {
    vol = Math.min(vol + 0.05, 0.8);
    audio.volume = vol;
    if (vol >= 0.8) clearInterval(fade);
  }, 80);
}, { once: true });


if (done) {
  dhLeft.style.display = 'none';
  dhRight.style.display = 'none';
}

function resetToInit() {
  scene_img = 0;
  dhLeft.textContent = '← explore';
  dhRight.textContent = 'explore →';
  dhLeft.style.display = 'block';
  dhRight.style.display = 'block';
  counterEl.style.display = 'block';
  hintEl.style.display = 'block';
  lblRight.style.display = 'block';
  lblLeft.style.display = 'block';
  divider.style.display = 'block';
  resetBtn.style.display = 'block';
  bgCanvas.style.opacity = '1';

  bgLeft.style.left = '-50%';
  bgRight.style.left = '50%';
  bgLeft.classList.remove('expanded');
  bgRight.classList.remove('expanded');

  scene.style.transform = 'translateX(0)';
}

function hideUI(left) {
  counterEl.style.display = 'none';
  hintEl.style.display = 'none';
  divider.style.display = 'none';
  resetBtn.style.display = 'none';
  bgCanvas.style.opacity = '0';
  
  if (left) {
    lblRight.style.display = 'none';
    dhRight.style.display = 'none';
  } else {
    lblLeft.style.display = 'none';
    dhLeft.style.display = 'none';
  }
}

dhLeft.addEventListener('click', () => {
  if (scene_img === 0) {
    hideUI(true);
    dhLeft.textContent = 'go back →';

    bgLeft.style.width = '100%';
    bgLeft.style.left = '0';
    bgLeft.classList.add('expanded');

    bgRight.style.width = '100%';
    bgRight.style.left = '100%';
    bgRight.classList.remove('expanded');

    trackLeft.style.left = '0';

    scene_img = 1;
  } else if (scene_img === 1) {
    resetToInit();
  }
});

dhRight.addEventListener('click', () => {
  if (scene_img === 0) {
    hideUI(false);
    dhRight.textContent = '← go back';

    bgLeft.style.width = '100%';
    bgLeft.style.left = '-100%';
    bgLeft.classList.remove('expanded');

    bgRight.style.width = '100%';
    bgRight.style.left = '0';
    bgRight.classList.add('expanded');

    trackRight.style.left = '0';

    scene_img = 2;
  } else if (scene_img === 2) {
    resetToInit();
  }
});

function buildStars() {
  stars = [];
  for (let i = 0; i < 131; ++i) {
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.0 + 0.2,
      a: Math.random() * 0.5 + 0.1,
      vy: Math.random() * 0.15 + 0.04,
      vx: (Math.random() - 0.5) * 0.14,
      side: Math.random() < 0.5 ? 'L' : 'R',
    })
  }
}

function resize() {
  W = scene.offsetHeight, H = scene.offsetHeight;
  bgCanvas.width = W;
  bgCanvas.height = H;
  
  threadSVG.setAttribute('width', W);
  threadSVG.setAttribute('height', H);
  threadSVG.setAttribute('viewBox', `0 0 ${W} ${H}`);

  buildStars();
  repositionFrags();
}

function repositionFrags() {
  fragEls.forEach((el, i) => {
    if (!el) return;
    el.style.left = (MEMS[i].rx * W) + 'px';
    el.style.top  = (MEMS[i].ry * H) + 'px';
  });
}

function drawBg() {
  ctx.clearRect(0, 0, W, H);
  const left = ctx.createRadialGradient(W*0.22, H*0.60, 0, W*0.22, H*0.60, W*0.6);
  left.addColorStop(0, 'rgba(15,42,105,0.18)');
  left.addColorStop(1, 'rgba(7,7,15,0)');
  ctx.fillStyle = left;
  ctx.fillRect(0, 0, W/2, H);

  const right = ctx.createRadialGradient(W*0.78, H*0.60, 0, W*0.78, H*0.60, W*0.6);
  right.addColorStop(0, 'rgba(75,30,110,0.18)');
  right.addColorStop(1, 'rgba(7,7,15,0)');
  ctx.fillStyle = right;
  ctx.fillRect(W/2, 0, W/2, H);

  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = s.side === 'R'
      ? `rgba(220,185,255,${s.a})`
      : `rgba(170,210,255,${s.a})`;
    ctx.fill();
  });
}

function tickStars() {
  stars.forEach(s => {
    s.y -= s.vy; s.x += s.vx;
    if (s.y < -4) { s.y = H+4; s.x = Math.random()*W; }
    if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
  });
}

function spawnRipple(x, y) {
  if (scene_img !== 0) return;
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.left = `${x}px`;
  r.style.top = `${y}px`;
  fragLayer.appendChild(r);
  setTimeout(() => {
    r.remove();
  }, 900);
}

function onSceneClick(e) {
  const rect = scene.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  spawnRipple(x, y);
}

function loop() {
  drawBg();
  tickStars();
  requestAnimationFrame(loop);
}
resize();
loop();

scene.addEventListener('click', onSceneClick);
window.addEventListener('resize', resize);