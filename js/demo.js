/* AccessCheck KZ: assessment prototype.
   IMPORTANT: there is no AI model here. The person using the page makes every
   judgement. The only computed values are (a) simple image-quality statistics
   and (b) arithmetic on the numbers the person types in. */
(function () {
  var D = window.ACK, esc = window.ACKCharts.esc;
  var $ = function (id) { return document.getElementById(id); };

  var state = { hasPhoto: false, source: null, quality: null, present: {}, pins: [], activeTag: null, measures: {}, limits: {}, usability: {} };

  /* ---------- build form controls ---------- */
  var grid = $('featureGrid');
  D.features.forEach(function (f) {
    var row = document.createElement('div');
    row.className = 'feature';
    row.innerHTML = '<label><input type="checkbox" data-feat="' + f.key + '"> ' + esc(f.label) + '</label>' +
      '<button type="button" class="pin-btn" data-tag="' + f.key + '" aria-pressed="false">Mark on photo</button>';
    grid.appendChild(row);
  });

  var mrows = $('measureRows');
  mrows.innerHTML =
    '<div class="mrow" role="row"><span role="cell">Ramp rise and run <small>cm</small></span>' +
    '<span role="cell" class="pair"><input type="number" min="0" inputmode="decimal" id="mRise" aria-label="Ramp rise in centimetres" placeholder="rise"><input type="number" min="0" inputmode="decimal" id="mRun" aria-label="Ramp run in centimetres" placeholder="run"></span>' +
    '<span role="cell"></span><span role="cell" class="res" id="resCalc">Slope not calculated</span></div>';
  D.measures.forEach(function (m) {
    var measured = m.derived
      ? '<output id="m_' + m.key + '" class="derived">from rise and run</output>'
      : '<input type="number" min="0" inputmode="decimal" id="m_' + m.key + '" aria-label="' + esc(m.label) + ' measured, ' + m.unit + '">';
    mrows.insertAdjacentHTML('beforeend',
      '<div class="mrow" role="row"><span role="cell">' + esc(m.label) + ' <small>' + m.unit + ', ' + (m.dir === 'max' ? 'at most' : 'at least') + '</small></span>' +
      '<span role="cell">' + measured + '</span>' +
      '<span role="cell"><input type="number" min="0" inputmode="decimal" id="l_' + m.key + '" aria-label="' + esc(m.label) + ' limit from the standard, ' + m.unit + '" placeholder="from standard"></span>' +
      '<span role="cell" class="res" id="r_' + m.key + '">Not assessed</span></div>');
  });

  var uq = $('usabilityQs');
  D.usability.forEach(function (u) {
    var h = '<div class="uq" role="radiogroup" aria-label="' + esc(u.q) + '"><p>' + esc(u.q) + '</p><div class="yn">';
    ['yes', 'no', 'unsure'].forEach(function (v) {
      h += '<label><input type="radio" name="u_' + u.key + '" value="' + v + '"> ' + (v === 'unsure' ? 'Cannot tell' : v.charAt(0).toUpperCase() + v.slice(1)) + '</label>';
    });
    uq.insertAdjacentHTML('beforeend', h + '</div></div>');
  });

  /* ---------- photo handling ---------- */
  function setPhoto(src, label, source) {
    var img = $('photo');
    img.onload = function () {
      state.hasPhoto = true; state.source = source;
      $('dropEmpty').hidden = true; $('canvasWrap').hidden = false; $('stageFoot').hidden = false;
      $('photoLabel').textContent = label;
      ['fs1', 'fs2', 'fs3'].forEach(function (id) { $(id).disabled = false; });
      $('downloadBtn').disabled = false;
      computeQuality(img);
      render();
    };
    img.onerror = function () { $('photoLabel').textContent = 'That file could not be read as an image. Choose a JPEG or PNG.'; $('stageFoot').hidden = false; };
    img.src = src;
  }

  $('file').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { $('stageFoot').hidden = false; $('photoLabel').textContent = 'That file is not an image. Choose a JPEG or PNG.'; return; }
    setPhoto(URL.createObjectURL(f), 'Your photo: ' + f.name + '. It has not been uploaded anywhere.', 'user photo');
  });

  var drop = $('drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) {
    var f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f && /^image\//.test(f.type)) setPhoto(URL.createObjectURL(f), 'Your photo: ' + f.name + '. It has not been uploaded anywhere.', 'user photo');
  });

  $('useSample').addEventListener('click', function () {
    var svg = D.sceneSVG.replace(/<g class="o o\d">.*?<\/g>/g, '').replace('<svg ', '<svg width="1280" height="800" ');
    setPhoto('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), 'Illustrated sample. A drawing, not a real site.', 'illustrated sample');
  });

  $('resetBtn').addEventListener('click', function () {
    state = { hasPhoto: false, source: null, quality: null, present: {}, pins: [], activeTag: null, measures: {}, limits: {}, usability: {} };
    $('demoForm').reset(); $('file').value = '';
    $('photo').removeAttribute('src');
    $('dropEmpty').hidden = false; $('canvasWrap').hidden = true; $('stageFoot').hidden = true; $('quality').hidden = true;
    ['fs1', 'fs2', 'fs3'].forEach(function (id) { $(id).disabled = true; });
    $('downloadBtn').disabled = true;
    document.querySelectorAll('.pin-btn').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    $('canvasWrap').classList.remove('placing');
    render();
  });

  /* ---------- image quality: plain pixel arithmetic, not AI ---------- */
  function computeQuality(img) {
    var q = { width: img.naturalWidth, height: img.naturalHeight };
    try {
      var w = 256, h = Math.max(1, Math.round(w * (img.naturalHeight || 1) / (img.naturalWidth || 1)));
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      var d = ctx.getImageData(0, 0, w, h).data, g = new Float32Array(w * h), sum = 0;
      for (var i = 0; i < w * h; i++) { g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]; sum += g[i]; }
      q.brightness = sum / (w * h);
      var ls = 0, ls2 = 0, n = 0;
      for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
        var k = y * w + x, l = g[k - 1] + g[k + 1] + g[k - w] + g[k + w] - 4 * g[k];
        ls += l; ls2 += l * l; n++;
      }
      q.sharpness = n ? ls2 / n - Math.pow(ls / n, 2) : 0;
    } catch (e) { q.error = true; }
    state.quality = q;
    var rows = [];
    var mp = q.width * q.height / 1e6;
    rows.push(['Resolution', q.width && q.height ? q.width + ' × ' + q.height + ' px' : 'Vector drawing', !q.width ? 'ok' : (Math.min(q.width, q.height) < 480 ? 'warn' : 'ok'), !q.width ? 'Scales to any size' : (Math.min(q.width, q.height) < 480 ? 'Low. Small features may be missed.' : 'Enough detail (' + mp.toFixed(1) + ' MP)')]);
    if (!q.error) {
      var b = q.brightness;
      rows.push(['Brightness', Math.round(b) + ' of 255', b < 60 || b > 235 ? 'warn' : 'ok', b < 60 ? 'Dark. Retake in daylight if possible.' : b > 235 ? 'Very bright. Detail may be washed out.' : 'Evenly lit']);
      rows.push(['Sharpness', Math.round(q.sharpness) + ' (edge variance)', q.sharpness < 40 ? 'warn' : 'ok', q.sharpness < 40 ? 'May be blurred or very plain.' : 'Edges are clear']);
    } else {
      rows.push(['Brightness and sharpness', 'Not available', 'warn', 'This browser blocked pixel access for the file.']);
    }
    $('qualityList').innerHTML = rows.map(function (r) {
      return '<div class="q-row"><dt>' + esc(r[0]) + '</dt><dd><b>' + esc(r[1]) + '</b><span class="q-' + r[2] + '">' + (r[2] === 'ok' ? '✓ ' : '! ') + esc(r[3]) + '</span></dd></div>';
    }).join('');
    $('quality').hidden = false;
  }

  /* ---------- level 1: presence and pins ---------- */
  grid.addEventListener('change', function (e) {
    var k = e.target.getAttribute('data-feat');
    if (k) { state.present[k] = e.target.checked; if (!e.target.checked) state.pins = state.pins.filter(function (p) { return p.tag !== k; }); render(); }
  });
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.pin-btn'); if (!b) return;
    var tag = b.getAttribute('data-tag');
    state.activeTag = state.activeTag === tag ? null : tag;
    document.querySelectorAll('.pin-btn').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-tag') === state.activeTag)); });
    $('canvasWrap').classList.toggle('placing', !!state.activeTag);
  });
  $('canvasWrap').addEventListener('click', function (e) {
    if (e.target.closest('.pin')) return;
    if (!state.activeTag) return;
    var r = $('photo').getBoundingClientRect();
    state.pins.push({ tag: state.activeTag, x: +((e.clientX - r.left) / r.width * 100).toFixed(1), y: +((e.clientY - r.top) / r.height * 100).toFixed(1) });
    state.present[state.activeTag] = true;
    var cb = grid.querySelector('[data-feat="' + state.activeTag + '"]'); if (cb) cb.checked = true;
    render();
  });
  $('pins').addEventListener('click', function (e) {
    var p = e.target.closest('.pin'); if (!p) return;
    state.pins.splice(+p.getAttribute('data-i'), 1); render();
  });

  /* ---------- level 2 and 3 inputs ---------- */
  $('demoForm').addEventListener('input', function () { render(); });
  $('demoForm').addEventListener('submit', function (e) { e.preventDefault(); });

  function num(id) { var el = $(id); if (!el || el.value === '') return null; var v = parseFloat(el.value); return isFinite(v) ? v : null; }

  function assess() {
    var labelOf = {}; D.features.forEach(function (f) { labelOf[f.key] = f.label; });
    var seen = D.features.filter(function (f) { return state.present[f.key]; }).map(function (f) { return f.label; });

    /* Level 1 */
    var l1;
    if (!state.hasPhoto) l1 = { status: 'none', text: 'No photo yet.' };
    else if (!seen.length) l1 = { status: 'unknown', text: 'Nothing marked yet.' };
    else if (state.present.ramp) l1 = { status: 'good', text: 'Ramp marked as present. Also seen: ' + (seen.filter(function (s) { return s !== 'Ramp'; }).join(', ').toLowerCase() || 'nothing else') + '.' };
    else if (state.present.steps) l1 = { status: 'serious', text: 'Steps marked, no ramp marked. Seen: ' + seen.join(', ').toLowerCase() + '.' };
    else l1 = { status: 'unknown', text: 'Seen: ' + seen.join(', ').toLowerCase() + '. No ramp or steps marked.' };

    /* Level 2 */
    var rise = num('mRise'), run = num('mRun'), slope = (rise != null && run) ? rise / run * 100 : null;
    var checks = [], pass = 0, fail = 0;
    D.measures.forEach(function (m) {
      var v = m.derived ? slope : num('m_' + m.key), lim = num('l_' + m.key), res;
      if (v == null) res = 'not measured';
      else if (lim == null) res = 'no limit set';
      else { var ok = m.dir === 'max' ? v <= lim : v >= lim; res = ok ? 'within limit' : 'outside limit'; ok ? pass++ : fail++; }
      checks.push({ key: m.key, item: m.label, unit: m.unit, measured: v == null ? null : +v.toFixed(1), limit: lim, result: res });
    });
    var l2;
    if (fail) l2 = { status: 'serious', text: fail + ' of ' + (pass + fail) + ' checked items outside the limit entered.' };
    else if (pass === D.measures.length) l2 = { status: 'good', text: 'All four items within the limits entered.' };
    else if (pass) l2 = { status: 'warning', text: pass + ' item' + (pass > 1 ? 's' : '') + ' within limit. The rest not assessed.' };
    else l2 = { status: 'unknown', text: 'Not assessed. Needs on-site measurements and the limits from the standard.' };

    /* Level 3 */
    var ans = {}, yes = 0, no = 0, unsure = 0;
    D.usability.forEach(function (u) {
      var c = document.querySelector('input[name="u_' + u.key + '"]:checked');
      ans[u.key] = c ? c.value : null;
      if (c) { if (c.value === 'yes') yes++; else if (c.value === 'no') no++; else unsure++; }
    });
    var l3;
    if (no) l3 = { status: 'serious', text: 'Not usable unaided. ' + no + ' question' + (no > 1 ? 's' : '') + ' answered "no".' };
    else if (yes === D.usability.length) l3 = { status: 'good', text: 'Usable unaided on all four questions.' };
    else if (yes + unsure) l3 = { status: 'warning', text: 'Uncertain. ' + (D.usability.length - yes) + ' question' + (D.usability.length - yes > 1 ? 's' : '') + ' unanswered or "cannot tell".' };
    else l3 = { status: 'unknown', text: 'Not assessed.' };

    /* Overall: the weakest answered level decides. */
    var overall;
    var levels = [l1, l2, l3];
    if (!state.hasPhoto) overall = { status: 'none', label: 'No assessment yet', text: '' };
    else if (levels.some(function (l) { return l.status === 'serious'; })) overall = { status: 'serious', label: 'Not accessible', text: 'At least one level found a barrier.' };
    else if (levels.every(function (l) { return l.status === 'good'; })) overall = { status: 'good', label: 'Accessible', text: 'All three levels passed on the evidence entered.' };
    else if (l1.status === 'good') overall = { status: 'warning', label: 'Ramp present, access unconfirmed', text: 'A record that stops at level 1 would call this "adapted".' };
    else overall = { status: 'unknown', label: 'Not enough information', text: 'Complete the three levels.' };

    return { slope: slope, checks: checks, usabilityAnswers: ans, seen: seen, l1: l1, l2: l2, l3: l3, overall: overall };
  }

  var ICON = { good: '✓', serious: '✕', warning: '!', unknown: '?', none: '–' };
  var WORD = { good: 'Pass', serious: 'Barrier', warning: 'Unconfirmed', unknown: 'Not assessed', none: 'Waiting' };

  function render() {
    var a = assess();
    /* pins */
    var labelOf = {}; D.features.forEach(function (f) { labelOf[f.key] = f.label; });
    $('pins').innerHTML = state.pins.map(function (p, i) {
      return '<button type="button" class="pin" data-i="' + i + '" style="left:' + p.x + '%;top:' + p.y + '%" aria-label="' + esc(labelOf[p.tag]) + ' marker. Activate to remove."><span>' + esc(labelOf[p.tag]) + '</span></button>';
    }).join('');
    /* measure results */
    $('resCalc').textContent = a.slope == null ? 'Slope not calculated' : 'Slope = ' + a.slope.toFixed(1) + '%';
    var so = $('m_slope'); if (so) so.textContent = a.slope == null ? 'from rise and run' : a.slope.toFixed(1) + ' %';
    a.checks.forEach(function (c) {
      var el = $('r_' + c.key);
      el.textContent = c.result.charAt(0).toUpperCase() + c.result.slice(1);
      el.className = 'res ' + (c.result === 'within limit' ? 'r-good' : c.result === 'outside limit' ? 'r-serious' : '');
    });
    /* report */
    if (!state.hasPhoto) { $('reportBody').innerHTML = '<p class="small">Add a photo to begin. The report fills in as you answer.</p>'; return; }
    var rows = [['1', 'Visual presence', a.l1], ['2', 'Standards compliance', a.l2], ['3', 'Functional usability', a.l3]];
    var h = '<div class="overall s-' + a.overall.status + '"><span class="badge">' + ICON[a.overall.status] + '</span><div><p class="overall-label">' + esc(a.overall.label) + '</p><p class="small">' + esc(a.overall.text) + '</p></div></div><ul class="report-rows">';
    rows.forEach(function (r) {
      h += '<li class="s-' + r[2].status + '"><span class="badge">' + ICON[r[2].status] + '</span><div><p><b>Level ' + r[0] + ', ' + r[1].toLowerCase() + ':</b> ' + WORD[r[2].status] + '</p><p class="small">' + esc(r[2].text) + '</p></div></li>';
    });
    h += '</ul><p class="small">Source of photo: ' + esc(state.source) + '. Markers placed: ' + state.pins.length + '.</p>';
    $('reportBody').innerHTML = h;
  }

  $('downloadBtn').addEventListener('click', function () {
    var a = assess();
    var out = {
      tool: 'AccessCheck KZ prototype',
      notice: 'Human-entered assessment. No AI model analysed this photo.',
      created: new Date().toISOString(),
      photo_source: state.source,
      image_quality_computed_in_browser: state.quality,
      level_1_visual_presence: { features_marked_present: a.seen, markers: state.pins, result: a.l1 },
      level_2_standards_compliance: { standard: 'SP RK 3.06-101-2012 (limits entered by the user)', checks: a.checks, result: a.l2 },
      level_3_functional_usability: { answers: a.usabilityAnswers, result: a.l3 },
      overall: a.overall
    };
    var url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
    var link = document.createElement('a'); link.href = url; link.download = 'accesscheck-kz-report.json';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  render();
})();
