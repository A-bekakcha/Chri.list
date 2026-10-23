/* Home page: one folder per category found in data/groceries_items.json, each linking to its own page. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var A = window.Art, G = window.Groc;
  var grid = $('grid');

  G.mount();

  function folder(c) {
    var isAdd = c === null;
    var el = document.createElement(isAdd ? 'button' : 'a');
    el.className = 'folder' + (isAdd ? ' add' : '');
    if (isAdd) el.type = 'button'; else el.href = G.PAGES[c.type];
    var nm = isAdd ? 'اضافة' : c.ar;
    el.setAttribute('aria-label', isAdd ? 'إضافة منتج إلى اللائحة' : nm);
    el.innerHTML =
      '<span class="paper" aria-hidden="true"></span>' +
      '<span class="tab"><span class="tabtxt"></span></span>' +
      '<span class="card"><span class="art">' + (isAdd ? A.ART.add : A.ART[c.art]) + '</span>' +
      '<span class="row"><span class="name"></span>' + A.CHEV + '</span></span>';
    el.querySelector('.tabtxt').textContent = isAdd ? 'منتج جديد' : c.items.length;
    el.querySelector('.name').textContent = nm;
    if (isAdd) el.addEventListener('click', G.openCustom);
    return el;
  }

  function render(cats) {
    grid.innerHTML = '';
    var shown = cats.filter(function (c) { return !!G.PAGES[c.type]; });   /* only types that have a page */
    shown.concat([null]).forEach(function (c) { grid.appendChild(folder(c)); });
    var n = shown.length;
    $('count').hidden = !n;
    $('count').textContent = n + (n <= 10 ? ' أقسام' : ' قسماً');
  }

  function load() {
    var box = $('loadBox'), msg = $('loadMsg'), retry = $('retry');
    box.hidden = false; retry.hidden = true;
    msg.textContent = 'جارٍ تحميل المنتجات…';
    G.loadCats().then(function (cats) { box.hidden = true; render(cats); }).catch(function () {
      msg.textContent = 'تعذر تحميل المنتجات من ملف data/groceries_items.json.';
      retry.hidden = false;
    });
  }

  $('retry').addEventListener('click', load);
  render([]);      /* the Add folder is there right away */
  load();
})();
