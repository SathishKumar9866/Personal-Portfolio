# src/assets: UNUSED

**Nothing in this directory is imported by the site.** Verified 2026-09-11:
`grep -rn 'from "../assets"' src/` returns only `assets/index.js` referencing itself.

These are leftovers from the original 3D template this repo was forked from, the one the `3d_portfolio` folder name still refers to, and whose three.js stack
was removed (see `docs/WORKLOG.md`).

| What | Why it is dead |
|---|---|
| `carrent.png`, `jobit.png`, `tripguide.png` (3.4 MB) | Template demo projects. Not your work. |
| `herobg.png` (930 KB) | Old hero background. The hero is now a CSS gradient (`.hero-bg`, `index.css`). |
| `company/`: meta, shopify, starbucks, tesla | Template employers. No relationship to this site. |
| `tech/`: 13 icons | Superseded by `TagTerm`, which renders text chips with definitions. |
| `index.js` | Barrel re-exporting all of the above. Imported by nothing. |

**Cost:** ~5.9 MB in every clone. **Runtime cost: zero**. Vite never bundles them,
because nothing imports the barrel.

Kept deliberately rather than deleted, on the owner's instruction. If you are
looking for an image the site actually uses, it is in `public/`:
`headshot.jpg`, `og.png`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`,
`icon-512.png`.

Project covers are **drawn**, not photographed, see the canvas drawing functions
at the top of `src/components/Works.jsx`.
