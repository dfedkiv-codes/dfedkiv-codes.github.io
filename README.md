# danylo fedkiv — personal site

Plain HTML and CSS, no build step. GitHub Pages serves it as is.

- `index.html` — About (the cover)
- `research.html`, `projects.html`, `science-olympiad.html`, `blog.html`, `friends.html`
- `data/exams.js` — the Science Olympiad exam list. Edit this file to add an exam; instructions are at the top of it
- `exams/` — upload exam and answer-key PDFs here
- `blog/post-template.html` — copy this to start a post; steps are in a comment inside `blog.html`
- `assets/js/marble.js` — draws the marble strip; each page's `data-seed` picks a different region
- `assets/css/site.css` — all styling; colours and sizes are variables at the top
- `cv.pdf` — linked from the cover
- `CNAME` — the custom domain, danylofedkiv.me

## If a change does not show up

Browsers keep old copies of the stylesheet and scripts. The `?v=8` after each
`.css` and `.js` link in the HTML files forces a fresh copy: after editing
`site.css` or a script, raise that number in every HTML file.
(`data/exams.js` is the exception in practice: a hard refresh, Ctrl+Shift+R, is enough.)
- `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png` — the browser-tab and home-screen icons, cut from the marble
