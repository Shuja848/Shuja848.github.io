# Shuja Chaudhry PCB Portfolio Website

Static portfolio site for GitHub Pages. No build tools are needed to host it: `index.html`, the `img` folder and the PDF are everything a browser needs.

## Publish on GitHub Pages

1. Create a new repository on GitHub named exactly `Shuja848.github.io` (public).
2. Upload the contents of this folder to the repository root (`index.html`, `img/`, `Shuja_Chaudhry_PCB_Portfolio.pdf`, `.nojekyll`). The `src/`, `build-site.js` and `serve.js` files can be uploaded too, they do no harm.
3. In the repository go to Settings, then Pages, set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://shuja848.github.io`.

Command line version:

```bash
cd portfolio-site
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/Shuja848/Shuja848.github.io.git
git push -u origin main
```

Deep links work, so you can send a client straight to one project, for example `https://shuja848.github.io/#project-2`.

## Editing the projects

Project text lives in `../fiverr-pcb-gig/portfolio-pdf/projects.js` and is shared with the PDF. After editing it:

```bash
node build-site.js
```

This rewrites `index.html`. Styles are in `src/style.css` and the small script in `src/app.js`; both are inlined into `index.html` by the build.

## Local preview

```bash
node serve.js
```

Then open http://localhost:4173.
