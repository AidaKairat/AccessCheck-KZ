/* AccessCheck KZ: page behaviour.
   Navigation, hero, problem visuals, charts, research categories,
   three-level explorer, cost estimate, scroll reveals. */
(function () {
  var D = window.ACK, CH = window.ACKCharts, esc = CH.esc, fmt = CH.fmt;
  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* Arrow-key support shared by every tab or radio group. */
  function roving(btns, select, attr) {
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
        if (e.key === 'Home') { e.preventDefault(); select(btns[0]); btns[0].focus(); }
        if (e.key === 'End') { e.preventDefault(); select(btns[btns.length - 1]); btns[btns.length - 1].focus(); }
        if (d) { e.preventDefault(); var n = btns[(i + d + btns.length) % btns.length]; select(n); n.focus(); }
      });
    });
    return function mark(active) {
      btns.forEach(function (b) { var on = b === active; b.setAttribute(attr, String(on)); b.tabIndex = on ? 0 : -1; });
    };
  }

  /* ---------- hero scene ---------- */
  var scene = $('heroScene'), answer = $('sceneAnswer');
  scene.innerHTML = D.sceneSVG;
  var ICON = { good: '✓', unknown: '?', serious: '✕' };
  var levelBtns = all('.levels button');
  var markLevel = roving(levelBtns, function (b) {
    var n = b.getAttribute('data-level'), a = D.sceneAnswers[n];
    scene.setAttribute('data-level', n);
    markLevel(b);
    answer.className = 'scene-answer s-' + a.status;
    answer.innerHTML = '<span class="badge">' + ICON[a.status] + '</span><span><b>' + esc(a.head) + '</b> ' + esc(a.body) + '</span>';
  }, 'aria-checked');
  levelBtns[0].click();

  /* ---------- navigation ---------- */
  var menuBtn = $('menuBtn'), rail = $('rail');
  menuBtn.addEventListener('click', function () {
    var open = rail.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open));
  });
  var links = all('#nav a');
  links.forEach(function (a) { a.addEventListener('click', function () { rail.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });
  var hasIO = 'IntersectionObserver' in window;
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('current', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    all('main section[id]').forEach(function (s) { if (s.parentNode.tagName === 'MAIN') io.observe(s); });
  }

  /* A citation link opens any collapsed block that holds its target. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var t = document.getElementById(a.getAttribute('href').slice(1));
    for (var p = t; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
  });

  /* ---------- references ---------- */
  $('refs').innerHTML = D.REFS.map(function (r) {
    var link = r.url ? ' <a href="' + esc(r.url) + '" rel="noopener" target="_blank">' + esc(r.url.replace(/^https?:\/\//, '').slice(0, 70)) + (r.url.length > 78 ? '…' : '') + '<span class="sr-only"> (opens in a new tab)</span></a>' : '';
    return '<li id="ref-' + r.id + '">' + esc(r.text) + link + '</li>';
  }).join('');

  /* ---------- problem: dot grid (320 squares, each 10 facilities; 11 accessible is about one) ---------- */
  var dots = $('dots'), dh = '';
  for (var i = 0; i < 320; i++) dh += '<i' + (i === 0 ? ' class="on"' : '') + '></i>';
  dots.innerHTML = dh;

  /* ---------- charts ---------- */
  var regionKey = 'facilities';
  function drawCharts() {
    CH.line($('chartPop'), D.population, { x0: 2017, x1: 2027, y0: 660, y1: 760, yTicks: [660, 680, 700, 720, 740, 760], aria: 'Registered people with disabilities in Kazakhstan rose from 674 thousand in 2017 to about 752 thousand in April 2026.' });
    CH.hbar($('chartAdapt'), D.adapted, { unit: '%', max: 100, decimals: 0, target: { value: D.adaptedTarget.value, label: D.adaptedTarget.label, ref: 1 }, unitLabel: 'Share fully adapted', aria: 'Share of facilities reported as fully adapted: 53% in 2024, 64% in 2025, 67% in April 2026, against a target of 80%.' });
    CH.hbar($('chartWho'), D.equippedFor, { unit: 'k', max: 46, unitLabel: 'Thousands of facilities', aria: 'Of 42.9 thousand facilities on the map, about 23 to 24 thousand are equipped for each of hearing, vision and wheelchair users.' });
    var r = D.regions[regionKey];
    $('regionSub').textContent = r.sub;
    $('regionN').textContent = r.findN; $('regionF').textContent = r.find;
    CH.hbar($('chartRegion'), r.rows, { unit: r.unit, max: r.max, decimals: r.decimals, unitLabel: r.unitLabel || 'Per cent', aria: r.sub });
    drawCost();
  }
  var segTabs = all('.seg [role=tab]');
  var markSeg = roving(segTabs, function (t) { regionKey = t.getAttribute('data-set'); markSeg(t); drawCharts(); play($('chartRegion')); }, 'aria-selected');
  markSeg(segTabs[0]);

  /* ---------- research: three categories, expandable study cards ---------- */
  var cats = $('cats'), panel = $('catPanel'), cat = D.approaches[0].key;
  cats.innerHTML = D.approaches.map(function (a, n) {
    var count = D.papers.filter(function (p) { return p.approach === a.key; }).length;
    return '<button role="tab" id="cat-' + a.key + '" aria-controls="catPanel" data-key="' + a.key + '" aria-selected="false"><span class="n">' + (n + 1) + '</span><span class="cat-t">' + esc(a.label) + '</span><span class="cat-m">' + esc(a.scope) + ', ' + count + ' studies</span></button>';
  }).join('');
  function drawCat() {
    panel.setAttribute('aria-labelledby', 'cat-' + cat);
    panel.innerHTML = '<p class="cat-tools"><button type="button" class="link-btn" id="expandAll">Open all studies</button></p><div class="studies">' +
      D.papers.filter(function (p) { return p.approach === cat; }).map(function (p) {
        return '<details class="study"><summary><span class="study-cite">' + esc(p.cite) + '</span><span class="study-title">' + esc(p.title) + '</span></summary><div class="study-body">' +
          '<div class="study-row"><h4>Main finding</h4><p>' + esc(p.finding) + '</p></div>' +
          '<div class="study-row rel"><h4>Relevance to AccessCheck KZ</h4><p>' + esc(p.relevance) + '</p></div>' +
          '<div class="study-row"><h4>What it covers</h4><p>' + esc(p.summary) + ' <a class="cite" href="#ref-' + p.ref + '">[' + p.ref + ']</a></p></div></div></details>';
      }).join('') + '</div>';
    $('expandAll').addEventListener('click', function () {
      var ds = all('.study', panel), open = ds.some(function (d) { return !d.open; });
      ds.forEach(function (d) { d.open = open; });
      this.textContent = open ? 'Close all studies' : 'Open all studies';
    });
  }
  var catBtns = all('#cats button');
  var markCat = roving(catBtns, function (b) { cat = b.getAttribute('data-key'); markCat(b); drawCat(); }, 'aria-selected');
  markCat(catBtns[0]); drawCat();

  /* ---------- AI solution: three-level explorer (an illustration, not model output) ---------- */
  var exScene = $('exScene'), exTabs = all('.ex-tabs button');
  exScene.innerHTML = D.sceneSVG;
  var markEx = roving(exTabs, function (b) {
    var n = b.getAttribute('data-level'), L = D.explorer[n];
    markEx(b);
    $('explorer').setAttribute('data-level', n); exScene.setAttribute('data-level', n);
    $('exPanel').setAttribute('aria-labelledby', b.id);
    $('exDesc').textContent = L.desc;
    $('exAi').innerHTML = L.ai.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    $('exHuman').innerHTML = L.human.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    $('exTags').innerHTML = L.tags.map(function (t, k) {
      return '<span class="ex-tag ' + t.kind + '" style="left:' + t.x + '%;top:' + t.y + '%;--d:' + (k * 70) + 'ms">' + esc(t.label) + '</span>';
    }).join('');
  }, 'aria-selected');
  exTabs[0].click();

  /* ---------- cost estimate (same calculation as before) ---------- */
  function val(id) { var v = parseFloat($(id).value); return isFinite(v) && v >= 0 ? v : 0; }
  function drawCost() {
    var images = val('cFac') * val('cPhotos');
    var kwh = images / 1000 * val('cModel');
    var co2 = kwh * val('cGrid') / 1000;
    var cloudUsd = images / 1000 * val('cCloud');
    var hours = images * Math.min(100, val('cShare')) / 100 * val('cMin') / 60;
    var review = hours * val('cWage');
    var cloudKzt = cloudUsd * val('cFx');
    var total = review + cloudKzt;
    $('calcHead').innerHTML = total > 0
      ? '<b>' + fmt(review / total * 100, 0) + '%</b> of the estimated running cost is human review, <b>' + fmt(cloudKzt / total * 100, 0) + '%</b> is cloud computing.'
      : 'Enter the inputs to see an estimate.';
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
  $('calcReset').addEventListener('click', function () { $('calcForm').reset(); drawCost(); });

  /* ---------- reveal on scroll, count-up numbers, chart entrance ---------- */
  /* Chart marks animate once when a chart first appears or its data is switched. */
  function play(el) {
    if (reduce || !el.classList.contains('chart')) return;
    el.classList.add('anim'); setTimeout(function () { el.classList.remove('anim'); }, 1000);
  }
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0), suf = el.getAttribute('data-suffix') || '';
    var t0 = null, dur = 900;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * e, dec) + suf;
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(end, dec) + suf;
    }
    requestAnimationFrame(step);
  }
  if (hasIO && !reduce) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in'); play(en.target);
        all('[data-count]', en.target).forEach(countUp);
        rio.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    all('[data-reveal], .chart').forEach(function (el) { rio.observe(el); });
  } else {
    all('[data-reveal], .chart').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- draw, and redraw on resize ---------- */
  drawCharts();
  var rt, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth; clearTimeout(rt); rt = setTimeout(drawCharts, 150);
  });
  window.addEventListener('scroll', CH.hideTip, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawCharts);
})();
