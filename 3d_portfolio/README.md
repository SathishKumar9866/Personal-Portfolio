# Sathish Kumar: portfolio

A fast, type-led personal site for an AI engineer. Light and dark themes, one
lava-red accent, no 3D engine. React 18 on Vite 5, Tailwind for styling, Framer
Motion for movement, and two 2D canvases for the ambient field.

Despite the folder name there is no 3D in it. `3d_portfolio` is left over from
the template this was forked from; that stack was removed long ago.

## Where to change what

Read this table instead of the code.

| You want to change | Open |
| --- | --- |
| Any copy: roles, projects, glossary, status | `src/constants/index.js` |
| Colour, spacing, type tokens | `src/index.css`, then `tailwind.config.js` |
| A whole section's layout | `src/components/<Section>.jsx` |
| The order of sections | `src/App.tsx` |
| Which items appear in the nav and the right rail | `navLinks` in `src/constants/index.js` |
| The hero backdrop network | `src/components/NeuralField.jsx` |
| The token wave in Stack | `src/components/TokenStream.jsx` |
| A project's cover drawing | the drawing functions at the top of `src/components/Works.jsx` |
| What a tech chip explains | `glossary` in `src/constants/index.js` |

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
```

**A `node_modules` installed under Linux will not work on Windows.** It has no
`.bin` shims and none of the platform binaries
(`@rollup/rollup-win32-x64-msvc`, `@esbuild/win32-x64`). Re-run `npm install` on
the machine you are building on.

**Configuration: none.** The site is static and reads no environment variables.
`docs/EMAIL-SETUP.md` and `.env.example` describe a contact form removed on
2026-09-11 and are kept only as history.

## Stack

| Area | Choice |
| --- | --- |
| Build | Vite 5 with `@vitejs/plugin-react-swc` |
| UI | React 18 |
| Styling | Tailwind, with CSS-variable design tokens |
| Motion | Framer Motion, plus two hand-written canvases |
| Type | Barlow (display and UI), Newsreader (prose), JetBrains Mono (labels), self-hosted via `@fontsource` |
| Contact | A copyable address and `mailto:`. No form, no service |

## Content model

All content lives in `src/constants/index.js`. Components read it. **A fact
hard-coded in a component is a bug.**

| Export | Holds |
| --- | --- |
| `status` | current role, employer, what he is open to, where |
| `experience` | roles, newest first |
| `education` | degrees, newest first |
| `projects` | the Work section |
| `services` | the six capability cards in About |
| `stackGroups` | the six Stack groups |
| `glossary` | plain-English definitions behind the dotted terms |
| `navLinks` | drives the navbar, the right rail, and the command palette |
| `profile` | portrait path and alt text |

### Nothing unverified renders

This is enforced by shape, not by discipline.

`experience` and `education` entries use `start` and `end` as ISO `"YYYY-MM"` or
`null`, and every field is optional. **An entry renders exactly what it has and
omits what it does not.** A role with no dates shows no date range rather than an
invented one; a degree with only an end date shows the graduation and no span.

The same rule governs figures. The resume repo this content came from carries
unfilled placeholders such as `[X]%` and `p95 under [X]ms`. **None were copied.**
The summaries state mechanisms and stacks, which are real, and stay silent on
every number nobody has measured.

### Adding a role or a degree

```js
{
  company: "Acme",            // school: for education
  title: "AI Engineer",       // degree: for education
  location: "Chicago, IL",
  start: "2025-01",           // or null
  end: null,                  // null plus current:true renders "Present"
  current: true,
  summary: "What it was, and what made it hard.",
  stack: ["Neo4j", "Azure"],  // focus: for education
}
```

Anything left `null` or omitted does not render.

### Adding a glossary term

```js
Neo4j: {
  def: "A graph database, storing data as nodes and the relationships between them.",
  link: "https://neo4j.com/",     // null is allowed and renders no link
  full: "Neo4j graph database",   // optional, shown on hover, for acronyms
},
```

Every term used anywhere must have an entry. Check it:

```bash
node --input-type=module -e "import('./src/constants/index.js').then(m=>{
  const used=[...new Set([...m.stackGroups.flatMap(x=>x.items),
    ...m.projects.flatMap(p=>p.tags),...m.experience.flatMap(e=>e.stack||[])])];
  console.log('missing:', used.filter(t=>!m.glossary[t]));})"
```

## Design system

Every colour is a CSS variable (`--c-*`, RGB triples) read through Tailwind
tokens, so light and dark swap by toggling `data-theme` on `<html>`. An inline
script in `index.html` sets the theme before first paint, so there is no flash,
and respects `prefers-color-scheme`. `ThemeToggle` persists the choice and is the
single owner of that state; the command palette asks it to toggle rather than
writing the DOM itself.

### The accent has two roles, and they are different tokens

- `--c-accent` is the lava red and is for **fills only**. As text it measures
  3.62:1 on white and fails AA.
- `--c-accent-ink` is the same red darkened for **text**: 5.78:1 light, 6.00:1 dark.

Using `text-accent` on small type is a bug.

### `--c-line` against `--c-line-strong`

The hairline is deliberately faint (1.22:1) and is right for decorative card
edges. Anything bounding an **interactive control** uses `--c-line-strong`, which
clears WCAG 1.4.11 at 3:1.

### Glass

Two materials, and the split is the engineering decision:

- `.glass` is real `backdrop-filter`, reserved for surfaces that **float over
  content**: the nav, both docks, the command palette, tooltips. Six of them.
- `.glass-card` is the same look **without** the filter, for the twenty cards in
  the page flow. A dozen-plus blurred layers in a scrolling page is the classic
  cause of jank on a phone, and behind an in-flow card there is only the page
  ground anyway.

Light mode gets its own specular value; a bright top edge sells glass on a dark
ground and muddies it on a near-white one. `prefers-reduced-transparency` drops
the blur entirely.

### Type

Barlow for display and UI, Newsreader for prose, JetBrains Mono for labels and
data. Prose is capped near 72 characters a line. Headings use fluid `clamp()`.

**Every text pair passes WCAG AA in both themes**, 22 pairs measured from the
built stylesheet rather than from source.

## Sections, in order

| Section | Component | Notes |
| --- | --- | --- |
| Hero | `Hero.jsx` | One headline, one CTA, one status line. The second CTA was removed: it was the fifth route to `#contact` |
| About | `About.jsx` | Portrait, lede, availability card, six capability cards |
| Experience | `Experience.jsx` | Roles then education on one timeline, dates right-aligned |
| Stack | `Tech.jsx` | Six groups. Every chip has a definition on hover |
| Work | `Works.jsx` | Six projects, generative canvas covers, plain chips |
| Contact | `Contact.jsx` | Invitation left, every route right, each URL printed as text |
| Agent note | `AgentNote.jsx` | Full-width band for crawlers and LLMs. A notice, never an instruction |

## Navigation and docks

Two edges, two jobs, both above 1024px only:

- **Right** (`SideRail.jsx`) is where you are, and one click to anywhere. Dots
  driven by `useActiveSection`, the same single observer the top navbar reads, so
  the two cannot disagree about where you are.
- **Left** (`ContactRail.jsx`) is how to reach him. It steps aside while the
  Contact section is on screen, so the same links are never visible twice.

Both sit behind a `rail` breakpoint of 1024px, with 40px cells held 8px from the
edge. The content container is `max-w-7xl` plus fixed 64px padding, so the text
column starts at `max(0,(vw-1280)/2) + 64`. A 40px dock at 8px clears that at
every desktop width; an earlier 44px-at-16px version sat 4px from the text until
the viewport passed roughly 1320, which is why the breakpoint had wrongly been
raised to 1400 instead.

The top bar hides on scroll down and returns on scroll up, with four guards: a
6px movement threshold, never hidden above 160px, never while the mobile menu is
open, and never while focus is inside it, with any focus bringing it back.

### Chips do two different things

- In **Stack** the chip teaches, so its definition opens on **hover** as well as
  click, and clicking pins it. A reader scanning tools should not have to guess
  that a chip is clickable to learn what it means.
- On **project and experience cards** the chip states, so it is `plain`: the
  expanded name is a native tooltip, and no panel opens inside a tilting card.

## Ambient motion: two effects, each scoped

Two canvases, and the scoping is the whole design decision. A backdrop that
follows the reader down the page is wallpaper competing with text; a backdrop
that appears where it illustrates something is an illustration.

### `NeuralField.jsx`: landing view only

The left contact dock and the right section rail are already two columns of dots
on opposite edges of a fixed viewport. The field reads them as the **input** and
**output** layers of a network, places two hidden layers between them, and sends
activations left to right along real paths.

**The nodes are real.** Coordinates come from `getBoundingClientRect()` on the
actual controls, so the drawing stays correct when a dock hides itself, when the
window resizes, or when a nav item is added. A control that is `display:none` or
zero-sized is filtered out rather than anchoring an edge to nothing.

**It must stay `position: fixed`,** because the docks it wires are fixed, so it
is scoped by *fading out as the hero leaves* and halting, not by re-parenting.
Opacity is derived from the hero's `getBoundingClientRect().bottom`, so the fade
is continuous rather than a step.

### `TokenStream.jsx`, the Stack section only

A wave that descends and wraps, with sub-word tokens riding the curve they were
emitted onto. It lives in Stack and only in Stack, because that is where the
`LLM / RAG` group sits, so the stream illustrates the content instead of
decorating the page.

**Scoped to a band, not to the section.** Filling the section ran the wave behind
all six stack cards, which is the same wallpaper problem one level down. It now
occupies a 20rem × 52% strip at the top right, the one part of that section with
nothing in it. Measured: rightmost rendered text ends at x=614, the canvas starts
at x=653, and it clears the card grid entirely.

**The architecture is chosen, not incidental.** `4 -> 8 -> 6 -> 5`. The input and
output widths are fixed by the interface (four contact links, five sections), so
only the hidden layers were free. They are wider than both ends and taper toward
the output, which is a plain MLP funnel nobody queries. The earlier
`4 -> 5 -> 4 -> 5` was not invalid, but it oscillated and placed a 4-unit layer
immediately before a 5-unit output, a bottleneck no one draws by accident. A
diagram on a portfolio should not invite a question its owner then has to answer.

**Layers are labelled.** `INPUT / HIDDEN 1 / HIDDEN 2 / OUTPUT` with node counts,
on a baseline along the bottom with a tick rising to each column. They sit at the
bottom because the columns pass behind the headline, and a caption landing on the
type costs more than it explains. An unlabelled lattice is just lines moving.

### What keeps both cheap

| Guard | Why |
| --- | --- |
| Desktop only: below 1024px the loop is **stopped**, not hidden | A rAF loop on a phone is battery spent on decoration. Verified by reading an empty pixel buffer, not just `display:none` |
| Each loop runs only where it belongs | The field halts once the hero is gone; the stream runs only while Stack is on screen |
| `devicePixelRatio` capped at 2 | A 3x phone would otherwise cost 9x the fill |
| Node positions re-read on resize and every 500ms | Reading layout 60 times a second forces a flush every frame |
| `prefers-reduced-motion` paints one still frame | The picture still reads; it just holds still |
| `pointer-events: none`, `aria-hidden` | Never in the way, never announced |

**Why 2D canvas and not three.js.** three.js plus a renderer is roughly 150kB
gzip against a ~115kB bundle: more than doubling the download for a background.
Both canvases together cost about 2kB.

**Stacking.** `NeuralField` is `fixed inset-0 z-0` as the first child of the
root; sections come later in the DOM at the same z-index and paint over it
without needing one of their own. `TokenStream` is `-z-10` inside its section,
which is `isolate`. Glass surfaces then blur whichever is behind them through
`backdrop-filter`.

## Links

**Every off-site link opens in a new tab**, `target="_blank"` with
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

## House style

**No long dashes.** No em dash, no en dash, no `&mdash;` or `&ndash;` entity. They read as machine-written
now, and the alternatives are almost always clearer anyway: a colon where a label
introduces its definition, a comma where a clause is parenthetical, a full stop
where two sentences were being held together against their will. Swept the whole
repo to zero, source and prose alike, and the check is one line:

```bash
node -e "const fs=require('fs'),path=require('path');let bad=0;
(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);
if(fs.statSync(p).isDirectory()){if(!['node_modules','dist','.git'].includes(f))w(p);}
else if(/[.](jsx?|tsx?|css|md|html|txt)$/.test(f)){
const n=(fs.readFileSync(p,'utf8').match(/[\u2013\u2014]/g)||[]).length;
if(n){console.log(n,p);bad+=n;}}}})('src');console.log('total',bad);"
```

Run it over `src`, `public` and `index.html`. This README is the one file that
legitimately names the characters, so check it by eye rather than by grep.


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

## Accessibility

Lighthouse reports 100 for accessibility, best practices, SEO and agentic
browsing, on both desktop and mobile: 53 audits, none failing.

That number is necessary and not sufficient. **Tap-target size is not in
Lighthouse's accessibility category**, and this page scored 100 while 49 of 53
controls were under 44x44 on mobile, the worst a chip at 15% of the minimum area.
Measure it separately:

```js
[...document.querySelectorAll('a[href],button,input')]
  .filter(el => el.offsetParent)
  .filter(el => { const r = el.getBoundingClientRect();
                  return r.width < 44 || r.height < 44; })
```

Other things that hold, and should keep holding:

- One `h1`, then `h2` per section, then `h3` for cards. No skips.
- The skip link targets `<main tabIndex={-1}>`, and the hero lives inside `main`,
  so "skip to content" does not mean "skip the content".
- Both dialogs trap Tab, restore focus to whatever opened them, and lock body
  scroll. The command palette is a real combobox and listbox with
  `aria-activedescendant`, and its selection carries a left rule as well as a
  tint, because colour alone is not a cue.
- `prefers-reduced-motion` is honoured by one `MotionConfig` at the root, which
  covers every Framer animation. The CSS block alone did not: it neutralises CSS
  animation only, and every section reveal is JS-driven.
- Timezone abbreviations are derived, so they track daylight saving. India is the
  exception and is labelled by hand, because `Intl` returns `GMT+5:30` for
  `Asia/Kolkata` in `en-US`, not `IST`.

## Verification

`npm run lint` and `npm run build` both exit 0. **Neither proves the page works.**

`no-undef` is re-enabled explicitly in `eslint.config.js`, because
`tseslint.configs.recommended` disables it on the assumption TypeScript catches
it, and these are `.jsx` files `tsc` never sees. An undefined identifier once
passed lint *and* `vite build`, and failed only in the browser.

For anything visual, measure it in a browser:

| Question | How, and why not the obvious way |
| --- | --- |
| Is contrast sufficient? | Compute from the **built** stylesheet. Reading the source proves the palette exists, not that an element uses it |
| Is the line length right? | Walk text nodes with one `Range` per character and bucket by rendered line box. Average-glyph-width estimates are not accurate enough to act on |
| Does this overlap that? | Compare **rendered text extents**, not element boxes. A block element is full width even when its text is not, which gives false positives |
| Is the canvas really off? | Read its pixel buffer. `display: none` and a stopped loop are different things |
| Did the dev server pick up my change? | Restart it after any `tailwind.config.js` edit. See Traps |

## Repo conventions

- **Every off-site link opens in a new tab.** See Links.
- **No long dashes.** See House style.
- Content in `src/constants/index.js`, never in a component.
- A comment says *why*, not *what*. Several here record a decision that looks
  like an omission, so the next person does not undo it.
- `docs/WORKLOG.md` records what shipped; `docs/BACKLOG.md` records what has not.
