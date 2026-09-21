(function () {
  var projects = window.PROJECTS || [];
  var byN = {};
  projects.forEach(function (p) { byN[p.n] = p; });

  // mobile menu
  var menu = document.querySelector('.menu');
  var nav = document.querySelector('.nav nav');
  menu.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') nav.classList.remove('open'); });

  // filters
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.card');
  var empty = document.querySelector('.empty');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var f = chip.getAttribute('data-filter');
      var shown = 0;
      cards.forEach(function (card) {
        var ok = f === 'all' || (' ' + card.getAttribute('data-cats') + ' ').indexOf(' ' + f + ' ') >= 0;
        card.classList.toggle('hide', !ok);
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  // modal
  var modal = document.getElementById('modal');
  var mImg = document.getElementById('m-img');
  var mThumbs = document.getElementById('m-thumbs');
  var mMain = document.querySelector('.m-main');
  var current = null, imgIndex = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function showImage(i) {
    imgIndex = (i + current.images.length) % current.images.length;
    mImg.src = current.images[imgIndex];
    mImg.alt = current.title + ' image ' + (imgIndex + 1);
    mMain.classList.toggle('photo', current.photo && imgIndex > 0);
    var thumbs = mThumbs.querySelectorAll('img');
    thumbs.forEach(function (t, k) { t.classList.toggle('on', k === imgIndex); });
    if (thumbs[imgIndex]) thumbs[imgIndex].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  function open(n) {
    current = byN[n];
    if (!current) return;
    document.getElementById('m-num').textContent = 'Project ' + String(current.n).padStart(2, '0') + ' of ' + projects.length;
    document.getElementById('m-title').textContent = current.title;
    document.getElementById('m-sub').textContent = current.subtitle;
    document.getElementById('m-tags').innerHTML = current.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    document.getElementById('m-desc').textContent = current.desc;
    document.getElementById('m-points').innerHTML = current.points.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    document.getElementById('m-specs').innerHTML = Object.keys(current.specs).map(function (k) { return '<tr><td>' + esc(k) + '</td><td>' + esc(current.specs[k]) + '</td></tr>'; }).join('');
    mThumbs.innerHTML = current.images.map(function (src, k) { return '<img src="' + src + '" alt="" data-k="' + k + '">'; }).join('');
    mThumbs.querySelectorAll('img').forEach(function (t) { t.addEventListener('click', function () { showImage(+t.getAttribute('data-k')); }); });
    showImage(0);
    modal.hidden = false;
    document.body.classList.add('locked');
    document.querySelector('.m-text').scrollTop = 0;
    if (history.replaceState) history.replaceState(null, '', '#project-' + n);
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('locked');
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { open(+card.getAttribute('data-n')); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+card.getAttribute('data-n')); } });
  });
  modal.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', close); });
  document.querySelector('.m-prev').addEventListener('click', function () { showImage(imgIndex - 1); });
  document.querySelector('.m-next').addEventListener('click', function () { showImage(imgIndex + 1); });
  document.getElementById('m-prevp').addEventListener('click', function () { open(current.n === 1 ? projects.length : current.n - 1); });
  document.getElementById('m-nextp').addEventListener('click', function () { open(current.n === projects.length ? 1 : current.n + 1); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showImage(imgIndex - 1);
    if (e.key === 'ArrowRight') showImage(imgIndex + 1);
  });

  // deep link: index.html#project-3 opens that project
  var m = location.hash.match(/^#project-(\d+)$/);
  if (m && byN[+m[1]]) open(+m[1]);
})();
