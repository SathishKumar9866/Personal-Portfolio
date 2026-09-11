# Sathish Kumar — portfolio

A fast, type-led personal site for an ML / AI engineer. Databricks-inspired
visual system, light + dark themes, no heavy 3D.


## Stack

| Area | Choice |
| --- | --- |
| Build | Vite 5 + `@vitejs/plugin-react-swc` |
| UI | React 18 |
| Styling | Tailwind CSS (CSS-variable design tokens) |
| Motion | Framer Motion |
| Type | Barlow (display + UI), Newsreader (prose), JetBrains Mono (labels), self-hosted via `@fontsource` |
| Contact | Copyable address + `mailto:` — no form, no service |

## Design system

- **Themes.** Every color is a CSS variable (`--c-*`, RGB triples) read through
  Tailwind tokens, so light/dark swap by toggling `data-theme` on `<html>`. An
  inline script in `index.html` sets the theme before first paint (no flash) and
  respects `prefers-color-scheme`. `ThemeToggle` persists the choice.
- **Palette.** Databricks-style: white / navy ink / oat in light, deep navy in
  dark, one lava-red accent (`#FF3621`).
- **The accent has two roles, and they are different tokens.** `--c-accent` is
  the lava red and is for FILLS only — as text it measures 3.62:1 on white and
  fails AA. `--c-accent-ink` is the same red darkened for text (5.78:1 light,
  6.00:1 dark). Using `text-accent` on small type is a bug.
- **`--c-line` vs `--c-line-strong`.** The hairline is deliberately faint
  (1.22:1) and is right for decorative card edges. Anything that bounds an
  *interactive control* uses `--c-line-strong`, which clears WCAG 1.4.11 at 3:1.
- **Every text pair passes WCAG AA in both themes** — 22 pairs measured from the
  built stylesheet, not from the source.
- **Type scale + spacing.** 4px base; fluid `clamp()` headings. Prose is capped
  near 72 characters a line; the featured card once ran 117.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the build
npm run lint
```

## Configuration

None. The site is static and takes no environment variables.

Contact is a copyable address plus an icon row — there is no form and no mail
service. `docs/EMAIL-SETUP.md` and `.env.example` describe the removed EmailJS
form and are kept only as history.

## Editing content

All content is data-driven in `src/constants/index.js`:

- `navLinks`, `services` (Overview), `stackGroups` (Stack, each with a `note`),
- `projects` (each with `outcome`, `description`, `tags`, links), `quotes`,
  and `contact`. Note: `stages` is present on each project but is currently
  dead data — no component reads it.

## Structure

```
src/
  components/   Hero, Navbar, About, Tech, Works, Contact, Footer,
                Quote, CommandPalette, ThemeToggle, LiveClock, ...
  constants/    all site content
  hoc/          SectionWrapper (scroll-reveal + layout)
  utils/        motion variants
  styles.js     shared type/spacing class strings
  index.css     theme tokens + base styles
```

## Content model

All content lives in `src/constants/index.js`. Components read it; a fact
hard-coded in a component is a bug.

| Export | Holds |
| --- | --- |
| `status` | current role, employer, what he is open to, where |
| `experience` | roles, newest first |
| `education` | degrees, newest first |
| `projects` | the Work section |
| `stackGroups`, `services` | Stack and About cards |
| `glossary` | plain-English definitions behind the dotted terms |

**Nothing unverified renders.** `experience` and `education` entries use
`start` / `end` as ISO `"YYYY-MM"` or `null`, and every field is optional: an
entry renders exactly what it has and omits what it does not. A role with no
dates shows no date range rather than an invented one. Source numbers that are
still placeholders (the resume repo's `[X]%`) must not be copied in.

## Notable details

- **Two edge docks, different jobs.** Section navigation on the right (where you
  are, one click to anywhere); contact on the left. Both appear only above the
  `rail` breakpoint (1400px) — below it a 44px dock measured 4px from the text at
  every width, because the content container is `max-w-7xl` plus fixed padding.
- **⌘K command palette** — jump to sections, copy email, open socials, toggle theme.
- **Generative project covers** — each card draws an abstract diagram of what
  the project does (a retrieval neighbourhood, a cited passage, a federated
  hub-and-spoke), selected by its `cover` key and seeded deterministically from
  the project name. Not screenshots, and not the literal pipeline stages.
- **Live clock** — IST and US Eastern / Central in the hero and footer, with
  zone abbreviations derived so they track daylight saving.
- **Accessibility** — semantic landmarks, single `h1`, skip link, visible focus,
  `prefers-reduced-motion` honored, keyboard-navigable palette.
- **Performance** — vendor chunks split for caching; no runtime 3D.

## Ambient motion — two effects, each scoped

Two canvases, and the scoping is the whole design decision. A backdrop that
follows the reader down the page is wallpaper competing with text; a backdrop
that appears where it illustrates something is an illustration.

### `NeuralField.jsx` — landing view only

The left contact dock and the right section rail are already two columns of dots
on opposite edges of a fixed viewport. The field reads them as the **input** and
**output** layers of a network, places two hidden layers between them, and sends
activations left to right along real paths.

**The nodes are real.** Coordinates come from `getBoundingClientRect()` on the
actual controls, so the drawing stays correct when a dock hides itself, when the
window resizes, or when a nav item is added. A control that is `display:none` or
zero-sized is filtered out rather than anchoring an edge to nothing.

**It must stay `position: fixed`,** because the docks it wires are fixed — so it
is scoped by *fading out as the hero leaves* and halting, not by re-parenting.
Opacity is derived from the hero's `getBoundingClientRect().bottom`, so the fade
is continuous rather than a step.

### `TokenStream.jsx` — the Stack section only

A wave that descends and wraps, with sub-word tokens riding the curve they were
emitted onto. It lives in Stack and only in Stack, because that is where the
`LLM / RAG` group sits — so the stream illustrates the content instead of
decorating the page. Section-scoped, so it is absolutely positioned inside its
own section and needs no fixed-coordinate wiring.

### What keeps both cheap

| Guard | Why |
| --- | --- |
| Desktop only — below 1024px the loop is **stopped**, not hidden | A rAF loop on a phone is battery spent on decoration. Verified by reading an empty pixel buffer, not just `display:none` |
| Each loop runs only where it belongs | The field halts once the hero is gone; the stream runs only while Stack is on screen |
| `devicePixelRatio` capped at 2 | A 3x phone would otherwise cost 9x the fill |
| Node positions re-read on resize and every 500ms | Reading layout 60 times a second forces a flush every frame |
| `prefers-reduced-motion` paints one still frame | The picture still reads; it just holds still |
| `pointer-events: none`, `aria-hidden` | Never in the way, never announced |

**Why 2D canvas and not three.js.** three.js plus a renderer is roughly 150kB
gzip against a ~115kB bundle — more than doubling the download for a background.
Both canvases together cost about 2kB.

**Stacking.** `NeuralField` is `fixed inset-0 z-0` as the first child of the
root; sections come later in the DOM at the same z-index and paint over it
without needing one of their own. `TokenStream` is `-z-10` inside its section,
which is `isolate`. Glass surfaces then blur whichever is behind them through
`backdrop-filter`.

## Links

**Every off-site link opens in a new tab** — `target="_blank"` with
`rel="noreferrer"`. The portfolio is the thing the visitor came for; sending them
away in the same tab costs a back-press and, on a slow connection, a full
re-render. Internal anchors (`#about`) stay in the tab. `mailto:` stays in the
tab, because a new tab for a mail client leaves an empty one behind.

**Addresses are shown as readable text, not only as icons.** A visitor may want
to write one down, check where a link goes before following it, or reach him when
the target site will not load for them. An icon answers none of those, so the
Contact card prints the full URL next to every destination.

Verified in the browser rather than by grep: 13 external links, 13 with
`target="_blank"`, 0 without `rel`.

## Traps

Each of these cost real time to find. They are written down so they cost it once.

- **`amount` in a `whileInView` viewport is a raw IntersectionObserver
  threshold**, and `intersectionRatio` is capped at
  `viewportHeight / elementHeight`. A section taller than ~4x the viewport can
  never satisfy `amount: 0.25`, so it stays at the `hidden` variant forever. The
  Work section is ~3800px and was invisible on every phone. Use `amount: "some"`.
- **A Tailwind config change needs a dev-server restart.** New color tokens
  produce no utilities until then, so the dev server can serve an older palette
  while every production build is correct. If a `text-*` class computes to the
  inherited color, check this before debugging the cascade.
- **`tseslint.configs.recommended` disables `no-undef`** on the assumption
  TypeScript catches it. These are `.jsx` files that `tsc` never sees, so an
  undefined identifier passed lint *and* `vite build` and only failed in the
  browser. It is re-enabled explicitly in `eslint.config.js`.
- **`Intl` returns `GMT+5:30` for `Asia/Kolkata`, not `IST`.** Zone labels are
  derived for the US zones (they observe DST) and fixed for India (it does not).
- **Lighthouse's accessibility category does not check tap-target size.** The
  page scored 100 while 49 of 53 controls were under 44x44 on mobile.

## Content sections, in order

| Section | Component | Notes |
| --- | --- | --- |
| Hero | `Hero.jsx` | One headline, one CTA, one status line. The second CTA was removed — it was the fifth route to `#contact` |
| About | `About.jsx` | Portrait, lede, the availability card, six capability cards |
| Experience | `Experience.jsx` | Roles then education on one timeline; dates right-aligned. Renders only fields that exist |
| Stack | `Tech.jsx` | Six groups; every chip has a definition on hover |
| Work | `Works.jsx` | Six projects, generative covers, plain chips |
| Contact | `Contact.jsx` | Invitation left, every route right, each URL printed as text |
| Agent note | `AgentNote.jsx` | Full-width band for crawlers and LLMs — a notice, never an instruction |

## Docks and navigation

Two edges, two jobs, both above 1024px only:

- **Right** (`SideRail.jsx`) — where you are and one click to anywhere. Dots
  driven by `useActiveSection`, the single observer the top navbar also reads, so
  the two cannot disagree.
- **Left** (`ContactRail.jsx`) — how to reach him. Steps aside while the Contact
  section is on screen, so the same links are never visible twice at once.

The top bar hides on scroll down and returns on scroll up, with four guards: a
6px threshold, never hidden above 160px, never while the mobile menu is open, and
never while focus is inside it.
