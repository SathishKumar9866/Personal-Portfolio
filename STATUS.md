# STATUS: personal-portfolio

Written when work stopped. Read this first on return, then `3d_portfolio/README.md`
for the change-to-file table.

**Last touched:** 2026-09-12
**Branch:** `main`. `refactor/less-template-more-evidence` merged and is gone.
**Live:** <https://sathishkumarai.github.io/> — GitHub Pages, built from `main` by Actions
**Working tree:** clean
**The site is `3d_portfolio/`.** Everything else here is supporting material.
There is no 3D in it; the folder name survives from a version that had it.

## Where it stopped

The site is live, merged to `main`, and verified at seven viewport widths in
both themes and at both ends of the text-size control. There is no work in
flight and nothing half-applied.

`refactor/less-template-more-evidence` squash-merged and deleted, after the
question "does this read as AI slop". The craft did not; the skeleton did.
Three changes, and the first is the one that mattered:

| Change | Why |
| --- | --- |
| **Deleted the six About capability cards** and the `services` constant | They restated Stack's six groups in adjectives instead of tools, and they were claims on a page whose hero promises evidence. About: 1,446px → 966px |
| **Project covers build left to right as you scroll** | The diagrams are left-to-right pipelines, so they now draw in the direction they run. A `destination-out` wipe over the finished frame, NOT a build parameter through six 250-line drawers |
| **Section eyebrows carry derived facts** | `4 roles · since 2020`, `6 areas · 33 tools`, `6 built · 1 live`, `4 routes · US Central`. All computed from the data, so none can go stale. Trailing full stops gone; `SectionHead.jsx` owns the shape |

**Still the default section names** — Overview, Experience, Stack, Projects,
Contact. Renaming those is writing his copy, and was left alone.

Before it, `feat/availability-stacked-facts` squash-merged and deleted: the "Open to work"
card is a stack of grouped facts instead of six evenly spaced rows, with the
parts that were one sentence given a line each, plus a per-fact stagger, a rule
that draws under each label, and a rail that fills as the card crosses the
screen. **It also fixed a reduced-motion claim that had been false since the
card was written:** the `prefers-reduced-motion` block in index.css zeroes CSS
`animation-duration` and `transition-duration` only, and framer writes `opacity`
and `y` as inline styles from its own rAF loop, so those were never neutralised
— the facts still slid 8px. `initial={reduced ? false : "hidden"}` is what stops
framer, and Hero.jsx was already doing it. **Assume nothing about that CSS block
covering framer.**

Before it, `feat/hero-code-completion-band` squash-merged and deleted: the hero's lower
slack on a phone — 253px of it at 390x844, and 331px from the last hero element
to "Overview" — now holds a Python binary search being completed and then run,
cycling found / missing / empty so the guard clause is always seen earning its
place. It **measures whether it fits** rather than trusting a breakpoint,
because the reader's text-size control changes the slack without changing
anything a media query can see. It spends what it measures on lines of the
function, 4 to 7 of them, and hides only when even four will not fit: at 112%
that is a 5-line window, where the first version hid itself over a single pixel.
The division cannot oscillate because neither of its terms depends on the
current line count — see the WORKLOG. Drawn with no check at all at 360x640 it
overlapped the lede by 156px.

Before it, `fix/mobile-layout-and-nav` squash-merged and deleted, four commits,
all four phone-layout faults found by measuring the running page. Full reasoning in
`3d_portfolio/docs/WORKLOG.md`, the 2026-09-12 entry headed "four layout faults
on a phone":

| What | Where it lives now |
| --- | --- |
| Contact rows sized by the card, not the viewport — a container query, threshold in `em` so it follows the A+ control | `.contact-row` in `src/index.css` |
| The nav bar stops hiding during a jump the reader asked for; `section-jump` for the two jumps that change no hash | `Navbar.jsx`, `CommandPalette.jsx`, `SideRail.jsx` |
| The Stack glossary panel is clamped inside the viewport instead of centred off the edge of it | `TagTerm.jsx` |
| The mobile menu stops clipping its own top, and its close button stops scrolling away | `Navbar.jsx` |
| One `readable()` for a URL printed to a human, was four copies that had drifted | `icons.js` |

**Two traps that cost real time here, both about what a box is measured
against.** A container query resolves `em` against the *container's*
font-size — that is the only reason the contact breakpoint can follow
`--type-scale`, which never touches the root font size. And a `backdrop-filter`
makes its element the containing block for `position: fixed` descendants, which
is why the menu's close button kept scrolling until the blur came off.

Before that, `redesign/highway-premium` squash-merged as `630a38f` (81 commits),
branch deleted, then six commits on `main`, all shipped and deployed:

| Commit | What |
| --- | --- |
| `4b0c58f` | Hamburger present at every width; nav stops hiding itself on a phone; page stops scrolling sideways |
| `632b392` | Fluid type and padding; Stack becomes one block on a phone; Collaborate moves to the end and off mobile |
| `dd2c5c1` | Overview text was being clipped mid-word; justification limited to wide measures |
| `8fad65f` | Crawler notice off the phone's reading flow |
| `0c8b15d` | CTA starts at Experience; two disclosures that earned nothing removed |
| `d9e8a7f` | Anchor landing, stacked contact rows, heavier body text on phones, token wave on mobile |

## The next action

Nothing is blocking. The highest-value things left, in order:

1. **Real-device QA on iOS and Android.** Everything so far is Chrome with
   emulated viewports. The hide-on-scroll handler clamps scroll position
   specifically for iOS rubber-banding and that has never run on a real iPhone.
2. **Decide about the 23 unprotected private repos** — GitHub Pro, or accept it.
   See `docs/REPO-SECURITY.md`.
3. **Prerendering**, if AI-crawler visibility matters more than it does today.
   Filed P1/L in `3d_portfolio/docs/BACKLOG.md`.

## How the deploy works

Two repos, one source of truth.

- **`Personal-Portfolio`** holds the site, in `3d_portfolio/`. Edit here.
- **`SathishKumarAI.github.io`** holds no site code. It exists only because a
  repo named exactly `<user>.github.io` is served from the domain root, which
  keeps Vite's `base` at `/` so one build serves both Pages and Vercel.

Its workflow checks out this repo at `SOURCE_REF` (now `main`), builds
`3d_portfolio/`, fails if `robots.txt`, `llms.txt`, `og.png` or the JSON-LD are
missing from `dist/`, and publishes.

**A push here cannot trigger that workflow** — the source is a different
repository. Deploy on demand:

```bash
gh workflow run deploy.yml -R SathishKumarAI/SathishKumarAI.github.io
```

Pages serves through a CDN, so a fresh deploy can take a minute to appear. Add a
cache-busting query (`?v=2`) when checking, or you will verify the old bundle
and believe the deploy failed.

**Vercel is still not set up.** `npx vercel whoami` returns `Logged out` and the
login is interactive. If a Vercel URL ever becomes the primary address, six
absolute URLs in `3d_portfolio/index.html` change together and nothing else
does; a comment in that file says so.

## Traps, each one already paid for

- **The site is not at the repo root.** Vercel needs `--cwd 3d_portfolio`, or
  Root Directory set to `3d_portfolio` in the dashboard.
- **A `tailwind.config.js` change needs a dev-server restart.** Vite will not
  pick up new tokens on HMR; the classes silently resolve to nothing and you
  measure transparent backgrounds or 16px fallback type and wonder why. Cost
  two debugging detours this session alone.
- **`fixed` breaks inside a transformed ancestor.** A transformed element
  becomes the containing block for its fixed descendants. This is what made the
  mobile menu 192px tall instead of full-screen for weeks. If something
  `fixed` is mis-sized, look up the tree for a `transform`.
- **Never reach for `overflow-x: hidden` to stop sideways scroll.** It hides the
  symptom at every width and breaks `position: sticky` anywhere inside, because
  an overflow container is also a scroll container. The career diagram in
  Experience depends on sticky. Find the element that is too wide instead.
- **A grid item will not shrink below its content's min-content width.** Default
  `min-width: auto`. One `whitespace-nowrap` on a long string held a card 38px
  wider than its column and clipped the text beside it. `min-w-0` on the item
  and `minmax(0,1fr)` on the track are the fix.
- **Framer-motion variants only propagate through motion components.** A plain
  `<div>` between an animated parent and its children cuts the chain and the
  children render at opacity 0, with nothing logged.
- **Do not trust a canvas measurement taken right after `scrollIntoView`.** The
  covers pause off-screen and clear on resize, so an early reading shows 0 ink
  on a cover that is fine. Scroll, wait ~900ms, then measure.
- **`while read` drops a final line with no trailing newline.** It silently
  skipped one repo out of 49 during the protection run. Reconcile results
  against the input list, not against the loop's own success count.
- **`.gitignore` must stay ASCII.** It was corrupted once by a PowerShell `>>`
  writing UTF-16LE; git stops parsing at the first NUL byte.
- **`3d_portfolio/read.md` is historical. Do not run it.**
- **A grep cannot read a PNG.** `public/og.png` kept an old job title through a
  whole rename. Its source is `3d_portfolio/docs/og-card.html`; regenerate it
  whenever the title or tagline changes.

## What is deliberately not done

- **No sitemap.** One page with in-page anchors. Reasoning is in
  `public/robots.txt`.
- **No prerendering**, so AI crawlers see only `<noscript>`. `public/llms.txt` is
  the deliberate answer.
- **`NeuralField` is desktop-only and stays that way.** Every node is read from
  `getBoundingClientRect()` on the two edge docks, which exist only from 1024px.
  Below that there is nothing to read, and inventing coordinates would
  contradict the one claim that makes it a diagram rather than decoration.
- **No enforced PR workflow.** Impossible on a personal account without locking
  the owner out; see `docs/REPO-SECURITY.md`.
- **`llms.txt` and the JSON-LD are hand-written copies** of facts in
  `src/constants/index.js`. Both carry a comment naming what they mirror.

## Where the rest of the reasoning lives

| Question | File |
| --- | --- |
| What changed, when, and what was measured | `3d_portfolio/docs/WORKLOG.md` |
| What is left, as tickets | `3d_portfolio/docs/BACKLOG.md` |
| Why the type is the size it is | `3d_portfolio/docs/TYPE-AUDIT.md` |
| What a phone gets and a desktop does not | `3d_portfolio/README.md`, "What a phone gets" |
| Which file to open for a given change | `3d_portfolio/README.md` |
| Which component owns what | `3d_portfolio/src/components/README.md` |
| Branch protection across the account | `docs/REPO-SECURITY.md` |
| How to contribute, and LLM-written patches | `CONTRIBUTING.md` |
| Where the five earlier drafts went | `README.md` |
