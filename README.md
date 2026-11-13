# Come Home

A React and Vite practice site for breathing, sitting, reflection, sound, Samyama, and a curated spiritual-reading library. It is a static frontend: practice progress and preferences stay in the visitor's browser.

## Create a React/Vite project

These are the exact commands for creating the same JavaScript project from scratch:

```sh
npm create vite@latest come-home -- --template react
cd come-home
npm install
npm install react-router-dom
npm run dev
```

In this existing repository, install and run it with:

```sh
npm install
npm run dev
npm run build
```

Vite prints the local development URL. The production build is written to `dist/`.

## Project map

- `src/App.jsx` mounts the app with `HashRouter` so every page works after a GitHub Pages refresh.
- `src/app/AppShell.jsx` owns shared practice, preference, timer, and audio state; shared playback stays mounted between routes.
- `src/modules/<page>/` keeps each page's component and its own content data together. Samyama and the reading library also have matching stylesheets.
- `src/shared/components/` contains the header, navigation, footer, and reusable phrase and wisdom views.
- `src/index.css` contains the shared theme, responsive layout, and reduced-motion behavior.
- `public/` is for static assets. Vite's `base` is `/self/` for the current GitHub Pages repository.
- `.github/workflows/deploy.yml` is already configured to build and publish `dist/` on pushes to `main`; leave it unchanged.

## Reference material

Treat files in `refer data/` as temporary source material. Integrate useful ideas in original wording, keep source references, and avoid reproducing long copyrighted passages. Present spiritual and frequency claims as traditional beliefs or modern associations, not proven outcomes. Do not promise health, financial, or supernatural results. Once reviewed and integrated, remove the consumed files while preserving `.gitkeep`.
