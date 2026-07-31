import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let triggers = [];

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function splitIntoChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  const chars = [];
  Array.from(text).forEach((ch) => {
    if (ch === ' ') {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const span = document.createElement('span');
    span.className = 'lr-char';
    span.textContent = ch;
    el.appendChild(span);
    chars.push(span);
  });
  return chars;
}

function cleanup() {
  triggers.forEach((t) => t.kill());
  triggers = [];
}

function initLetterReveal() {
  cleanup();

  const targets = document.querySelectorAll('.letter-reveal');
  if (!targets.length) return;

  targets.forEach((el) => {
    if (el.dataset.lrDone) return;
    const chars = splitIntoChars(el);
    el.dataset.lrDone = 'true';
    if (!chars.length) return;

    if (prefersReducedMotion()) {
      chars.forEach((c) => (c.style.opacity = '1'));
      return;
    }

    const total = chars.length;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const revealWindow = Math.min(0.15, 4 / total);
        chars.forEach((c, i) => {
          const rangeStart = (i / (total - 1)) * (1 - revealWindow);
          const rangeEnd = rangeStart + revealWindow;
          const t = clamp01((progress - rangeStart) / (rangeEnd - rangeStart));
          c.style.opacity = String(0.2 + t * 0.8);
        });
      },
    });
    triggers.push(trigger);
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initLetterReveal);
document.addEventListener('astro:before-swap', cleanup);
