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
    id: "mmp-selectivity",
    title: "Why MMP Selectivity Is Harder Than It Looks",
    date: "2025-06-01",
    dateDisplay: "Jun 2025",
    excerpt: "Everyone wants a selective MMP inhibitor. The literature is full of them failing in clinical trials. Here's what I've been thinking about after a semester in the Fields lab.",
    content: `
      <h2>Why MMP Selectivity Is Harder Than It Looks</h2>
      <p class="modal-meta">Jun 2025 · Research notes</p>
      <p>
        Matrix metalloproteinases are a structurally conserved family of zinc-dependent endopeptidases
        with 23 human members. They share a catalytic domain with a nearly identical active site geometry.
        This is the problem. When you design an inhibitor that chelates the catalytic zinc — which is the
        dominant strategy historically — you get an inhibitor that works against essentially all of them.
      </p>
      <p>
        The early broad-spectrum MMP inhibitors (marimastat, batimastat) failed not because they didn't
        work biochemically — they were potent — but because the on-target side effects were unacceptable.
        Musculoskeletal syndrome from off-target MMP inhibition effectively killed the class.
      </p>
      <h3>Where selectivity comes from</h3>
      <p>
        The catalytic domain has shallow selectivity determinants, but the structural/hemopexin domain
        varies more substantially between MMPs. MT1-MMP (MMP-14), for instance, has a distinctive
        hemopexin domain that governs substrate tethering and CD44 shedding. Triple-helical substrate
        conformation exploits this — a peptide that must adopt triple-helical geometry in the active site
        is making structural contacts that a flat small molecule can't access.
      </p>
      <p>
        The approach in the Fields lab uses fluorogenic triple-helical peptides as both substrates and
        potential scaffold leads. If you can map the P-side preferences for MMP-13 versus MT1-MMP with
        enough resolution, you can start to exploit those differences. The problem is that the number of
        combinations scales factorially, so positional scanning libraries become the practical approach.
      </p>
      <h3>What I'm thinking about</h3>
      <p>
        The computational side of this — docking triple-helical conformers into MMP active sites — is
        genuinely underexplored. Most docking software isn't parameterized for triple-helix backbone
        geometry. That gap might be worth filling eventually. For now: SPPS, HPLC, fluorescence assays,
        and trying to understand the selectivity determinants from the kinetics data up.
      </p>
    `
  },
  {
    id: "goldwater-reflection",
    title: "Goldwater Without Publications: What Actually Mattered",
    date: "2025-04-15",
    dateDisplay: "Apr 2025",
    excerpt: "I won the Goldwater Scholarship as a sophomore with no publications and no REU experience. This is my honest account of what I think made the difference.",
    content: `
      <h2>Goldwater Without Publications: What Actually Mattered</h2>
      <p class="modal-meta">Apr 2025 · Reflections</p>
      <p>
        The standard advice for competitive research fellowships is: publications, REU, strong letter writers.
        I had exactly one of those three — strong letters — when I submitted my Goldwater application.
        I had been in the Fields lab for less than a semester. No publications, no summer programs.
      </p>
      <p>
        So what worked? My honest read, with the caveat that I can't know for certain:
      </p>
      <h3>Intellectual coherence over credential density</h3>
      <p>
        The application asked me to describe a research problem I want to spend my career on, not to list
        what I'd done so far. I wrote about the structural biology of MMP selectivity as a problem
        with intrinsic interest — not "I want to cure cancer" in generic terms, but a specific unresolved
        question about substrate geometry and active site contacts that I could articulate precisely.
        The Goldwater is looking for people who think like researchers. The credentials are proxies for that.
        If you can demonstrate the underlying thing directly, you don't need as many proxies.
      </p>
      <h3>The physician-scientist framing</h3>
      <p>
        MD-PhD track means the motivation structure is different from a pure PhD applicant. You're not
        just pursuing intellectual curiosity — you're arguing that the research has a translational endpoint
        that only makes sense if you also understand clinical context. I think that coherent motivation
        statement read as genuine, because it was.
      </p>
      <h3>What I'd tell other sophomores</h3>
      <p>
        Get into a lab early and actually learn something — not "I assisted with experiments" but
        "I understand the mechanism well enough to have an opinion about what the next experiment should be."
        That understanding is what reviewers are actually evaluating. The publication is evidence of it,
        but it's not the thing itself.
      </p>
    `
  },
  {
    id: "biomedical-ds-curriculum",
    title: "Building a Data Science Curriculum for Wet Lab Biologists",
    date: "2025-05-20",
    dateDisplay: "May 2025",
    excerpt: "Most biomedical data science curricula are either too abstract or too clinical. Here's how I structured my own 20-week self-directed curriculum to actually serve the kind of research I want to do.",
    content: `
      <h2>Building a Data Science Curriculum for Wet Lab Biologists</h2>
      <p class="modal-meta">May 2025 · Methods &amp; Tools</p>
      <p>
        The problem with most intro bioinformatics or biostatistics courses is that they optimize for
        one of two audiences: biology students who need to know that p-values exist, or CS students
        who don't know why anyone would care about TCGA. Neither describes someone who has spent
        significant time at a SPPS synthesizer but wants to add computational skills.
      </p>
      <h3>The structure I landed on</h3>
      <p>
        I organized the curriculum in three phases:
      </p>
      <ul>
        <li><strong>Phase 1 (Weeks 1–8):</strong> Clinical epidemiology + Python fundamentals. NHANES,
        MIMIC-III lite, basic statistical inference, visualization. The goal was to get comfortable
        with the shape of clinical data — messy, longitudinal, full of missing values for real reasons.</li>
        <li><strong>Phase 2 (Weeks 9–16):</strong> Cheminformatics. ChEMBL, PubChem, RDKit, QSAR basics.
        This is where the wet lab background actually became an asset — I could evaluate whether a predicted
        pharmacophore made structural sense in a way that a pure CS background wouldn't let you do.</li>
        <li><strong>Phase 3 (Weeks 17–20):</strong> Integration bridge + capstone. Drug-outcome linkage
        using both data types. The capstone question: what does the MMP-13 inhibitor chemical space look
        like relative to osteoarthritis outcomes in SEER/TCGA?</li>
      </ul>
      <h3>What actually worked</h3>
      <p>
        Project-first learning. I defined the capstone question before I started Week 1, so every module
        was oriented toward something concrete. The NHANES cholesterol project and the Pima Indians
        classification project were both graded against actual research questions, not toy exercises.
        That made the difference between "I completed the curriculum" and "I can do something with this."
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
