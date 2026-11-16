/* Builds the exam archive on the Science Olympiad page from data/exams.js.
   You should not need to edit this file; add exams in data/exams.js. */
(function () {
  var list = document.getElementById("exam-list");
  var filters = document.getElementById("exam-filters");
  var count = document.getElementById("exam-count");
  if (!list || !filters) return;

  var exams = (window.EXAMS || []).filter(function (e) { return e && e.invitational; });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  if (!exams.length) {
    list.appendChild(el("li", "exam", "No exams posted yet."));
    return;
  }

  // distinct events, in order of first appearance
  var events = [];
  exams.forEach(function (e) {
    var name = (e.event || "Other").trim();
    e.event = name;
    if (events.indexOf(name) === -1) events.push(name);
  });

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  var active = "all";
  var wanted = decodeURIComponent(location.hash.replace(/^#/, ""));
  events.forEach(function (name) { if (slug(name) === wanted) active = name; });

  function fileLink(label, href) {
    var a = el("a", null, label);
    a.href = href;
    if (/^https?:/i.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function row(e) {
    var li = el("li", "exam" + (e.example ? " is-example" : ""));

    var left = el("div");
    left.appendChild(el("h3", null, e.invitational));
    var meta = [e.event];
    if (e.division) meta.push("Division " + e.division);
    if (e.season) meta.push(e.season);
    left.appendChild(el("p", "meta", meta.join(", ")));
    if (e.note) left.appendChild(el("p", "note", e.note));
    li.appendChild(left);

    var files = el("div", "files");
    if (e.exam) files.appendChild(fileLink("Exam", e.exam));
    if (e.key) files.appendChild(fileLink("Answer key", e.key));
    if (!e.exam && !e.key) files.appendChild(el("span", null, e.example ? "Placeholder" : "Not released yet"));
    li.appendChild(files);

    return li;
  }

  function render() {
    list.textContent = "";
    var shown = exams.filter(function (e) { return active === "all" || e.event === active; });
    shown.forEach(function (e) { list.appendChild(row(e)); });

    Array.prototype.forEach.call(filters.querySelectorAll(".chip"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-event") === active));
    });

    if (count) {
      count.textContent = "Showing " + shown.length + " of " + exams.length +
        (exams.length === 1 ? " exam" : " exams");
    }
  }

  function chip(label, value, n) {
    var b = el("button", "chip", label);
    b.type = "button";
    b.setAttribute("data-event", value);
    b.appendChild(el("span", null, String(n)));
    b.addEventListener("click", function () {
      active = value;
      history.replaceState(null, "", value === "all" ? location.pathname : "#" + slug(value));
      render();
    });
    return b;
  }

  filters.appendChild(chip("All", "all", exams.length));
  events.forEach(function (name) {
    var n = exams.filter(function (e) { return e.event === name; }).length;
    filters.appendChild(chip(name, name, n));
  });

  render();
})();
