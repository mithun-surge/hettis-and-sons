var currentScrollHandler = null;

function initGlobal() {
  if (currentScrollHandler) {
    window.removeEventListener('scroll', currentScrollHandler);
    currentScrollHandler = null;
  }

  var header = document.querySelector('header.site');
  if (header) {
    currentScrollHandler = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    currentScrollHandler();
    window.addEventListener('scroll', currentScrollHandler, { passive: true });
  }
}

document.addEventListener('astro:page-load', initGlobal);
