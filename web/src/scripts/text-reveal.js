import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let triggers = [];

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wrapWordsInNode(node) {
  const children = Array.from(node.childNodes);
  children.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      if (!text || !text.trim()) return;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/).filter((p) => p.length);
      parts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const outer = document.createElement('span');
        outer.className = 'sr-word';
        const inner = document.createElement('span');
        inner.className = 'sr-word-inner';
        inner.textContent = part;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.replaceChild(frag, child);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.hasAttribute && child.hasAttribute('data-no-split')) return;
      wrapWordsInNode(child);
    }
  });
}

function cleanup() {
  triggers.forEach((t) => t.kill());
  triggers = [];
}

function initTextReveal() {
  cleanup();

  const targets = document.querySelectorAll('.hero h1, .phero h1, .head h2, .cta-band h2, .cta-dark h2, .split-reveal');
  if (!targets.length) return;

  if (prefersReducedMotion()) return;

  targets.forEach((el) => {
    if (el.dataset.srDone) return;
    wrapWordsInNode(el);
    el.dataset.srDone = 'true';

    const innerSpans = el.querySelectorAll('.sr-word-inner');
    if (!innerSpans.length) return;
    gsap.set(innerSpans, { yPercent: 110 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(innerSpans, {
          yPercent: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.035,
        });
      },
    });
    triggers.push(trigger);
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initTextReveal);
document.addEventListener('astro:before-swap', cleanup);
