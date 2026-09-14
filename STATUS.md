# STATUS: personal-portfolio

Written when work stopped. Read this first on return, then `3d_portfolio/README.md`
for the change-to-file table.

**Last touched:** 2026-09-14
**Branch:** `fix/deck-fits-short-windows`, PR open, work item `COD-188`. Five
squash-merged to `main` before it, in this order: `#20` the ask box (`COD-183`),
`#21` the headline (`COD-184`), `#22` the Experience deck (`COD-185`), `#23` the
WebGL field (`COD-186`), `#24` the reader's own clock (`COD-187`). All five
branches deleted.
**Live:** <https://sathishkumarai.github.io/> — GitHub Pages, built from `main` by Actions.
**Not yet deployed.** Five changes are on `main` and the site is still serving
the build from before them. `gh workflow run deploy.yml -R SathishKumarAI/SathishKumarAI.github.io`
**Working tree:** clean
**The site is `3d_portfolio/`.** Everything else here is supporting material.
**There IS 3D in it now** — `NeuralField3D.js`, three.js, hero only, desktop
only, in a chunk nobody else fetches. The folder name stopped being a joke on
2026-09-14.

## Where it stopped

Five changes in one session, then a UI sweep that found two faults in them and
fixed both. In the order a reader meets them on the page:

| | What it does now | Where |
| --- | --- | --- |
| **Headline** | `From model development to real-world impact.` The evidence promise moved down into the lede, which still carries it | `Hero.jsx` |
| **Hero field** | real 3D. Input layer on the contact dock, output on the section rail, hidden layers 170px toward the reader and 190px away; the pointer moves the camera | `NeuralField3D.js` |
| **Clock** | his three zones plus the reader's own, and the hour difference between them, read from the device | `LiveClock.jsx`, `utils/localzone.js` |
| **`Ctrl K`** | an ask box. Retrieves passages from the page's own `constants` and cites the section they live in | `CommandPalette.jsx`, `utils/answer.js` |
| **Experience** | four roles as a sticky deck; each card holds the screen until the next slides over it | `Experience.jsx`, `.role-sticky` in `index.css` |

**The sweep's two findings, both introduced the same day:**

- **A pinned role card taller than the screen hid its own bottom.** At 1280x620
  with the text control at 140%, 192px of a card's bullets were unreachable:
  sticky holds the card at the top while the reader scrolls past it.
  `useDeckFits` now measures and drops to a plain list when a card will not fit.
- **Half the `Ask` chip lit on hover** — `hover:text-accent` did not reach the
  span holding the shortcut, so "Ask" went red and "Ctrl K" stayed grey.

Everything else checked clean: 113 interactive elements, six palettes (no
contrast failures), hover and focus states, reveal animations after a scrollbar
jump, the palette's hostile inputs, the mobile menu, the copy buttons, both ends
of the text-size control, and the console.

**The traps these set, all five worth carrying:**

1. **One `overflow-x: hidden` on a wrapper above the roles turns the deck back
   into a flat list**, silently. An overflow container is also a scroll
   container and `sticky` resolves against the nearest one. `html`/`body` are
   the exception — their overflow propagates to the viewport, which is why the
   deck works over the `body { overflow-x: hidden }` already in `index.css`.
2. **three.js must stay unnamed in `manualChunks`.** Naming it puts 131kB
   gzipped into the entry graph — the phones the dynamic import exists to spare.
3. **Import three by name, never as a namespace.** `await import("three")`
   defeats tree-shaking: 191.81kB against 131.13kB for ten named classes.
4. **A canvas keeps its first context for life.** `NeuralField` must not take a
   2D context until it knows it is drawing, and the 3D module makes its own
   element, because `forceContextLoss()` poisons one for the next renderer.
5. **A comment that quotes copy goes stale when the copy does.** Changing the
   headline invalidated two component headers that justified themselves by
   quoting it.

**`npm test` exists now** and CI runs it between lint and build: 12 tests in two
files, `utils/answer.test.mjs` and `utils/localzone.test.mjs`. Before this
session there were none.

### The five, in detail

**The page answers questions now, and quotes itself doing it.** `Ctrl K` was a
list of twelve commands; it is an ask box with commands under it. Type three
characters or more and `src/utils/answer.js` searches the same `constants` the
sections render — 19 documents, one per role, degree, stack group, project, plus
the availability card — and returns the passages that match, each with the
section it lives in. `↵` jumps there.

**Nothing is generated. No key, no backend, no model call.** Every answer is a
verbatim string from `constants`, and a test asserts it by checking each
returned passage against the joined source. The reason is the page's own
argument: every number here is measured or absent, and a generated sentence
about the work is the one sentence nobody measured. It is also why this works on
Pages with the network off.

**Two ranking faults, both found by asking it a real question.** "What did he
ship on Azure" first answered with a project that does not mention Azure: long
documents win on volume, fixed with BM25's length normalisation. It was *still*
wrong, because the page says "Shipped" and a reader types "ship" — fixed with a
four-line stemmer (`-ing`, `-ed`, `-s`, then one doubled consonant, so `shipp`
→ `ship`). `test_ship_matches_shipped` exists because the first fix alone did
not hold.

**The trap here: an alias table is not optional.** `hire`, `job`, `available`
appear nowhere on this site, so "are you available for hire" retrieved *nothing*
until six aliases were added. The words a reader arrives with are not the words
the page uses, and a headline feature that returns nothing on the first natural
question is worse than no feature.

Measured on the running page: Azure question returns the AdvanSoft role first;
`↵` scrolls 0 → 1669 with the section top at 88px and restores `body.overflow`;
arrow keys cross from answers into commands in one key set; two characters show
commands only; nonsense returns one row offering the email; 390×844 DPR 3 fits
the panel at 358×490 with no sideways scroll; Preprint renders the passage at
`rgb(17,17,19)` on white. Bundle 100.22 → 103.84 kB raw, 32.77 → 34.18 kB
gzipped, both builds made in the same tree. `npm test` is 7/7 and CI runs it
between lint and build.

**Before this branch, on `main`:**

**The nav bar no longer returns on a twitch.** It hides on a deliberate
downward push (12px in one frame) and used to come back on 2px of upward
movement, which meant any nudge while reading slid 77px of bar in and out at the
top of the eyeline. The return is now hysteretic: upward movement has to
accumulate 200px — two mouse-wheel notches, or a thumb swipe — before the bar
comes back, and **any downward movement zeroes that total**, so jitter in both
directions never sums to a return.

Measured on the built bundle at 1280x720: scrolled down to y=1600 the bar is
`-translate-y-full`; 50, 100 and 150px of upward movement leave it hidden; at
210px it shows. Eight rounds of (up 50 / down 20) — 400px of upward movement
in total — leave it hidden, and a single 250px upward swipe shows it. The other
four guards are unchanged and re-verified: y<=160 always shows, a jump the
reader asked for never hides, focus inside the bar shows it, the mobile menu
shows it.

**Stack was redesigned.** It was a 3x2 grid of glass cards whose only heading
was a 12px uppercase red label, and the intro paragraph's claim — that the six
groups sit in order on a path from raw data to a running product — was stated in
words and then thrown away by a grid that shows six equals.

Three things now carry that claim:

| | |
| --- | --- |
| **The pipeline rail** above the grid | six tinted segments between `raw data` and `running product`. The hovered group's segment brightens and doubles in height, so a card says where on the path it sits. `aria-hidden`: it is a picture of what the intro already says in words |
| **A stage numeral** `01`–`06` on every card and every phone row | the same ordering, in the one place a reader looks after the title |
| **A cursor spotlight** in the group's own colour | `--mx`/`--my` written imperatively to the card node on pointermove, read by `.stack-card::before` |

The card heading moved from 12px uppercase accent-red to 17px display
semibold, so the hierarchy inside a card finally runs heading > note > tools
instead of three near-equal bands.

**One colour, two forms.** Each group now carries `dot` (a literal Tailwind
class, because Tailwind scans for literal strings) *and* `tint` (the raw
`--c-cat-*` variable name, because `rgb(var(...) / 0.46)` cannot be recovered
from a class). They are declared adjacent so they cannot drift apart unnoticed.

**The trap here: do not put `overflow: hidden` on the card.** Clipping the
spotlight that way also clips the glossary panel TagTerm opens below a chip,
which is the entire point of the section. The pseudo-elements take
`border-radius: inherit` instead, which clips the gradient and not the content.
The second half of that: both pseudo-elements sit at `z-index: -1`, where a
negative-z child paints *above* its parent's own background and *below* the
parent's in-flow text — so the glow is in the card's material rather than over
its words.

Measured in Chrome at 1440px and 390px, both themes: `--cat` resolves per card
(`132 160 186` on Data engineering), the spotlight follows to
`radial-gradient(288px 224px at 30% 40%, rgba(132,160,186,0.46) …)`, the border
tints to `rgba(132,160,186,0.55)`, the rail reads `["1","0.16","0.16","0.16",
"0.16","0.16"]` with card 1 active, the glossary panel renders fully outside the
card, and `scrollWidth === clientWidth` on the phone.

The site is live, merged to `main`, and verified at seven viewport widths in
both themes and at both ends of the text-size control. There is no work in
flight and nothing half-applied.

**There is CI now, and that is the biggest change of the three.**
`.github/workflows/ci.yml` runs install, lint, build and the crawler-file guard
on every PR to `main` and every push to `main` — the same four steps, same order,
same Node 22 as the deploy in the other repo, so the two cannot disagree about
what green means. Before it, **this repository had no workflow at all**: nine PRs
merged in one day with nothing checking them but a human reading the diff.

The guard was proven to fail, not just to pass: against a copy of `dist`, a
deleted `llms.txt`, a zero-byte `og.png` and a stripped JSON-LD each exit 1,
and an intact tree exits 0. A check that has only ever passed is not yet a check.

Two small ones with it: **`Quote.jsx` deleted** (dead, and the bundle already had
zero occurrences of its `figcaption`, so Rollup had tree-shaken it and the
deletion changed the shipped output not at all), and **the theme change fades**
rather than cutting — `.theme-switching` on `<html>` for 260ms, scoped to the
moment of the change because a permanent global colour transition would animate
every hover too.

**The trap in that last one is worth carrying:** the reduced-motion override has
to be placed AFTER the fade rule. The global reduced-motion reset near the top of
`index.css` is `!important` too, and between two equally important, equally
specific rules the later one wins — without the ordering, adding a fade quietly
re-enables motion for readers who asked for none.

The docs were also brought back in line with the code (`README`, the components
README, `TYPE-AUDIT`), which had drifted through a day of redesigns.

Before those, `feat/reading-themes` squash-merged and deleted: **six palettes, not two.**
Slate and Ink (dark), Paper, Manuscript, Clarity and Preprint (light). Preprint
is an arXiv/IEEE page and its accent is `#B31B1B`, arXiv's own Cornell red,
which sits in the same family as this site's lava red.

**`data-scheme` is the new second axis.** Every structural rule — glass shadows,
bloom, grain — keys off it, so a palette declares light-or-dark once in the
`themes` registry and inherits the rest. Those rules used to read
`:not([data-theme="dark"])`, which stops being true at the third palette.

**The content is identical in all six**, deliberately. The ask was for themes
"from the mindset of" a recruiter, a professor, a hiring manager; what varies is
the reading condition, never the claims. A portfolio that shows different people
different facts is not a theme.

Every palette measured for contrast rather than derived — all six clear AA for
text and 3.0 for control boundaries; the table is in the WORKLOG.

**Two traps this set:** a nested element cannot opt into another palette
(`:root[data-theme=...]` only ever matches the document root, so themed swatches
must paint from stored values), and **a bare `<span>` is inline, so it ignores
width** — the swatches rendered 2px wide until they were given `block`.

Before it, `redesign/premium-dark` squash-merged and deleted. Feedback was "looks like a
website from 1990"; it did not, it looked like **2020 developer-brand**, which
is a different and more fixable problem. Four causes, none of them the content:

| Was | Now |
| --- | --- |
| Mono on nav, wordmark, status, every label | **Mono is for identifiers only** — code, URLs, repo and tool names, clocks, counts. Everything else is the sans |
| One soft shadow on cards, flat ground | Three-layer elevation, a radial bloom behind the hero, 3.5% feTurbulence grain |
| Flat saturated CTA at 6px radius | `.btn-accent` — lit gradient, coloured ambient glow, 1px hover lift |
| 33 boxed chips in Stack on a phone | Bare flowing terms; **1,364px → 1,131px, 17% shorter**, touch target kept |

**The trap this pass set:** the hero bloom shipped with a `-10%` horizontal
inset, which bled 39px past each edge and took the document to 430px wide on a
390px phone — a sideways scrollbar on every page. The mobile battery caught it.
**Any decorative element positioned with a negative inset widens the document.**

Before it, `fix/code-band-flicker` squash-merged and deleted — **the first fix in this
sequence that came from a real phone rather than an emulated viewport.** The
hero's code band flickered while scrolling, because a mobile browser collapses
its URL bar as you scroll and the hero is a viewport-height box: the slack the
band measures itself against changed by the bar's height several times per
gesture, walking it 7 lines → 5 lines → hidden and back. It now decides against
the SMALLEST room it has seen rather than the current one, and debounces, so the
answer settles once and stays. **A viewport-height box on mobile is not a fixed
height — anything measuring against one has to assume it moves.**

Before it, `refactor/less-template-more-evidence` squash-merged and deleted, after the
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

Merge `fix/deck-fits-short-windows` (`COD-188`), then **deploy** — `main` is six
changes ahead of what the live site serves. Then, in order:

0. **Say the ask box exists somewhere other than the nav chip.** A reader who
   never looks at the top right never finds it. The hero is the obvious place
   and was deliberately left alone.

1. **Safari and Firefox, and a real iPhone.** Chrome is the only browser this
   site has ever been opened in, by anyone, on purpose or otherwise. A real
   Android phone was checked on 2026-09-12 and found a flicker that nine
   emulated viewports had missed, which is the whole argument for doing the
   other two. The hide-on-scroll handler still clamps scroll position for iOS
   rubber-banding and that code has never executed on an iPhone.
2. **Per-project detail pages** (P1/L): problem, approach, result, and the line
   about what made it hard. The deepest-value thing left for a recruiter who
   clicks in.
3. **Prerendering** (P1/L), if AI-crawler visibility matters more than it does
   today. GPTBot and friends see only the `<noscript>` block; `llms.txt` is the
   deliberate answer and covers the content, but the HTML is empty to them.
4. **Decide about the 23 unprotected private repos** — GitHub Pro, or accept it.
   See `docs/REPO-SECURITY.md`.

Blocked on the owner rather than on work: project screenshots, real metric
numbers for the covers (do not invent them), testimonials, and the Vercel deploy
(`vercel login` is interactive).

### One piece of housekeeping

`redesign/de-slop-portfolio` still exists locally. It is **behind** `main`, not
ahead: its 26 commits are pre-squash-merge history whose content shipped long
ago, and the branch is missing `ci.yml`, `og.png`, `llms.txt` and 40 other files
that `main` has. Safe to delete; left alone because deleting someone's branch is
their call. `archive/pre-consolidation-2026-09-11` is deliberate and stays.

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
