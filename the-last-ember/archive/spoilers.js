/* Central reading-progress rules. Change the reading order HERE only.
   A record with level N is revealed by the earliest book at level N. A reader at level L sees records with level <= L.
   0 = No spoilers · 1 = Through Book 1 · 2 = Through Book 2 · 3 = Through Book 3 · 4 = Full archive */
window.LE_SPOILERS = {
  levels: [
    { id: 0, label: "No spoilers" },
    { id: 1, label: "Through Book 1" },
    { id: 2, label: "Through Book 2" },
    { id: 3, label: "Through Book 3" },
    { id: 4, label: "Full archive" }
  ],
  /* book id -> level at which it is considered read */
  bookLevel: { "origins": 1, "born-to-survive": 2, "be-aware": 3 },
  bookNames: { "origins": "Origins", "born-to-survive": "Born to Survive", "be-aware": "Be Aware" },
  /* Be Aware's position is NOT confirmed by the owner; it is provisionally gated behind level 3 (the safest choice). */
  provisional: { "be-aware": true },
  storageKey: "le-reading-level",
  isVisible: function (lv, level) { return lv <= level; }
};
