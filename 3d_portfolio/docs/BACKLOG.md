# Feature backlog

Future work for the portfolio, as tickets. Priority: **P0** ship-blockers,
**P1** high-value, **P2** nice-to-have. Effort: S / M / L. Status: `[ ]` todo,
`[~]` needs input, `[x]` done.

> Current state: Databricks-style site, light/dark, type-led hero, domain-specific
> animated project covers, two-tier Stack chips, AI-crawler surface in place.
> Branch `redesign/highway-premium`.

---

## Ship / deploy

- [x] **(P0, S) ~~Push branch + open PR.~~** Done 2026-09-11: PR #4 open against `main`. Blocked on `gh auth login` (token expired).
- [~] **(P0, M) Deploy to Vercel.** Zero-config for this Vite app. Yields the
  production URL that unblocks the tickets below. *Blocked 2026-09-11:
  `npx vercel whoami` returns `Logged out` and `vercel login` is interactive, so
  it has to be run by the owner. Deploy from the subdirectory
  (`npx vercel --cwd 3d_portfolio`) or set Root Directory to `3d_portfolio` if
  importing the repo in the dashboard: the site is not at the repo root.*
- [x] **(P0, S) ~~Set the real canonical domain.~~** Done 2026-09-11:
  <https://sathishkumarai.github.io/>. The canonical, `og:url`, `og:image`,
  `twitter:image` and the JSON-LD `url`/`image` are the only place the domain is
  hard-coded, and `index.html` says so, so moving to a Vercel address later is
  those lines and nothing else.
- [x] **(P0, M) ~~Deploy to GitHub Pages.~~** Done 2026-09-11: live at
  <https://sathishkumarai.github.io/>, built by Actions in the
  `SathishKumarAI.github.io` repo, which holds no site code. That repo name is
  load-bearing: only `<user>.github.io` serves from the domain root, which keeps
  Vite's `base` at `/` so one build serves both Pages and Vercel.
- [ ] **(P0, S) Flip `SOURCE_REF` to `main`** in
  `SathishKumarAI.github.io/.github/workflows/deploy.yml` once PR #4 is
  squash-merged. It builds from `redesign/highway-premium` today, which works
  but will silently stop tracking `main`.
- [x] **(P1, S) ~~`sitemap.xml`~~** Declined 2026-09-11, reasoning recorded in
  `public/robots.txt`: this is a single page with in-page anchors, so a sitemap
  would carry exactly one URL and tell a crawler nothing it does not already
  have. Reopen the day the site grows real routes.
- [ ] **(P1, M) Cross-browser + real-device QA**, Safari, Firefox, real iOS /
  Android. Only Chrome tested so far (emulated 390/820/1440).

## Content the owner must supply

- [~] **(P1, M) Real project screenshots / GIFs (option A).** Drop images into
  `public/`; layer them over the generative covers for the top 1, 2 projects.
  Highest credibility. *Needs assets from Sathish.*
- [x] **(P1, S) ~~Add EmailJS keys.~~** Dropped 2026-09-11, the contact form
  was removed in favour of a copyable address and an icon row, so there is
  nothing left to key.
- [x] **(P1, S) ~~Confirm LinkedIn slug + contact email.~~** Done 2026-09-11: canonical slug is lowercase `sathishkumarai`, from the owner's own saved profile (72 occurrences, zero for mixed case). HTTP cannot settle it; LinkedIn answers both with 999. Original note: are current (LinkedIn
  blocks bot verification; email deliverability untestable here).
- [~] **(P2, M) Metric covers (option E).** Show a real chart per project
  (retrieval recall, detection mAP, latency). *Needs real numbers: don't fake.*
- [~] **(P2, S) Testimonials.** *Needs real quotes.*

## Features

- [ ] **(P1, L) Per-project detail pages / modals.** problem → approach → result,
  with the "what made it hard" line. Deep dive for recruiters who click in.
- [ ] **(P2, M) Live iframe embed (option D)** for `pickleball-shuffle` (it's live).
- [ ] **(P2, L) Writing / blog section.** Short posts on shipping ML to prod, reinforces the hero thesis.
- [ ] **(P2, S) Résumé / CV download** button in the hero or footer.
- [ ] **(P2, S) "Now" / current-focus line**, what he's building this month.
- [ ] **(P2, M) Hover-reveal on Stack tools**, where each tool was used (link to
  the project that uses it).
- [x] **(P2, S) ~~Rotating / more quotes.~~** Cancelled 2026-09-11: the three interstitial quotes were removed. They were the largest type on the page after the h1, larger than any project title, and sat between the reader and the work.

## Polish

- [x] **(P1, S) ~~Light-mode contrast audit.~~** Done 2026-09-11: the accent's role was split rather than its colour changed. `--c-accent` fills, `--c-accent-ink` reads as text. 22 pairs measured from the built stylesheet, all AA in both themes. Small red text (`#FF3621`) on white
  is ~3.5:1: fine for large headings (AA large), below AA for small body/eyebrow
  text. Consider a darker red token for small text, or navy.
- [ ] **(P2, S) Smooth theme-toggle transition** on panels/borders (currently only
  `body` fades; other surfaces flip instantly).
- [x] **(P2, M) ~~OG / Twitter share image.~~** Done 2026-09-11: `public/og.png`
  at 1200x630 plus 180/192/512 icons. Regenerated later the same day when the
  title changed, and given a source: `docs/og-card.html`. It had none, so the
  card kept saying "ML / AI Engineer" after every string on the site had been
  updated, because a grep cannot read a PNG. Still needs absolute URLs at deploy.
- [ ] **(P2, S) Section-header treatment**, the eyebrow+word pattern is fine but
  could be made more distinctly editorial if desired.

## Engineering

- [ ] **(P2, M) Reduce framer-motion footprint**, it's the largest runtime dep
  (~37KB gzip). Replace simple reveals/hovers with CSS where possible.
- [ ] **(P2, S) Preload the primary font weights** (Barlow 400/700) to cut FOUT.
- [ ] **(P2, S) CI:** GitHub Action for build + lint + a Lighthouse budget on PRs.
- [ ] **(P1, L) Prerender for AI crawlers.** The site is a client-rendered SPA,
  so ChatGPT-User, GPTBot and most AI crawlers see only the `<noscript>` block:
  they do not execute JavaScript. `public/llms.txt` is the deliberate answer and
  covers the content, but the HTML itself is empty to them. A build-time
  prerender (one plugin, one build step) would give them the real page. Weigh
  against the cost of a new dep and a second render path. This is a
  rearchitecture, not a refinement, which is why it was flagged rather than
  started.
- [ ] **(P2, S) Keep `llms.txt` and the JSON-LD honest.** Both are hand-written
  copies of facts that live in `src/constants/index.js`, and both now carry a
  comment naming the constant they mirror. A small check that fails when
  `stackGroups` or `education` drifts from them would make the comment
  enforceable instead of aspirational.

---

_See `docs/WORKLOG.md` for what's already shipped._
