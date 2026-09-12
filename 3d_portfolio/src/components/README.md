# src/components

Thirty files. Read the table, not the directory.

## Change to file

| You want to change | Open |
| --- | --- |
| The headline, the CTA, the status line | `Hero.jsx` |
| How a section announces itself, and its fact line | `SectionHead.jsx` |
| Portrait, lede, capability cards | `About.jsx` |
| Roles and degrees, the timeline, date alignment | `Experience.jsx` |
| The six tool groups, and the category dots | `Tech.jsx` |
| Which tools get the filled chip, and each dot's colour | `stackGroups` in `../constants/index.js` |
| Project cards, and the drawings on them | `Works.jsx` |
| The contact card, and the URLs printed in it | `Contact.jsx` |
| Whether a contact row is one line or two | `.contact-row` in `../index.css` |
| The notice aimed at crawlers and LLMs | `AgentNote.jsx` |
| "Open to work": copy, animation, the Reach out button | `Availability.jsx` |
| Top bar: links, hide-on-scroll, mobile menu | `Navbar.jsx` |
| Right edge: section markers | `SideRail.jsx` |
| Left edge: contact icons | `ContactRail.jsx` |
| What a tech chip does on hover or click, and its two tiers | `TagTerm.jsx` |
| The reader's own text-size control (A- / A+) | `FontSizeToggle.jsx` |
| What collapses behind a disclosure on a phone | `MobileCollapse.jsx` |
| The diagram in the margin beside each role | `CareerTrack.jsx` |
| The "open to collaborators" closing band | `Collaborate.jsx` |
| The one scroll-reveal used by every card | `Reveal.jsx` |
| Shared canvas geometry and the seeded RNG | `../utils/draw.js` |
| Command palette actions | `CommandPalette.jsx` |
| The hero network drawing | `NeuralField.jsx` |
| The token wave in Stack | `TokenStream.jsx` |
| The Python search band on a phone | `CodeCompletion.jsx` |
| Brand glyph paths, and the list of off-site links | `icons.js` |
| Scroll-reveal timing used across the page | `Reveal.jsx` |
| The scroll hairline at the top | `ScrollProgress.jsx` |
| Clock zones and their labels | `LiveClock.jsx` |
| The colophon line | `Footer.jsx` |

## What owns what

Each file's header comment states what it owns and what it explicitly does not.
Those lines are the contract; when a change crosses two files, one of them is
probably wrong.

A few boundaries worth knowing before editing:

- **`icons.js` owns every off-site destination.** `SocialIcons`, `ContactRail`,
  `Contact` and `CommandPalette` all read `socialLinks()`. Adding a profile is
  one edit, in `constants`, and it appears in four places.
- **`useActiveSection` owns "which section am I in".** `Navbar` and `SideRail`
  both consume it. They used to run separate observers and could disagree.
- **`ThemeToggle` owns the theme.** `CommandPalette` dispatches a `toggle-theme`
  event rather than writing `data-theme` itself; when it did both, the toggle
  desynced and needed two clicks.
- **`TagTerm` has two modes.** Default teaches (hover opens the definition);
  `plain` states (native tooltip only). Cards pass `plain`.

## Traps in this directory

- **`Works.jsx` seeds each cover's RNG from the project name**
  (`hash(name || cover)`). Renaming a project silently changes its drawing. The
  build will not tell you.
- **Framer propagates variants only through motion components.** Wrapping
  children in a plain `<div>` breaks the chain and leaves them stuck at
  `opacity: 0`. This has caused two separate invisible-content bugs.
- **`viewport={{ amount: n }}` is a raw IntersectionObserver threshold**, and
  `intersectionRatio` is capped at `viewportHeight / elementHeight`. A section
  taller than about four viewports can never satisfy `0.25`. Use `"some"`.
  This once made the whole Work section invisible on every phone.
- **Canvases must re-read their size.** A canvas sized once inside an effect
  stays at its old backing-store dimensions after a resize, and static ones never
  repaint at all.
