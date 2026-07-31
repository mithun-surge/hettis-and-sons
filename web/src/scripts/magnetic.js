import gsap from 'gsap';

let cleanupFns = [];

function supportsHover() {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function cleanup() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
}

function initMagnetic() {
  cleanup();
  if (!supportsHover()) return;

  const targets = document.querySelectorAll('.btn');
  targets.forEach((el) => {
    const setX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const setY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      setX(relX * 0.35);
      setY(relY * 0.45);
    }
    function onLeave() {
      setX(0);
      setY(0);
    }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    cleanupFns.push(() => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { clearProps: 'transform' });
    });
  });
}

document.addEventListener('astro:page-load', initMagnetic);
document.addEventListener('astro:before-swap', cleanup);
