const stage = document.getElementById('collaboration-stage');

async function mountMotion() {
  const canvas = stage.querySelector('canvas');
  const button = stage.querySelector('.motion-toggle');
  const label = button.querySelector('span');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  // Detect unsupported WebGL quietly before asking Three.js to create a context.
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) return;
  let scene;
  try {
    // GSAP's UMD browser build must run as a classic script, not an ES module.
    if (!window.gsap) await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('./vendor/gsap.min.js', import.meta.url).href;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
    const { createCollaborationScene } = await import('./collaboration-scene.js');
    scene = createCollaborationScene(canvas, innerWidth <= 600);
  } catch (error) {
    // The CSS/SVG illustration and all learning content remain available.
    stage.dataset.motion = 'fallback';
    console.warn('Collaboration animation unavailable:', error);
    return;
  }
  const gsap = window.gsap;
  const timeline = gsap.timeline({ id: 'collaboration-loop', paused: true, repeat: -1 });
  timeline.to(scene.motion, { phase: 1.17, duration: 18, ease: 'none' }, 0);
  timeline.to(scene.motion, { turn: Math.PI * 2, duration: 36, ease: 'none' }, 0);
  // Two phase cycles align at the loop boundary, avoiding a visible packet jump.
  timeline.to(scene.motion, { phase: 2.17, duration: 18, ease: 'none' }, 18);
  const parallax = ['tiltX', 'tiltY'].map(key => gsap.quickTo(scene.motion, key, { duration: .9, ease: 'power2.out' }));
  let userPaused = false;
  let inView = false;
  let suspended = false;
  let lost = false;
  let active = false;
  let destroyed = false;
  const render = () => {
    scene.render();
    // Useful for smoke tests; never displayed as a fake metric in the UI.
    stage.dataset.frames = String(Number(stage.dataset.frames || 0) + 1);
  };
  const reconcile = () => {
    const running = !destroyed && !lost && !reduce.matches && !userPaused && inView && !document.hidden && !suspended;
    if (running !== active) {
      active = running;
      if (active) { timeline.resume(); gsap.ticker.add(render); }
      else {
        timeline.pause();
        parallax.forEach(tween => tween.tween.pause());
        gsap.ticker.remove(render);
      }
    }
    stage.dataset.motion = lost ? 'fallback' : reduce.matches ? 'reduced' : userPaused ? 'paused' : active ? 'running' : 'offscreen';
    button.disabled = reduce.matches;
    button.setAttribute('aria-pressed', String(userPaused || reduce.matches));
    label.textContent = reduce.matches ? 'Reduced motion' : userPaused ? 'Resume animation' : 'Pause animation';
    if (reduce.matches && !lost) {
      scene.motion.tiltX = scene.motion.tiltY = 0;
      render();
    }
  };
  const resize = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width && height && !lost) { scene.resize(width, height); render(); }
  });
  const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; reconcile(); }, { threshold: 0 });
  const theme = new MutationObserver(() => { scene.theme(); if (!lost) render(); });
  const onToggle = () => { userPaused = !userPaused; reconcile(); };
  const onPointer = event => {
    if (!active || !finePointer.matches) return;
    const bounds = stage.getBoundingClientRect();
    parallax[0](-((event.clientY - bounds.top) / bounds.height - .5) * .22);
    parallax[1](((event.clientX - bounds.left) / bounds.width - .5) * .28);
  };
  const onLeave = () => { if (active) parallax.forEach(tween => tween(0)); };
  const onVisibility = () => reconcile();
  const onLost = event => {
    event.preventDefault();
    lost = true;
    stage.dataset.ready = 'false';
    button.hidden = true;
    reconcile();
  };
  const onRestored = () => {
    lost = false;
    scene.theme();
    scene.resize(stage.clientWidth, stage.clientHeight);
    render();
    stage.dataset.ready = 'true';
    button.hidden = false;
    reconcile();
  };
  const onPageHide = event => {
    suspended = true;
    reconcile();
    if (event.persisted) return;
    destroyed = true;
    timeline.kill();
    parallax.forEach(tween => tween.tween.kill());
    resize.disconnect(); intersection.disconnect(); theme.disconnect();
    reduce.removeEventListener('change', reconcile);
    button.removeEventListener('click', onToggle);
    stage.removeEventListener('pointermove', onPointer);
    stage.removeEventListener('pointerleave', onLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('pagehide', onPageHide);
    scene.dispose();
  };
  const onPageShow = () => { suspended = false; reconcile(); };
  scene.resize(stage.clientWidth, stage.clientHeight);
  scene.theme();
  render();
  stage.dataset.ready = 'true';
  button.hidden = false;
  button.addEventListener('click', onToggle);
  stage.addEventListener('pointermove', onPointer, { passive: true });
  stage.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  document.addEventListener('visibilitychange', onVisibility);
  reduce.addEventListener('change', reconcile);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  resize.observe(stage);
  intersection.observe(stage);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  reconcile();
}

if (stage) mountMotion().catch(error => {
  stage.dataset.motion = 'fallback';
  console.warn('Collaboration animation unavailable:', error);
});
