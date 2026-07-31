import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let batchTriggers = [];

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function cleanupReveal() {
  batchTriggers.forEach((t) => t.kill());
  batchTriggers = [];
}

function initReveal() {
  cleanupReveal();

  const els = gsap.utils.toArray('.reveal');
  if (!els.length) return;

  if (prefersReducedMotion()) {
    gsap.set(els, { clearProps: 'all' });
    return;
  }

  gsap.set(els, { opacity: 0, y: 28 });

  batchTriggers = ScrollTrigger.batch(els, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true,
      });
    },
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initReveal);
document.addEventListener('astro:before-swap', cleanupReveal);
