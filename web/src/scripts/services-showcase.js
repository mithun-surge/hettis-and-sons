let activeObserver = null;
let revealObserver = null;
let clickCleanups = [];

function cleanup() {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }
  clickCleanups.forEach((fn) => fn());
  clickCleanups = [];
}

function initServicesShowcase() {
  cleanup();

  const cards = document.querySelectorAll('.svc-card[data-key]');
  const navButtons = document.querySelectorAll('.svc-nav-btn[data-target]');
  if (!cards.length || !navButtons.length) return;

  const navByKey = new Map();
  navButtons.forEach((btn) => navByKey.set(btn.dataset.target, btn));

  activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const key = entry.target.dataset.key;
        const btn = navByKey.get(key);
        if (!btn) return;
        if (entry.isIntersecting) {
          navButtons.forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        }
      });
    },
    { threshold: 0.6 }
  );
  cards.forEach((c) => activeObserver.observe(c));

  revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach((c) => revealObserver.observe(c));

  navButtons.forEach((btn) => {
    const onClick = () => {
      const card = document.querySelector(`.svc-card[data-key="${btn.dataset.target}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    btn.addEventListener('click', onClick);
    clickCleanups.push(() => btn.removeEventListener('click', onClick));
  });
}

document.addEventListener('astro:page-load', initServicesShowcase);
document.addEventListener('astro:before-swap', cleanup);
