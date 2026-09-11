# Highway portfolio — design

**Date:** 2026-09-11
**Branch:** `redesign/highway-premium` (cut from `redesign/de-slop-portfolio`, 26 commits ahead of `main`)
**Status:** approved in chat. Contact/footer/photo-slot pass shipped 2026-09-11; rail, routes and Work tiers not yet built.

## Why

The site reads as a competent single scroll with six sections. Three things are
wrong with it as a hiring artifact:

1. **No spine.** Sections are stacked, not routed. Nothing tells a visitor where
   they are, how far in they got, or what is left.
2. **Work does not scale.** Six flat cards was already a wall. It is now twelve
   projects, and twelve equal cards means none of them reads as important.
3. **Nothing is linkable.** A recruiter who wants to send one project to a
   hiring manager can only send the whole page.

## Goals

- One legible route through the content, with a visible position indicator.
- Project depth that survives being sent to a stranger: real URLs, real detail.
- More motion, with each tier of it paying for its own weight.
- Every claim on the page traceable to something real — a repo, a deploy, a
  measured number, or nothing at all.

## Non-goals

- No CMS, no backend, no auth. Static build, static host.
- No new UI framework, component library, or router dependency.
- No 3D. The repo is named `3d_portfolio` for historical reasons only.
- No redesign of the color system or type scale. Both are good and stay.

## Decisions

Each of these was decided with the owner; the reasoning is recorded so a later
session does not relitigate it.

| Decision | Choice | Why |
|---|---|---|
| Highway meaning | Route metaphor **and** structural contract | A quiet visual spine carries identity; the zone contract does the structural work. Metaphor alone would be a gimmick. |
| Routing | History API, ~40-line hook, no dependency | Hash routing would fight the existing `#section` anchors. A router dep buys nothing for 4 static routes. |
| Work density | Three tiers: Featured 4 / Shipped 3 / Also 5 | Twelve equal cards flatten importance. Tiers restore it. |
| `ai-due-diligence-copilot` | Demoted to Also | One of three siblings sharing one engine. Showing all three as peers triples one story. |
| `paper-code-gen` | Also tier, no code link | Pushed **private** on 2026-09-11. Card carries no repo link until the owner flips it public. |
| `rag-project` | **Not** published | It is a workspace folder holding five already-published repos, 6.6 GB, no `.gitignore`, and a live `.env`. Publishing it would leak a credential. Link the two unlisted siblings instead. |
| Live proof | Recorded clip now, real embed after deploy | `pb-card-deck` sends `X-Frame-Options: DENY` and `frame-ancestors 'none'`. Verified 2026-09-11 via response headers. |
| Deploy | After the redesign lands | Owner's call. Domain-dependent work (canonical URL, sitemap, OG image, frame-ancestors) is sequenced behind it. |
| Photo | In About, not the hero | Matches the inspiration reference; keeps the type-led hero uncluttered. |
| Résumé button | Dropped | Owner's call. Contact carries email and LinkedIn. |
| Direction | Footnotes for the narrative, highway for Work | Owner's call, 2026-09-11. See "Two ideas, one page" below — including the risk the owner accepted. |

## Two ideas, one page

The archived `sathishkumarai.github.io` carried a `docs/DECISIONS.md` that opened with
"Read this before redesigning anything." It is now at
`~/coding/archive/portfolio-github-pages-annotated`. Its reasoning is copied here because
a spec that contradicts an archived decision without acknowledging it is how the same
mistake gets made twice.

**Its one idea.** The work is about grounding — retrieval that cites its source, outputs a
person can check. So the page does the same thing it describes: a claim in the opening is
highlighted, carries an `[nn]` marker, and opening it retrieves the project the claim rests
on into the margin, where a source belongs. The `[01]`-`[15]` numbering indexes real
entries; renumbering an entry changes what the opening cites. Each highlight is a real
anchor, so with JavaScript off a click still lands the reader on the source.

**Its warning**, which this spec is deliberately going against: *"When a change would
compete with it, the change loses. A second bold thing does not make the page twice as
interesting; it makes the first thing half as clear."*

**What was decided anyway.** Both, split by region:

- **Narrative regions** (hero, About) use the citation mechanic. Claims carry `[nn]`
  markers that retrieve the backing project. This is the page's one loud idea.
- **Work** uses the highway tiering and detail routes. Twelve projects is a density
  problem the citation mechanic does not solve.

**The accepted risk, stated plainly:** two structural ideas on one page can blunt each
other, exactly as the archived note warns. The mitigation is that they never appear in the
same region — by the time a reader reaches Work, the citation apparatus has done its job
and stops. If, once built, the page reads as two designs stapled together, the citation
mechanic wins and the rail goes. That is the tie-breaker, decided now rather than mid-build.

**Also worth keeping from that file:** generation 2 was abandoned for being "the current
house style of generated UI — every element a default rather than a choice." Rounded cards,
outlined tag chips, uniform radii, grid-with-fade backdrop. The current site still uses
uniform `rounded-2xl` on every panel. That is the same smell, and this redesign should not
reproduce it.

## Architecture

### The road

A sticky full-height left rail, replacing the current top-hairline
`ScrollProgress`. One instrument, not two.

```
 ▲ 0%              progress fill, scroll-driven
 │
 ●  01  ABOUT      markers: filled = passed, ringed = current
 │
 ●  02  STACK
 │
 ●  03  WORK  ───► exits branch right into /work/<slug>
 │
 ●  04  NEWS
 │
 ●  05  CONTACT
 ▼ 100%
```

Exits are numbered from the sections that actually render. Writing is blocked
on real posts; when they exist it becomes exit 05 and Contact renumbers to 06.
Markers are generated from the rendered section list, never hardcoded, so this
costs nothing.

- Collapses to the existing hairline below `sm`.
- Reuses the `IntersectionObserver` already in `Navbar.jsx`. One observer, two
  consumers — not a second observer.
- On a detail route the spine greys out and one lit spur marks the current
  project, so leaving the main road is visible.
- Reduced motion: fill jumps rather than tweens, markers unchanged. The rail is
  still fully functional with zero animation.

### Zone contract

Every section, same three zones, so the page has a rhythm instead of six
card grids in a row.

| Zone | Holds | Example — Work |
|---|---|---|
| Orient | exit marker, eyebrow, headline, one-sentence lede | "EXIT 03 · WORK" + what counts as a project worth listing |
| Act | the interactive substance | featured cards, dive-in links |
| Review | the proof, the residue | metrics, live badge, index table |

### Work tiers

```
FEATURED (4)   full-width, animated cover, metrics row, detail route
  rag-pipeline-langchain · pickleball-vision-llm
  federated-yolov8-object-detection · liver-report-ai-public

SHIPPED (3)    compact row, live badge, links out
  pb-card-deck (live) · pediatric-care-platform · instagram-reels-extractor

ALSO (5)       filterable, collapsed index: name · one line · stack · links
  ai-due-diligence-copilot · engineering-intelligence-hub
  healthcare-knowledge-navigator · rsna-knee-2026 · paper-code-gen
```

Three components, not one component with a `variant` prop. Different jobs,
different markup.

### Routes

```
/                              home
/work/<slug>                   featured projects only
/writing/<slug>                only if posts exist
```

- `vercel.json` rewrites every path to `index.html` so deep links survive a
  cold load.
- Section anchors stay hash-based and untouched.
- Unknown path renders home with a quiet "no such exit" marker. Never a blank
  screen.

### Detail page

| Zone | Content |
|---|---|
| Orient | name, one-line outcome, stack row, artifact links |
| Act | problem → approach → result → **what made it hard** |
| Review | metrics row (only where real), repo link, next/prev project |

Content is drafted from each project's README and marked `unverified: true`
until the owner confirms it. **Anything still flagged at merge time does not
render.** No placeholder bars, no invented percentages.

### News feed

Reverse-chronological, date-badged, type-labelled — taken from
`adewynter.github.io`. Entries are real events: pushes, deploys, competition
entries. A timeline is a road, so it fits the spine better than any other
section would.

The same reference supplies the honesty rule, which matches the repo's own
house rule: **say what is unfinished rather than hiding it.** Empty sections
say they are empty.

### Stack crosslinks

Add `stack: []` per project; invert once at module load into `tool → projects[]`.
Clicking a tool lights its siblings and drops a row of project links. Extends
the existing `TagTerm` click behavior rather than adding a second interaction
model to the same chip.

## Motion

Three tiers, each justifying its cost:

1. **Scroll-linked** — rail fill, marker states, headers settling on entry.
   `useScroll`/`useTransform`, or CSS where CSS suffices.
2. **Shared-element dive-in** — `layoutId` grows a project cover into the
   detail hero. The one premium moment; makes a route change read as movement
   along the road. Genuinely needs Framer Motion.
3. **Ambient** — canvas covers animate on hover/in-view only. Gated behind
   `IntersectionObserver` so twelve canvases never run at once.

Every tier has a `prefers-reduced-motion` path that is a designed state, not a
disabled one.

## File layout

`constants/index.js` (235 lines) and `Works.jsx` (307 lines) are the two files
this design would otherwise bloat past the 500-line ceiling.

```
src/constants/  → projects.js · stack.js · news.js · glossary.js
src/covers/     → one canvas drawing per project (was inline in Works.jsx)
src/route/      → useRoute.js (History API) · routes.js
src/components/ → Rail.jsx · WorkFeatured.jsx · WorkShipped.jsx · WorkIndex.jsx
                  ProjectDetail.jsx · News.jsx
```

`src/style.js` is deleted in the first commit: nothing imports it, every
component uses `styles.js`.

## Verification

Per increment, with numbers quoted, not adjectives:

- `npm run lint` and `npm run build` exit 0.
- Deep link cold-loaded in a fresh tab; back/forward across three routes.
- Bundle size before and after, gzip, per chunk. Baseline measured
  2026-09-11: `motion 37.23 kB · react 45.10 kB · index 14.93 kB · css 5.59 kB`.
- Reduced-motion checked by toggling the OS setting, not by reading the media
  query.
- Keyboard-only pass: rail markers, filters, dive-in, and back.

## Increments

Each is independently useful and independently shippable.

1. Split `constants/` and `covers/`; delete `style.js`. No visual change.
2. The rail; retire `ScrollProgress`.
3. Work tiers over existing data.
4. Routing + one detail page (`rag-pipeline-langchain`).
5. Remaining three detail pages.
6. News feed.
7. Stack crosslinks.
8. Photo, live-proof clip, About rework.

## Blocked on the owner

These do not block the build; each renders nothing until its input exists.

| Input | Blocks |
|---|---|
| A photo file | About portrait |
| One sentence: what you are building this month | Now line |
| 2–3 real posts | Writing exit — otherwise it does not render |
| Confirmation of drafted case-study text and any metric | Metrics rows, detail prose |
| `npx vercel login` | Deploy, canonical URL, sitemap, OG image, live embed |

## Risks

- **Framer Motion grows.** It is already the largest runtime dep. Tiers 1 and 3
  move to CSS where possible; `layoutId` does not. Measured both ways, reported
  as numbers.
- **Static-host rewrite.** A wrong `vercel.json` 404s every deep link. Verified
  by cold-loading one, not by reading the config.
- **Twelve canvases.** Mitigated by the in-view gate; re-measured on a
  throttled CPU profile.

## Found, not fixed

- `pickleball-shuffle` in constants is the stale repo name; GitHub renamed it to
  `pb-card-deck`. The link survives on a rename redirect, so it is not a 404,
  but the displayed name is wrong and the redirect is not a guarantee. Fixed in
  increment 3.
- `rag-project/ai-due-diligence-copilot/.env` is a real credential file in an
  unversioned 6.6 GB folder with no `.gitignore`. Outside this repo, so outside
  this spec — but it should be gitignored before that folder ever becomes a git
  repo.
