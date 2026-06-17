/* ============================================================
   PORTFOLIO SCRIPT — Danylo Fedkiv
   ============================================================ */

/* ══════════════════════════════════════
   COMICS DATA
   Add objects here to populate comics.html.
   Each entry: { title: "...", src: "URL or path to PNG/JPG" }
   src can be a full URL: "https://i.imgur.com/abc.png"
   or a relative path:    "assets/comic-01.png"
══════════════════════════════════════ */
const COMICS = [
  // Example — uncomment and edit to add a comic:
  { title: "An idea a friend of mine had after browsing the Yamaha website", src: "comics/16.png" },
  { title: "That time a friend of mine fell asleep in class", src: "comics/1.png" },
  { title: "The hurricane season from I believe 2025", src: "comics/2.png" },
  { title: "A weird dream a friend of mine had", src: "comics/3.png" },
  { title: "Why you should probably never pull an all nighter", src: "comics/4.png" },
  { title: "When my friend proposed to us a very well hidden pyramid scheme", src: "comics/5.png" },
  { title: "That time we played hide and seek in the mall", src: "comics/6.png" },
  { title: "An actually real email sent out at our high school", src: "comics/7.png" },
  { title: "DO NOT EAT SPICY CHICKEN WINGS BEFORE AN EXAM", src: "comics/8.png" },
  { title: "The hurricane season from I believe 2024", src: "comics/9.png" },
  { title: "A comic suggestion from a long time ago", src: "comics/10.png" },
  { title: "A little snippet of the chaos unraveling in a groupchat", src: "comics/11.png" },
  { title: "Why I would never grade assignments for volunteer hours again", src: "comics/12.png" },
  { title: "Science Olympiad inspired crashout", src: "comics/13.png" },
  { title: "Reason why I have a friend who graduated highschool at 16", src: "comics/14.png" },
  { title: "What apparently happens to you when you use lightmode", src: "comics/15.png" },
  
  
];

/* ══════════════════════════════════════
   BLOG POST DATA
   Add objects here to populate the Blog tab.
   Fields: id, title, date, dateDisplay, excerpt, content (HTML)
══════════════════════════════════════ */
const POSTS = [
  // Example — uncomment and edit to add a post:
  // {
  //   id: "first-post",
  //   title: "My First Post",
  //   date: "2025-06-01",
  //   dateDisplay: "Jun 2025",
  //   excerpt: "A short preview of the post shown in the list.",
  //   content: `
  //     <h2>My First Post</h2>
  //     <p class="modal-meta">Jun 2025 · Category</p>
  //     <p>Full post content here. HTML is supported.</p>
  //   `
  // },
];

/* ══════════════════════════════════════
   TAB SWITCHING
══════════════════════════════════════ */
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels  = document.querySelectorAll(".tab-panel");

  function activateTab(id) {
    buttons.forEach(b => b.classList.toggle("active", b.dataset.tab === id));
    panels.forEach(p  => p.classList.toggle("active", p.id === "tab-" + id));
    // Trigger fade-ins for newly visible panel
    observeFadeIns();
    // Update URL hash without jumping
    history.replaceState(null, "", "#" + id);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      activateTab(btn.dataset.tab);
      // Close mobile nav if open
      document.querySelector(".nav-tabs")?.classList.remove("open");
    });
  });

  // Load tab from URL hash on first load
  const hash = location.hash.replace("#", "");
  const valid = ["about", "projects", "blog", "fun"];
  if (hash && valid.includes(hash)) {
    activateTab(hash);
  }
}

/* ══════════════════════════════════════
   BLOG RENDERING
══════════════════════════════════════ */
function renderBlogList() {
  const list    = document.getElementById("blog-list");
  const empty   = document.getElementById("blog-empty");
  if (!list) return;

  if (POSTS.length === 0) {
    list.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  list.innerHTML = POSTS.map(post => `
    <div class="blog-item fade-in" data-id="${post.id}"
         tabindex="0" role="button" aria-label="Read: ${post.title}">
      <div class="blog-date">${post.dateDisplay}</div>
      <div>
        <div class="blog-title">${post.title}</div>
        <div class="blog-excerpt">${post.excerpt}</div>
        <span class="blog-read-more">read more →</span>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".blog-item").forEach(item => {
    item.addEventListener("click", () => openPost(item.dataset.id));
    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") openPost(item.dataset.id);
    });
  });
}

function openPost(id) {
  const post = POSTS.find(p => p.id === id);
  if (!post) return;
  const modal   = document.getElementById("blog-modal");
  const content = document.getElementById("modal-content");
  content.innerHTML = post.content;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("modal-close").focus();
}

function closeModal() {
  const modal = document.getElementById("blog-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════
   COMICS RENDERING (comics.html only)
══════════════════════════════════════ */
function renderComics() {
  const feed  = document.getElementById("comics-feed");
  const empty = document.getElementById("comics-empty");
  if (!feed) return;

  if (COMICS.length === 0) {
    feed.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  feed.innerHTML = COMICS.map((comic, i) => `
    <div class="comic-entry fade-in" style="animation-delay:${i * 0.06}s">
      <div class="comic-img-wrap">
        <img src="${comic.src}" alt="${comic.title}" loading="lazy" />
      </div>
      <div class="comic-caption">
        <span class="comic-title">${comic.title}</span>
        <span class="comic-num">#${String(i + 1).padStart(2, "0")}</span>
      </div>
    </div>
  `).join("");
}

/* ══════════════════════════════════════
   SCROLL FADE-IN (IntersectionObserver)
══════════════════════════════════════ */
let fadeObserver = null;

function observeFadeIns() {
  if (fadeObserver) {
    // Re-observe any newly visible .fade-in elements
    document.querySelectorAll(".fade-in:not(.visible)").forEach(el => {
      fadeObserver.observe(el);
    });
    return;
  }

  fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );

  document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));
}

/* ══════════════════════════════════════
   MOBILE NAV TOGGLE
══════════════════════════════════════ */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const tabs   = document.querySelector(".nav-tabs");
  if (!toggle || !tabs) return;

  toggle.addEventListener("click", () => tabs.classList.toggle("open"));

  document.addEventListener("click", e => {
    if (!e.target.closest("#navbar")) tabs.classList.remove("open");
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // Index page
  if (document.getElementById("tab-about")) {
    initTabs();
    renderBlogList();
    initNavToggle();

    const closeBtn     = document.getElementById("modal-close");
    const backdrop     = document.querySelector(".modal-backdrop");
    if (closeBtn)  closeBtn.addEventListener("click", closeModal);
    if (backdrop)  backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  }

  // Comics page
  if (document.getElementById("comics-feed")) {
    renderComics();
  }

  // Run fade-ins on initial load
  observeFadeIns();
});
