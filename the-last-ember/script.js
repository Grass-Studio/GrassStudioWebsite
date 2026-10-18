(function () {
  var data = window.LAST_EMBER || {};

  var syn = (data.synopsis || "").trim();
  if (syn) {
    var box = document.getElementById("synopsis");
    syn.split(/\n{2,}/).forEach(function (t) {
      var p = document.createElement("p");
      p.textContent = t;
      box.appendChild(p);
    });
    document.getElementById("world").hidden = false;
  }

  var books = (data.books || []).filter(function (b) { return b && b.title && b.cover; });
  if (books.length) {
    var list = document.getElementById("book-list");
    books.forEach(function (b) {
      var li = document.createElement("li");
      var img = document.createElement("img");
      img.src = b.cover; img.alt = b.alt || ("Cover of " + b.title); img.loading = "lazy";
      var h = document.createElement("h3"); h.textContent = b.title;
      li.appendChild(img); li.appendChild(h);
      if (b.summary) { var p = document.createElement("p"); p.textContent = b.summary; li.appendChild(p); }
      list.appendChild(li);
    });
    document.getElementById("books").hidden = false;
  }

  /* Gentle parallax on the background, disabled for reduced motion */
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var bg = document.querySelector(".hero-bg"), ticking = false;
  addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = Math.min(scrollY, innerHeight);
      bg.style.translate = "0 " + (y * 0.12).toFixed(1) + "px";
      ticking = false;
    });
  }, { passive: true });
})();
