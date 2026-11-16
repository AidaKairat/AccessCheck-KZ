/* AccessCheck KZ: small dependency-free SVG charts.
   Each chart has hover and keyboard tooltips and a table view. */
(function () {
  var C = { bar: '#1257D6', muted: '#9DB9EE', ink: '#0B1F3A', soft: '#4A5B75', grid: '#D5DFEE' };
  var tip = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(v, d) { return Number(v).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d == null ? 1 : d }); }

  function showTip(target, html) {
    tip = tip || document.getElementById('tip');
    tip.innerHTML = html;
    tip.classList.add('on');
    var r = target.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 8);
    var y = r.top - th - 10;
    if (y < 8) y = r.bottom + 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }
  function hideTip() { if (tip) tip.classList.remove('on'); }

  function wire(el) {
    el.querySelectorAll('[data-tip]').forEach(function (m) {
      var html = m.getAttribute('data-tip');
      m.addEventListener('mouseenter', function () { showTip(m, html); });
      m.addEventListener('mouseleave', hideTip);
      m.addEventListener('focus', function () { showTip(m, html); });
      m.addEventListener('blur', hideTip);
    });
  }

  function tipHtml(label, value, ref) {
    return '<b>' + esc(value) + '</b><span>' + esc(label) + '</span>' + (ref ? '<span class="tip-src">Source [' + ref + ']</span>' : '');
  }

  function tableView(rows, unitLabel) {
    var h = '<details class="tableview"><summary>View as table</summary><table><thead><tr><th scope="col">Item</th><th scope="col">' + esc(unitLabel) + '</th><th scope="col">Source</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr><th scope="row">' + esc(r.label) + '</th><td>' + esc(r.shown) + '</td><td>' + (r.ref ? '<a href="#ref-' + r.ref + '">[' + r.ref + ']</a>' : 'Calculated') + '</td></tr>';
    });
    return h + '</tbody></table></details>';
  }

  /* Horizontal bars. rows: [{label, value, ref, muted}] */
  function hbar(el, rows, o) {
    o = o || {};
    var W = Math.max(280, el.clientWidth || 600);
    var narrow = W < 420;
    var labelW = narrow ? 0 : Math.min(210, W * 0.34);
    var rowH = narrow ? 56 : (rows.length > 8 ? 34 : 46), top = o.target ? 28 : 6, right = 84;
    var H = top + rows.length * rowH + 6;
    var plotW = W - labelW - right;
    var max = o.max || Math.max.apply(null, rows.map(function (r) { return r.value; })) * 1.1 || 1;
    var unit = o.unit || '', dec = o.decimals == null ? 1 : o.decimals;
    function sx(v) { return labelW + (v / max) * plotW; }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" role="img" aria-label="' + esc(o.aria || 'Bar chart') + '">';
    s += '<line x1="' + labelW + '" y1="' + top + '" x2="' + labelW + '" y2="' + (H - 6) + '" stroke="' + C.grid + '" stroke-width="1"/>';
    rows.forEach(function (r, i) {
      var barH = narrow ? 20 : (rows.length > 8 ? 20 : 26), y = top + i * rowH, barY = narrow ? y + 24 : y + (rowH - barH) / 2;
      var w = Math.max(9, sx(r.value) - labelW);
      var shown = fmt(r.value, dec) + unit;
      var lx = narrow ? 0 : labelW - 10, ly = narrow ? y + 16 : barY + barH / 2 + 5;
      s += '<text x="' + lx + '" y="' + ly + '" text-anchor="' + (narrow ? 'start' : 'end') + '" class="c-label">' + esc(r.label) + '</text>';
      s += '<path tabindex="0" role="img" aria-label="' + esc(r.label + ': ' + shown) + '" data-tip="' + esc(tipHtml(r.label, shown, r.ref)) + '" class="c-mark c-bar" d="M' + labelW + ' ' + barY + ' h' + (w - 4) + ' a4 4 0 0 1 4 4 v' + (barH - 8) + ' a4 4 0 0 1 -4 4 h-' + (w - 4) + ' Z" fill="' + (r.muted ? C.muted : C.bar) + '"/>';
      if (o.target) s += '<text x="' + (labelW + w - 8) + '" y="' + (barY + barH / 2 + 5) + '" text-anchor="end" class="c-value" style="fill:#fff" aria-hidden="true">' + esc(shown) + '</text>';
      else s += '<text x="' + (labelW + w + 8) + '" y="' + (barY + barH / 2 + 5) + '" class="c-value">' + esc(shown) + '</text>';
    });
    if (o.target) {
      var tx = sx(o.target.value);
      s += '<line x1="' + tx + '" y1="' + (top - 6) + '" x2="' + tx + '" y2="' + (H - 6) + '" stroke="' + C.ink + '" stroke-width="2" stroke-dasharray="5 4"/>';
      s += '<text x="' + tx + '" y="12" text-anchor="' + (tx > W - 90 ? 'end' : 'middle') + '" class="c-label strong">' + esc(o.target.label) + '</text>';
    }
    s += '</svg>';
    var t = rows.map(function (r) { return { label: r.label, shown: fmt(r.value, dec) + unit, ref: r.ref }; });
    if (o.target) t.push({ label: o.target.label, shown: fmt(o.target.value, dec) + unit, ref: o.target.ref });
    el.innerHTML = s + tableView(t, o.unitLabel || 'Value');
    wire(el);
  }

  /* Time series with a real time axis. pts: [{t, label, value, ref}] */
  function line(el, pts, o) {
    o = o || {};
    var W = Math.max(280, el.clientWidth || 700), H = 320;
    var m = { l: 46, r: 62, t: 18, b: 34 };
    var x0 = o.x0, x1 = o.x1, y0 = o.y0, y1 = o.y1;
    function sx(t) { return m.l + (t - x0) / (x1 - x0) * (W - m.l - m.r); }
    function sy(v) { return H - m.b - (v - y0) / (y1 - y0) * (H - m.t - m.b); }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" role="img" aria-label="' + esc(o.aria || 'Line chart') + '">';
    o.yTicks.forEach(function (v) {
      s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + sy(v) + '" y2="' + sy(v) + '" stroke="' + C.grid + '" stroke-width="1"/>';
      s += '<text x="' + (m.l - 8) + '" y="' + (sy(v) + 4) + '" text-anchor="end" class="c-axis">' + v + '</text>';
    });
    var step = W < 460 ? 3 : 1;
    for (var yr = Math.ceil(x0); yr <= Math.floor(x1); yr += step) {
      s += '<text x="' + sx(yr) + '" y="' + (H - 10) + '" text-anchor="middle" class="c-axis">' + yr + '</text>';
    }
    s += '<path d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + sx(p.t).toFixed(1) + ' ' + sy(p.value).toFixed(1); }).join(' ') + '" fill="none" class="c-line" stroke="' + C.bar + '" stroke-width="3" stroke-linejoin="round"/>';
    pts.forEach(function (p, i) {
      var shown = fmt(p.value, 1) + ' thousand';
      s += '<circle tabindex="0" role="img" aria-label="' + esc(p.label + ': ' + shown) + '" data-tip="' + esc(tipHtml(p.label, shown, p.ref)) + '" class="c-mark c-dot" cx="' + sx(p.t) + '" cy="' + sy(p.value) + '" r="7" fill="' + C.bar + '" stroke="#fff" stroke-width="2"/>';
      if (i === 0) s += '<text x="' + sx(p.t) + '" y="' + (sy(p.value) - 12) + '" text-anchor="middle" class="c-value">' + fmt(p.value, 1) + '</text>';
      if (i === pts.length - 1) s += '<text x="' + (sx(p.t) + 10) + '" y="' + (sy(p.value) + 4) + '" class="c-value">' + fmt(p.value, 0) + '</text>';
    });
    s += '</svg><p class="chart-note">The vertical axis starts at ' + y0 + ' thousand, not zero, to show the change.</p>';
    el.innerHTML = s + tableView(pts.map(function (p) { return { label: p.label, shown: fmt(p.value, 1), ref: p.ref }; }), 'Thousands of people');
    wire(el);
  }

  window.ACKCharts = { hbar: hbar, line: line, fmt: fmt, esc: esc, hideTip: hideTip };
})();
