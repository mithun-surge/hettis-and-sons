import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let triggers = [];

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function cleanup() {
  triggers.forEach((t) => t.kill());
  triggers = [];
}

function initImageReveal() {
  cleanup();

  const wrappers = gsap.utils.toArray('.img-reveal');
  if (!wrappers.length) return;

  if (prefersReducedMotion()) {
    wrappers.forEach((w) => {
      const img = w.querySelector('img');
      if (img) gsap.set(img, { clearProps: 'all' });
    });
    return;
  }

  wrappers.forEach((wrapper) => {
    const img = wrapper.querySelector('img');
    if (!img) return;
    const zoom = wrapper.classList.contains('img-reveal-zoom');

    gsap.set(img, zoom ? { clipPath: 'inset(0 0 100% 0)', scale: 1.12 } : { clipPath: 'inset(0 0 100% 0)' });

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(img, {
          clipPath: 'inset(0 0 0% 0)',
          scale: zoom ? 1 : undefined,
          duration: 1.2,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(trigger);
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initImageReveal);
document.addEventListener('astro:before-swap', cleanup);
