# Learning notes

Every technique this site uses, explained from scratch.

The rest of the docs assume you already know the craft. This page does not. Each
entry is the same three things: **what it is** in plain words, **where it lives
here** so you can open the real thing, and **what to try next** if you want to
learn it properly rather than just recognise it.

Read it with the site open (`npm run dev`) and the file beside you. Nothing below
is theory — all of it is running on the live page right now.

---

## 1. One source of facts

**In plain words.** Every number and sentence a visitor reads comes from one file.
Nothing is typed twice. If you add a project, the page's counters, the search
index and the "6 built · 1 live" line all change by themselves.

**Why it matters.** The alternative is writing "6 projects" in a heading, adding a
seventh project, and shipping a page that lies about itself. That is the single
most common bug in personal sites, and it is invisible — nothing errors.

**Where it lives.** `src/constants/index.js` holds the facts. Every section's
eyebrow is one line of arithmetic over them — `src/components/Tech.jsx` and
`src/components/Works.jsx` open with theirs:

```js
const STACK_META = `${stackGroups.length} areas · ${
  new Set(stackGroups.flatMap((g) => g.items)).size      // counted, never typed
} tools`;

const WORK_META = `${projects.length} built${LIVE ? ` · ${LIVE} live` : ""}`;
```

That `LIVE &&` is the honesty clause: ship nothing live and the line says
`6 built` rather than `6 built · 0 live`. A number that can be zero needs to know
how to disappear.

**Try next.** Add a fake seventh project to `constants` and watch four places
update. Then delete it. That loop — change data, watch the UI follow — is the
whole idea behind React, and this is the smallest honest example of it.

---

## 2. Components, props, and why the page is not one file

**In plain words.** A component is a function that returns some HTML-shaped thing.
Props are its arguments. The page is about thirty of them stacked up.

**Where it lives.** `src/components/TagTerm.jsx` is a good first read: one
component, a few props (`name`, `plain`, `primary`), and two very different
outputs depending on them.

**The rule this repo follows.** One concern per file, named after the concern, and
a header comment saying what the file owns *and what it does not*. When a change
crosses two files, one of them is probably wrong.

**Try next.** Open `src/components/README.md` and pick any row. Open that file and
read only its header comment. You should be able to predict what is inside before
scrolling.

---

## 3. CSS custom properties, and how six themes cost almost nothing

**In plain words.** A custom property is a variable you can use in CSS:
`--c-accent: 255 78 58` then `color: rgb(var(--c-accent))`. Change the variable and
everything using it changes at once.

**Why it is clever here.** Six palettes are six blocks of variables. No component
knows which theme is on. Switching themes rewrites one attribute on `<html>` and
the whole page re-colours with no JavaScript touching any element.

**The second axis.** `data-theme` says *which palette*; `data-scheme` says *light
or dark*. Structural rules (shadows, grain, the hero bloom) key off the second,
because `:not([data-theme="dark"])` stops being true when you add a third palette.

**Where it lives.** The top 200 lines of `src/index.css`, and `ThemeToggle.jsx`.

**Try next.** In DevTools, set `document.documentElement.dataset.theme = "ink"`.
Then find one hard-coded colour anywhere in `src/components/` — there should not be
one.

---

## 4. `position: sticky` — the Roles deck

**In plain words.** `sticky` means "behave normally until you reach this position,
then stop and let everything scroll past you". The Roles cards each stop 96px below
the top, so the next one slides over the last.

**The two things that break it, both real bugs here.**

1. An ancestor with `overflow: hidden` or `auto` turns into a scroll container, and
   sticky resolves against *that* instead of the page. The card silently stops
   sticking. (`html` and `body` are exempt — their overflow propagates to the
   viewport.)
2. A card taller than the space below its stick point hides its own bottom — it
   pins, and the part below the fold never arrives. Measured here at 1280×620 with
   large text: **192px of a card was unreachable**.

**Where it lives.** `.role-sticky` in `src/index.css`, `useDeckFits` in
`Experience.jsx` — which measures the tallest card and turns the whole effect off
rather than hiding content.

**Try next.** Add `overflow-x: hidden` to the `<ol>` in `Experience.jsx` and watch
the deck become a plain list with no error anywhere. Then remove it.

---

## 5. Lazy loading: making the expensive thing optional

**In plain words.** `import()` with parentheses fetches a file *later*, as a
separate download, instead of bundling it into the main one. The page loads fast,
and the heavy part arrives only for readers who will actually see it.

**The numbers here.** three.js is **131 kB gzipped** — about four times the app
itself. Bundled, every phone would download it to run a scene phones never show.
Lazily imported behind three checks (desktop, motion allowed, WebGL available), a
phone downloads **none of it**.

**The trap.** Your bundler can undo this by accident. Naming three.js in
`manualChunks` puts it back in the eager graph; importing it as a namespace
(`await import("three")`) defeats tree-shaking and costs 60 kB more.

**Where it lives.** `NeuralField.jsx` (the decision), `NeuralField3D.js` (the
payload), `vite.config.ts` (the chunking rule), `TagTerm.jsx` (the same pattern for
icons, with a module-level cache so 33 chips share one download).

**Try next.** `npm run build` and read the chunk table it prints. Then change
`import("./NeuralField3D")` to a normal top-of-file import and build again. The
number moves by 131 kB.

---

## 6. Retrieval: how the ask box finds an answer without an AI

**In plain words.** It is search, not intelligence. Split the question into words,
score every paragraph on the page by how many rare words it shares with the
question, show the best sentences.

**The three ideas that make it work.**

- **IDF (inverse document frequency).** A word in every paragraph ("data") tells
  you nothing; a word in one ("federated") tells you everything. Weight each term
  by how *rare* it is.
- **Length normalisation.** Long paragraphs match more words by accident, so divide
  by length. Without it, "what did he ship on Azure" answered with a project that
  never mentions Azure.
- **Stemming.** The page says "Shipped", the reader types "ship". Chop common
  endings off *both* so they land on the same key. It does not have to be real
  linguistics — it has to be applied identically to both sides.

**Where it lives.** `src/utils/answer.js`, ~120 lines, no dependencies.

**Try next.** In `answer.test.mjs`, add a question you would ask this page. Run
`npm test`. If the answer is wrong, print the scores and find out which of the
three ideas above is missing.

---

## 7. Masked gradients: the light that runs around a card

**In plain words.** You cannot animate a border's colour *around* a box. So: paint
a cone-shaped gradient over the whole card, then cut a hole in the middle so only a
1.5px rim shows. Spin the cone, and the lit part appears to travel the edge.

**The two pieces.**

```css
background: conic-gradient(from var(--role-edge), transparent 0 262deg, accent 336deg, transparent 360deg);
mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
mask-composite: exclude;   /* subtract the inside from the outside = a ring */
```

`@property --role-edge` is what makes the angle animatable — without it the browser
treats the variable as an unknown string and nothing moves.

**Where it lives.** `.role-card[data-current="true"]::before` in `src/index.css`.

**Try next.** Change `mask-composite: exclude` to `add` and watch the ring become a
filled card. That one keyword is the whole trick.

---

## 8. Reading the browser instead of guessing

**In plain words.** A media query knows the window size. It does not know the
reader bumped the text size, or that a font swapped in and made a card taller. When
the thing you care about is *"does this fit?"*, measure it.

**Three places this repo measures rather than guesses.**

| Question | How it is answered |
| --- | --- |
| Does the Roles deck fit? | Measure the tallest card against the room, with a `ResizeObserver` and 32px of hysteresis |
| Does the hero's code band fit? | Measure the slack, spend it on lines of code, hide only if even four will not fit |
| Which role is the margin diagram about? | Read the pinned card positions on a timer — never inside the frame loop |

**The performance rule that comes with it.** Reading a position *after* writing a
style forces the browser to redo layout immediately. Do all the reads, then all the
writes. Here that was **50ms → 33.6ms** on the worst frame.

**Try next.** In `useCoveredCards`, move the `dataset.covered` write back inside the
measuring loop and watch the worst frame in DevTools' Performance panel.

---

## 9. Motion that respects the reader

**In plain words.** Some people get motion sick. The operating system has a switch
for it, and a good site listens.

**The catch that bit this repo.** The CSS block for `prefers-reduced-motion` zeroes
*CSS* animations. Framer Motion writes inline styles from its own loop, so it
ignores that block completely. Stopping it needs
`initial={reduced ? false : "hidden"}` in the component.

**Where it lives.** `MotionConfig reducedMotion="user"` in `App.tsx`, the
`@media (prefers-reduced-motion: reduce)` blocks in `src/index.css`, and the
`useReducedMotion()` calls in `Hero.jsx`, `Works.jsx`, `Availability.jsx`.

**Try next.** Turn reduced motion on in your OS, reload, and check three things:
the hero field does not fetch three.js, the project cards stop tilting, the
role-edge light parks instead of travelling.

---

## 10. Tests without a framework

**In plain words.** A test is a file that checks something and exits non-zero when
it is wrong. You do not need Jest for that — Node has `assert` built in.

**What makes these tests good, and it is not the tooling.**

- **Named for the failure**, not the function:
  `test_ship_matches_shipped`, `test_every_passage_is_quoted_not_written`.
- **Proved to fail.** Every guard here was run against a deliberately broken copy
  before being believed. A check that has only ever passed is not yet a check.
- **They protect claims, not code.** "Answers are quoted, never generated" is a
  promise the page makes to a reader; the test is what keeps it true.

**Where it lives.** `src/utils/*.test.mjs`, run by `npm test`, run again by CI.

**Try next.** Delete a line from `public/llms.txt` and run `npm test`. Read the
failure message — it names exactly what went missing.

---

## 11. Accessibility, as mechanics rather than virtue

**In plain words.** Some people navigate with a keyboard, some with a screen
reader, some with the text size at 140%. These are not edge cases; they are Tuesday.

**The specific things this page does.**

| Thing | Why |
| --- | --- |
| A visible focus ring on everything (`:focus-visible`, 2px accent) | Without it, a keyboard user cannot see where they are |
| `aria-hidden` on every decorative canvas and glyph | The name is already in text beside it; announcing both reads it twice |
| A live region that says "GitHub copied to clipboard" | A copy button that only changes colour tells a screen-reader user nothing |
| 44px minimum touch targets on a phone | A finger is not a mouse pointer |
| Escape closes the palette and the glossary, and returns focus | Otherwise focus lands on `<body>` and tabbing restarts from the top |

**Try next.** Unplug your mouse and reach the "Reach out" button using only Tab and
Enter. Anything that feels wrong is a bug worth filing.

---

## 12. Your comments are compiled too

**In plain words.** Tailwind does not understand your code. It reads every file
you point it at as plain text and collects anything that *looks like* a class
name, then generates CSS for whatever it found. It cannot tell the difference
between a class name and an English word — and it does not skip comments.

**How this was discovered, while writing these very notes.** Plain-English
comments were added to seven source files. The build output grew by 20 bytes and
the CSS hash changed, so the two builds were diffed rule by rule:

```
rules added by the comments: 1
  + .table{display:table}
```

One sentence explaining timezone maths contained the ordinary word for a grid of
rows. `tailwind.config.js` scans `./src/**/*.{js,jsx,ts,tsx}`, the extractor found
that word, and a real CSS rule shipped to every visitor.

Then it happened a second time: the comment *explaining the bug* used the word
again, and the rule came straight back. It is now explained here, in a Markdown
file Tailwind never reads.

**Why this matters beyond 20 bytes.** It is the same mechanism behind a bug this
repo hit for real, and the reason for a rule in the README: **Tailwind scans for
literal strings**, so `bg-${group.dot}` built at runtime produces nothing, while
the literal `bg-cat-data` sitting in a data file is found. Once you know the
compiler is doing text search, both behaviours stop being surprising.

**Try next.** Put the word `flex` on a line of its own in a comment in any file
under `src/`, run `npm run build`, and diff the CSS against the previous build. Then
decide whether you want a build step that reads your prose.

---

## 13. Showing less without deleting anything

**In plain words.** A long page is not fixed by writing less. It is usually fixed
by drawing less *at first*, and letting the reader ask for the rest.

The Projects grid on a phone was six cards, 2,818px — 29% of the whole page, and
a reader heading for the contact details crossed every pixel of it. Now three are
drawn and a button offers the others. **Nothing was deleted:** all six are in the
HTML, in `llms.txt`, and in the `<noscript>` block a crawler reads.

**The arithmetic that makes it worth doing.** A disclosure costs a 44px row and a
tap. It only pays if what it hides is much taller than that. Here it hides
1,424px for one tap, which is an easy yes; in About it would once have hidden
114px behind six taps, which is why that idea was rejected and the cards deleted
instead.

**Where it lives.** Two files, and they are one mechanism:

```jsx
// Works.jsx — how many, and what the button counts
const PHONE_CARDS = 3;
<div data-collapsed={showAll ? undefined : "true"} className="projects-grid ...">
```

```css
/* index.css — the hiding itself */
@media (max-width: 639px) {
  .projects-grid[data-collapsed="true"] > *:nth-child(n + 4) { display: none; }
}
```

**Why the limit is CSS and not `projects.slice(0, 3)`.** A `slice` has to know
how wide the window is, and JavaScript only learns that by asking — a media
query in JS, a listener for when it changes, and a first render that guesses and
then corrects itself, which the reader sees. The CSS rule is the browser doing
the same job with the right answer on the first paint. The slice would also take
the card out of the document, and a crawler reads the document.

**Two ordering traps, and both are the same lesson: the DOM changes when React
commits, not when you call `setState`.**

1. A visitor arriving at `/#pb-card-deck` needs that card in the layout *before*
   the browser goes looking for the anchor. So the state starts correct —
   `useState(asked)` — rather than being fixed by an effect afterwards.
2. A visitor clicking a link to a hidden card gets scrolled by the browser
   immediately, while three cards above it are still hidden — landing 1,391px
   short. The obvious fix, a `requestAnimationFrame` inside the handler, **also
   measured 1,391px off**: that frame can run before React has painted, so it
   corrects against the same wrong layout. An effect keyed on the state cannot
   run too early.

**Try next.** Set `PHONE_CARDS` to 1 and watch the button's own label change —
it is derived, so it cannot say "3 more" while hiding five. Then open
`/#pb-card-deck` on a narrow window and watch the deck open before the scroll.

---

## 14. What to build next, if you are learning from this repo

In rough order of how much you learn per hour:

1. **Add a project to `constants` and change nothing else.** Watch six places
   update. This teaches derived state better than any tutorial.
2. **Write one test for something you believe.** Then break the thing on purpose and
   watch it fail. That habit is worth more than any framework.
3. **Add a glossary term** to `constants.glossary` and hover the chip. One data
   edit, three behaviours: tooltip, panel, "learn more" link.
4. **Make a section eyebrow count something else** — `STACK_META` in
   `Tech.jsx` says `6 areas · 33 tools`; make it name the largest area instead.
   Three lines, and you will have to decide what is honestly derivable.
5. **Try act 4 of the campaign** (see [BACKLOG.md](BACKLOG.md)): make a section's
   heading arrive as you scroll into its scene. Everything needed is already here —
   `Reveal.jsx` and the scene structure.
6. **Find a fact the page states twice.** Dump every visible text node with the
   section it sits in and count the repeats — that is exactly how About was found
   restating three project descriptions word for word. Most of what you find will
   be legitimate (a nav label equals its heading on purpose); the value is in
   telling those apart.

## See also

- [ARCHITECTURE.md](ARCHITECTURE.md) — the same systems, assuming you know the craft
- [DECISIONS.md](DECISIONS.md) — why each of these was chosen over the alternative
- [../README.md](../README.md) — which file to open for a given change
