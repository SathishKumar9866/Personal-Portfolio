# Worklog

## 2026-09-11 (second session): covers, Stack tiers, one title, AI-crawler surface

Branch `redesign/highway-premium`. Four commits: `f6f6cea`, `8037811`,
`a92ca51`, `4924be9`.

### The bug that mattered

**The first project card had been shipping an empty panel.** `constants` said
`cover: "Embeddings"`; every key in `DRAWERS` is lowercase. The lookup returned
`undefined`, the drawer returned before touching the canvas, and the corner
label fell through to its own default, the word `preview`.

Measured: that canvas had **0 non-empty pixels** while the other five ran 3.5 to
20% ink. It survived because an empty panel labelled "preview" is
indistinguishable from an intentional placeholder. The label was lying about the
state, and nothing else was.

Fixing the casing would have taken one character. Instead the cover now draws
the mechanic: `QUERY` in, the question embedded and its `TOP-3 PASSAGES` pulled
from the store, a `CITED ANSWER` with the passage it used marked `[1]`. It
reuses the scatter from the old embedding cover and the marked answer line from
the due-diligence cover, so the six covers still read as one system. Renamed
`retrieval`, so the key and the content agree.

A missing drawer now warns in dev. That is the actual defect: a typo and an
unpainted canvas looked the same from the outside.

### Federated learning only went one way

The federated cover animated updates travelling from the clients to the hub and
stopped. That says the clients give and never receive, which is the half of
federated learning that is not federated. A round is two trips. Now: filled red
inbound, hollow outbound, a pulse at the hub where aggregation happens, and a
caption that names the leg.

Proven by pixel count rather than by watching it: the accent-red pixel count on
that canvas alternates **494 to 640** on the 3200ms period, hub-only against
hub-plus-five-inbound-dots. The static and reduced-motion render used to draw no
dots at all and now shows both legs mid-flight.

### Stack: the card-height bug was not a height bug

Reported as "two cards in a row should match height". They already did. CSS grid
stretches them, measured 186/186 and 200.2/200.2 at a 620px grid width.

What actually drifted was the **chip row**, which floated up under a one-line
note. Two cards in the same row disagreed on where their chips sat by 19.5px and
on the space below them by **33.7px**. The fix is `flex flex-col` plus `mt-auto`
on the chip row, not a height rule. After: 0.0px on both, in all three rows.

Worth writing down because the reported symptom named the wrong cause, and a
height rule would have "fixed" it while leaving the chips ragged.

### Stack: the rest

- **Two chip tiers.** Each group names at most two primary tools; they get a
  filled chip. The fill inverts per theme instead of being dark in both, because
  a dark fill on the dark ground reads as *less* emphasis than an outline chip.
  13.59:1 light, 13.9:1 dark, computed from the DOM. Hover moves a filled chip
  to an accent fill with `--c-strong` ink: the one accent pairing that clears AA
  at 4.68:1, where `--c-accent-ink` on that fill would be 3.6:1 and fail.
- **Six category dots**, desaturated. Six hues at full chroma is a rainbow; the
  dot is there so the eye can find a category again, not to rank it.
- **A second tap now closes a definition.** The old handler only unpinned,
  leaving `open` true and relying on a `mouseleave` that a touch screen never
  sends. On a phone the panel stayed up with nothing to dismiss it.
- The dotted underline goes solid on hover and focus.
- The hover lift lives in `index.css` beside `.glass-card`, not as a
  `hover:shadow-*` utility. The light-theme `:root:not([data-theme="dark"])
  .glass-card` rule is specificity 0,3,0 and outranks a 0,2,0 utility, so a
  utility would have worked in dark mode and silently done nothing in light.
- Cards stack to one column under `md`. The old grid was two columns on a phone.

The reference mockup named in the request, `stack-section-redesign.html`, was
not on disk anywhere, so this was built from the written spec.

### One title

`ee1eebb` settled the title as "AI Engineer", owner-confirmed, but only
`constants.role` had been updated. Eleven other places still said "ML / AI
Engineer", so the site introduced itself two ways depending on where you looked.
Now one string everywhere, zero occurrences of "ML / AI" left.

`Contact.jsx` deliberately keeps "data engineering, data science, ML, and AI
engineering roles". What he calls himself and what he will be hired for are
different decisions, and that sentence is the only place the second one is
stated.

**A grep cannot read a PNG.** `public/og.png` had the old title painted into it
and no source in the repo, so every string could be updated, verified and
shipped while the image in every link preview kept saying "ML / AI Engineer". It
was also the last em dash to survive `1242d04`, and it was set in Arial while
the site is Barlow. `docs/og-card.html` is now the source, with its
regeneration steps in its own header. Re-rendered at deviceScaleFactor 1 so the
bitmap is 1200x630 and not 1.25x that, verified by reading the PNG header, and
`document.fonts` was checked before capture so it is not a fallback-typeface
screenshot.

### AI-crawler surface

- **`robots.txt` was two lines.** It now answers sixteen AI agents by name. That
  is redundant by the letter of the standard and deliberate: a named rule is
  where a future opt-out goes, and `Google-Extended` and `Applebot-Extended` are
  not crawlers at all but training-use tokens with no fetching agent behind
  them, so a wildcard is not the clear answer for them that it is for a normal
  bot.
- **No sitemap, and the file says why.** One page with in-page anchors means a
  sitemap carries exactly one URL.
- **`llms.txt` could not answer "what does he use".** It had the work and the
  contact routes but not the stack, which is the most likely question an agent
  gets about a portfolio. Added Stack, with the same primary/secondary split the
  site draws, and Education.
- **The JSON-LD was a Person with four fields.** Now description, image, email,
  Substack, `alumniOf` from `education`, and `knowsAbout` with 18 entries from
  `stackGroups`. Every value already existed in constants; nothing inferred.

Both `llms.txt` and the JSON-LD are hand-maintained and now say so in a comment
naming the constant they mirror. That is the trade: this is a client-rendered
SPA, so React output is invisible to a crawler that does not run JavaScript, and
the alternative to hand-maintaining is duplicating section markup into
`index.html`, which drifts silently. Filed as two tickets: a prerender pass, and
a check that fails when the copies drift.

### Verification

Everything above was measured in Chrome against the running app, not read off
the diff.

| Claim | Measurement |
| --- | --- |
| RAG cover paints | 0% ink to 7.1%, 1758 accent-red pixels |
| Federated goes both ways | red pixels alternate 494 to 640 on a 3200ms cycle |
| Animated covers animate | 3 of 3 produce distinct frames, all pause off-screen |
| No clipping on a phone | 0 ink in the rightmost 6px at 390px wide |
| Chip rows align | 33.7px delta to 0.0px, all three rows, 620px grid |
| Six dots, six colours | 6 distinct computed values, 8x8px |
| Two tiers | 33 chips, 12 filled: the 2 primaries in each of 6 groups |
| Filled chip contrast | 13.59:1 light, 13.9:1 dark, from the DOM |
| Popover dismisses | first tap opens, second closes, click-away closes, Escape closes |
| Focus stays visible | 1.6px solid accent outline on the term buttons |
| Hover lift resolves | all 4 `.card-lift` rules, including the light-theme override |
| One column on a tablet | at 702px: 1 column, 6 cards share one left edge, no h-overflow |
| Nothing else regressed | Works and Experience plain chips still 18 and 40, no buttons added |
| og.png is what it claims | 1200x630 from the PNG header, matching the declared meta |
| JSON-LD is valid | parses as JSON out of `dist/index.html` after the build |
| Crawler files ship | `dist/robots.txt` 2095 bytes, `dist/llms.txt` 4634 bytes |
| Title is consistent | 0 matches for "ML / AI" in the rendered page text |
| Build and lint | `npm run build` 1.0s; `npm run lint` 0 errors, 26 pre-existing warnings |

Console is clean apart from the pre-existing framer-motion "non-static
position" dev warning, which is documented in `Works.jsx` and is
`NODE_ENV`-guarded.

### Still open

- **Vercel is not deployed.** `npx vercel whoami` returns `Logged out` and
  `vercel login` is interactive, so the owner has to run it. Note for whoever
  does: the site is not at the repo root, so deploy with
  `npx vercel --cwd 3d_portfolio`, or set Root Directory to `3d_portfolio` when
  importing the repo in the dashboard.
- **Three TODOs in `index.html` are still blocked on that domain**: absolute
  `og:image` and `twitter:image`, `og:url`, and the canonical link. X ignores
  relative image URLs, so social cards stay broken until the deploy exists.
- No GitHub Pages deployment exists. If one is wanted at
  `sathishkumarai.github.io`, note that this repo is `Personal-Portfolio`, so
  Pages would serve it from `/Personal-Portfolio/` and Vite needs a matching
  `base`. Only a repo literally named `SathishKumarAI.github.io` serves from the
  domain root.


## 2026-09-11: Accessibility, real content, and a scoped ambient field

Branch `redesign/highway-premium`, cut from `redesign/de-slop-portfolio`.
Open as PR #4 against `main`.

### The bug that mattered

**The Projects section was invisible on every phone.** Sections reveal with
`whileInView` and `viewport={{ amount: 0.25 }}`. That `amount` is a raw
IntersectionObserver threshold, and `intersectionRatio` is capped at
`viewportHeight / elementHeight`. Work is about 3800px tall, so on a 390x844
phone the ratio can never exceed **0.222**. The condition was unsatisfiable, the
variant never ran, and every child stayed at `opacity: 0`.

Measured blank before, measured visible after, screenshots both ways. It survived
earlier "emulated 390/820/1440" QA because catching it needs scrolling *into*
`#work` at phone width, not just loading the page. Fixed with `amount: "some"`,
which is height-independent and cannot regress as a section grows.

### Accessibility

- **22 contrast pairs now pass AA in both themes**, computed from the built
  stylesheet. The accent's role was split rather than its colour changed:
  `--c-accent` fills, `--c-accent-ink` is the same red legible as text
  (3.62 to 5.78:1). `--c-faint` darkened; it was 3.02:1 and used only at 10-13px.
  White on the accent fill failed at 3.62:1, including the skip link, which is an
  accessibility affordance that was itself inaccessible.
- **Tap targets: 49 of 53 controls were under 44x44 on mobile.** Now zero.
  Lighthouse does not check this, which is how the page scored 100 while a third
  of its controls were half the usable size.
- Focus traps, focus restoration and scroll lock on both dialogs; the command
  palette is a real combobox and listbox with `aria-activedescendant`.
- `prefers-reduced-motion` honoured by one root `MotionConfig`. The CSS block
  alone covered no Framer animation, and the README had claimed otherwise.
- Skip link now targets `<main tabIndex={-1}>` with the hero inside `main`.
- Lighthouse 100/100/100/100, 53 audits, desktop and mobile.

### Content

- **Real work history**: four roles and two degrees, sourced from
  `~/coding/shelf/product/resume-automation`, not from the LinkedIn save, which
  contained zero date ranges across all 119 of its files.
- The resume's unfilled `[X]%` placeholders were **not** copied. Summaries carry
  mechanisms and stacks; every unmeasured number stays absent.
- Project descriptions previously repeated their own headline verbatim on all
  six cards. They now carry the mechanism, sourced from each repo's own
  description.
- 45 terms used, 45 defined. 21 carry an expanded name shown on hover.
- Contact rebuilt: invitation left, every route right, **each URL printed as
  readable text**, per-row copy.
- `AgentNote`: a full-width notice for crawlers and LLMs, written as a notice and
  an invitation, never an instruction, because instructions in scraped content
  are prompt injection and a well-built agent ignores them.

### Motion, after two wrong attempts

First version put one canvas behind the whole page. That is wallpaper competing
with text. Second version scoped it to a section, still filling all 935px of it
behind the cards. Both wrong for the same reason.

Now two canvases, each where it explains something:

- **`NeuralField`**, landing view only. Reads the left dock and right rail as
  input and output layers from their real `getBoundingClientRect()` coordinates,
  with two hidden layers between. Architecture is `4 -> 8 -> 6 -> 5`, a plain MLP
  funnel; the earlier `4 -> 5 -> 4 -> 5` put a 4-unit layer before a 5-unit
  output, which invites a question the owner would then have to answer. Layers
  are labelled with node counts.
- **`TokenStream`**, a 20rem band at the top right of Stack only. Sub-word tokens
  ride a descending wave. Verified clear of all content: rightmost rendered text
  at x=614, canvas starts at x=653.

Both desktop-only with the loop **stopped**, not hidden, below 1024px, verified
by reading an empty pixel buffer. Together about 2kB. three.js would have been
150 to 170kB against a 115kB bundle.

### Also

- Liquid-glass surfaces, split into `.glass` (real `backdrop-filter`, six
  floating surfaces) and `.glass-card` (same look, no filter, twenty in-flow
  cards), because a dozen blurred layers in a scrolling page is what makes phones
  stutter.
- Top bar hides on scroll down, returns on scroll up, with four guards.
- Two edge docks: sections right, contact left, both gated at 1024px.
- Every off-site link opens in a new tab. 13 external links, 13 correct.
- **195 long dashes removed** across 39 files, plus two hiding as `&mdash;`
  entities. Replaced by judgement, not find-and-replace.
- Repo consolidated: five other portfolio attempts moved out with their history
  intact, none deleted.
- `.gitignore` was **not working at all**: lines 205 onward had been appended in
  UTF-16LE by a PowerShell redirect, and git stops parsing an ignore file at the
  first NUL byte. Every rule after that point, including the block that was
  supposed to ignore the nested repos, had been silently dead.

### Mistakes worth recording

- Shipped `TERM_HINT` without importing it. **lint passed, build passed**, and
  the page failed only in the browser. Cause: `tseslint.configs.recommended`
  disables `no-undef` on the assumption TypeScript catches it, and these are
  `.jsx` files `tsc` never sees. Re-enabled explicitly.
- Spent time on a Framer "static scroll container" warning that is dev-only and
  about `<html>`, not a defect.
- Served a **stale Tailwind palette for several checks**: a `tailwind.config.js`
  change needs a dev-server restart, so `text-accent-ink` and friends existed in
  every production build while the dev server still showed the old colours.
- Broke the scroll-spy while fixing it, by observing zero-height anchors rather
  than sections.
- Swept the LinkedIn save into a commit with `git add -A`: 45MB, 58 files. Undone
  before any push, then gitignored.

### Verified

Chrome, light and dark, at 390, 820, 1024, 1366 and 1500. `eslint` 0 errors and
`vite build` 0 on every commit. Behaviour checked in a browser rather than read
off the diff; where something could not be proven, the commit says so.

### Open

- Deploy to Vercel. Blocks the canonical URL, the sitemap, absolute OG image
  URLs, and the live embed for `pb-card-deck`, which sends `frame-ancestors 'none'`.
- Real measured numbers for the project metric rows.
- Two or three writing pieces, or the Writing section stays unbuilt.
- LinkedIn profile still spells the name "Satish" and gives a different job title
  than the resume. Both are profile edits, not code.

## 2026-07-02 → 07-03: De-slop redesign → Databricks direction

Full rebuild of the portfolio from a generic "3D template" look into a clean,
type-led, Databricks-style site with light/dark themes. Branch:
`redesign/de-slop-portfolio` (18 commits, base `main` untouched).

### Arc of the work

1. **Build fix + snapshot.** Dropped `tsc -b` from the build (JSX project; tsc
   choked on untyped `.js` imports). Committed the working template state as a
   rollback point.
2. **First de-slop pass ("Instrument", amber on dark).** New tokens, self-hosted
   type, code-split three.js (1124KB → 274KB initial), semantic landmarks, a11y,
   scroll-spy nav, SEO meta. *Superseded by the Databricks direction below.*
3. **Responsive fixes.** Hero 3D was covering the copy on phones/portrait
   tablets; moved it below the fold + scrim at ≤1024px via live `matchMedia`.
   Compact About cards.
4. **Meaningful project covers.** Generative graphic per project driven by a
   real pipeline (`stages`), not decoration.
5. **Link audit.** Verified all repo/profile/live links resolve (200); removed a
   broken placeholder canonical domain (`sathishkumarai.dev`).
6. **Product layer.** Working contact form (EmailJS + `mailto` fallback), footer
   + colophon, scroll-progress bar, back-to-top, app error boundary, ⌘K command
   palette, full-screen mobile menu, per-group Stack notes, console easter egg.
7. **Direction reset → Databricks (per feedback: still read AI-generated).**
   - Removed the spinning 3D wireframe globe entirely; **uninstalled the whole
     three.js stack** (`three`, `@react-three/*`, `maath`).
   - CSS-variable **theme system**. light default (white / navy / oat) + dark
     (deep navy), one **lava-red** accent (`#FF3621`). No-flash inline script,
     persisted sun/moon `ThemeToggle`, respects `prefers-color-scheme`.
   - Type switched to **Barlow** (Databricks heritage font) + JetBrains Mono.
   - Type-led hero, bold headline, filled + ghost CTAs.
8. **Layout + content.** Overview → 2×2 grid, Stack → 2-col, both at all
   breakpoints (less scroll). Author quotes (Einstein / Ramanujan / Kalam) as
   interstitials. Stack intro + Projects "built with" + service-card
   descriptions. **IST / EST / CST live clock** in hero + footer.
9. **Headline.** Iterated to a current-news hook: *"Everyone's building AI
   agents. I ship the ones that reach production."* (2026 agent-to-production
   gap).
10. **Optimization + cleanup.** Vendor chunk split (app code now ~11KB gzip on
    its own); removed 2 unused deps; deleted dead 3D component files; **removed
    19MB of dead `public/` glTF assets** that were shipping in every build.
    ESLint clean.
11. **Docs + hygiene.** Real README, `favicon.svg`, `robots.txt`,
    `site.webmanifest`.
12. **Project covers, final form.** Animated pipeline → **domain-specific covers**
    (embeddings / citation / federated / video-frames / tracking / scorecard),
    dispatched by a `cover` field. Subtle animation, off-screen-paused,
    reduced-motion-safe.

### Verified
Chrome, light + dark, desktop + tablet (820) + mobile (390); no console errors;
no horizontal scroll; production build green throughout.

### Open / blocked
- **Push + PR**. blocked on an expired GitHub token (`gh auth login` needed).
- **Deploy domain**. needed for the real canonical URL + OG image.
- See `docs/BACKLOG.md` for the future ticket list.
