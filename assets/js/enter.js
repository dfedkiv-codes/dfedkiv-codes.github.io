/* Runs before the page paints.
   1. Remembers whether the previous page was the cover (About) or an inner
      page, so the marble strip can slide from its old width to its new one.
   2. Holds the page in its starting pose until the marble has drawn its first
      frame, then adds "go" to <html>, which lets the slide and the text fade
      play. Without the wait, a slow first frame would eat the animation.
   The motion itself is in site.css. */
(function () {
  var KEY = "df-prev-page";
  var root = document.documentElement;
  root.classList.add("js");

  try {
    var prev = sessionStorage.getItem(KEY);
    if (prev) root.classList.add("from-" + prev);
  } catch (e) {}

  var started = false;
  function go() {
    if (started) return;
    started = true;
    root.classList.add("go");
    // once the slide is over, drop the marker so resizing the window is instant
    setTimeout(function () { root.classList.remove("from-cover", "from-inner"); }, 1000);
  }

  function remember() {
    try {
      sessionStorage.setItem(KEY, document.body.classList.contains("cover") ? "cover" : "inner");
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    remember();
    // two frames: the marble draws in the first, the motion starts in the second
    requestAnimationFrame(function () { requestAnimationFrame(go); });
  });
  window.addEventListener("pageshow", function () { remember(); go(); });
  setTimeout(go, 1500); // never leave the page hidden if something stalls
})();
