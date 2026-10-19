(function () {
  var data = window.LE_SERIES || {};

  /* Approved series description only (empty until the owner approves a draft). */
  var syn = (data.description || "").trim();
  if (syn) {
    var box = document.getElementById("synopsis");
    syn.split(/\n{2,}/).forEach(function (t) { var p = document.createElement("p"); p.textContent = t; box.appendChild(p); });
    document.getElementById("world").hidden = false;
  }

  /* Four book positions. Only verified fields are rendered. */
  var list = document.getElementById("book-list");
  (data.books || []).forEach(function (b) {
    var li = document.createElement("li"); li.className = "book" + (b.reserved ? " reserved" : "");
    var f = document.createElement("div"); f.className = "frame";
    if (b.cover) { var img = document.createElement("img"); img.src = b.cover; img.alt = b.coverAlt || ("Cover of " + b.title); img.loading = "lazy"; f.appendChild(img); }
    else f.textContent = b.reserved ? "Reserved" : "Official cover not yet supplied";
    li.appendChild(f);
    if (!b.reserved) { var h = document.createElement("h3"); h.textContent = b.title; li.appendChild(h); }
    var p = document.createElement("p"); p.className = "pos"; p.textContent = b.positionStatus; li.appendChild(p);
    if (b.summary) { var s = document.createElement("p"); s.textContent = b.summary; li.appendChild(s); }
    if (b.status) { var st = document.createElement("p"); st.textContent = b.status; li.appendChild(st); }
    list.appendChild(li);
  });

  /* Gentle parallax on the hero background, disabled for reduced motion */
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var bg = document.querySelector(".hero-bg"), ticking = false;
  addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { bg.style.translate = "0 " + (Math.min(scrollY, innerHeight) * 0.12).toFixed(1) + "px"; ticking = false; });
  }, { passive: true });
})();
