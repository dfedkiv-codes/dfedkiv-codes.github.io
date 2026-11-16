/* Builds the exam archive on the Science Olympiad page from data/exams.js.
   You should not need to edit this file; add exams in data/exams.js. */
(function () {
  var mount = document.getElementById("exam-archive");
  if (!mount) return;

  var COLORS = ["#ff3d8b", "#2fd6e8", "#ff9a3d", "#2fd67f", "#a77bff", "#ffd84a"];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  // ---------- data ----------
  var exams = (window.EXAMS || []).filter(function (e) { return e && e.invitational; });
  exams.forEach(function (e, i) {
    e.event = String(e.event || "Other").trim();
    e.division = String(e.division || "").trim().toUpperCase();
    e.season = String(e.season || "Undated").trim();
    e._order = i;
  });

  if (!exams.length) {
    mount.appendChild(el("p", "empty", "No exams posted yet."));
    return;
  }

  // events: the configured order first, then any others as they appear
  var events = (window.EVENTS || []).map(function (s) { return String(s).trim(); });
  exams.forEach(function (e) { if (events.indexOf(e.event) === -1) events.push(e.event); });
  var colorOf = {};
  events.forEach(function (name, i) { colorOf[name] = COLORS[i % COLORS.length]; });
  events = events.filter(function (name) {
    return exams.some(function (e) { return e.event === name; });
  });

  var divisions = [];
  exams.forEach(function (e) { if (e.division && divisions.indexOf(e.division) === -1) divisions.push(e.division); });
  divisions.sort();

  // newest season first; the first number in the label decides
  function seasonKey(s) { var m = /\d{4}/.exec(s); return m ? parseInt(m[0], 10) : -1; }
  exams.sort(function (a, b) {
    return (seasonKey(b.season) - seasonKey(a.season)) ||
      String(b.date || "").localeCompare(String(a.date || "")) ||
      (a._order - b._order);
  });

  // ---------- state, kept in the address so a filtered view can be linked ----------
  var state = { event: "all", division: "all" };
  location.hash.replace(/^#/, "").split("&").forEach(function (pair) {
    var kv = pair.split("=");
    if (kv[0] === "event") events.forEach(function (n) { if (slug(n) === kv[1]) state.event = n; });
    if (kv[0] === "div" && divisions.indexOf(String(kv[1]).toUpperCase()) !== -1) state.division = String(kv[1]).toUpperCase();
  });
  function saveState() {
    var parts = [];
    if (state.event !== "all") parts.push("event=" + slug(state.event));
    if (state.division !== "all") parts.push("div=" + state.division.toLowerCase());
    history.replaceState(null, "", parts.length ? "#" + parts.join("&") : location.pathname + location.search);
  }

  // ---------- controls ----------
  var controls = el("div", "exam-controls");
  var eventRow = el("div", "filters");
  eventRow.setAttribute("role", "group");
  eventRow.setAttribute("aria-label", "Filter exams by event");
  var divRow = el("div", "filters filters-small");
  divRow.setAttribute("role", "group");
  divRow.setAttribute("aria-label", "Filter exams by division");

  function matches(e, ev, dv) {
    return (ev === "all" || e.event === ev) && (dv === "all" || e.division === dv);
  }

  function chip(row, label, key, value, color) {
    var b = el("button", "chip");
    b.type = "button";
    b.setAttribute("data-key", key);
    b.setAttribute("data-value", value);
    if (color) {
      var dot = el("i", "dot");
      dot.style.background = color;
      b.appendChild(dot);
    }
    b.appendChild(document.createTextNode(label));
    b.appendChild(el("span", "n"));
    b.addEventListener("click", function () {
      state[key] = value;
      saveState();
      render();
    });
    row.appendChild(b);
  }

  chip(eventRow, "All events", "event", "all");
  events.forEach(function (name) { chip(eventRow, name, "event", name, colorOf[name]); });
  controls.appendChild(eventRow);

  if (divisions.length > 1) {
    chip(divRow, "Both divisions", "division", "all");
    divisions.forEach(function (d) { chip(divRow, "Division " + d, "division", d); });
    controls.appendChild(divRow);
  }

  var summary = el("p", "count");
  summary.setAttribute("aria-live", "polite");
  var groups = el("div", "exam-groups");

  mount.appendChild(controls);
  mount.appendChild(summary);
  mount.appendChild(groups);

  // ---------- rows ----------
  function fileLink(label, href) {
    var a = el("a", null, label);
    a.href = href;
    if (/^https?:/i.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function row(e) {
    var li = el("li", "exam" + (e.example ? " is-example" : ""));

    var name = el("div", "exam-name");
    name.appendChild(el("span", "exam-title", e.invitational));
    if (e.note) name.appendChild(el("span", "exam-note", e.note));
    li.appendChild(name);

    var ev = el("div", "exam-event");
    var dot = el("i", "dot");
    dot.style.background = colorOf[e.event];
    ev.appendChild(dot);
    ev.appendChild(document.createTextNode(e.event));
    if (e.division) ev.setAttribute("data-div", "Div " + e.division);
    li.appendChild(ev);

    li.appendChild(el("div", "exam-div", e.division ? "Div " + e.division : ""));

    var files = el("div", "exam-files");
    if (e.exam) files.appendChild(fileLink("Exam", e.exam));
    if (e.key) files.appendChild(fileLink("Key", e.key));
    if (!e.exam && !e.key) files.appendChild(el("span", null, e.example ? "Placeholder" : "Not released yet"));
    li.appendChild(files);

    return li;
  }

  function render() {
    var shown = exams.filter(function (e) { return matches(e, state.event, state.division); });

    // chip states and counts (each count respects the other filter)
    Array.prototype.forEach.call(controls.querySelectorAll(".chip"), function (b) {
      var key = b.getAttribute("data-key"), value = b.getAttribute("data-value");
      b.setAttribute("aria-pressed", String(state[key] === value));
      var n = exams.filter(function (e) {
        return key === "event" ? matches(e, value, state.division) : matches(e, state.event, value);
      }).length;
      b.querySelector(".n").textContent = n;
    });

    groups.textContent = "";
    var seasons = [];
    shown.forEach(function (e) { if (seasons.indexOf(e.season) === -1) seasons.push(e.season); });

    seasons.forEach(function (season) {
      var inSeason = shown.filter(function (e) { return e.season === season; });
      var group = el("section", "exam-group");
      var head = el("h3", "exam-season");
      head.appendChild(document.createTextNode(season + " season"));
      head.appendChild(el("span", null, plural(inSeason.length, "exam")));
      group.appendChild(head);
      var ul = el("ul", "exams");
      inSeason.forEach(function (e) { ul.appendChild(row(e)); });
      group.appendChild(ul);
      groups.appendChild(group);
    });

    if (!shown.length) {
      groups.appendChild(el("p", "empty", "No exams match those filters yet."));
    }

    var nEvents = events.filter(function (n) { return shown.some(function (e) { return e.event === n; }); }).length;
    summary.textContent = shown.length === exams.length
      ? plural(exams.length, "exam") + " across " + plural(nEvents, "event") + " and " + plural(seasons.length, "season")
      : "Showing " + shown.length + " of " + plural(exams.length, "exam");
  }

  render();
})();
