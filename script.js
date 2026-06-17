/* ============================================================
   PORTFOLIO SCRIPT — Danylo Fedkiv
   - Blog post data + rendering
   - Scroll-triggered fade-in
   - Sticky nav mobile toggle
   - Blog post modal
   ============================================================ */

/* ══════════════════════════════════════
   BLOG POST DATA
   To add a post: add an object to POSTS.
   Fields: id, title, date, excerpt, content (HTML string)
══════════════════════════════════════ */
const POSTS = [
  {
    id: "test",
    title: "test",
    date: "test",
    dateDisplay: "test",
    excerpt: "test",
    content: `
      <h2>test</h2>
      <p class="modal-meta">test</p>
      <p>
        test
      </p>
      <p>
        test
      </p>
      <h3>test</h3>
      <p>
        test
      </p>
      <p>
        test
      </p>
      <h3>Wtest</h3>
      <p>
        test
      </p>
    `
  }
];

/* ══════════════════════════════════════
   RENDER BLOG LIST
══════════════════════════════════════ */
function renderBlogList() {
  const container = document.getElementById("blog-list");
  if (!container) return;

  container.innerHTML = POSTS.map(post => `
    <div class="blog-item fade-in" data-id="${post.id}" tabindex="0" role="button" aria-label="Read: ${post.title}">
      <div class="blog-date">${post.dateDisplay}</div>
      <div>
        <div class="blog-title">${post.title}</div>
        <div class="blog-excerpt">${post.excerpt}</div>
        <span class="blog-read-more">read more →</span>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".blog-item").forEach(item => {
    item.addEventListener("click", () => openPost(item.dataset.id));
    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") openPost(item.dataset.id);
    });
  });
}

/* ══════════════════════════════════════
   BLOG MODAL
══════════════════════════════════════ */
function openPost(id) {
  const post = POSTS.find(p => p.id === id);
  if (!post) return;

  const modal = document.getElementById("blog-modal");
  const content = document.getElementById("modal-content");
  content.innerHTML = post.content;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus close button for accessibility
  document.getElementById("modal-close").focus();
}

function closeModal() {
  const modal = document.getElementById("blog-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════
   SCROLL FADE-IN (IntersectionObserver)
══════════════════════════════════════ */
function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   MOBILE NAV TOGGLE
══════════════════════════════════════ */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links  = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  // Close nav on link click (mobile)
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ══════════════════════════════════════
   ACTIVE NAV HIGHLIGHT ON SCROLL
══════════════════════════════════════ */
function initNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.style.color = "");
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.style.color = "var(--accent)";
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  renderBlogList();
  initFadeIn();  // run after renderBlogList so blog items are in DOM
  initNav();
  initNavHighlight();

  // Modal close via button
  document.getElementById("modal-close")
    .addEventListener("click", closeModal);

  // Modal close via backdrop click
  document.querySelector(".modal-backdrop")
    .addEventListener("click", closeModal);

  // Modal close via Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});
