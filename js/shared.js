/* Shared by every page: list state (saved in the browser), top bar, the three bottom sheets
   (quantity, types, shopping list) and sharing the list as a picture. */
(function () {
  'use strict';
  var A = window.Art;
  var $ = function (id) { return document.getElementById(id); };
  var G = window.Groc = {};

  /* ---------- site map: which page opens for which type in the JSON ---------- */
  G.PAGES = {
    'Vegetables': 'vegetables.html',
    'Fruits': 'fruits.html',
    'Meat': 'meat.html',
    'Food Stuffs': 'food-stuffs.html',
    'Attar': 'attar.html',
    'Cleaning Products': 'cleaning-products.html',
    'Bakery': 'bakery.html'
  };
  G.META = {
    'Fruits': { theme: 'fruit', art: 'fruit', unit: 'count' },
    'Vegetables': { theme: 'veg', art: 'veg', unit: 'kg' },
    'Food Stuffs': { theme: 'pantry', art: 'pantry', unit: 'count' },
    'Meat': { theme: 'meat', art: 'meat', unit: 'kg' },
    'Cleaning Products': { theme: 'clean', art: 'clean', unit: 'count' },
    'Attar': { theme: 'attar', art: 'spice', unit: 'kg' },
    'Bakery': { theme: 'bakery', art: 'bread', unit: 'count' }
  };
  /* folder order on the home page */
  var ORDER = ['Vegetables', 'Fruits', 'Meat', 'Food Stuffs', 'Attar', 'Cleaning Products', 'Bakery'];
  var UNIT = { count: 'قطعة', kg: 'كيلو', da: 'DA' };
  var ULAB = { count: 'بالعدد', kg: 'بالكيلو', da: 'بالمبلغ' };
  var DATA_URL = 'data/groceries_items.json';

  /* ---------- state: the shopping list, shared by all pages through localStorage ---------- */
  var KEY = 'groceries-retro-v1';
  var S = load();
  function load() {
    try {
      var r = localStorage.getItem(KEY);
      if (r) {
        var o = JSON.parse(r);
        if (o && Array.isArray(o.list)) return { list: o.list };
      }
    } catch (e) {}
    return { list: [] };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ list: S.list })); } catch (e) {} }
  /* another tab or page changed the list */
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    S = load();
    updateBadge();
    document.dispatchEvent(new CustomEvent('groc:list'));
  });

  function fmt(q) { return String(Math.round(q * 10) / 10); }
  function qtyText(e) {
    if (e.noQty) return '';
    return e.unit === 'da' ? fmt(e.qty) + ' DA' : fmt(e.qty) + ' ' + UNIT[e.unit];
  }
  function ordered() {
    return S.list.filter(function (e) { return !e.bought; }).concat(S.list.filter(function (e) { return e.bought; }));
  }
  function entryId(cat, name) { return cat + '|' + name; }
  function findEntry(id) { return S.list.filter(function (e) { return e.id === id; })[0]; }
  G.fmt = fmt; G.qtyText = qtyText; G.entryId = entryId; G.findEntry = findEntry;
  G.picks = function (id) { return S.list.filter(function (z) { return z.id.indexOf(id + '|') === 0; }); };

  function changed() {
    save();
    updateBadge();
    document.dispatchEvent(new CustomEvent('groc:list'));
  }

  /* ---------- data: everything comes from data/groceries_items.json ---------- */
  function pushKind(c, k, u) {
    if (typeof k === 'string') c.items.push({ n: k, u: u, opts: null });
    else if (k && k.name) c.items.push({ n: k.name, u: u, opts: Array.isArray(k.options) && k.options.length ? k.options : null });
  }
  function buildCats(json) {
    var list = (json && json.groceries) || [];
    var cats = list.map(function (g, i) {
      var m = G.META[g.type] || { theme: 'custom', art: 'tag', unit: 'count' };
      var c = { type: g.type, ar: g.name_ar || g.type, theme: m.theme, art: m.art, unit: m.unit, items: [], byItem: false, idx: i };
      if (g.sub_types && g.sub_types.length) {
        c.byItem = true;   /* each item keeps the unit of its group (By Kg / By Piece) */
        g.sub_types.forEach(function (s) {
          var u = s.type === 'By Kg' ? 'kg' : 'count';
          (s.kinds || []).forEach(function (k) { pushKind(c, k, u); });
        });
      } else {
        (g.kinds || []).forEach(function (k) { pushKind(c, k, m.unit); });
      }
      return c;
    });
    cats.sort(function (a, b) {
      var x = ORDER.indexOf(a.type), y = ORDER.indexOf(b.type);
      x = x === -1 ? 99 : x; y = y === -1 ? 99 : y;
      return x - y || a.idx - b.idx;
    });
    return cats;
  }
  G.loadCats = function () {
    return fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (j) {
        var cats = buildCats(j);
        if (!cats.length) throw new Error('empty');
        return cats;
      });
  };

  /* ---------- page chrome: top bar + sheets ---------- */
  var TOP =
    '<div class="icon-btn logo" role="img" aria-label="شعار البقالة">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M2.5 4h3l2.2 10.2h10.2L20.6 7H6.4"/><path d="M9 10h10M9.6 12.4H18"/><circle cx="9.4" cy="18.6" r="1.5"/><circle cx="17.2" cy="18.6" r="1.5"/>' +
      '</svg></div>' +
    '<button class="icon-btn" type="button" id="listBtn" aria-label="قائمة التسوق">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="4.5" y="4.5" width="15" height="17" rx="2.2"/><rect x="8.5" y="2.5" width="7" height="4" rx="1.2" fill="#fff"/>' +
        '<path d="M8 11l1.2 1.2L11.4 10M13.4 11.4H16M8 16.4l1.2 1.2 2.2-2.2M13.4 16.8H16"/>' +
      '</svg><span class="badge l" id="listBadge" hidden>0</span></button>';
  var SHEETS = "  <div class=\"scrim\" id=\"scrim\" hidden>\n    <section class=\"sheet\" id=\"sheetQty\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"qtyTitle\" hidden>\n      <div class=\"sheet-head\">\n        <h2 id=\"qtyTitle\"></h2>\n        <input class=\"field\" id=\"customName\" type=\"text\" maxlength=\"30\" autocomplete=\"off\" placeholder=\"اسم المنتج\" aria-label=\"اسم المنتج\" hidden>\n        <button class=\"x\" type=\"button\" data-close aria-label=\"إغلاق\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"2.4\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6 6 18\"/></svg></button>\n      </div>\n      <p class=\"err\" id=\"qtyErr\" role=\"alert\" hidden></p>\n      <div class=\"seg\" id=\"unitSeg\"></div>\n      <div class=\"presets\" id=\"presets\" hidden></div>\n      <div class=\"stepper\" id=\"stepper\">\n        <button class=\"step\" type=\"button\" id=\"minus\" aria-label=\"إنقاص\">−</button>\n        <div class=\"val\"><output id=\"qtyVal\">1</output><span id=\"qtyUnit\">قطعة</span></div>\n        <button class=\"step\" type=\"button\" id=\"plusBtn\" aria-label=\"زيادة\">+</button>\n      </div>\n      <button class=\"btn primary wide\" type=\"button\" id=\"qtyOk\">إضافة إلى اللائحة</button>\n      <button class=\"btn ghost\" type=\"button\" id=\"qtyDel\" hidden>إزالة من اللائحة</button>\n    </section>\n\n    <section class=\"sheet\" id=\"sheetOpts\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"optsTitle\" hidden>\n      <div class=\"sheet-head\">\n        <h2 id=\"optsTitle\"></h2>\n        <button class=\"x\" type=\"button\" data-close aria-label=\"إغلاق\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"2.4\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6 6 18\"/></svg></button>\n      </div>\n      <p class=\"note\">اختر النوع الذي تريده، يمكنك اختيار أكثر من نوع.</p>\n      <div class=\"presets opts\" id=\"opts\"></div>\n      <button class=\"btn primary wide\" type=\"button\" id=\"optsOk\">إضافة إلى اللائحة</button>\n    </section>\n\n    <section class=\"sheet\" id=\"sheetList\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"listTitle\" hidden>\n      <div class=\"sheet-head\">\n        <h2 id=\"listTitle\">قائمة التسوق</h2>\n        <button class=\"x\" type=\"button\" data-close aria-label=\"إغلاق\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"2.4\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6 6 18\"/></svg></button>\n      </div>\n      <ul class=\"rows\" id=\"rows\"></ul>\n      <p class=\"empty\" id=\"listEmpty\" hidden></p>\n      <div class=\"actions\">\n        <button class=\"btn primary\" type=\"button\" id=\"shareBtn\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0a0a0a\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 15V3M7 8l5-5 5 5M5 13v7h14v-7\"/></svg>\n          مشاركة القائمة\n        </button>\n        <button class=\"btn\" type=\"button\" id=\"clearBtn\">مسح الكل</button>\n      </div>\n      <p class=\"note\" id=\"shareMsg\" role=\"status\" aria-live=\"polite\"></p>\n    </section>\n  </div>";

  var lastCount = 0;
  function updateBadge() {
    var el = $('listBadge');
    if (!el) return;
    var l = S.list.filter(function (e) { return !e.bought; }).length;
    el.hidden = l === 0;
    el.textContent = l;
    if (l !== lastCount && l > 0) {
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    }
    lastCount = l;
  }

  var scrim, sheets, lastFocus = null;
  function openSheet(el, focusEl) {
    lastFocus = document.activeElement;
    sheets.forEach(function (s) { s.hidden = s !== el; });
    scrim.hidden = false;
    if (focusEl) focusEl.focus();
  }
  function closeSheets() {
    scrim.hidden = true;
    sheets.forEach(function (s) { s.hidden = true; });
    if (lastFocus && document.contains(lastFocus) && lastFocus.focus) lastFocus.focus();
  }

  var Q = null, OP = null;

  /* ---------- types box (e.g. cheese): pick the types you want, no quantity ---------- */
  G.openOpts = function (o) {      /* { cat, name, options } */
    var base = entryId(o.cat, o.name);
    var pre = G.picks(base).map(function (z) { return z.opt; });
    OP = { cat: o.cat, name: o.name, base: base, sel: pre.slice(), had: pre.length > 0 };
    $('optsTitle').textContent = o.name;
    $('optsTitle').setAttribute('dir', 'auto');
    var box = $('opts');
    box.innerHTML = '';
    o.options.forEach(function (x) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'preset'; b.setAttribute('data-o', x); b.setAttribute('dir', 'auto');
      b.textContent = x;
      box.appendChild(b);
    });
    syncOpts();
    openSheet($('sheetOpts'), box.querySelector('button'));
  };
  function syncOpts() {
    Array.prototype.forEach.call($('opts').querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', OP.sel.indexOf(b.getAttribute('data-o')) !== -1 ? 'true' : 'false');
    });
    $('optsOk').textContent = OP.had ? 'تحديث اللائحة' : 'إضافة إلى اللائحة';
    $('optsOk').disabled = !OP.sel.length && !OP.had;
  }

  /* ---------- quantity box ---------- */
  function stepOf(u) { return u === 'kg' ? 0.5 : 1; }
  function minOf(u) { return u === 'kg' ? 0.5 : 1; }
  function maxOf(u) { return u === 'kg' ? 50 : 99; }

  /* o = { cat, name, unit, cfg: { units, def, presets } } — each category page decides cfg */
  G.openQty = function (o) {
    var cfg = o.cfg, id = entryId(o.cat, o.name), e = findEntry(id);
    var u = e && cfg.units.indexOf(e.unit) !== -1 ? e.unit : cfg.def;
    var qty = e && e.unit === u ? e.qty : (u === 'da' ? cfg.presets[0] : 1);
    Q = { custom: false, cat: o.cat, name: o.name, id: id, cfg: cfg, unit: u, qty: qty };
    $('qtyTitle').hidden = false;
    $('qtyTitle').textContent = o.name;
    $('qtyTitle').setAttribute('dir', 'auto');
    $('customName').hidden = true;
    $('qtyErr').hidden = true;
    showQty(!!e, null);
  };
  /* the Add folder: a product of your own, straight to the list */
  G.openCustom = function () {
    Q = { custom: true, cat: 'منتج مضاف', name: '', id: null, cfg: { units: ['count', 'kg'], def: 'count', presets: [] }, unit: 'count', qty: 1 };
    $('qtyTitle').hidden = true;
    var inp = $('customName');
    inp.hidden = false;
    inp.value = '';
    $('qtyErr').hidden = true;
    showQty(false, inp);
  };
  function showQty(had, focusEl) {
    $('qtyOk').textContent = had ? 'تحديث اللائحة' : 'إضافة إلى اللائحة';
    $('qtyDel').hidden = !had;
    var seg = $('unitSeg');
    seg.innerHTML = '';
    seg.hidden = Q.cfg.units.length < 2;
    Q.cfg.units.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-u', k); b.textContent = ULAB[k];
      seg.appendChild(b);
    });
    var pr = $('presets');
    pr.innerHTML = '';
    Q.cfg.presets.forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'preset'; b.setAttribute('data-v', v); b.textContent = v + ' DA';
      pr.appendChild(b);
    });
    syncQty();
    openSheet($('sheetQty'), focusEl || $('qtyOk'));
  }
  function syncQty() {
    var money = Q.unit === 'da';
    $('stepper').hidden = money;
    $('presets').hidden = !money;
    $('qtyVal').textContent = fmt(Q.qty);
    $('qtyUnit').textContent = UNIT[Q.unit];
    $('minus').disabled = Q.qty <= minOf(Q.unit);
    $('plusBtn').disabled = Q.qty >= maxOf(Q.unit);
    Array.prototype.forEach.call($('unitSeg').querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-u') === Q.unit ? 'true' : 'false');
    });
    Array.prototype.forEach.call($('presets').querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', Number(b.getAttribute('data-v')) === Q.qty ? 'true' : 'false');
    });
  }

  /* ---------- shopping list sheet ---------- */
  function openList() {
    $('shareMsg').textContent = '';
    disarmClear();
    renderRows();
    openSheet($('sheetList'), $('sheetList').querySelector('.x'));
  }
  function renderRows() {
    var rows = ordered();
    var ul = $('rows');
    ul.innerHTML = '';
    rows.forEach(function (e) {
      var li = document.createElement('li');
      li.className = e.bought ? 'done' : '';
      li.innerHTML = '<button class="chk" type="button">' + A.CHK + '</button>' +
        '<div class="rinfo"><span class="rname" dir="auto"></span><span class="rmeta"></span></div>' +
        '<button class="x" type="button" aria-label="حذف">' + A.XICON + '</button>';
      li.querySelector('.rname').textContent = e.name;
      li.querySelector('.rmeta').textContent = e.cat + (qtyText(e) ? ' · ' + qtyText(e) : '');
      var chk = li.querySelector('.chk');
      chk.setAttribute('aria-pressed', e.bought ? 'true' : 'false');
      chk.setAttribute('aria-label', e.bought ? 'ألغِ تعليم ' + e.name : 'علّم ' + e.name + ' كمشتراة');
      chk.addEventListener('click', function () { e.bought = !e.bought; changed(); renderRows(); });
      li.querySelector('.x').addEventListener('click', function () {
        S.list = S.list.filter(function (z) { return z.id !== e.id; });
        changed(); renderRows();
      });
      ul.appendChild(li);
    });
    var empty = $('listEmpty');
    empty.hidden = rows.length > 0;
    empty.textContent = 'القائمة فارغة. اختر قسماً ثم اضغط على أي منتج لإضافته.';
    $('shareBtn').disabled = $('clearBtn').disabled = rows.length === 0;
    prepareShare();
  }

  /* ---------- share the list as a picture ---------- */
  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function fit(c, text, maxW) {
    var t = text;
    while (c.measureText(t).width > maxW && t.length > 1) t = t.slice(0, -1);
    return t === text ? t : t + '…';
  }
  async function makeImage() {
    try {
      await Promise.all([
        document.fonts.load('800 26px Tajawal'), document.fonts.load('700 22px Tajawal'),
        document.fonts.load('500 20px Tajawal'), document.fonts.load('400 60px Lalezar')
      ]);
    } catch (e) {}
    var rows = ordered();
    var W = 720, P = 36, TG = 28, RH = 80, HEAD = 150, FOOT = 92;
    var cardH = HEAD + rows.length * RH + FOOT;
    var H = P * 2 + TG + cardH + 8;
    var sc = 2, cv = document.createElement('canvas');
    cv.width = W * sc; cv.height = H * sc;
    var c = cv.getContext('2d');
    c.scale(sc, sc);
    c.direction = 'rtl';
    c.fillStyle = '#efeeec'; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(10,10,10,0.1)';
    for (var yy = 7; yy < H; yy += 14) for (var xx = 7; xx < W; xx += 14) c.fillRect(xx, yy, 1.4, 1.4);
    var cx = P, cy = P + TG, cw = W - 2 * P;
    c.fillStyle = '#0a0a0a'; rr(c, cx + 8, cy + 8, cw, cardH, 16); c.fill();
    c.fillStyle = '#ffffff'; rr(c, cx, cy, cw, cardH, 16); c.fill();
    c.lineWidth = 4; c.strokeStyle = '#0a0a0a'; c.stroke();
    /* tab with the date */
    var tx = cx + 28, tw = 250;
    c.beginPath(); c.moveTo(tx, cy - 2); c.lineTo(tx, cy - TG + 12); c.arcTo(tx, cy - TG, tx + 12, cy - TG, 12);
    c.lineTo(tx + tw - 12, cy - TG); c.arcTo(tx + tw, cy - TG, tx + tw, cy - TG + 12, 12); c.lineTo(tx + tw, cy - 2);
    c.fillStyle = '#00bfa5'; c.fill(); c.lineWidth = 4; c.stroke();
    var date = '';
    try { date = new Date().toLocaleDateString('ar-DZ-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) {}
    c.fillStyle = '#0a0a0a'; c.textAlign = 'center'; c.font = '800 17px Tajawal, sans-serif';
    c.fillText(date, tx + tw / 2, cy - 8);
    /* title with highlighter */
    c.textAlign = 'right'; c.font = '400 60px Lalezar, Tajawal, sans-serif';
    var tr = cx + cw - 36, ty = cy + 90, tm = c.measureText('قائمة التسوق').width;
    c.fillStyle = '#00bfa5'; c.fillRect(tr - tm - 8, ty - 12, tm + 16, 22);
    c.fillStyle = '#0a0a0a'; c.fillText('قائمة التسوق', tr, ty);
    /* count pill */
    c.font = '800 22px Tajawal, sans-serif';
    var label = rows.length + ' منتج', lw = c.measureText(label).width + 32;
    c.fillStyle = '#fff'; rr(c, cx + 36, cy + 46, lw, 46, 23); c.fill();
    c.lineWidth = 3; c.stroke();
    c.fillStyle = '#0a0a0a'; c.textAlign = 'center'; c.fillText(label, cx + 36 + lw / 2, cy + 77);
    /* rows */
    var left = cx + 36, right = cx + cw - 36;
    rows.forEach(function (e, i) {
      var ry = cy + HEAD + i * RH;
      c.setLineDash([7, 7]); c.lineWidth = 2; c.strokeStyle = '#0a0a0a';
      c.beginPath(); c.moveTo(left, ry); c.lineTo(right, ry); c.stroke(); c.setLineDash([]);
      var bs = 34, bx = right - bs, by = ry + (RH - bs) / 2;
      c.fillStyle = e.bought ? '#00bfa5' : '#ffffff'; rr(c, bx, by, bs, bs, 7); c.fill();
      c.lineWidth = 3; c.stroke();
      if (e.bought) {
        c.beginPath(); c.moveTo(bx + 8, by + 18); c.lineTo(bx + 15, by + 25); c.lineTo(bx + 27, by + 10);
        c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
      }
      var nr = bx - 18;
      c.textAlign = 'right'; c.fillStyle = '#0a0a0a'; c.font = '800 28px Tajawal, sans-serif';
      var nm = fit(c, e.name, nr - left - 200);
      c.fillText(nm, nr, ry + 38);
      if (e.bought) {
        var nw = c.measureText(nm).width;
        c.lineWidth = 3; c.beginPath(); c.moveTo(nr - nw, ry + 29); c.lineTo(nr, ry + 29); c.stroke();
      }
      c.fillStyle = '#4a4947'; c.font = '500 20px Tajawal, sans-serif';
      c.fillText(e.cat, nr, ry + 64);
      c.fillStyle = '#0a0a0a'; c.textAlign = 'left'; c.font = '800 26px Tajawal, sans-serif';
      c.fillText(qtyText(e), left, ry + 50);
    });
    /* footer */
    var fy = cy + HEAD + rows.length * RH;
    c.setLineDash([7, 7]); c.lineWidth = 2; c.beginPath(); c.moveTo(left, fy); c.lineTo(right, fy); c.stroke(); c.setLineDash([]);
    var done = rows.filter(function (e) { return e.bought; }).length;
    c.textAlign = 'center'; c.fillStyle = '#0a0a0a'; c.font = '700 22px Tajawal, sans-serif';
    c.fillText(done + ' من ' + rows.length + ' تم شراؤها', cx + cw / 2, fy + 54);
    return new Promise(function (res) { cv.toBlob(res, 'image/png'); });
  }
  /* The picture is drawn ahead of time, so tapping Share can open the phone's share sheet at once
     (browsers only allow that straight from a tap). */
  var prepared = null, prepTimer = null;
  function listKey() { return JSON.stringify(S.list.map(function (e) { return [e.id, e.qty, e.unit, e.bought]; })); }
  function prepareShare() {
    clearTimeout(prepTimer);
    prepared = null;
    if (!S.list.length) return;
    prepTimer = setTimeout(function () {
      var key = listKey();
      makeImage().then(function (blob) {
        if (blob && key === listKey()) prepared = { key: key, blob: blob };
      }).catch(function () {});
    }, 150);
  }
  async function shareList() {
    var m = $('shareMsg');
    if (!S.list.length) return;
    var blob = prepared && prepared.key === listKey() ? prepared.blob : null;
    /* 1. the phone's own share sheet (WhatsApp, Messenger, Messages ...) */
    if (blob && navigator.share && navigator.canShare) {
      var file = new File([blob], 'shopping-list.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'قائمة التسوق' });
          m.textContent = 'تمت المشاركة.';
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') { m.textContent = 'تم الإلغاء.'; return; }
        }
      }
    }
    /* 2. otherwise save the picture so it can be sent from the gallery */
    m.textContent = 'جارٍ تجهيز الصورة…';
    try {
      if (!blob) blob = await makeImage();
      if (!blob) throw new Error('no image');
      if (window.claude && window.claude.use) {         /* inside a Claude artifact: ask the viewer to save it */
        var d = await window.claude.use('downloads');
        if (!d) { m.textContent = 'الحفظ غير متاح في هذا العرض.'; return; }
        await d.save({ filename: 'shopping-list.png', data: blob });
        m.textContent = 'تم. افتح الصورة وشاركها مع من تشاء.';
        return;
      }
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = 'shopping-list.png';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      m.textContent = 'تم حفظ الصورة. أرسلها من معرض الصور أو الملفات.';
    } catch (err) {
      m.textContent = err && (err.code === 'declined' || err.name === 'AbortError') ? 'تم الإلغاء.' : 'تعذر إنشاء الصورة. حاول مرة أخرى.';
    }
  }

  /* clear all: first tap arms the button, second tap within 4 seconds clears */
  var clearTimer = null;
  function disarmClear() {
    clearTimeout(clearTimer);
    clearTimer = null;
    var b = $('clearBtn');
    if (!b) return;
    b.classList.remove('armed');
    b.textContent = 'مسح الكل';
  }

  /* ---------- mount: call once per page, after the DOM is ready ---------- */
  G.mount = function () {
    var top = $('top');
    if (top) top.innerHTML = TOP;
    document.body.insertAdjacentHTML('beforeend', SHEETS);
    scrim = $('scrim');
    sheets = [$('sheetQty'), $('sheetOpts'), $('sheetList')];

    scrim.addEventListener('click', function (e) {
      if (e.target === scrim || e.target.closest('[data-close]')) closeSheets();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !scrim.hidden) closeSheets(); });
    $('listBtn').addEventListener('click', openList);

    /* types box */
    $('opts').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-o]');
      if (!b || !OP) return;
      var o = b.getAttribute('data-o'), i = OP.sel.indexOf(o);
      if (i === -1) OP.sel.push(o); else OP.sel.splice(i, 1);
      syncOpts();
    });
    $('optsOk').addEventListener('click', function () {
      if (!OP) return;
      S.list = S.list.filter(function (z) { return !(z.id.indexOf(OP.base + '|') === 0 && OP.sel.indexOf(z.opt) === -1); });
      OP.sel.forEach(function (o) {
        var id = OP.base + '|' + o;
        if (!findEntry(id)) S.list.push({ id: id, cat: OP.cat, name: OP.name + ' · ' + o, opt: o, qty: 1, unit: 'count', noQty: true, bought: false });
      });
      changed(); closeSheets();
    });

    /* quantity box */
    $('unitSeg').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-u]');
      if (!b || !Q) return;
      var u = b.getAttribute('data-u'), prev = Q.unit;
      if (u === prev) return;
      Q.unit = u;
      if (u === 'da') Q.qty = Q.cfg.presets[0];
      else if (prev === 'da') Q.qty = 1;
      else Q.qty = u === 'count' ? Math.max(1, Math.ceil(Q.qty)) : Math.max(0.5, Q.qty);
      syncQty();
    });
    $('presets').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-v]');
      if (!b || !Q) return;
      Q.qty = Number(b.getAttribute('data-v'));
      syncQty();
    });
    $('minus').addEventListener('click', function () { Q.qty = Math.max(minOf(Q.unit), Q.qty - stepOf(Q.unit)); syncQty(); });
    $('plusBtn').addEventListener('click', function () { Q.qty = Math.min(maxOf(Q.unit), Q.qty + stepOf(Q.unit)); syncQty(); });
    $('customName').addEventListener('input', function () { $('qtyErr').hidden = true; });
    $('qtyOk').addEventListener('click', function () {
      var name = Q.name, id = Q.id;
      if (Q.custom) {
        name = $('customName').value.trim();
        if (!name) {
          $('qtyErr').textContent = 'اكتب اسم المنتج أولاً.';
          $('qtyErr').hidden = false;
          $('customName').focus();
          return;
        }
        id = 'custom|' + name;
      }
      var e = findEntry(id);
      if (e) { e.qty = Q.qty; e.unit = Q.unit; }
      else S.list.push({ id: id, cat: Q.cat, name: name, qty: Q.qty, unit: Q.unit, bought: false });
      changed(); closeSheets();
    });
    $('qtyDel').addEventListener('click', function () {
      S.list = S.list.filter(function (e) { return e.id !== Q.id; });
      changed(); closeSheets();
    });

    /* list sheet */
    $('shareBtn').addEventListener('click', shareList);
    $('clearBtn').addEventListener('click', function () {
      if (!S.list.length) return;
      if (!clearTimer) {
        var b = this;
        b.classList.add('armed');
        b.textContent = 'اضغط للتأكيد';
        clearTimer = setTimeout(disarmClear, 4000);
        return;
      }
      disarmClear();
      S.list = [];
      changed(); renderRows();
      $('shareMsg').textContent = 'تم مسح القائمة.';
    });

    updateBadge();
  };
})();
