import gsap from 'gsap';

let cleanupFns = [];

function supportsCustomCursor() {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function cleanup() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
  document.documentElement.classList.remove('has-custom-cursor');
}

function initCursor() {
  cleanup();
  if (!supportsCustomCursor()) return;

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  document.documentElement.classList.add('has-custom-cursor');

  const setDotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
  const setDotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
  const setRingX = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' });
  const setRingY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' });

  let shown = false;
  function onMove(e) {
    if (!shown) {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      shown = true;
    }
    setDotX(e.clientX);
    setDotY(e.clientY);
    setRingX(e.clientX);
    setRingY(e.clientY);
  }
  document.addEventListener('mousemove', onMove);

  function onDocLeave() {
    gsap.to(cursor, { opacity: 0, duration: 0.3 });
    shown = false;
  }
  document.documentElement.addEventListener('mouseleave', onDocLeave);

  const HOVER_SELECTOR = 'a, button, .btn, [data-cursor-hover]';
  function onOver(e) {
    if (e.target.closest && e.target.closest(HOVER_SELECTOR)) {
      cursor.classList.add('cursor--hover');
    }
  }
  function onOut(e) {
    if (e.target.closest && e.target.closest(HOVER_SELECTOR)) {
      cursor.classList.remove('cursor--hover');
    }
  }
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mouseout', onOut);

  function onDown() {
    cursor.classList.add('cursor--active');
  }
  function onUp() {
    cursor.classList.remove('cursor--active');
  }
  document.addEventListener('mousedown', onDown);
  document.addEventListener('mouseup', onUp);

  cleanupFns.push(() => {
    document.removeEventListener('mousemove', onMove);
    document.documentElement.removeEventListener('mouseleave', onDocLeave);
    document.removeEventListener('mouseover', onOver);
    document.removeEventListener('mouseout', onOut);
    document.removeEventListener('mousedown', onDown);
    document.removeEventListener('mouseup', onUp);
    gsap.set(cursor, { opacity: 0 });
    cursor.classList.remove('cursor--hover', 'cursor--active');
  });
}

document.addEventListener('astro:page-load', initCursor);
document.addEventListener('astro:before-swap', cleanup);
