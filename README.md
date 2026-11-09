# Oulan Li — portfolio

Plain HTML and CSS, no build step. Hosted on GitHub Pages.

## Structure

- `index.html` — homepage and project index
- `about.html` — about page
- `work/*.html` — one case study per project
- `assets/style.css` — all styles; colors and fonts are variables at the top
- `assets/images/` — project images (put them here)

## Adding an image

Replace a placeholder like

```html
<figure class="fig"><div class="placeholder">FIG. 02 — ...</div></figure>
```

with

```html
<figure class="fig">
  <img src="../assets/images/360-playtest.jpg" alt="Guests playing around the Ring">
  <figcaption>FIG. 02 — Playtest Day, Oct 31</figcaption>
</figure>
```

Keep images under ~500 KB (export at 1600 px wide, JPG or WebP). Put videos on YouTube or Vimeo and embed them; GitHub won't take large files.

## Still to fill in

Search the pages for `todo` and `YOUR-EMAIL`. Add the résumé as `assets/Oulan-Li-Resume.pdf`.
