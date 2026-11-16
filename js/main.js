/* AccessCheck KZ: page behaviour (navigation, hero, charts, research filter, cost estimate). */
(function () {
  var D = window.ACK, CH = window.ACKCharts, esc = CH.esc, fmt = CH.fmt;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- hero scene ---------- */
  var scene = $('heroScene'), answer = $('sceneAnswer');
  scene.innerHTML = D.sceneSVG;
  var levelBtns = Array.prototype.slice.call(document.querySelectorAll('.levels button'));
  var ICON = { good: '✓', unknown: '?', serious: '✕' };
  function setLevel(n, focus) {
    scene.setAttribute('data-level', n);
    levelBtns.forEach(function (b) {
      var on = b.getAttribute('data-level') === String(n);
      b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    var a = D.sceneAnswers[n];
    answer.className = 'scene-answer s-' + a.status;
    answer.innerHTML = '<span class="badge">' + ICON[a.status] + '</span><span><b>' + esc(a.head) + '</b> ' + esc(a.body) + '</span>';
  }
  levelBtns.forEach(function (b, i) {
    b.addEventListener('click', function () { setLevel(+b.getAttribute('data-level')); });
    b.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (d) { e.preventDefault(); setLevel(+levelBtns[(i + d + 3) % 3].getAttribute('data-level'), true); }
    });
  });
  setLevel(1);

  /* ---------- navigation ---------- */
  var menuBtn = $('menuBtn'), rail = $('rail');
  menuBtn.addEventListener('click', function () {
    var open = rail.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open));
  });
  var links = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
  links.forEach(function (a) { a.addEventListener('click', function () { rail.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('current', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
  }

  /* ---------- references ---------- */
  $('refs').innerHTML = D.REFS.map(function (r) {
    var link = r.url ? ' <a href="' + esc(r.url) + '" rel="noopener" target="_blank">' + esc(r.url.replace(/^https?:\/\//, '').slice(0, 70)) + (r.url.length > 78 ? '…' : '') + '<span class="sr-only"> (opens in a new tab)</span></a>' : '';
    return '<li id="ref-' + r.id + '"' + (r.url ? '' : ' class="ref-pending"') + '>' + esc(r.text) + link + '</li>';
  }).join('');

  /* ---------- charts ---------- */
  var regionKey = 'facilities';
  function drawCharts() {
    CH.line($('chartPop'), D.population, { x0: 2017, x1: 2027, y0: 660, y1: 760, yTicks: [660, 680, 700, 720, 740, 760], aria: 'Registered people with disabilities in Kazakhstan rose from 674 thousand in 2017 to about 752 thousand in April 2026.' });
    CH.hbar($('chartAdapt'), D.adapted, { unit: '%', max: 100, decimals: 0, target: { value: D.adaptedTarget.value, label: D.adaptedTarget.label, ref: 1 }, unitLabel: 'Share fully adapted', aria: 'Share of facilities reported as fully adapted: 53% in 2024, 64% in 2025, 67% in April 2026, against a target of 80%.' });
    CH.hbar($('chartWho'), D.equippedFor, { unit: 'k', max: 46, unitLabel: 'Thousands of facilities', aria: 'Of 42.9 thousand facilities on the map, about 23 to 24 thousand are equipped for each of hearing, vision and wheelchair users.' });
    var r = D.regions[regionKey];
    $('regionSub').textContent = r.sub;
    CH.hbar($('chartRegion'), r.rows, { unit: r.unit, max: r.max, decimals: r.decimals, unitLabel: r.unitLabel || 'Per cent', aria: r.sub });
    drawCost();
  }
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.seg [role=tab]'));
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', function () {
      regionKey = t.getAttribute('data-set');
      tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      drawCharts();
    });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click(); }
    });
  });

  /* ---------- research: three topics, two readings per row ---------- */
  (function () {
    var ph = function () { return 'Not yet added.'; };
    $('papers').innerHTML = D.approaches.map(function (a, n) {
      var cards = D.papers.filter(function (p) { return p.approach === a.key; }).map(function (p) {
        return '<article class="paper"><h4>' + esc(p.title) + '</h4><p class="paper-cite">' + esc(p.cite) + ' <a class="cite" href="#ref-' + p.ref + '">[' + p.ref + ']</a></p>' +
          '<dl><dt>What it covers</dt><dd>' + (p.summary ? esc(p.summary) : ph('summary')) + '</dd><dt>Key finding</dt><dd>' + (p.finding ? esc(p.finding) : ph('key finding')) + '</dd><dt>Relevance to AccessCheck KZ</dt><dd>' + (p.relevance ? esc(p.relevance) : ph('relevance')) + '</dd></dl></article>';
      }).join('');
      return '<section class="topic" aria-labelledby="topic-' + a.key + '"><header class="topic-head"><span class="n">' + (n + 1) + '</span><h3 id="topic-' + a.key + '">' + esc(a.label) + '</h3><span class="scope">' + esc(a.scope) + '</span></header><div class="pair">' + cards + '</div></section>';
    }).join('');
  })();

  /* ---------- cost estimate ---------- */
  function val(id) { var v = parseFloat($(id).value); return isFinite(v) && v >= 0 ? v : 0; }
  function drawCost() {
    var images = val('cFac') * val('cPhotos');
    var kwh = images / 1000 * val('cModel');
    var co2 = kwh * val('cGrid') / 1000;
    var cloudUsd = images / 1000 * val('cCloud');
    var hours = images * Math.min(100, val('cShare')) / 100 * val('cMin') / 60;
    var review = hours * val('cWage');
    var cloudKzt = cloudUsd * val('cFx');
    var tiles = [
      ['Images per year', fmt(images, 0), 'facilities × photos'],
      ['Electricity for inference', fmt(kwh, 1) + ' kWh', fmt(co2, 1) + ' kg CO₂e on Kazakhstan\'s grid'],
      ['Cloud computing', 'US$' + fmt(cloudUsd, 0), 'about ' + fmt(cloudKzt / 1e6, 2) + ' million tenge'],
      ['Human review', fmt(hours, 0) + ' hours', fmt(review / 1e6, 1) + ' million tenge']
    ];
    $('calcOut').innerHTML = tiles.map(function (t) {
      return '<div class="out"><p class="out-l">' + t[0] + '</p><p class="out-n">' + t[1] + '</p><p class="small">' + t[2] + '</p></div>';
    }).join('');
    CH.hbar($('chartCost'), [
      { label: 'Human review', value: review / 1e6 },
      { label: 'Cloud computing', value: cloudKzt / 1e6, muted: true }
    ], { unit: ' M ₸', decimals: 2, unitLabel: 'Million tenge per year', aria: 'Estimated yearly cost in million tenge: human review compared with cloud computing.' });
  }
  $('calcForm').addEventListener('input', drawCost);
  $('calcForm').addEventListener('submit', function (e) { e.preventDefault(); });

  /* ---------- draw, and redraw on resize ---------- */
  drawCharts();
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(drawCharts, 150); });
  window.addEventListener('scroll', CH.hideTip, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawCharts);
})();
