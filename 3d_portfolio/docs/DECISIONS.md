# Decisions

What was chosen, what was rejected, and what it cost. One entry per decision that
would be expensive to reverse or easy to undo by accident.

This is an **index**, not a retelling. The evidence — measurements, screenshots in
prose, the failed attempts — lives in [WORKLOG.md](WORKLOG.md) under the date
given. Read this page to know *what* was decided; read the WORKLOG to know whether
the reasoning still holds.

## The standing rules everything else follows

These predate the individual decisions and constrain all of them.

| Rule | Consequence you will feel |
| --- | --- |
| **Every figure is measured or absent** | No estimated metrics on project cards, ever. An invented number undoes the point of the whole site |
| **A fact hard-coded in a component is a bug** | Counts, dates and the ask-box corpus all derive from `constants` |
| **Absent beats invented** | A renamed project drops its About row rather than printing a stale proof; a tool with no logo shows no logo |
| **Ambient motion is desktop-only** | Every loop stops below a breakpoint. A phone spends no battery on decoration |
| **Prove a check fails before trusting it** | Every guard in this repo has been run against a deliberately broken copy |

## Decisions

### The ask box answers from the page, with no model

**2026-09-14.** `Ctrl K` was twelve commands; it now retrieves passages from the
site's own `constants` and cites the section they live in.

- **Rejected:** an LLM call. It needs a key, a backend, and a budget, and it would
  put a *generated* sentence about the work on a page whose entire argument is
  that every number is measured.
- **Cost:** +1.4 kB gzipped, 19 documents, ~120 lines of ranking code.
- **Reversal:** easy. Delete `utils/answer.js` and the palette returns to commands.

### The hero field became real 3D

**2026-09-14.** `NeuralField.jsx` had argued *against* this in its own header:
"three.js plus a renderer is ~150kB gzip against a ~115kB bundle."

- **Chosen anyway**, by the owner, after being shown that number.
- **Contained by:** a dynamic import, a 1024px floor, a reduced-motion check and a
  real WebGL probe. A phone, a reduced-motion reader and a browser without WebGL
  fetch **nothing**; the entry bundle moved 33.4 → 36.0 kB gzipped.
- **Kept honest by:** the 2D field staying as the fallback rather than being
  deleted. Two implementations of one diagram is the price of the graceful path.
- **Reversal:** moderate. The chunk, the probe and the handoff in `NeuralField.jsx`
  come out together.

### Paper is the default palette

**2026-09-14.** A first-time reader gets Paper whatever their device prefers.

- **Rejected:** following `prefers-color-scheme`, which is the more considerate
  default and was overruled deliberately.
- **Why:** the reader who lands cold is usually a recruiter or hiring manager on a
  work laptop in daylight. The page should arrive as a document, not a terminal.
- **Cost:** a dark-mode visitor sees a light page until they click once. The choice
  is then remembered forever.
- **Found doing it:** two `theme-color` tags keyed to the system scheme, of which
  the boot script only ever rewrote the first — a navy browser bar above a white
  page on exactly the devices the pair was meant to help.

### The page is staged as a campaign

**2026-09-14.** BMW rather than Sprite, Google or Meta, with copy cut to campaign
length.

- **Rejected:** Sprite (needs a product to be loud about), Google (needs an
  illustration system that does not exist), Meta (reads as a company, not a
  person).
- **Built:** the hero as a claim list, the spec band, sections as scenes.
- **Not built:** projects as product pages, scroll choreography, a persistent CTA.
  See [BACKLOG.md](BACKLOG.md).
- **The tension to watch:** campaign staging is *assertion* mode; this site's
  credibility is *measurement* mode. Every act so far has kept the evidence and
  changed only the staging. The moment a scene asserts something the page cannot
  show, the direction has gone wrong.

### One name per section

**2026-09-14.** Every nav label equals its section heading:
`About · Roles · Stack · Projects · Contact`.

- **Fixed:** the nav said *About* over a section headed *Overview*, and *Work* over
  one headed *Projects* — and "Work" also collided with "Experience".
- **Renamed:** `Experience` → **Roles** (what they are, and what the spec band
  counts), `#work` → `#projects`.
- **Rejected:** keeping "Experience" for recruiter familiarity. It is a word that
  means everything, over a section holding four jobs with dates.
- **Guarded by:** `test_every_cited_section_is_a_real_one` — the rename touched
  three files that all had to agree.

### The og:image is the one thing no check can read

**2026-09-15.** `og.png` is a picture of text, so no test in this repo can verify
its contents — and it went stale exactly as predicted: the headline changed on
2026-09-14 and the card kept `data to AI, end to end` for a day, previewing a
tagline the page no longer contained on every share of the link.

- **Mitigation, not a fix:** `docs/og-card.html` is the regenerable source, and
  a test now asserts that template still names the current `status.role`. If the
  role changes, the build fails and someone re-renders the card.
- **Still manual:** the render itself. Capture the template at exactly 1200x630
  with no device-pixel-ratio scaling and save over `public/og.png`.
- **The `<noscript>` block had drifted the same way** and was corrected in the
  same pass. It is now guarded.

### The crawler copy is checked, not trusted

**2026-09-14.** `llms.txt` is hand-written prose and stays that way, but seven
assertions now compare it to `constants`.

- **The failure that caused it:** the file listed Stack, Education, Projects and
  Contact and **not one job**, for as long as it had existed. Every AI crawler
  reading this profile saw no employment history.
- **Rejected:** generating the file. Prose for a reader beats a dump, and the
  guard gets the safety without the tone.
- **Known limit, accepted:** the match is a substring, so a name surviving inside a
  longer one still passes.

### Six category colours became one ramp

**2026-09-14.** Cool to warm, ending a step from the brand accent.

- **Why not six hues:** they were unrelated and unordered on a page that holds to
  one accent, which is what made the section look unconsidered.
- **What the ramp buys:** the rail above the cards runs `RAW DATA → RUNNING
  PRODUCT`, and the colour now moves along it. The group that ships lands on the
  brand colour.
- **The trap it creates:** order now matters more than the values. Reorder
  `stackGroups` without reordering `--c-cat-*` and the ramp climbs then jumps back,
  which looks like a bug rather than a choice.

### Roles are a sticky deck, and only one card is lit

**2026-09-14.** Cards pin under the navbar; the covered ones dim their content.

- **Rejected:** a JS-driven pinned stage with scroll-swapped roles. It costs scroll
  listeners, scroll jacking, a separate mobile path and an argument about whether
  the content is still in the document.
- **Accepted limitation:** a deck always slices the card underneath. Dimming makes
  the sliced half-line read as *a card behind* rather than as broken text.
- **Turns itself off** when the tallest card will not fit — measured, not a media
  query, because the text-size control changes height without changing anything a
  query can see.

### Tool logos are generated, not depended on and not hand-drawn

**2026-09-14.** `simple-icons` is a devDependency; a script writes the 25 marks the
site names into a plain module.

- **Rejected — runtime dependency:** 3,460 marks in the graph for 25 glyphs.
- **Rejected — hand-writing them:** 25 chances to ship someone else's logo subtly
  wrong from memory.
- **The concept marks are hand-drawn**, and that is not the same act: a category
  glyph in the site's own line language claims nothing about anyone's identity.
- **Absent on purpose:** Azure, S3, DynamoDB and Pinecone show nothing. The first
  three were removed upstream over trademark policy.

## Decisions that were reversed

Worth keeping visible: three things were built, measured, and taken back out.

| Built | Why it was wrong | What replaced it |
| --- | --- | --- |
| Rounding SVG path coordinates to 2dp | Destroyed every mark using compact arc syntax — `01.5` is two arc flags and a number. Docker, MLflow and Kubernetes rendered blank while the build stayed green | No rounding. The paths ship in a lazy chunk where the bytes cost first paint nothing |
| Fading the whole covered card | `opacity` on `.role-card` made its ground translucent, so two covered cards showed each other's text | Dim the card's children only |
| The base tint on the role-edge light at `accent / 0.45` | The whole card read as *selected*, or as an error state, and the travelling light had nothing to be brighter than | `accent / 0.18` |

## See also

- [ARCHITECTURE.md](ARCHITECTURE.md) — how the results of these decisions fit together
- [WORKLOG.md](WORKLOG.md) — the measurements each entry above compresses
- [BACKLOG.md](BACKLOG.md) — what has not been decided yet
