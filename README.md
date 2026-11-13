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
- `src/app/AppShell.jsx` owns shared practice, preference, timer, and audio state; YouTube can be paused independently, and a running breathing practice continues for one minute after leaving its page, then pauses.
- `src/modules/<page>/` keeps each page's component, visual styles, and content data together.
- `src/shared/components/` contains the header, navigation, footer, reusable phrase and wisdom views, and the persistent cross-page audio/practice dock.
- The header's chime control enables gentle breathing-phase and sitting-practice sounds. Do Not Disturb quiets this site's practice sounds and haptic cues; browser and device notifications must be managed in device settings.
- `src/modules/samyama/sadhana/` is a separate, private-by-default question → personal words → three-stage practice flow. The reflection itself is not saved; only completed practice counts are stored locally.
- `src/theme/tokens.css` is the separate light/dark palette and design-token file; edit it to restyle the whole site without changing page content.
- `src/theme/motion.css` contains shared animations and reduced-motion behavior, separate from the theme palette.
- `src/index.css` contains shared typography, surfaces, and responsive foundations. Component and page styles live beside their components.
- `public/` is for static assets. Vite's `base` is `/self/` for the current GitHub Pages repository.
- `.github/workflows/deploy.yml` is already configured to build and publish `dist/` on pushes to `main`; leave it unchanged.

## Reference material

Treat files in `refer data/` as temporary source material. Integrate useful ideas in original wording, keep source references, and avoid reproducing long copyrighted passages. Present spiritual and frequency claims as traditional beliefs or modern associations, not proven outcomes. Do not promise health, financial, or supernatural results. Once reviewed and integrated, remove the consumed files while preserving `.gitkeep`.
