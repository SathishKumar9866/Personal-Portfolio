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
| The four big numbers under the hero | `src/components/SpecBand.jsx` — all derived, none typed |
| Colour, spacing, type tokens | `src/index.css`, then `tailwind.config.js` |
| A whole section's layout | `src/components/<Section>.jsx` |
| Which scenes are tinted, and the scene rhythm | `main > section:nth-of-type(odd)` in `src/index.css` |
| The stage every section sits on | `src/hoc/SectionWrapper.jsx` |
| The order of sections | `src/App.tsx` |
| Which items appear in the nav and the right rail | `navLinks` in `src/constants/index.js` |
| The hero backdrop network, in 3D | `src/components/NeuralField3D.js` |
| The 2D fallback field, and who gets which | `src/components/NeuralField.jsx` |
| The token wave in Stack | `src/components/TokenStream.jsx` |
| A project's cover drawing | the drawing functions at the top of `src/components/Works.jsx` |
| What a tech chip explains | `glossary` in `src/constants/index.js` |
| Which tools show a logo, and which slug each uses | `MAP` in `scripts/gen-tool-icons.mjs`, then `npm run icons` |
| The mark for a term that is an idea, not a product | `src/components/conceptIcons.js` — hand-drawn, never generated |
| Which tools get the filled chip | `primary` per group in `stackGroups` |
| A Stack category's colour | `dot` AND `tint` per group in `stackGroups` — same colour, two forms — token in `src/index.css` |
| The Stack pipeline rail, card glow, stage numerals | `src/components/Tech.jsx`, `.stack-card` / `.stack-seg` in `src/index.css` |
| The og:image social card | `docs/og-card.html`, then re-render over `public/og.png` |
| How big any text is | the named scale in `tailwind.config.js`, never a literal |
| How much a section is padded | `styles.padding` in `src/styles.js`, one clamp |
| What a phone hides that a desktop shows | `MobileCollapse.jsx`, plus `md:` classes at the call site |
| The diagram beside each Experience role | `CareerTrack.jsx`, keyed by `glyph` in `stackGroups`' sibling `experience` |
| What a typed question can find, and how it is ranked | `src/utils/answer.js` |
| What the ask box looks like, and its commands | `src/components/CommandPalette.jsx` |
| How far a role card pins, and the deck offsets | `.role-sticky` / `.role-card` in `src/index.css`, `top`/`z-index` in `Experience.jsx` |
| When the deck gives up and becomes a list | `useDeckFits` in `src/components/Experience.jsx` |
| Clock zones, and the reader's own row | `src/components/LiveClock.jsx`, `src/utils/localzone.js` |
| What AI crawlers are answered by name | `public/robots.txt` |
| The machine-readable copy of the site | `public/llms.txt` |

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
npm test           # retrieval and timezone logic; plain node, no framework
npm run icons      # regenerate src/components/toolIcons.js from simple-icons
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
| Motion | Framer Motion, two hand-written canvases, and three.js for the hero field only |
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
| `stackGroups` | the six Stack groups, each with its dot colour and its primary tools |
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

### Six reading themes, two schemes

`data-theme` is the palette; `data-scheme` is light-or-dark. Every structural
rule keys off the scheme — the glass shadows, the bloom, the grain — so a new
palette declares `scheme` once in `themes` (`constants/index.js`) and inherits
all of it. Those rules used to read `:not([data-theme="dark"])`, which is a
sentence that stops being true the moment a third palette lands.

| Theme | Scheme | Character |
| --- | --- | --- |
| Slate | dark | The default. Deep navy |
| Ink | dark | Near-black and cool, the highest contrast of the six |
| Paper | light | Warm white. The default light |
| Manuscript | light | Warm, low blue, gentle. For reading rather than scanning |
| Clarity | light | Neutral, high contrast, accent pulled back |
| Preprint | light | An arXiv or IEEE page: white, near-black, **Cornell red `#B31B1B`** |

Preprint's accent is arXiv's own red, which happens to sit in the same family as
this site's lava red — so it reads as a paper without the page giving up its
identity.

**The content is identical in all six.** A portfolio that shows a recruiter
different claims than it shows a professor is not a theme, it is a lie with a
switch on it. These are reading conditions: ground, contrast, warmth.

Every palette was **measured, not derived**. Contrast on the six pairs that
matter, lowest value per theme:

| Theme | body text | secondary | faint on card | accent as text | control edge |
| --- | --- | --- | --- | --- | --- |
| Slate | 12.57 | 8.15 | 4.89 | 6.00 | 4.16 |
| Ink | 16.42 | 9.10 | 5.53 | 7.92 | 3.77 |
| Paper | 13.59 | 6.97 | 4.53 | 5.78 | 3.56 |
| Manuscript | 13.72 | 7.39 | 4.54 | 6.80 | 3.24 |
| Clarity | 18.02 | 8.70 | 5.01 | 6.87 | 3.23 |
| Preprint | 18.86 | 11.32 | 5.72 | 8.39 | 3.93 |

Text floor is 4.5 (AA), control-boundary floor is 3.0 (WCAG 1.4.11). All six
clear both.

**Two traps the picker hit**, both worth knowing:

- **A nested element cannot opt into another palette.** The rules are
  `:root[data-theme=...]`, so putting the attribute on a swatch matches nothing
  and every swatch came out the colour of the current theme. The swatches paint
  from `theme.bar` and `theme.accent` directly.
- **A bare `<span>` is inline, and an inline box ignores width.** The swatches
  rendered 2px wide with their height coming from the line box alone.

### Depth

The page had none: flat fills, 1px hairlines, one plane. Four pieces, all in
`index.css`, none of them animated.

| Class | What it does |
| --- | --- |
| `.glass-card` | **Three** shadows, not one — a tight contact shadow, a wide ambient one, and the inner highlight. A single soft shadow reads as a blur behind a box; three read as a surface above the page |
| `.bloom` | Two large radial gradients at ~10% behind the hero, so the headline sits in front of something |
| `.grain` | A fixed `feTurbulence` layer at 3.5%. A flat dark ground bands across 1440px; noise breaks the bands into material. One data URI, no request |
| `.btn-accent` | A lit vertical gradient, a **coloured** ambient shadow so the accent glows into the ground rather than sitting on it, an inner top highlight, and a hover that lifts 1px instead of dimming |

Radii: large surfaces 18–22px, small controls 12px. A 6px control beside a 22px
card is what makes the control look like it came from another decade.

**The trap.** `.bloom` first shipped as `inset: -20% -10% auto -10%`. The
negative horizontal bled 39px past each edge and took the document to 430px wide
on a 390px phone — a sideways scrollbar on every page. It is `inset-x: 0` now.
**A decorative element positioned with a negative inset widens the document.**

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

Barlow for display and UI, Newsreader for prose, JetBrains Mono for **identifiers
only**.

That last word is a rule, and it replaced a much looser one. Mono used to carry
labels and data, which in practice meant navigation, the wordmark, the status
line, every eyebrow, every card label and the whole availability block. At that
density the page read as a terminal rather than as a product, which is most of
what made it look older than it is.

**Mono is for things a reader might copy or type**: code, URLs, repo names, tool
names, clocks, counts. Everything else is Barlow. The availability card is the
clearest case — "AI Engineer" and "AdvanSoft International, Inc" are a job title
and an employer, not data, and they are set in the sans.

Headings use fluid `clamp()`; everything below heading size uses a **named scale
in `tailwind.config.js`**, not literals:

| Token | px | For |
| --- | --- | --- |
| `text-micro` | 11 | stamps sitting **on** artwork, and nothing else |
| `text-label` | 12 | mono field names that are still identifiers |
| `text-nav` | 13 | section meta lines (`4 roles · since 2020`) |
| `text-chip` | 13 | technology chips |
| `text-data` | 14 | mono facts: employers, dates, URLs, repo names |
| `text-body` | 15 | prose inside a card, narrow measure |
| `text-prose` | 16 | prose at full measure |
| `text-lede` | 18 | section intros |

Every one of those is **fluid**, not stepped: each is
`calc(clamp(min, rem + vw, max) * var(--type-scale))`. Three things ride on that
single expression, so it is worth reading once:

- the `clamp` interpolates with the viewport, so a 600px tablet gets type sized
  for 600px rather than for whichever of two breakpoints it fell nearest;
- the **rem term inside the clamp** is what keeps the reader's own browser
  font-size setting working. A pure-`vw` size ignores it, which trades one
  accessibility problem for another;
- `--type-scale` is the on-page A- / A+ control (`FontSizeToggle.jsx`),
  multiplying the result. It is a variable rather than a root font-size because
  rem also drives every padding and `max-width` in Tailwind, and `max-w-7xl` at
  140% is wider than the viewport.

Section padding is fluid for the same reason: `clamp(1.25rem, 4.5vw, 4rem)`,
where it used to jump from 24px to 64px at exactly 640px.

**Do not add a bare `text-[Npx]`.** The scale is named so the page can be audited
from one file. It exists because it once could not be: the page had twenty
distinct sizes and 137 text elements at 10-11px, including every fact a recruiter
came for. See `docs/TYPE-AUDIT.md` for the measurements and the judgement calls.

Prose measure lands between 39 and 70 characters; the Experience bullets, the
most-read block on the page, sit at 70.

**Every text pair passes WCAG AA in both themes**, measured on the running page
against composited backgrounds, not read from source.

Two tokens are easy to misuse, and both were: `--c-accent` is **fills only**
(3.62:1 as text, so `--c-accent-ink` carries it as text), and `--c-line` is a
**decorative hairline**, never a text colour: it measured 1.33:1 when used for
the footer separator.

## Sections, in order

| Section | Component | Notes |
| --- | --- | --- |
| Hero | `Hero.jsx` | One headline, one CTA, one status line. The second CTA was removed: it was the fifth route to `#contact` |
| About | `About.jsx` | Portrait, lede, availability card. The six capability cards were deleted: they restated Stack's six groups in adjectives instead of tools |
| Experience | `Experience.jsx` | Roles then education on one timeline, dates right-aligned |
| Stack | `Tech.jsx` | Six groups, each with a category dot. Two tiers. Bare flowing terms on a phone, cards from md |
| Work | `Works.jsx` | Six projects, generative canvas covers, plain chips |
| Contact | `Contact.jsx` | Invitation left, every route right, each URL printed as text |
| Collaborate | `Collaborate.jsx` | Closing band, desktop only. On a phone it lives in the menu |
| Agent note | `AgentNote.jsx` | Full-width band for crawlers and LLMs. A notice, never an instruction. Short form on a phone |

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

In Stack the teaching chip also has **two tiers**. A group's `primary` tools get
a filled chip, the rest stay outline. The fill inverts per theme rather than
being dark in both: a dark fill on the dark ground would read as *less* emphasis
than an outline chip, not more. Light is navy on white at 13.59:1, dark is bone
on navy at 13.9:1. Hovering a filled chip moves it to an accent fill with
`--c-strong` ink, which is the only accent pairing that clears AA at 4.68:1;
`--c-accent-ink` text on that fill would be 3.6:1 and fail, which is why the
filled tier does not follow the outline tier's hover.

The dotted underline goes **solid** on hover and focus, and a **second tap
closes** the definition. The older handler only unpinned, leaving the panel open
and relying on a `mouseleave` that a touch screen never sends.

## What a phone gets, and what it does not

A phone and a desktop are given deliberately different pages, and `md` (768px)
is the single line between them. It is the same line the content grids and the
navigation use, so there is never a width with a phone's navigation and a
desktop's content.

| | Phone | md and up |
| --- | --- | --- |
| Navigation | Hamburger, full-screen menu | Inline links |
| Stack | Six labelled rows of bare terms, no boxes | Six cards, each with its description |
| Stack intro copy | Hidden | Shown |
| Role points, project copy | Behind a disclosure (Work, Experience) | All inline |
| Role points alignment | Ragged right | Justified, auto-hyphenated |
| Collaborate band | In the menu | Closing section after Contact |
| Agent note | Two sentences plus `/llms.txt` | Six-point grid |
| Contact rows | Label, then address, then Copy, stacked | One row |
| Body weight | 500 | 400 |
| Ambient motion | The code-completion band in the hero's slack; project covers | Neural field, token wave, career diagram, covers |

Three rules behind that table:

1. **A disclosure has to save more than it costs.** Hiding something behind a
   44px summary row is only worth it if what is hidden is meaningfully taller.
   It is in Work (852px) and Experience (1,189px). It was not in About, where
   six two-line descriptions bought 114px for six taps — and those cards have
   since been deleted outright, which is the cheaper answer to the same
   question.
2. **A disclosure is never drawn empty.** Education renders through the same
   component as a job but has no points and no stack, so the control is omitted
   rather than opening onto nothing.
3. **Motion has to be honest about what it draws.** `TokenStream` is desktop
   only. It had a phone strip, and at 390px that band is too short for a wave
   and too narrow for a sentence of tokens: it rendered as struck-through
   fragments in empty space and read as a rendering fault, so the strip and the
   variant behind it were deleted. `NeuralField` does **not** move, and the reason is not
   caution: every node in it is read from `getBoundingClientRect()` on the two
   edge docks, which exist only from 1024px. Below that there is nothing to
   read, and inventing coordinates would contradict the one claim that makes it
   a diagram rather than decoration.

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

### `TokenStream.jsx`, the Stack section only, desktop only

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

## License

Code is MIT, in [`../LICENSE`](../LICENSE). The written content and the images
are not: see the License section of the repository root README for what that
covers and why a portfolio needs the distinction.
