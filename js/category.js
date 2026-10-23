/* Runs on every category page. The page itself (e.g. fruits.html) says which type from the JSON it shows
   and what the quantity box offers, through window.PAGE. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var P = window.PAGE, A = window.Art, G = window.Groc;
  var cat = null, query = '';
  var itemsEl = $('items');

  G.mount();
  $('heroArt').innerHTML = A.ART[P.art];

  /* what the quantity box offers for one item */
  function cfgFor(unit) {
    if (P.byItem) return { units: [unit], def: unit, presets: [] };   /* each item uses the unit of its group in the JSON */
    return { units: P.units.slice(), def: P.defaultUnit, presets: (P.presets || []).slice() };
  }

  function render() {
    if (!cat) return;
    var all = cat.items;
    var q = query.trim().toLowerCase();
    var shown = q ? all.filter(function (x) { return x.n.toLowerCase().indexOf(q) !== -1; }) : all;
    $('q').hidden = all.length < 12 && !q;
    $('catCount').textContent = all.length + ' منتج';
    itemsEl.innerHTML = '';
    shown.forEach(function (x) {
      var id = G.entryId(cat.ar, x.n), e = G.findEntry(id);
      var picks = x.opts ? G.picks(id) : [];
      var on = x.opts ? picks.length > 0 : !!e;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'item' + (on ? ' in' : '');
      b.innerHTML = '<span class="plus" aria-hidden="true">' + A.PLUS + A.CHECK + '</span>' +
        '<span class="emb" aria-hidden="true">' + (A.GL[P.theme] || A.GL.fruit) + '</span>' +
        '<span class="iname" dir="auto"></span><span class="iq"></span>';
      b.querySelector('.iname').textContent = x.n;
      var tag = '';
      if (x.opts) tag = picks.length === 1 ? picks[0].opt : (picks.length ? picks.length + ' أنواع' : '');
      else if (e) tag = G.qtyText(e);
      if (tag) b.querySelector('.iq').textContent = tag;
      b.setAttribute('aria-label', x.n + (tag ? '، في اللائحة: ' + tag : (x.opts ? '، اختر النوع' : '')));
      b.addEventListener('click', function () {
        if (x.opts) G.openOpts({ cat: cat.ar, name: x.n, options: x.opts });
        else G.openQty({ cat: cat.ar, name: x.n, unit: x.u, cfg: cfgFor(x.u) });
      });
      itemsEl.appendChild(b);
    });
    var none = $('none');
    none.hidden = shown.length > 0;
    none.textContent = 'لا توجد نتائج لهذا البحث.';
  }

  function load() {
    var box = $('loadBox'), msg = $('loadMsg'), retry = $('retry');
    box.hidden = false; retry.hidden = true;
    msg.textContent = 'جارٍ تحميل المنتجات…';
    G.loadCats().then(function (cats) {
      cat = cats.filter(function (c) { return c.type === P.type; })[0];
      if (!cat) throw new Error('type not found in the JSON');
      $('catTitle').textContent = cat.ar;
      box.hidden = true;
      render();
    }).catch(function () {
      msg.textContent = 'تعذر تحميل المنتجات من ملف data/groceries_items.json.';
      retry.hidden = false;
    });
  }

  $('retry').addEventListener('click', load);
  $('q').addEventListener('input', function () { query = this.value; render(); });
  document.addEventListener('groc:list', render);
  load();
})();
