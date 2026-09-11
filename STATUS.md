# STATUS: personal-portfolio

Written when work stopped. Read this first on return, then `3d_portfolio/README.md`
for the change-to-file table.

**Last touched:** 2026-09-11
**Branch:** `redesign/highway-premium`, 71 commits ahead of `main`, pushed
**Working tree:** clean
**The site is `3d_portfolio/`.** Everything else in this directory is supporting
material. There is no 3D in it; the folder name survives from a version that had it.

## Where it stopped

The site is feature-complete and verified, and **not deployed anywhere**. That is
the only thing standing between this branch and being done.

Four commits landed in the last session:

| Commit | What |
| --- | --- |
| `f6f6cea` | RAG project cover drawn (it was shipping an empty panel), federated cover animates a full round both ways, GitHub icon on repo links |
| `8037811` | Stack: two chip tiers, six category dots, chip row anchored to the card bottom, one column under `md`, second-tap dismiss on definitions |
| `a92ca51` | 16 AI crawlers answered by name in `robots.txt`, Stack and Education added to `llms.txt`, JSON-LD widened |
| `4924be9` | One title everywhere, "AI Engineer". `og.png` regenerated and given a source at `docs/og-card.html` |

## The next action

Deploy. It is blocked on one interactive step that only the owner can run:

```bash
npx vercel login                    # interactive, cannot be automated
npx vercel --cwd 3d_portfolio       # preview
npx vercel --prod --cwd 3d_portfolio
```

`npx vercel whoami` currently returns `Logged out`.

Then, immediately after, three TODOs in `3d_portfolio/index.html` unblock and
should go in one commit:

1. `og:image` and `twitter:image` to absolute URLs. X ignores relative ones, so
   social cards are broken until this is done.
2. `og:url`.
3. The canonical `<link>`, currently commented out.

Then open the PR for the branch. There isn't one yet for this run of work.

## Traps, each one already paid for

- **The site is not at the repo root.** Vercel needs `--cwd 3d_portfolio`, or
  Root Directory set to `3d_portfolio` when importing the repo in the dashboard.
  Deploying the root gives you a directory listing.
- **`node_modules` installed under Linux will not work on Windows** and vice
  versa: no `.bin` shims and none of the platform binaries
  (`@rollup/rollup-win32-x64-msvc`, `@esbuild/win32-x64`). Re-run
  `npm install` on the machine you are building on.
- **A change to `tailwind.config.js` needs a dev-server restart.** Vite will not
  pick up new colour tokens on HMR; the classes silently resolve to nothing and
  you will measure transparent backgrounds and wonder why. Cost 20 minutes once.
- **Do not trust a canvas measurement taken right after `scrollIntoView`.** The
  project covers pause when off-screen via `IntersectionObserver` and clear on
  resize, so a reading taken too early shows 0 ink on a cover that is fine.
  Scroll, wait ~900ms, then measure.
- **`hover:shadow-*` utilities do not work on `.glass-card` in light mode.** The
  `:root:not([data-theme="dark"]) .glass-card` rule is specificity 0,3,0 and
  outranks a 0,2,0 utility. Card hover states belong in `index.css` next to the
  material. See `.card-lift`.
- **`.gitignore` must stay ASCII.** It was corrupted once by a PowerShell `>>`
  writing UTF-16LE; git stops parsing at the first NUL byte, so every rule after
  that point silently did nothing. Append with `printf` or an editor.
- **`3d_portfolio/read.md` is historical. Do not run it.** It reinstalls the
  three.js stack that was deliberately removed.
- **A grep cannot read a PNG.** `public/og.png` kept the old job title through a
  whole rename because it is an image. It now has a source at
  `docs/og-card.html`; regenerate it whenever the title or the tagline changes.

## What is deliberately not done

- **No sitemap.** One page with in-page anchors, so it would carry exactly one
  URL. The reasoning is written into `public/robots.txt`. Reopen if real routes
  appear.
- **No prerendering, so AI crawlers see only `<noscript>`.** This is a
  client-rendered SPA and GPTBot, ChatGPT-User and friends do not execute
  JavaScript. `public/llms.txt` is the deliberate answer and carries the real
  content. A build-time prerender is filed in `docs/BACKLOG.md` as P1/L; it is a
  rearchitecture, not a refinement.
- **`Contact.jsx` still says "data engineering, data science, ML, and AI
  engineering roles"** while the title everywhere else is now just "AI Engineer".
  That is on purpose: what he calls himself and what he will be hired for are
  different decisions, and that sentence is the only place the second is stated.
- **No GitHub Pages deploy.** If one is wanted, note that this repo is
  `Personal-Portfolio`, so Pages serves it from `/Personal-Portfolio/` and Vite
  needs a matching `base`. Only a repo named exactly `SathishKumarAI.github.io`
  serves from the domain root.

## Where the rest of the reasoning lives

| Question | File |
| --- | --- |
| What changed, when, and what was measured | `3d_portfolio/docs/WORKLOG.md` |
| What is left, as tickets | `3d_portfolio/docs/BACKLOG.md` |
| Which file to open for a given change | `3d_portfolio/README.md` |
| Which component owns what | `3d_portfolio/src/components/README.md` |
| Where the five earlier drafts went | `README.md` |
