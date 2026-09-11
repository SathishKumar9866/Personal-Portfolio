# Worklog

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
