(function () {
  const MAX = 12;
  let revealed = 0, done = false;
  let threadLines = [], fragEls = [];
 
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
 
  

})();