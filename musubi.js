const MAX = 12;
let revealed = 0, done = false;
let threadLines = [], fragEls = [];
let scene_img = 0; // 0 = 2 halves, 1 = just left, 2 = just right, 3 = ending
let W = 0, H = 0;
let stars = [];

const MEMS = [
  { side:'left',  rx:0.20, ry:0.36, text:'a name on the palm\nalready fading' },
  { side:'right', rx:0.78, ry:0.30, text:'braiding her\ngrandmother\'s hair' },
  { side:'left',  rx:0.16, ry:0.60, text:'sketching a face\nhe\'s never met' },
  { side:'right', rx:0.80, ry:0.55, text:'the taste of\nsomething\nshe cannot place' },
  { side:'left',  rx:0.25, ry:0.78, text:'running through\na city he doesn\'t own' },
  { side:'right', rx:0.75, ry:0.70, text:'the comet overhead\nand the festival below' },
  { side:'left',  rx:0.14, ry:0.48, text:'Tokyo at 3am,\nalone on the train' },
  { side:'right', rx:0.82, ry:0.42, text:'waking up crying\nwithout knowing why' },
  { side:'left',  rx:0.27, ry:0.22, text:'a call\nthat doesn\'t connect' },
  { side:'right', rx:0.74, ry:0.80, text:'the lake reflecting\nwhat is not there' },
  { side:'left',  rx:0.21, ry:0.88, text:'her name\nin his own handwriting' },
  { side:'right', rx:0.72, ry:0.18, text:'musubi —\nthe god of joining' },
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
const audio1 = document.getElementById('bgm1');
const audio2 = document.getElementById('bgm2');

document.addEventListener('click', () => {
  audio1.muted = false;
  audio1.volume = 0;
  audio1.play();
  let vol = 0;
  const fade = setInterval(() => {
    vol = Math.min(vol + 0.05, 0.8);
    audio1.volume = vol;
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
  W = scene.offsetWidth, H = scene.offsetHeight;
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

function drawThreads() {
  Array.from(threadSVG.querySelectorAll('.tl')).forEach(e => e.remove());
  threadLines.forEach(t => {
    const age = Math.min(1, (Date.now() - t.born) / 1600);
    const glow = document.createElementNS('http://www.w3.org/2000/svg','path');
    glow.setAttribute('d', t.d); glow.setAttribute('fill','none');
    glow.setAttribute('stroke', `rgba(230,90,90,${0.09*age})`);
    glow.setAttribute('stroke-width','5'); glow.setAttribute('class','tl');
    threadSVG.appendChild(glow);
    const line = document.createElementNS('http://www.w3.org/2000/svg','path');
    line.setAttribute('d', t.d); line.setAttribute('fill','none');
    line.setAttribute('stroke', `rgba(220,100,100,${0.32*age})`);
    line.setAttribute('stroke-width','0.9');
    line.setAttribute('stroke-dasharray','4 5'); line.setAttribute('class','tl');
    threadSVG.appendChild(line);
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

function revealNext(x, y) {
  if (done || revealed >= MAX) return;
  const m = MEMS[revealed];
  const px = m.rx * W, py = m.ry * H;
  spawnRipple(x, y);

  const el = document.createElement('div');
  el.className = 'frag ' + m.side;
  el.style.left = px + 'px';
  el.style.top = py + 'px';
  el.innerHTML = m.text.replace(/\n/g, '<br>');
  fragLayer.appendChild(el);
  fragEls[revealed] = el;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));

  if (revealed > 0) {
    const prev = MEMS[revealed-1];
    const x1=prev.rx*W, y1=prev.ry*H, x2=px, y2=py;
    const cpx=(x1+x2)/2, cpy=(y1+y2)/2-(40+Math.random()*55);
    threadLines.push({ d:`M${x1} ${y1} Q${cpx} ${cpy} ${x2} ${y2}`, born:Date.now() });
  }

  revealed++;
  counterEl.textContent = `${revealed} / ${MAX} memories surfaced`;
  if (revealed >= 3) {
    dhLeft.style.opacity='0';
    dhRight.style.opacity='0';
  }
  if (revealed >= 4) hintEl.style.opacity = '0.08';
  if (revealed >= 7) hintEl.style.opacity = '0';
  if (revealed >= MAX) {
    done = true;
    scene_img = 3;

    threadSVG.classList.add('fading');
    fragLayer.classList.add('fading');
    bgCanvas.style.transition = 'opacity 1.5s ease';
    bgCanvas.style.opacity = '0';
    divider.style.transition = 'opacity 1.5s ease';
    divider.style.opacity = '0';

    audio2.muted = false;
    audio2.volume = 0;
    audio2.play();

    const crossfade = setInterval(() => {
      if (audio1.volume > 0) {
        audio1.volume = Math.max(0, audio1.volume - 0.02);
        if (audio1.volume === 0) audio1.pause();
      }
      if (audio1.volume === 0 && audio2.volume >= 0.8) {
        clearInterval(crossfade);
      }
    }, 80);

    setTimeout(() => {
      bgLeft.classList.add('converging');
      bgRight.classList.add('converging');
    }, 600);

    setTimeout(() => {
      scene.innerHTML = `
        <div id="bg-ending">
          <img src="images/both1.jpg" alt="The meeting place">
        </div>
        <div id="ending">
          <h2>繋がっている</h2>
          <p>we were always connected — and yet the distance remains</p>
        </div>
      `;

      setTimeout(() => {
        document.getElementById('ending').classList.add('visible');
      }, 1000);

    }, 2000);

    setTimeout(() => {
      audio2.muted = false;
      audio2.volume = 0;
      audio2.play();

      const fadeIn = setInterval(() => {
        if (audio2.volume < 0.8) {
          audio2.volume = Math.min(0.8, audio2.volume + 0.02);
        } else {
          clearInterval(fadeIn);
        }
      }, 80);
    }, 1200);
    
  }
}

function onSceneClick(e) {
  if (e.target === dhLeft || e.target === dhRight || e.target === resetBtn) return;
  const rect = scene.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  revealNext(x, y);
}

function reset() {
  revealed = 0;
  done=false;
  threadLines=[];
  fragEls=[];
  fragLayer.innerHTML='';
  Array.from(threadSVG.querySelectorAll('.tl')).forEach(e=>e.remove());
  counterEl.textContent = '0 / 12 memories surfaced';
  hintEl.style.opacity = '1';
  dhLeft.style.opacity = '1';
  dhRight.style.opacity='1';
  endingEl.style.opacity = '0';
}

function loop() {
  drawBg();
  tickStars();
  drawThreads();
  requestAnimationFrame(loop);
}
resize();
loop();

scene.addEventListener('click', onSceneClick);
window.addEventListener('resize', resize);
resetBtn.addEventListener('click', e => { e.stopPropagation(); reset(); });