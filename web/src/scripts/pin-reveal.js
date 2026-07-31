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
    span.className = 'plr-char';
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

function initPinReveal() {
  cleanup();

  const targets = document.querySelectorAll('.pin-letter-reveal');
  if (!targets.length) return;

  targets.forEach((el) => {
    if (el.dataset.plrDone) return;
    const chars = splitIntoChars(el);
    el.dataset.plrDone = 'true';
    if (!chars.length) return;

    if (prefersReducedMotion()) {
      return;
    }

    const total = chars.length;
    const pinTarget = el.closest('[data-pin-container]') || el.parentElement || el;
    const scrollDistance = Math.max(500, total * 9);

    const trigger = ScrollTrigger.create({
      trigger: pinTarget,
      start: 'top top',
      end: '+=' + scrollDistance,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const revealWindow = Math.min(0.15, 4 / total);
        chars.forEach((c, i) => {
          const rangeStart = (i / (total - 1)) * (1 - revealWindow);
          const rangeEnd = rangeStart + revealWindow;
          const t = clamp01((progress - rangeStart) / (rangeEnd - rangeStart));
          c.style.opacity = String(0.22 + t * 0.78);
        });
      },
    });
    triggers.push(trigger);
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initPinReveal);
document.addEventListener('astro:before-swap', cleanup);
