/* Runs before the page paints. Remembers whether the previous page was the
   cover (About) or an inner page, so the marble strip can slide from its old
   width to its new one. The animation itself is in site.css. */
(function () {
  var KEY = "df-prev-page";
  try {
    var prev = sessionStorage.getItem(KEY);
    if (prev) document.documentElement.classList.add("from-" + prev);
  } catch (e) {}

  function remember() {
    try {
      sessionStorage.setItem(KEY, document.body.classList.contains("cover") ? "cover" : "inner");
    } catch (e) {}
  }
  document.addEventListener("DOMContentLoaded", remember);
  window.addEventListener("pageshow", remember);
})();
