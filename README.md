Be concise. Prioritize output over explanation.

- For coding tasks, give the working code first. Then add at most 3 short bullets on key decisions or caveats.
- Do not restate my question or summarize the task.
- Do not add greetings, praise, or closing offers.
- Give one solution. Mention an alternative only if the first has a real limitation.
- For edits, show only the changed functions or lines with file and location, not the entire file.
- Comment only non-obvious logic. No docstrings unless I ask.
- Do only what I asked. Suggest extras (tests, refactors, edge cases) in one line at the end.
- Explain theory or reasoning only when I ask "why" or "explain."
- If my request is ambiguous, ask one clarifying question instead of guessing at length.

## Project instructions

- Read this file before each project task and follow it as the primary project guide.
- Keep practice copy and reusable reference-derived content in `content.js`, page structure in `index.html`, styling in `styles.css`, and behavior in `app.js`.
- Treat files in `refer data/` as temporary source material: review them, integrate only useful details in original wording, then remove consumed files while keeping the folder (tracked with `.gitkeep`).
- Preserve spiritual context. Mark traditional or modern frequency claims as beliefs or associations; do not promise health, financial, or supernatural results or reproduce long copyrighted passages.
- Keep tools, dependencies, and explanations lean. Run `node --check app.js` and the available site checks before a requested push.
- Make thoughtful improvements that fit the brief without unrelated scope changes.

## Site

Come Home is a React application built with Vite. Start it locally with:

```sh
npm install
npm run dev
```

Vite prints the local URL in the terminal. Create a production build with `npm run build`; the output is written to `dist/`.

- `src/components/` contains the reusable header, navigation, footer, and practice sections.
- `src/data.js` contains practice copy and reference-derived data.
- `src/index.css` preserves the responsive theme and motion.
- `src/App.jsx` manages interaction, sessions, saved progress, and audio behavior.
- `vite.config.js` sets the GitHub Pages base path to `/self/`.
- `.github/workflows/deploy.yml` installs dependencies, builds the app, and publishes `dist/` to GitHub Pages after pushes to `main`. Set the repository's Pages source to **GitHub Actions** if it is not already enabled.
