# Danylo Fedkiv — Research Portfolio

Static GitHub Pages portfolio. No build tools, no frameworks — pure HTML/CSS/JS.

## File Structure

```
portfolio/
├── index.html       ← All sections (single-page)
├── styles.css       ← All styles
├── script.js        ← Blog posts data + interactions
├── cv.pdf           ← YOUR CV — add this file before deploying
└── README.md
```

## Deploying to GitHub Pages

### Step 1 — Create a repository

Go to github.com/new and create a repository named:
- `yourusername.github.io` → site will live at `https://yourusername.github.io`
- OR any name (e.g. `portfolio`) → site at `https://yourusername.github.io/portfolio`

### Step 2 — Add your CV PDF

Place your CV as `cv.pdf` in the root folder alongside `index.html`.
The "Download CV" buttons link to `cv.pdf` and will 404 without it.

### Step 3 — Push the files

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/REPONAME.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages

1. Go to your repository → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / `root`
4. Save — your site will be live in ~1 minute

---

## Adding a Blog Post

Open `script.js` and add an object to the `POSTS` array at the top:

```js
{
  id: "unique-slug",          // used as identifier
  title: "Post Title",
  date: "2025-07-01",         // ISO date for ordering
  dateDisplay: "Jul 2025",    // shown in UI
  excerpt: "Short preview...",
  content: `
    <h2>Post Title</h2>
    <p class="modal-meta">Jul 2025 · Category</p>
    <p>Your content here...</p>
  `
}
```

Posts render automatically — no other changes needed.

## Updating CV Content

CV content lives in `index.html` inside `<section id="cv">`.
Each block follows this pattern:

```html
<div class="cv-block">
  <h3 class="cv-heading">Section Name</h3>
  <div class="cv-entry">
    <div class="cv-entry-header">
      <span class="cv-org">Organization</span>
      <span class="cv-date">Date range</span>
    </div>
    <p class="cv-role">Role / position</p>
    <ul class="cv-bullets">
      <li>Detail</li>
    </ul>
  </div>
</div>
```

## Customization Notes

- **Accent color**: change `--accent` in `:root` in `styles.css`
- **Email / LinkedIn**: update the `<a>` tags in `#about`
- **Status dots**: green = active, amber = planned, gray = future
- **Fun section**: replace emoji placeholders with `<img>` tags once you have art/images
