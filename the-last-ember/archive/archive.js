/* The Last Ember Archive UI. Reads window.LE_DATA + window.LE_SPOILERS. Everything shown is filtered through vis()/vf(). */
(function () {
  var S = window.LE_SPOILERS, D = window.LE_DATA, root = document.getElementById("arch-panel");
  if (!S || !D || !root) return;
  var level = 0;
  try { var v = parseInt(localStorage.getItem(S.storageKey), 10); if (v >= 0 && v <= 4) level = v; } catch (e) {}
  var tab = "characters", query = "", sel = {};
  var TABS = [["characters","Characters"],["events","Events"],["mysteries","Mysteries"],["theories","Theories"],["timeline","Timeline"],["virus","The Virus"],["artworks","Artworks"]];
  var BOOK = { O: "Origins", B: "Born to Survive", A: "Be Aware" };

  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    for (var k in (attrs || {})) { if (k === "text") el.textContent = attrs[k]; else if (k === "on") { for (var e in attrs.on) el.addEventListener(e, attrs.on[e]); } else el.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }
  function vis(rec) { return S.isVisible(rec.level, level); }
  function vf(list) { return (list || []).filter(function (f) { return S.isVisible(f[1], level); }); }
  function src(s) { var m = /^([OBA]) (.+)$/.exec(s); return m ? BOOK[m[1]] + ", pp. " + m[2] : s; }
  function byId(coll, id) { return (D[coll] || []).filter(function (r) { return r.id === id; })[0]; }
  function visibleById(coll, id) { var r = byId(coll, id); return r && vis(r) ? r : null; }
  function match(text) { return !query || text.toLowerCase().indexOf(query) !== -1; }
  function srcBlock(list) {
    var seen = {}, out = [];
    list.forEach(function (f) { if (f[2] && !seen[f[2]]) { seen[f[2]] = 1; out.push(src(f[2])); } });
    return out.length ? h("p", { "class": "arch-src", text: "Sources: " + out.join(" · ") }) : null;
  }
  function factList(list) {
    var f = vf(list);
    return h("ul", { "class": "arch-facts" }, f.map(function (x) { return h("li", { text: x[0] }); }));
  }
  function linkBtn(coll, id, label) {
    return h("button", { type: "button", "class": "arch-link-btn", on: { click: function () { open(coll, id); } }, text: label });
  }
  function relatedLinks(rec) {
    var groups = [["characters","chars","Characters"],["events","events","Events"],["mysteries","mysteries","Mysteries"],["theories","theories","Theories"]], out = [];
    groups.forEach(function (g) {
      var items = (rec[g[1]] || []).map(function (id) { return visibleById(g[0], id); }).filter(Boolean);
      if (items.length) out.push(h("p", { "class": "arch-rel" }, [h("span", { text: g[2] + ": " })].concat(items.map(function (r) { return linkBtn(g[0], r.id, r.name || r.title); }))));
    });
    return out;
  }
  function details(coll, rec, summaryText, blurb, bodyKids, searchText) {
    var d = h("details", { "class": "arch-card", id: "arch-" + coll + "-" + rec.id });
    if (sel[coll] === rec.id) d.setAttribute("open", "");
    d.appendChild(h("summary", {}, [h("span", { "class": "arch-title", text: summaryText }), blurb ? h("span", { "class": "arch-blurb", text: blurb }) : null]));
    d.appendChild(h("div", { "class": "arch-body" }, bodyKids));
    d._text = searchText; return d;
  }
  function empty(msg) { return h("p", { "class": "arch-empty", text: msg }); }

  /* ---- renderers ---- */
  function renderCharacters() {
    var chars = D.characters.filter(vis), shown = chars.filter(function (c) {
      return match([c.name, c.role].concat(vf(c.facts).map(function (f) { return f[0]; }), vf(c.aliases).map(function (a) { return a[0]; })).join(" "));
    });
    var wrap = h("div", { "class": "arch-chars" });
    var left = h("div", { "class": "arch-left" });
    if (chars.length > 1) left.appendChild(wheel(chars));
    var list = h("ul", { "class": "arch-list", "aria-label": "Characters" });
    shown.forEach(function (c) { list.appendChild(h("li", {}, [h("button", { type: "button", "class": "arch-pick" + (sel.characters === c.id ? " on" : ""), "aria-pressed": sel.characters === c.id ? "true" : "false", on: { click: function () { sel.characters = c.id; render(); } }, text: c.name })])); });
    left.appendChild(list);
    wrap.appendChild(left);
    var cur = sel.characters && visibleById("characters", sel.characters);
    wrap.appendChild(h("div", { "class": "arch-profile", "aria-live": "polite" }, cur ? profile(cur) : [empty(chars.length ? "Select a character to open a profile." : "")]));
    var frag = document.createDocumentFragment();
    if (!chars.length) frag.appendChild(empty("Nothing to show at this reading level."));
    else frag.appendChild(wrap);
    if (chars.length && !shown.length) frag.appendChild(empty("No match at this reading level."));
    return frag;
  }
  function profile(c) {
    var kids = [h("h3", { text: c.name }), h("p", { "class": "arch-role", text: c.role + (c.type === "group" ? " (group)" : "") })];
    var al = vf(c.aliases); if (al.length) kids.push(h("p", { "class": "arch-aka", text: "Also known as: " + al.map(function (a) { return a[0]; }).join(", ") }));
    kids.push(factList(c.facts));
    var rel = vf(c.relations.map(function (r) { return [r[0], r[2], r[3], r[1]]; })).filter(function (r) { return visibleById("characters", r[0]); });
    if (rel.length) kids.push(h("div", { "class": "arch-relations" }, [h("h4", { text: "Relationships" }), h("ul", {}, rel.map(function (r) { return h("li", {}, [h("span", { text: r[3] + " — " }), linkBtn("characters", r[0], byId("characters", r[0]).name)]); }))]));
    var bk = c.books.filter(function (b) { return S.isVisible(S.bookLevel[b], level); });
    if (bk.length) kids.push(h("p", { "class": "arch-books", text: "Appears in: " + bk.map(function (b) { return S.bookNames[b]; }).join(", ") }));
    var ev = D.events.filter(function (e) { return vis(e) && e.chars.indexOf(c.id) !== -1; }), my = D.mysteries.filter(function (m) { return vis(m) && m.chars.indexOf(c.id) !== -1; });
    if (ev.length) kids.push(h("p", { "class": "arch-rel" }, [h("span", { text: "Events: " })].concat(ev.map(function (e) { return linkBtn("events", e.id, e.title); }))));
    if (my.length) kids.push(h("p", { "class": "arch-rel" }, [h("span", { text: "Mysteries: " })].concat(my.map(function (m) { return linkBtn("mysteries", m.id, m.title); }))));
    kids.push(srcBlock(vf(c.facts)));
    return kids;
  }
  function wheel(chars) {
    var n = chars.length, R = 200, cx = 250, cy = 250, pos = {};
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "-60 0 620 500"); svg.setAttribute("class", "arch-wheel"); svg.setAttribute("role", "group"); svg.setAttribute("aria-label", "Character relationship wheel (a searchable list follows)");
    chars.forEach(function (c, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; pos[c.id] = [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
    var NS = "http://www.w3.org/2000/svg", done = {};
    chars.forEach(function (c) { vf((c.relations || []).map(function (r) { return [r[0], r[2], r[3], r[1]]; })).forEach(function (r) {
      if (!pos[r[0]]) return; var key = [c.id, r[0]].sort().join("|"); if (done[key]) return; done[key] = 1;
      var l = document.createElementNS(NS, "line"); l.setAttribute("x1", pos[c.id][0]); l.setAttribute("y1", pos[c.id][1]); l.setAttribute("x2", pos[r[0]][0]); l.setAttribute("y2", pos[r[0]][1]);
      l.setAttribute("class", "wl" + (sel.characters === c.id || sel.characters === r[0] ? " hot" : "")); svg.appendChild(l);
    }); });
    chars.forEach(function (c) {
      var g = document.createElementNS(NS, "g"); g.setAttribute("class", "wn" + (sel.characters === c.id ? " on" : "")); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", c.name);
      var circ = document.createElementNS(NS, "circle"); circ.setAttribute("cx", pos[c.id][0]); circ.setAttribute("cy", pos[c.id][1]); circ.setAttribute("r", c.type === "group" ? 9 : 7);
      var t = document.createElementNS(NS, "text"); t.setAttribute("x", pos[c.id][0]); t.setAttribute("y", pos[c.id][1] + (pos[c.id][1] < cy ? -14 : 22)); t.setAttribute("text-anchor", "middle"); t.textContent = c.name;
      g.appendChild(circ); g.appendChild(t);
      var go = function () { sel.characters = c.id; render(); setTimeout(function () { var f = root.querySelector(".arch-profile"); if (f && matchMedia("(max-width:820px)").matches) f.scrollIntoView({ block: "nearest" }); }, 0); };
      g.addEventListener("click", go); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      svg.appendChild(g);
    });
    return svg;
  }
  function renderEvents() {
    var out = [];
    D.events.filter(vis).forEach(function (e) {
      var f = vf(e.facts), txt = [e.title].concat(f.map(function (x) { return x[0]; }));
      if (!match(txt.join(" "))) return;
      var kids = [factList(e.facts)];
      var meta = [];
      if (e.place && S.isVisible(e.place[1], level)) meta.push("Place: " + e.place[0]);
      if (e.timing && S.isVisible(e.timing[1], level)) meta.push("Timing: " + e.timing[0]);
      meta.push("Book: " + S.bookNames[e.book]);
      kids.push(h("p", { "class": "arch-meta", text: meta.join("  ·  ") }));
      relatedLinks(e).forEach(function (x) { kids.push(x); }); kids.push(srcBlock(f));
      out.push(details("events", e, e.title, "", kids));
    });
    return listOrEmpty(out);
  }
  function currentStatus(m) { var s = null; m.statusByLevel.forEach(function (x) { if (x[1] <= level) s = x[0]; }); return s; }
  function renderMysteries() {
    var out = [];
    D.mysteries.filter(vis).forEach(function (m) {
      var cl = vf(m.clues); if (!match([m.title, m.intro].concat(cl.map(function (c) { return c[0]; })).join(" "))) return;
      var kids = [h("p", { "class": "arch-status", text: "Status: " + currentStatus(m) }), h("p", { text: m.intro }), h("h4", { text: "Known clues" }), factList(m.clues)];
      relatedLinks(m).forEach(function (x) { kids.push(x); }); kids.push(srcBlock(cl));
      out.push(details("mysteries", m, m.title, currentStatus(m), kids));
    });
    return listOrEmpty(out);
  }
  function renderTheories() {
    var out = [];
    D.theories.filter(vis).forEach(function (t) {
      var ev = vf(t.evidence), co = vf(t.counter);
      if (!match([t.title, t.explain].concat(ev.map(function (x) { return x[0]; })).join(" "))) return;
      var kids = [h("p", { "class": "arch-status", text: t.confirmation }), h("p", { text: t.explain }), h("h4", { text: "Supporting evidence" }),
        h("ul", { "class": "arch-facts" }, ev.map(function (x) { return h("li", { text: x[0] }); }))];
      if (co.length) { kids.push(h("h4", { text: "Counter-evidence / open questions" })); kids.push(h("ul", { "class": "arch-facts" }, co.map(function (x) { return h("li", { text: x[0] }); }))); }
      relatedLinks(t).forEach(function (x) { kids.push(x); }); kids.push(srcBlock(ev.concat(co)));
      out.push(details("theories", t, t.title, t.kind === "interpretation" ? "Text-supported interpretation" : "Unresolved speculation", kids));
    });
    return listOrEmpty(out);
  }
  function renderTimeline() {
    var items = D.timeline.filter(vis).sort(function (a, b) { return a.order - b.order; }).filter(function (t) { return match(t.title + " " + t.text + " " + t.marker); });
    if (!items.length) return listOrEmpty([]);
    var ol = h("ol", { "class": "arch-timeline" });
    items.forEach(function (t) {
      var evs = (t.events || []).map(function (id) { return visibleById("events", id); }).filter(Boolean);
      ol.appendChild(h("li", { id: "arch-timeline-" + t.id }, [h("p", { "class": "arch-marker", text: t.marker + " · confidence: " + t.conf }), h("h3", { text: t.title }), h("p", { text: t.text }),
        evs.length ? h("p", { "class": "arch-rel" }, [h("span", { text: "Events: " })].concat(evs.map(function (e) { return linkBtn("events", e.id, e.title); }))) : null,
        h("p", { "class": "arch-src", text: "Source: " + src(t.source) })]));
    });
    return ol;
  }
  function renderEmpty(key) {
    var items = (D[key] || []).filter(vis);
    if (items.length) return h("p", { text: "" });
    return h("div", { "class": "arch-void" }, [h("p", { text: key === "virus" ? "THE VIRUS" : "ARTWORKS", "class": "arch-void-title" }), h("p", { text: "This section is intentionally empty for now. Nothing here is canon until the author provides or approves content." })]);
  }
  function listOrEmpty(cards) {
    if (!cards.length) return empty(level === 0 ? "Nothing to show at this reading level." : "No match at this reading level.");
    var frag = document.createDocumentFragment(); cards.forEach(function (c) { frag.appendChild(c); }); return frag;
  }

  /* ---- shell ---- */
  var tabsEl = document.getElementById("arch-tabs"), levelEl = document.getElementById("arch-level"), qEl = document.getElementById("arch-q");
  S.levels.forEach(function (l) { levelEl.appendChild(h("option", { value: l.id, text: l.label })); });
  levelEl.value = String(level);
  TABS.forEach(function (t) {
    tabsEl.appendChild(h("button", { type: "button", role: "tab", id: "tab-" + t[0], "data-tab": t[0], on: { click: function () { tab = t[0]; render(); } }, text: t[1] }));
  });
  levelEl.addEventListener("change", function () {
    level = parseInt(levelEl.value, 10);
    try { localStorage.setItem(S.storageKey, String(level)); } catch (e) {}
    var c = sel.characters && !visibleById("characters", sel.characters); if (c) delete sel.characters; /* drop selections that are no longer unlocked */
    ["events", "mysteries", "theories"].forEach(function (k) { if (sel[k] && !visibleById(k, sel[k])) delete sel[k]; });
    render();
  });
  qEl.addEventListener("input", function () { query = qEl.value.trim().toLowerCase(); render(); });

  function open(coll, id) { tab = coll; query = ""; qEl.value = ""; sel[coll] = id; render(); var el = document.getElementById("arch-" + coll + "-" + id); if (el) el.scrollIntoView({ block: "center" }); }
  function render() {
    Array.prototype.forEach.call(tabsEl.children, function (b) { var on = b.getAttribute("data-tab") === tab; b.setAttribute("aria-selected", on ? "true" : "false"); b.className = on ? "on" : ""; });
    var isEmptyTab = tab === "virus" || tab === "artworks";
    document.getElementById("arch-search").hidden = isEmptyTab;
    root.setAttribute("role", "tabpanel"); root.setAttribute("aria-labelledby", "tab-" + tab);
    root.innerHTML = "";
    var map = { characters: renderCharacters, events: renderEvents, mysteries: renderMysteries, theories: renderTheories, timeline: renderTimeline };
    root.appendChild(isEmptyTab ? renderEmpty(tab) : map[tab]());
  }
  render();
})();
