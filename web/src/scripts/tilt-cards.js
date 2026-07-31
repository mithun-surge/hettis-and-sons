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

function initTiltCards() {
  cleanup();
  if (!supportsHover()) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    gsap.set(card, { transformPerspective: 800 });

    const setRX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
    const setRY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
    const setTY = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' });

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setRY((px - 0.5) * 10);
      setRX((0.5 - py) * 8);
      setTY(-4);
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    }
    function onLeave() {
      setRX(0);
      setRY(0);
      setTY(0);
    }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    cleanupFns.push(() => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
      gsap.set(card, { clearProps: 'transform' });
    });
  });
}

document.addEventListener('astro:page-load', initTiltCards);
document.addEventListener('astro:before-swap', cleanup);
