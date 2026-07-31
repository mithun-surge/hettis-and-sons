var menuCleanup = null;

function initMenu() {
  if (menuCleanup) {
    menuCleanup();
    menuCleanup = null;
  }

  var primaryNav = document.getElementById('primaryNav');
  var menuBtn = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  var servicesToggle = document.getElementById('servicesToggle');
  var servicesSub = document.getElementById('servicesSub');
  if (!primaryNav || !menuBtn) return;

  var lastFocus = null;

  function isMobileMenu() {
    return window.matchMedia('(max-width:920px)').matches;
  }

  function collapseServices() {
    if (servicesToggle) servicesToggle.setAttribute('aria-expanded', 'false');
  }

  function getFocusable() {
    return Array.prototype.slice
      .call(primaryNav.querySelectorAll('a[href], button:not([disabled])'))
      .filter(function (el) {
        var sub = el.closest('.sub');
        if (sub) {
          var tog = sub.parentNode.querySelector('.sub-toggle');
          if (tog && tog.getAttribute('aria-expanded') !== 'true') return false;
        }
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      });
  }

  function onMenuKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      var f = getFocusable();
      if (!f.length) return;
      var first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openMenu() {
    lastFocus = document.activeElement;
    primaryNav.classList.add('open');
    document.body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onMenuKeydown);
    setTimeout(function () {
      if (menuClose) menuClose.focus();
    }, 80);
  }

  function closeMenu() {
    var wasOpen = primaryNav.classList.contains('open');
    primaryNav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    collapseServices();
    document.removeEventListener('keydown', onMenuKeydown);
    if (wasOpen && lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function onMenuBtnClick() {
    if (primaryNav.classList.contains('open')) closeMenu();
    else openMenu();
  }
  menuBtn.addEventListener('click', onMenuBtnClick);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  function onServicesToggleClick(e) {
    e.preventDefault();
    var open = servicesToggle.getAttribute('aria-expanded') === 'true';
    servicesToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
  }
  if (servicesToggle) servicesToggle.addEventListener('click', onServicesToggleClick);

  function onDocClick(e) {
    if (!isMobileMenu() && servicesToggle && servicesToggle.getAttribute('aria-expanded') === 'true') {
      if (!servicesToggle.contains(e.target) && !servicesSub.contains(e.target)) {
        servicesToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }
  document.addEventListener('click', onDocClick);

  function onDocKeydown(e) {
    if (e.key === 'Escape' && !isMobileMenu() && servicesToggle && servicesToggle.getAttribute('aria-expanded') === 'true') {
      servicesToggle.setAttribute('aria-expanded', 'false');
      servicesToggle.focus();
    }
  }
  document.addEventListener('keydown', onDocKeydown);

  function onResize() {
    if (!isMobileMenu() && primaryNav.classList.contains('open')) closeMenu();
  }
  window.addEventListener('resize', onResize);

  menuCleanup = function () {
    menuBtn.removeEventListener('click', onMenuBtnClick);
    if (menuClose) menuClose.removeEventListener('click', closeMenu);
    if (servicesToggle) servicesToggle.removeEventListener('click', onServicesToggleClick);
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onDocKeydown);
    document.removeEventListener('keydown', onMenuKeydown);
    window.removeEventListener('resize', onResize);
  };
}

document.addEventListener('astro:page-load', initMenu);
