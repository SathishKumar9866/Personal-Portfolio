# Worklog

## 2026-09-12: the hero's empty third, and what went in it

### The space was left over, not designed

The hero is `min-h-screen` and top-aligned. On a phone its content ends at 591
of 844, so 253px of it is slack, and the About section's padding takes the gap
from the last hero element to the word "Overview" to **331px — thirty-nine
percent of the screen with nothing in it**. The thing that earns that space on a
desktop is the scroll cue, and the scroll cue is `hidden sm:flex`. At 768x900
the same measurement is 346px.

### What went in it

A band that completes a Python binary search and then runs it, with the array
it is searching drawn underneath. Three cases cycle in a fixed order, and the
values are random every time, so it is never the same search twice:

| Case | What the reader sees |
| --- | --- |
| `found` | the window narrows onto the target, `return mid` |
| `missing` | the loop exhausts, `return -1` |
| `empty` | `if not nums` is the only line that runs |

Which case comes next is deliberately **not** random. An edge case that only
appears by luck is one a reader may never see, and the guard clause earning its
place is the entire point — the page claims "the evidence it works" and
"measured, not estimated", and this is that claim in miniature.

**The steps are the execution.** `trace()` runs the same algorithm the band
prints and records which line it was on, so the highlighted line and the drawn
`lo..hi` window cannot disagree: there is only one traversal. Verified against a
real run, `[4,12,16,18,21,27,32]` with target 19 — guard, init, then three
rounds of while/mid/branch, then exhausted, then `-1`.

### It is DOM, and it yields

Two decisions worth keeping.

**No canvas and no requestAnimationFrame.** It is a dozen lines of text and
seven boxes, so it is DOM on a `setTimeout` chain at about 11 frames a second,
not 60. Its two siblings are canvases because they draw geometry; this draws
text, and text in a canvas is text nobody can select, scale or theme.

**It measures whether it fits, rather than assuming a breakpoint.** The slack is
the hero's height minus its content's, so it depends on the screen *and* on how
tall the copy wrapped *and* on the reader's text-size control, which changes the
content's height without changing anything a media query can see. Measured:

| Condition | Slack | Band |
| --- | --- | --- |
| 390x844 | 253px | shown |
| 430x932 | 406px | shown |
| 768x900 | 346px | shown, clearing the scroll cue by 16px |
| 360x640 | 49px | hidden |
| 740x360 landscape | 0px | hidden |
| 390x844 at 112% text | 221px | hidden |
| 390x844 at 140% text | 18px | hidden |

Drawn without that check at 360x640, it overlapped the lede by 156px. When it
hides, its timer chain does not run either.

### Verified

- the trace is a real binary search: window narrows, `mid` tracks it, and the
  returned index is the cell that holds the target
- on every settled result the line that produced it is inside the scrolled code
  window — `missing` shows lines 6..12 with `return -1` active, `empty` shows
  0..6 with the guard's `return -1` active, `found` shows 2..8 with `return mid`
- `prefers-reduced-motion` verified by running it, not by reading it: all 13
  lines present, the final state shown, and byte-identical after 2.5s
- not rendered at all at 1440, where `NeuralField` already owns the landing view
- both themes; `scrollWidth` never exceeds the viewport at any width tested

`npm run lint` 0 errors (27 pre-existing warnings), `npm run build` exit 0.

### Not done

Real-device QA on iOS and Android, still. And a band that shrank to fit instead
of hiding would survive the 112% case, which currently misses by one pixel —
221px of slack against 222px needed.

## 2026-09-12: four layout faults on a phone, all found by measuring

Branch `fix/mobile-layout-and-nav`. Every number below was read off the running
page in Chrome, not inferred from the rule that produced it.

### The contact card was sized by the wrong width

The rows used viewport breakpoints, and the card's width does not follow the
viewport monotonically: full width in one column up to `lg`, then the grid
splits and it shrinks to ~460px. So `sm:flex-row` handed the roomiest layout to
exactly the width with the least room. At a 1024 viewport the address column was
193px against a 281px address and all four broke mid-domain —
`sathishkumar786.ml@gm / ail.com` — while the `↗` floated alone at the right
edge.

A container query on the list replaced them, so the decision is made by the
width that actually constrains the row. Below 32em a row is two lines, label and
Copy on the first, the address given the whole of the second: one line fewer
than the three the viewport version stacked on a phone, and the card is 538px
tall instead of 656px at 380px wide.

The threshold is arithmetic: 7rem label + 0.75rem + the longest address
(LinkedIn, 281px) + 0.75rem + the copy button (74px) = 491px. 32em is that plus
21px of slack against a card measuring 529px at 1440, its narrowest single-row
case.

**It is `em` and not `rem`, and that is the part worth remembering.**
`--type-scale` multiplies the type tokens without touching the root font size,
so a `rem` threshold is frozen while the text grows. A container query resolves
font-relative units against the *container's* font-size, so setting
`font-size: calc(1rem * var(--type-scale))` on the container is what makes the
breakpoint follow the reader's A+ control. At 140% with a frozen 32rem the
addresses grew past the row and the copy button wrapped onto a line of its own.

### A jump is not a reading gesture

Tapping Experience in the mobile menu smooth-scrolls about 3,000px downward. The
hide-on-scroll handler counted that as hundreds of positive deltas, hid the bar
on the way, and the reader landed on the section with no hamburger — and no
route back into the menu except scrolling to the top, because the only other
path to `setHidden(false)` is the `y <= 160` guard. Measured before: all five
menu links landed with the bar at `translateY(-100%)`.

It cannot be a fixed timeout, because the browser scales the smooth scroll with
the distance — 433ms to About, 1,517ms to Contact — and a window long enough for
the longest jump would freeze the bar well past the end of the shortest. So the
jump holds the bar until the reader takes hold of the page: a `touchstart`, a
`wheel` or a `keydown` ends it, whatever the animation is still doing. The 2.5s
timeout is only a backstop for a jump to the section you are already on, which
scrolls nothing and so would never end on its own.

Every in-page anchor changes the hash, which covers the menu, the desktop links,
the Hero CTA and Availability. The two that scroll without one, `CommandPalette`
and `SideRail`, dispatch `section-jump` — the same window-event idiom the
palette already uses for `open-command` and `toggle-theme`.

### Three things positioned against the wrong box

All the same shape: an element positioned against its parent when it had to fit
inside the screen.

1. **The Stack glossary panel.** `left-1/2 -translate-x-1/2` centres it on its
   chip, and `w-[min(17rem,calc(100vw-2rem))]` caps the width while saying
   nothing about the position. At 390px, React's panel ran 163 to 435 and took
   the document's `scrollWidth` to 435 with it, so opening it made the whole
   page scroll sideways; PySpark's started at -63, where nothing can reach it.
   Now centred on the chip only while that fits, sliding along the edge when it
   does not, from a **layout** effect so it is never painted in the wrong place
   first.
2. **The mobile menu clipped its own top.** A centred flex column that is also
   its own scroll container splits negative free space evenly: 961px of content
   in an 844px box put the first link at top -21 with `scrollTop` already at its
   minimum of 0. About was cut off and no amount of scrolling could reach it.
   `justify-start` with `mt-auto`/`mb-auto` centres identically when there is
   room — verified symmetric at 390x1400, 257px above and below — and collapses
   to 0 when there is not.
3. **The close button scrolled away.** `absolute` inside that scroll container
   put it at top -97 at the bottom of the menu, and the hamburger that opened it
   is underneath the overlay, so a phone had nothing left to close with; Escape
   needs a keyboard. `fixed` now — which needed `backdrop-blur-md` to go, since
   a backdrop filter makes its element the containing block for fixed
   descendants. That blur was doing nothing anyway: `bg-primary` is
   `rgb(15 34 40)` with no alpha.

### One `readable()`, because four copies had drifted

Four components turned an href into text for a human, each with its own version
of the line, and three disagreed on the same visit: the contact card said
`linkedin.com/in/sathishkumarai`, the mobile menu said `www.linkedin.com/...`,
the palette said `www.linkedin.com/.../` with the slash still on. It now lives
next to `socialLinks()` in `icons.js`, which already owns the one list of
destinations all four are printing, and strips scheme, `www.`, trailing slash
and `mailto:`. Display only; every caller keeps the real href.

The `www.` was not cosmetic: four characters of monospace is 36px, and that was
the 36px deciding whether a contact row fit on one line.

### Verified

Dev build, both themes, at 390x844, 740x360 landscape, 390x1400, 1024x860,
1150, 1280 and 1440x900, and at both ends of the text-size control:

- no address breaks mid-word at any width, and `scrollWidth` never exceeds the
  viewport, including with a glossary panel open
- all five menu links land with the bar at `translateY(0)` and the hamburger
  passing an `elementFromPoint` hit test at its centre
- the palette's "Go to Contact" (8,903px, no hashchange) and the SideRail dot
  both land with the bar visible
- hide-on-scroll still works after a jump: reading down hides it, a 45px upward
  flick returns it, and a wheel 200ms into a 1.5s jump ends the suspension at
  once
- in the menu, the first link is reachable and the close button holds top 20
  from the first scroll position to the last
- all 66 glossary panels sit inside the viewport at 390px, all 33 at 1440px

`npm run lint` 0 errors (27 pre-existing `react-refresh` warnings),
`npm run build` exit 0.

### Still not done

Real-device QA on iOS and Android. Everything here is Chrome with emulated
viewports, and the iOS rubber-band clamp in the scroll handler has still never
run on a real iPhone.

## 2026-09-12: merged, deployed, and made to work on a phone

Branch `redesign/highway-premium` squash-merged as `630a38f` and deleted. Six
commits on `main` since: `4b0c58f`, `632b392`, `dd2c5c1`, `8fad65f`, `0c8b15d`,
`d9e8a7f`. Live at <https://sathishkumarai.github.io/>, built from `main` by
Actions in the `SathishKumarAI.github.io` repo.

### The bug that mattered

**The mobile menu had never covered the screen.** `fixed inset-0` inside a
`<nav>` that always carries a transform for hide-on-scroll, and a transformed
ancestor becomes the containing block for its fixed descendants. So the overlay
resolved against the 76px nav box: measured 192px tall against a 1009px
viewport, with the page showing through the rest of it. Broken since
hide-on-scroll landed, and not something a screenshot of the nav would reveal.
Portalled to `document.body`, and given what a modal owes its reader and never
had: Escape, scroll lock, focus restoration, its own close button.

### "There is no hamburger on mobile" was three separate faults

Worth separating, because only one of them was the thing being described.

1. **Between 640px and 768px there was no hamburger at all.** The nav switched
   at `sm` while the content collapse and both content grids switch at `md`. At
   700px the desktop cluster measured 684px wide inside a 555px row,
   overflowing by 129px with zero gap to the identity. All three switch at `md`
   now, so exactly one navigation exists at every width.
2. **The bar hid and did not come back.** One symmetric `Math.abs(delta) > 6`
   gate for both directions meant a small upward flick did nothing: measured,
   about 120px of deliberate upward scroll plus a 300ms transition. Now
   asymmetric, 12px to hide and 2px to show, so it returns on a single 40px
   flick. Scroll position is clamped to `[0, maxScroll]` first, because iOS
   rubber-bands past both ends and those are not gestures.
3. **The page scrolled sideways.** The Contact card used `fadeIn("left")`, which
   parks an element at `x: +100` until its section scrolls into view. At 700px it
   sat at left 164 inside a cell at left 64 and pushed the document to 721px, so
   the page carried a horizontal scrollbar from load until the reader reached
   Contact.

The tempting fix for the third, `overflow-x: hidden` on an ancestor, would have
hidden the symptom at every width and broken the sticky career diagram in
Experience: an overflow container is also a scroll container, and `sticky` stops
working inside one.

### Text that was clipped, not overflowing

Reported as "the text is overflowing on mobile", in the Overview section. The
cause was the opposite of overflow.

The status card's value lines carried `whitespace-nowrap`. A grid item defaults
to `min-width: auto`, whose floor is the min-content width of its contents, and
a line that may never wrap has a min-content width equal to the entire string.
"AI Engineer &middot; AdvanSoft International, Inc" therefore held the card at
388px inside a 350px column, and because the card also has `overflow-hidden`,
the excess was not spilling out, it was being **cut off mid-word**: the bio read
"...because tha" and "Calm, disciplined,".

`whitespace-nowrap` applies from `md` up now, values get `min-w-0` and wrap, and
the About grid declares `grid-cols-[minmax(0,1fr)]` so an unbreakable string can
never widen the column again.

Two smaller cases of the same complaint: the role points were **justified at a
40-character measure**, where the browser stretches word gaps until the lines
comb and auto-hyphenation starts breaking "product" into "prod-uct", every line
ending flush hard against the right edge; and a repo name was being `truncate`d
by 55px behind an ellipsis. Justification is `md`-and-up now, and the repo name
wraps on a phone.

### A phone and a desktop are different pages now

The page ran **14,494px at phone width** at the start of the session, about
fourteen screens, and reaching the contact details meant scrolling past all of
it. It is **10,520px** now, a 27% cut, with every headline still on the page.

What changed, and the rule behind each:

- **Secondary detail collapses behind a native `<details>`**, but only where it
  pays: Work (852px saved) and Experience (1,189px). Not About, where six
  two-line descriptions bought 114px in exchange for six taps. A disclosure has
  to save more than it costs.
- **A disclosure is never drawn empty.** Education renders through the same
  `Role` component as a job but carries no points and no stack, so a phone was
  getting a "WHAT I DID" control that opened onto nothing.
- **Stack is one block with six labelled rows on a phone**, cards from `md`.
  Six bordered cards each with a description was close to a screen per card for
  content that is really a list. 1,809px to 1,465px.
- **The Collaborate band is desktop-only**, in the menu on a phone, and moved to
  the end of the page. **The agent note is present at both widths in two
  lengths**: two sentences plus the `/llms.txt` pointer on a phone, the
  six-point grid on desktop. Hiding it outright was wrong, since it is the one
  part of the page written for the readers who summarise him to other people.
- **Contact rows stack.** Three things were competing for a 350px line: a fixed
  7rem label, the address and a copy button. The address is the longest and the
  only one worth reading character by character, and it got whatever was left.
- **Body text is weight 500 on phones.** Barlow at 400 is airy by design, and
  that airiness reads as thin at arm's length, especially light-on-dark.

### Type and padding are fluid

Every size in the named scale interpolates with the viewport between a floor and
a ceiling, and section padding went from a hard 24px-to-64px jump at exactly
640px to `clamp(1.25rem, 4.5vw, 4rem)`. Measured: padding 20px at 390, 34.5px at
767, 64px at the ceiling; chips 13.07, 13.63, 14px across the same widths.

Every clamp keeps a **rem term beside the vw term** deliberately. A pure-vw size
ignores the reader's own browser font-size setting, which would trade one
accessibility problem for another.

### A reader-controlled text size

Four steps, 100 to 140 percent, beside the theme toggle on desktop and in the
menu on a phone, persisted and restored in the same pre-paint pass as the theme.

It multiplies one variable rather than setting a root font-size, and that is the
whole design: rem drives every padding, margin and `max-width` in Tailwind, and
`max-w-7xl` at 140% is wider than the viewport. Text is what a reader wants
bigger; the layout is not.

Getting there surfaced one overflow: the hero headline's second sentence carried
`whitespace-nowrap`, which held at 100% and pushed 1314px against a 1440px
window at 140%.

### A diagram in the margin beside each role

The roles list is `max-w-2xl` inside a `max-w-7xl` section, which left a 480px
column empty down the whole section: the largest unclaimed horizontal space on
the page. It now holds a labelled schematic of the role the reader is level
with, changing as they scroll. One canvas and one rAF loop for four diagrams,
not four canvases.

Two bugs while wiring it, both caught by measuring rather than looking:
education was getting `data-role-index` values that collided with the first two
jobs, and wrapping the list in a plain `<div>` to build the two-column grid cut
framer-motion's variant propagation, rendering the entire roles column at
opacity 0.

### The token wave was on screen six seconds in every fifty

Reported as "it only shows once". It did. The baseline translated downward at
11px/s and wrapped over a range of `h + 0.55h`, a period of about fifty seconds
at a 352px canvas, and the tokens ride that baseline so they left with it.
Measured: painted ink fell 3.37% to 0.00% over five seconds and stayed empty.

It was also drawing at 0.14 alpha inside a 0.6 opacity layer, about 8%
effective, and each box picked its label from the current time, so twelve boxes
flickered through a seventeen-piece list twice a second instead of carrying
anything. The baseline oscillates inside the band now, the label is indexed by
emission order so a token holds one piece for its whole crossing, and there are
six sentences instead of one.

It runs on a phone too, in a strip of its own above the stack block, because at
390px there is no empty band to borrow. `NeuralField` does not, and that is
structural rather than cautious: every node in it is read from
`getBoundingClientRect()` on the two edge docks, which exist only from 1024px.

### Smaller, but each one a real defect

- **The hero CTA skipped the career history.** "See my work" pointed at `#work`,
  jumping from the hero straight to the project grid. It reads "Start with my
  experience" and lands on `#experience`.
- **And then landed in the wrong place.** `.hash-span` carried
  `scroll-margin-top: 10.5rem`, parking the anchor 168px down the viewport with
  a 78px bar over the top, so jumping to Experience left most of Overview on
  screen. 5.5rem clears the bar and nothing more.
- **The landing page had 140px of dead space** between the navbar and the name.
  The hero centred a 549px composition in a 900px viewport, and the matching
  136px at the bottom was not dead: the scroll cue lives there. Top-aligned with
  an explicit padding now, 140px to 52px.
- **"repo" became "GitHub repo"**, and the menu prints full destinations under
  each label the way Contact does, because a label alone asks the reader to
  trust where a tap goes.
- **The colophon was checked rather than trusted.** Barlow, Newsreader and
  JetBrains Mono are all imported in `main.tsx` and all three are in use, so the
  type credit is accurate. It now also records that the site started in
  **August 2024** (first commit) and that this version is **September 2026**, in
  "Month YYYY", the same shape the Experience timeline prints. The old "2026.09"
  was the only `YYYY.MM` on the page.

### Contributions, and a licence that says what it covers

`CONTRIBUTING.md` plus a closing band on the site. LLM-written patches are
welcome explicitly, with one condition, the same one a human patch has: the pull
request explains its reasoning rather than its diff. A patch a model wrote and
nobody can explain is a patch nobody can safely change later.

The MIT LICENSE had been in the repo since 2024 and neither README mentioned it.
Both now carry a License section that draws a line the MIT text does not: the
grant covers the software, the written content and images are reserved. On a
portfolio that distinction is the point, because the text *is* the product.

### Repository protection

28 public repos across the account now refuse force-pushes and deletion of the
default branch and require linear history. 23 private repos could not be: branch
protection on private repositories is a paid feature for personal accounts. 9
forks were skipped deliberately.

The full reasoning, including why requiring pull requests would have locked the
owner out of his own `main`, is in `../docs/REPO-SECURITY.md`. The short version
worth repeating: **outside contributors were never able to push anyway.** Anyone
without write access can only fork and open a PR. Protection guards against the
owner's own mistakes, not against strangers who were never getting in.

### Verification

Measured in Chrome against the running app and the deployed URL, at 390, 408,
700, 767 and 1440px, in both themes.

| Claim | Measurement |
| --- | --- |
| Phone page length | 14,494px to 10,520px |
| Contrast failures | 0, both themes, both widths |
| Text below 12px | 6-7, all canvas captions |
| Horizontal overflow | none at any width tested |
| Touch targets under 44px | 0 non-exempt; 2 are inline links in sentences, which WCAG 2.5.8 exempts |
| Mobile menu | 1009px of a 1009px viewport, parented to BODY |
| Nav return on scroll up | ~120px to a single 40px flick |
| Text size control | 4 steps, proportional, 0 overflow at any step |
| Token wave | ink 3.44-3.90% across 8 samples, was decaying to 0.00% |
| Token wave on phone | ink 18.32-19.09%, crosses 0 text glyphs |
| Career diagram | 4 tracked roles, 4 distinct diagrams, 0 text glyphs crossed |
| Card heights | 0px delta per row, both grids |
| Status card | 388px in a 350px column, now 350px |
| CTA landing | Overview bottom at 40px, entirely under the 78px nav |
| Public repos protected | 28 of 28, re-queried from the API |
| Build and lint | 0 errors, 27 pre-existing react-refresh warnings |

Console is clean apart from the pre-existing framer-motion "non-static position"
dev warning, which is documented in `Works.jsx` and `NODE_ENV`-guarded.

### Still open

- **Twelve screens is still twelve screens.** Six projects, four roles, six
  stack groups and six capability cards is a lot of page at 390px, and the
  remaining height is content rather than padding. The hamburger is the fast
  route to Contact.
- **The site is still client-rendered**, so AI crawlers see only the
  `<noscript>` block. `public/llms.txt` is the deliberate answer. A build-time
  prerender is filed in `BACKLOG.md` as P1/L.
- **23 private repos are unprotected** pending GitHub Pro.
- **A theme picker on first load was proposed and advised against**: the site
  already reads `prefers-color-scheme`, so a modal asks something the OS has
  already answered and puts a decision between a recruiter and the content.


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
