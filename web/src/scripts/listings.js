function initListings() {
  var filterBar = document.getElementById('filterBar');
  var emptyState = document.getElementById('emptyState');
  if (!filterBar) return;

  var cards = Array.prototype.slice.call(document.querySelectorAll('#listingGrid .lcard'));

  filterBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.chip');
    if (!btn) return;
    Array.prototype.forEach.call(filterBar.querySelectorAll('.chip'), function (c) {
      c.classList.remove('active');
    });
    btn.classList.add('active');
    var f = btn.getAttribute('data-filter');
    var shown = 0;
    cards.forEach(function (card) {
      var match = f === 'all' || card.getAttribute('data-category') === f;
      card.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    if (emptyState) emptyState.style.display = shown === 0 ? 'block' : 'none';
  });
}

document.addEventListener('astro:page-load', initListings);
