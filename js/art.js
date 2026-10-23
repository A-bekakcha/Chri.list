/* Hand-drawn artwork shared by all pages: folder stickers (ART), item emblems (GL) and small icons. */
(function () {
  /* ---------- artwork ---------- */
  var O = '<svg viewBox="0 0 120 80" fill="none" stroke="#0a0a0a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">';
  var E = '</svg>';
  var ART = {
    veg: O +
      '<g transform="translate(50 28) rotate(38)">' +
        '<path d="M-3 0 C-14 -10 -12 -22 -8 -24 C-5 -16 -3 -10 -1 -3 Z" fill="#4fc26b"/>' +
        '<path d="M3 0 C14 -10 12 -22 8 -24 C5 -16 3 -10 1 -3 Z" fill="#4fc26b"/>' +
        '<path d="M0 0 C-3 -12 0 -26 0 -28 C3 -20 3 -10 2 0 Z" fill="#4fc26b"/>' +
        '<path d="M-10 0 Q0 -5 10 0 L1 48 Q0 50 -1 48 Z" fill="#ff8a3d"/>' +
        '<path d="M-6 12 H-1 M3 24 H7 M-3 35 H1" stroke-width="2"/>' +
      '</g>' +
      '<circle cx="94" cy="46" r="18" fill="#ff5a4d"/>' +
      '<path d="M82 32 L90 36 L94 28 L98 36 L106 32 L100 40 H88 Z" fill="#4fc26b"/>' +
      '<path d="M84 50 Q83 43 89 39" stroke="#fff" stroke-width="3"/>' + E,
    fruit: O +
      '<circle cx="38" cy="42" r="26" fill="#ff8a3d"/>' +
      '<circle cx="38" cy="42" r="20" fill="#ffe0a3" stroke-width="2"/>' +
      '<path d="M38 42 L58 42 M38 42 L52 56 M38 42 L38 62 M38 42 L24 56 M38 42 L18 42 M38 42 L24 28 M38 42 L38 22 M38 42 L52 28" stroke="#ff8a3d" stroke-width="3"/>' +
      '<circle cx="38" cy="42" r="4" fill="#ffe0a3" stroke="none"/>' +
      '<path d="M92 30 Q112 28 108 48 Q104 66 92 72 Q80 66 76 48 Q72 28 92 30 Z" fill="#ff5a4d"/>' +
      '<path d="M80 29 L92 35 L104 29 L99 38 L92 34 L85 38 Z" fill="#4fc26b"/>' +
      '<g fill="#ffd23f" stroke="none"><circle cx="86" cy="48" r="1.8"/><circle cx="98" cy="48" r="1.8"/><circle cx="92" cy="57" r="1.8"/><circle cx="84" cy="59" r="1.8"/><circle cx="100" cy="59" r="1.8"/></g>' + E,
    meat: O +
      '<path d="M16 42 Q12 20 40 16 Q72 10 96 24 Q112 38 100 54 Q84 70 52 66 Q20 66 16 42 Z" fill="#ff6b78"/>' +
      '<path d="M28 30 Q40 24 52 30 M68 22 Q82 26 90 36 M28 48 Q38 54 48 52" stroke="#ffd7dc" stroke-width="3"/>' +
      '<path d="M44 28 H78 V38 H66 V56 H56 V38 H44 Z" fill="#fff8e6"/>' + E,
    pantry: O +
      '<g transform="rotate(6 83 41)"><rect x="62" y="14" width="42" height="54" rx="3" fill="#ff5a4d"/>' +
      '<circle cx="83" cy="34" r="11" fill="#ffd23f"/><rect x="70" y="51" width="26" height="8" rx="2" fill="#fff8e6"/></g>' +
      '<path d="M14 26 V62 Q32 72 50 62 V26" fill="#4aa3ff"/>' +
      '<ellipse cx="32" cy="26" rx="18" ry="6" fill="#d9ecff"/>' +
      '<path d="M14 39 Q32 46 50 39 V52 Q32 59 14 52 Z" fill="#ffd23f"/>' + E,
    spice: O +
      '<rect x="22" y="12" width="36" height="12" rx="3" fill="#c98b5a"/>' +
      '<path d="M24 24 H56 Q62 28 62 36 V62 Q62 70 54 70 H26 Q18 70 18 62 V36 Q18 28 24 24 Z" fill="#fff8e6"/>' +
      '<path d="M18 52 H62 V62 Q62 70 54 70 H26 Q18 70 18 62 Z" fill="#ff8a3d"/>' +
      '<rect x="26" y="33" width="28" height="14" rx="2" fill="#ffd23f"/><path d="M31 40 H49" stroke-width="2"/>' +
      '<g transform="translate(92 30)" fill="#a35a2c">' +
        '<ellipse rx="4.5" ry="15"/><ellipse rx="4.5" ry="15" transform="rotate(45)"/>' +
        '<ellipse rx="4.5" ry="15" transform="rotate(90)"/><ellipse rx="4.5" ry="15" transform="rotate(135)"/>' +
        '<circle r="4" fill="#5a2f14"/>' +
      '</g>' +
      '<path d="M76 60 Q94 54 110 66 Q96 76 82 70 Q74 66 76 60 Z" fill="#ff5a4d"/>' +
      '<path d="M76 60 Q71 55 75 51" stroke-width="3"/>' + E,
    clean: O +
      '<rect x="22" y="32" width="32" height="38" rx="7" fill="#4aa3ff"/>' +
      '<rect x="32" y="22" width="12" height="10" fill="#fff8e6"/>' +
      '<path d="M26 12 H50 L58 18 V24 H30 Q26 24 26 20 Z" fill="#ff5a4d"/>' +
      '<rect x="28" y="44" width="20" height="14" rx="2" fill="#fff8e6"/>' +
      '<g fill="#d9ecff"><circle cx="80" cy="22" r="10"/><circle cx="98" cy="40" r="7"/><circle cx="82" cy="54" r="8"/><circle cx="108" cy="16" r="4"/></g>' +
      '<g stroke="#fff" stroke-width="2"><path d="M75 19 Q77 16 80 16"/><path d="M95 38 Q96 36 98 36"/><path d="M78 52 Q79 49 82 49"/></g>' +
      '<path d="M104 62 L106 68 L112 70 L106 72 L104 78 L102 72 L96 70 L102 68 Z" fill="#ffd23f"/>' + E,
    bread: O +
      '<g transform="rotate(-28 90 36)"><rect x="64" y="28" width="52" height="16" rx="8" fill="#e9a959"/>' +
      '<path d="M76 31 L80 41 M88 31 L92 41 M100 31 L104 41" stroke-width="2"/></g>' +
      '<path d="M14 56 Q10 30 38 26 Q68 24 72 52 Q74 68 44 70 Q18 72 14 56 Z" fill="#f2b765"/>' +
      '<path d="M28 37 Q32 44 28 54 M42 33 Q46 42 42 55 M56 37 Q60 44 56 54" stroke="#fff8e6" stroke-width="4"/>' + E,
    add: O +
      '<path transform="translate(3 3)" d="M52 14 H68 V32 H86 V48 H68 V66 H52 V48 H34 V32 H52 Z" fill="#0a0a0a"/>' +
      '<path d="M52 14 H68 V32 H86 V48 H68 V66 H52 V48 H34 V32 H52 Z" fill="#00bfa5"/>' + E,
    tag: O +
      '<path d="M14 20 Q14 14 20 14 H64 L104 40 L64 66 H20 Q14 66 14 60 Z" fill="#ffd23f"/>' +
      '<circle cx="30" cy="40" r="5" fill="#efeeec"/>' +
      '<path d="M46 32 H72 M46 44 H64" stroke-width="3"/>' + E
  };
  var G0 = '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var GL = {
    fruit: G0 + '<circle cx="12" cy="14" r="7" fill="#fff"/><path d="M12 7c0-2 1.5-3.5 3.5-4"/></svg>',
    veg: G0 + '<path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15Z" fill="#fff"/><path d="M5 19 13 11"/></svg>',
    meat: G0 + '<path d="M4 7h16v5h-6v8h-4v-8H4Z" fill="#fff"/></svg>',
    pantry: G0 + '<path d="M6 6v12c0 1.7 2.7 3 6 3s6-1.3 6-3V6" fill="#fff"/><ellipse cx="12" cy="6" rx="6" ry="2.5" fill="#fff"/></svg>',
    clean: G0 + '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#fff"/></svg>',
    attar: G0 + '<circle cx="8" cy="14" r="2" fill="#fff"/><circle cx="15" cy="9" r="2" fill="#fff"/><circle cx="16" cy="17" r="2" fill="#fff"/></svg>',
    bakery: G0 + '<path d="M12 21V6"/><path d="M12 10c-3 0-4.5-2-4.5-4.5 3 0 4.5 2 4.5 4.5Zm0 5c-3 0-4.5-2-4.5-4.5 3 0 4.5 2 4.5 4.5Zm0-5c3 0 4.5-2 4.5-4.5-3 0-4.5 2-4.5 4.5Zm0 5c3 0 4.5-2 4.5-4.5-3 0-4.5 2-4.5 4.5Z" fill="#fff"/></svg>'
  };
  GL.custom = GL.fruit;
  var CHEV = '<svg class="go" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#0a0a0a"/>' +
    '<path d="M13.5 7.5 9 12l4.5 4.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var PLUS = '<svg class="pl" viewBox="0 0 12 12" fill="none" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round"><path d="M6 1.5v9M1.5 6h9"/></svg>';
  var CHECK = '<svg class="tk" viewBox="0 0 12 12" fill="none" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6.5l2.6 2.6L10 3.4"/></svg>';
  var CHK = '<svg viewBox="0 0 12 12" fill="none" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6.5l2.6 2.6L10 3.4"/></svg>';
  var XICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  window.Art = { ART: ART, GL: GL, CHEV: CHEV, PLUS: PLUS, CHECK: CHECK, CHK: CHK, XICON: XICON };
})();
