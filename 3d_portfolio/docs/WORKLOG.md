# Worklog

## 2026-09-15: the spec band comes out

Owner's call, and a fair one. The band restated numbers the page already carried:
`4 employers · since 2020` sits above Roles, `6 built · 1 live` above Projects,
`6 areas · 33 tools` above Stack. Set at 112px between the hero and the first
section a reader actually wants, it was a wall of numerals repeating what those
sections say for themselves.

Removed: the component, its ground rule, its row in both READMEs.

### The deletion moved something it had no business moving

`main > section:nth-of-type(odd)` tinted alternate scenes. The spec band was the
first `<section>` in `main`, which made **Roles and Projects even-numbered** — so
with the band gone, `odd` quietly tinted About, Stack and Contact instead, and
the two card-heavy sections lost their ground.

It is `even` now, and the reason is written where the rule lives: **a rule that
counts siblings is a rule that moves when a sibling is deleted.** The property
that makes `nth-of-type` robust to reordering is exactly what makes it fragile to
deletion.

### Measured after

    scene 1  about      not tinted
    scene 2  roles      tinted
    scene 3  stack      not tinted
    scene 4  projects   tinted
    scene 5  contact    not tinted

Page height 10,158px to **9,685px**. `US Central time · usually replies within a
day` still appears exactly once, in Contact, where it is earned — the band was
the duplicate, not the source. Lint 0, tests 27/27, build 0.

## 2026-09-15: the social card, the unguarded mirrors, and a font finding that went the other way

Three things off the findings list. Two were real; the third taught more by being
wrong than it would have by being right.

### The social card had been previewing a tagline the site no longer had

`public/og.png` was generated on 11 September. The headline changed on the 14th.
For a day, every share of this link on LinkedIn, Slack or anywhere else showed
**"AI Engineer · data to AI, end to end"** — a line that exists nowhere on the
page. Nothing warned anyone, because a grep cannot read a PNG and neither can a
test.

Regenerated from `docs/og-card.html` at exactly 1200x630, and the template's copy
now matches the site. The `<noscript>` block in `index.html` had drifted the same
way — same old tagline — and was corrected with it.

**What can actually be checked is the template**, so that is what is now checked:
`test_the_og_card_source_matches_the_role` fails the build if `og-card.html`
stops naming the current role. The render stays manual, and the header comment in
that file now says when to redo it and what went wrong the one time nobody did.

### Two more hand-written mirrors, both unguarded until today

Yesterday's `llms-mirror.test.mjs` guards `public/llms.txt`. It left two copies of
the same facts unchecked, and the asymmetry was mine:

- the **JSON-LD** block — what Google and every structured-data consumer reads
- the **`<noscript>`** block — the only content in the served HTML

`html-mirror.test.mjs` now asserts the JSON-LD parses at all, that `jobTitle`
equals `status.role`, that the email matches, that every school appears in
`alumniOf`, that every social link appears in `sameAs`, and that `knowsAbout` has
not drifted more than four tools from the primaries.

**Proved to fail, three ways.** Against copies with the job title changed, a
school name truncated and six tools removed from `knowsAbout`, each failed the
right test by name; the real file passes 7/7.

### The font finding was wrong twice, and the measurements said so

Reported as "swap Barlow for a variable font and drop unused subsets, ~90kB".
Both halves collapsed on contact with evidence.

1. **There is no variable Barlow.** `npm view @fontsource-variable/barlow`
   returns 404. All four static weights are genuinely used: 400 twice, 500
   twenty-nine times, 600 ten times, 700 on the headline.
2. **There is no font problem to fix.** Measured on the live page: all six fonts
   a reader fetches finish at **137ms against a first paint at 152ms**, and
   layout shift is **0**. Nothing swaps, nothing shifts, and preloading would
   optimise a cost that does not exist.

What was left was deploy weight: 20 woff2 files built and published for a site
written in English, including Vietnamese, Cyrillic and Greek.

**Then the fix made transfer worse, which is the interesting part.** Importing
`latin` *and* `latin-ext` added four faces no character on the page needs — and
Chrome downloaded all four anyway, 55kB of them. The page contains `→` (U+2192)
and `↗` (U+2197), which the latin subset does not cover; when a glyph is missing
from the first matching face the browser tries the **next face in the family**
before falling back to a system font. Offering a subset you do not need is not
free.

Latin only, then:

| | Before | After |
| --- | --- | --- |
| woff2 files built | 20 | **12** |
| Font bytes in `dist` | 361 kB | **292 kB** |
| `@font-face` rules shipped | 21 | 13 |
| vendor CSS | 12 kB / 3.14 kB gz | **6.56 kB / 2.91 kB gz** |
| Fonts a reader fetches | 6 files, 184 kB | **unchanged** |

The honest summary: **0.23 kB gzipped off every page load**, 69 kB off the
deploy, and a trap documented in `main.tsx` that cost 55 kB when it fired.

`npm test` is 27 checks in four files.

## 2026-09-14: the crawler copy is now checked, not trusted

`public/llms.txt` is a hand-written mirror of facts in `constants/index.js`.
Hand-written was and is the right call — it is prose for a reader, not a dump —
but hand-written also means it can quietly stop being true, and until today
nothing checked that it had not.

It had. The file listed Stack, Education, Projects and Contact and **not one
job**, for as long as it has existed. Every AI crawler that read this profile
saw no employment history at all. CI checked that the file *exists* in `dist`;
nothing checked what was in it.

### What the guard asserts

Seven checks, one direction: everything in `constants` must appear in
`llms.txt`.

| Check | Covers |
| --- | --- |
| employers, role titles | the four roles |
| projects | all six by name |
| schools | both degrees |
| stack groups, primary tools | the six areas and the twelve tools the file names |
| contact | the email address |

The reverse is deliberately allowed: the file's "Also" section lists repos the
site does not show.

**Every missing item is reported at once**, not one per run — a drifted file
that fails on its first omission takes five runs to catch up.

### Proved to fail, not only to pass

Against a copy with the `## Roles` section deleted — the exact regression that
shipped — it fails with the exact contents of the hole:

    FAIL test_every_employer_is_listed
         employers missing from llms.txt (3): AdvanSoft International, Inc | Integer IT Solutions | DotIn Solutions
    FAIL test_every_role_title_is_listed
         role titles missing from llms.txt (4): AI Engineer | Machine Learning Engineer | Research Engineer | Software Engineer

Against a copy with one primary tool removed it fails naming that tool, and
against the real file it exits 0. The test takes an optional path argument
purely so that failure can be demonstrated without doctoring the real file.

**One limit, stated rather than engineered around:** the match is a substring,
so a name that survives inside a longer one still passes — renaming
`pb-card-deck` to `pb-card-deck-OLD` in the FILE goes undetected. Renaming it in
`constants` does not, and that is the direction that actually drifts.

`npm test` is now 20 checks across three files, and CI runs it between lint and
build.

## 2026-09-14: Experience becomes Roles, and the crawler copy gets the jobs it never had

"Experience" survived the naming pass this morning because it is the
conventional label and a recruiter scans for it. It is also a word that means
everything and therefore nothing, over a section holding four jobs with dates.
The section is now **Roles**, which is what they are — and what the spec band
has been counting all along (`04 ROLES`). The band now points at a section with
the same word on it.

### The eyebrow had to change with it

`4 roles · since 2020` over a heading reading **Roles** is a section saying its
own name twice and telling the reader nothing new. It counts **employers** now:
`4 employers · since 2020`. A different fact, still derived — four jobs at four
places rather than four titles at two — and `new Set(ROLES.map(r => r.company))`
keeps it honest if two roles ever share an employer.

### The hero CTA names its destination again

"Start with my experience" pointed at a section no longer called that. It reads
**"Start with the roles"** and still lands on `#roles`.

### And llms.txt had no employment history at all

Checked while renaming: the machine-readable copy listed Stack, Education,
Projects and Contact — **and not one job**. For a profile whose whole purpose is
being read by someone deciding whether to hire him, that is the largest thing
that could be missing, and it had been missing the whole time.

`## Roles` is now in it: four entries, newest first, each with company, country,
dates and what the role did — compressed from `experience` in `constants`, the
same hand-mirroring the rest of that file already does, with the same "change
one, change the other" note the Stack section carries.

### Measured

    nav:      About · Roles · Stack · Projects · Contact
    headings: About · Roles · Stack · Projects · Contact

Eyebrow reads `4 employers · since 2020`, the CTA reads "Start with the roles"
and resolves to `#roles`, and there are **zero dangling `#` anchors**. `llms.txt`
now has seven headings and ships in `dist`. Lint 0, tests 13/13, build 0.

## 2026-09-14: one name per thing

The question was whether Work and Experience are the same thing. They are not,
but the page could not have told you that: the nav offered both words, and
neither of them was the name of a section.

### Two sections had two names each

| Nav said | The section said | Now |
| --- | --- | --- |
| About | **Overview** | About |
| Work | **Projects** | Projects |

A nav is an index. When an index uses a different word from the thing it points
at, a reader arriving at "Projects" after clicking "Work" has to stop and check
whether they landed in the right place.

**"Work" was the worse of the two**, because it also collided with
"Experience" — a job is work, so the nav offered two words for one idea and then
used neither as a heading. "Projects" is the specific word, and it is what the
section has always called itself. Experience keeps its name: with "Work" gone
there is nothing left for it to collide with, and it is the word a recruiter
scans for.

### "Work" had four senses on one page

The nav item, the section heading it did not match, the spec band's **"systems
built"** for the same six things, and the availability card's "Open to work".
Three of the four are gone: the nav says Projects, the band says `06 PROJECTS`,
and `llms.txt` lists them under `## Projects` rather than `## Selected work`.

"Open to work" stays. It is the phrase a recruiter recognises, it means
employment rather than output, and with the nav item gone it collides with
nothing.

### The anchor moved too

`#work` became `#projects` — five internal references, no external ones, so the
URL now says what the section is. `utils/answer.js` cites sections by these ids,
so the ask box's citations moved with it: an answer from a project now reads
`… · projects`, which is the word in the nav.

**And that is now a test.** `test_every_cited_section_is_a_real_one` asserts
every section an answer cites exists in `navLinks`. The rename touched three
files that all had to agree; the fourth time someone renames a section, a
citation pointing at a section nobody can find will fail the build instead of
shipping.

### Measured

Nav labels and section headings, read off the rendered page:

    nav:      About · Experience · Stack · Projects · Contact
    headings: About · Experience · Stack · Projects · Contact

Every nav target resolves, and **zero dangling `#` anchors** anywhere on the
page. `npm test` 13/13, lint 0, build 0.

## 2026-09-14: the six category colours become one ramp

The Stack colours were six unrelated hues — steel blue, teal, terracotta,
mauve, olive, periwinkle — in no order, on a page that otherwise holds to a
single lava accent. Six hues with no relationship between them is what made the
section look unconsidered beside the rest of the page.

They are now **one sweep from cool to warm**, ending a step away from
`--c-accent`.

### It is not decoration, it is the claim the section already makes

The rail above the cards runs from `RAW DATA` to `RUNNING PRODUCT`, and the
intro says the six groups sit in order along that path. The colour now moves
along it too: blue at the raw end, warming through gold and amber, landing on
the brand red at **Backend & apps — the group that ships**. The rail finally
looks like the sentence above it.

| | Dark | Light |
| --- | --- | --- |
| Data engineering | `122 152 186` | `46 96 140` |
| Data science | `126 172 166` | `34 112 108` |
| LLM / RAG | `198 176 118` | `132 108 40` |
| Computer vision | `214 150 104` | `158 98 44` |
| MLOps & infra | `220 118 92` | `168 74 50` |
| Backend & apps | `228 96 76` | `176 42 30` |

### The trap this sets, and it is a real one

**Order now matters more than the individual values.** Reordering `stackGroups`
without reordering these leaves a ramp that climbs and then jumps back — which
is worse than six arbitrary hues, because it looks like a bug rather than a
choice. The comment in `index.css` says so where someone would be editing.

### Measured

The stage numerals take these colours, so they had to clear AA as text. On the
light ground: **6.63, 5.83, 5.05, 4.96, 5.69, 6.57** — the weakest is Computer
vision at 4.96, above the 4.5 line, and they are 26px anyway. Dots, numerals,
rail segments and the card's cursor glow all read the same token, so the ramp
is one edit rather than four.

## 2026-09-14: the deck transition stops looking like broken text

Two complaints about Experience, both fair: the transition looked wrong, and
the section felt crowded. They turned out to be the same fault seen twice.

### What was actually happening

A sticky deck always slices the card underneath. The incoming card's top edge
travels up across the outgoing card's text, so for most of a transition the
reader sees **half a sentence cut by a horizontal line** — at 1440 the screenshot
showed "entities from customer-support feedback, automating request triage"
chopped through the middle. No geometry avoids that; it is what a deck does.

And with three near-identical cards on screen — same ground, same border, same
weight — nothing said which one was being read. That is the crowding.

### The fix is one idea: only one card is lit

A covered card now dims its content to 0.38 and scales to 0.988. The sliced
half-line stops reading as broken text and starts reading as a card behind,
which is what it is. Spacing changed with it: the step between pinned tops went
**10px → 16px** so the stack shows four edges rather than one thick border, and
the gap between cards went **20px → 36px** so each has room to be read before
the next arrives.

### Two things got worse before they got better

**Fading the whole card was wrong.** With `opacity` on `.role-card` the GROUND
went translucent too, so two covered cards showed each other's text through
their own backgrounds — "AI Engineer" printed over "Machine Learning Engineer".
It looked like a rendering fault, which is worse than the problem being solved.
Only the card's own children are dimmed now; the fill stays opaque.

**The scroll handler thrashed layout.** It wrote `dataset.covered` on one card
and then measured the next, which invalidates style and forces a synchronous
layout on every iteration. Measured: 29.8fps, every frame over 20ms, **50ms
worst case** while scrolling the deck. Reading all four tops and heights first
and writing afterwards took the worst case to **33.6ms**.

### The measurement that mattered, and the one that did not

| | fps | worst frame |
| --- | --- | --- |
| Live site, no covered logic (baseline) | 29.8 | 49.1ms |
| This branch, interleaved reads and writes | 29.8 | 50.0ms |
| This branch, batched | 30.0 | **33.6ms** |

**The 30fps is the browser session, not the page** — the baseline hits the same
ceiling with none of this code in it. The only honest comparison here is the
worst frame, and it is better than the site currently serves.

State through a scroll, at 1440: `0:dim 1:LIT` → `0:dim 1:dim 2:LIT` →
`0:dim 1:dim 2:dim 3:LIT`. On a phone the deck is static, no card is ever marked
covered, and nothing dims.

## 2026-09-14: Overview stops asserting and starts proving

Overview was the weakest scene on a page whose whole argument is evidence: a
portrait, three sentences of prose, and a status card 900px below the fold. Two
of those sentences were claims with nothing behind them.

### Two sentences became three claims with their proof attached

| Was | Now |
| --- | --- |
| "The work tends to run offline, ground its answers in real sources, and be easy to try in a minute, because that is what makes it worth building." | Three rows: **It runs where the data already is** · **It shows the source it used** · **You can try it in a minute, with no account** — each followed by the `outcome` of the project that proves it, and a jump to it |
| "Calm, disciplined, focused on what I can control." | Cut. It is the one line on the page nothing can check, and a version of it is on about half the portfolios on the internet |

The proofs are not retyped. `PRINCIPLES` maps a claim to a project NAME and
resolves it against `projects` at module load, so the row prints that project's
own words:

- *YOLOv8 detection trained federated: raw data never leaves the client.*
- *Document Q&A that cites the exact source passage behind every answer.*
- *Live mobile-first scorekeeper: no login, works offline after first load.*

**A renamed project drops its row rather than printing a stale proof.** The
`.filter((p) => p.project)` is the house rule in one line: absent beats
invented.

### The scene stopped leaving 40% of itself empty

The block was capped at `max-w-5xl` inside a 1425px scene, so the section that
opens the page used three fifths of its own stage. It is now three columns from
`lg` — portrait, prose, availability card — two from `md`, one on a phone.

**The measure of the prose did not change.** The COLUMN got narrower, not the
line length, which is the distinction that keeps this from being a readability
regression.

| | Before | After |
| --- | --- | --- |
| Section height at 1440 | 1244px | **827px** (−33%) |
| Availability card | ~900px down the page | beside the prose, visible on arrival |
| Grid at 1440 | `240px + 1fr`, capped at 5xl | `260px + 572px + 368px` |

### Measured

1440: three columns as above, card 368px wide and intact at that width. 820:
two columns, card spanning both at 731px. 390: one column, portrait 260px,
claim rows 350px, `scrollWidth === clientWidth`. Checked in Paper and Slate.
Lint 0, tests 12/12, build 0.

## 2026-09-14: Paper is the default, for everyone

The boot script used to follow `prefers-color-scheme` — dark devices got Slate,
light devices got Paper. A first-time reader now gets **Paper whatever their
device prefers**. A reader who chooses another palette keeps it, as before.

**This is the more considerate default being deliberately overruled, and the
reason is who lands here.** The first-time reader of this page is usually a
recruiter or a hiring manager on a work laptop in daylight, and the page should
arrive as a document rather than as a terminal. Dark is one click away and the
choice is remembered from then on.

**One theme-color tag, not a pair.** The head carried two, keyed to
`prefers-color-scheme`, and the boot script only ever rewrote the first. With
Paper as the default that left a dark-scheme phone painting a navy browser bar
above a white page — a seam across the top of exactly the devices the pair was
meant to help. There is now a single tag, which the boot script rewrites to
whichever palette is actually in use.

The `themes` registry notes moved with it: Slate is "Deep navy, easy on a long
scroll" and Paper is "The default. Warm white, and what a first-time reader
gets." A registry that still called Slate the default would be a comment
disagreeing with the code.

Verified with `localStorage.theme` cleared: `data-theme="light"`,
`data-scheme="light"`, body `rgb(255,255,255)`, one `theme-color` tag at
`#FFFFFF` with no media attribute.

## 2026-09-14: sections become scenes

Act two of the campaign direction. The page was one continuous document with
five headings in it; it is now a sequence of scenes, each with its own ground,
its own edges, and a head big enough to open it.

### The ground is full-bleed, the measure is not

`max-w-7xl mx-auto` used to sit on the `<section>` itself, which meant a section
could never paint a background wider than its own text column. The section is
now the stage and a `div` inside it is the page: colour runs edge to edge, the
measure stays exactly where it was.

### Alternation is a property of the sequence, not of a component

`main > section:nth-of-type(odd)` tints the spec band, Experience and Projects;
Overview, Stack and Contact keep the page ground. **No component is told its own
index** — a component that knows where it sits in a list is wrong the moment the
list is reordered, and this page has already reordered its sections twice.

The tint is `color-mix(in srgb, tertiary 55%, primary)`, so it is one step off
the ground in all six palettes rather than correct in Slate and wrong in Paper.
The hairline above and below each scene matters as much as the fill: at these
low contrasts the edge is what says a scene changed, and without it the tint
reads as a rendering artefact.

### The heads now open something

`sectionHeadText` went from `clamp(2rem, 5vw, 3.5rem)` to
`clamp(2.5rem, 6.5vw, 4.75rem)` — 56px to 76px at 1440, 40px on a phone. At the
old size a head read as a paragraph heading inside a document, which is exactly
what the page was.

The derived eyebrow — `4 ROLES · SINCE 2020` — now sits behind a 20px accent
rule, the same device as the hero's three claims. That turns a line of facts
into a label for the scene rather than a caption floating over nothing.

### Measured

Six scenes at 1440: spec band 315px, Overview 1033, Experience 2572, Stack 1128,
Projects 2615, Contact 610. Every one 1425px wide — full-bleed — with 128px of
top padding, and the tinted three carrying a 0.8px hairline top and bottom.
Phone: 390px wide scenes, 64px padding, heads at 40px, `scrollWidth ===
clientWidth`.

The page grew from 8,966px to 10,158px, about 13%. That is the cost of scene
padding and the spec band, and it is the right trade for this direction: a
campaign page is long on purpose, and nothing was added to the content.

Checked in Slate and Paper. In light palettes the tint is subtle by design — the
hairline does most of the work — and the white cards still sit clearly above the
tinted ground.

## 2026-09-14: the opening act, staged like a campaign

The ask was for the page to read like a product campaign — BMW rather than
Sprite or Google — with copy cut to campaign length. This is the first act: the
hero and the band under it.

### The lede became a spec list

One 38-word paragraph became three lines, each against its own accent rule:

    — Retrieval that cites its source
    — Vision that trains where the data already lives
    — Results reported as measured, negative ones included

**Nothing was added and no new claim is made.** "Retrieval that cites the
passage it used" is "Retrieval that cites its source"; the negative-results
clause, which is the most distinctive sentence on the page, is kept whole as its
own line instead of trailing a paragraph.

The point is not fewer words, it is staging. Three claims stacked against rules
are read in about a second each; the same words in prose ask the reader to
decide to start reading, which most people who land on a portfolio do not do.

### The numbers moved from 12px to 112px

Every figure in the new band was already on the page, set in a section eyebrow:
"4 roles · since 2020", "6 built · 1 live", "6 areas · 33 tools". They are the
most compressed true things this site can say, and they were its smallest type.

| | | |
| --- | --- | --- |
| **04** roles | since 2020 | |
| **06** systems built | 1 live | |
| **33** tools | 6 areas | |
| **CDT** US Central time | replies within a day | |

**All four are derived, none typed.** Add a project and the band counts it in
the same edit. `tabular-nums` so 04 and 33 occupy the same width, or a spec row
reads as four separate measurements rather than one sheet.

**No count-up animation, deliberately.** Numbers ticking up from zero is the
convention on pages where the numbers ARE the marketing. Here they are evidence,
and evidence does not need a drumroll.

The band's ground is `color-mix(in srgb, tertiary 55%, primary)` rather than a
fixed colour: one step off the page in every palette, light or dark. A band that
announces itself with a new hue reads as an advert embedded in the page, which
is the exact failure mode of this whole direction.

### Measured

112px numerals at 1440 in a 315px band, 52px in a 2x2 grid at 390. Ground
differs from the page ground in Slate, Ink, Paper and Manuscript, and the
numerals keep the palette's own text colour in each. `scrollWidth ===
clientWidth` at both widths. Lint 0, tests 12/12, build 0.

### What this act does not do yet

Sections are still a continuous document rather than full-viewport scenes, the
projects are still cards rather than product pages, and there are still no
screenshots — which is the one thing a campaign page for software normally
leads with, and the one thing this repo cannot supply without the owner.

## 2026-09-14: a mark for the ideas too, not only the products

The logos landed for the 25 tools that have one. On a project card that left
rows like `RAG · MLOps · Kubernetes` showing one glyph and two bare words, which
reads as a failed image rather than as a distinction — **11 of the 18 project
tags are concepts**, so the branded minority looked like the exception.

`conceptIcons.js` draws the other 16 terms: RAG, LLM, MLOps, Vision, Federated,
Multimodal, Applied ML, Product, Live, Embeddings, Evaluation, SQL, ETL
pipelines, Detection & tracking, Exploratory analysis, Federated learning. Every
"built with" row on the page now carries a mark on every tag.

### Why drawing these is not the thing the generator refuses to do

The generator exists because a brand mark recalled from memory is a claim about
someone else's identity, and it is either right or wrong. These are category
marks in the site's own line language — the same vocabulary as the project
covers and the career diagrams: a bounding box for detection, a hub and three
spokes for federated training, a cylinder for SQL, brackets around numbers for
embeddings. They claim nothing about anyone.

Three products still show nothing, and that stands: **DynamoDB, S3 and
Pinecone.** Giving those a generic storage glyph would be inventing a mark for a
named product, which is exactly the line the generator draws.

### Two shapes of data, one renderer

Brand marks are filled silhouettes and carry `p`; the drawn marks are strokes
and carry `d` with `s: 1`. `ToolGlyph` switches on that flag — a stroke path
rendered as a fill becomes a blob, and a silhouette rendered as a stroke becomes
an outline of itself.

`glyphs.js` re-exports both files and is what `TagTerm` imports lazily, so the
generator can never overwrite the hand-drawn set.

### Measured

**Nine loose dots for "Embeddings" disappeared at 14px** — 1.8px of ink nine
times over is less ink than one stroke — and were replaced with brackets around
three points. The check was the rendered path's bounding box, per chip: every
glyph now measures at least 90 square units of ink in a 24-unit box, and the
only chips without one are the three products above.

33 Stack chips, 30 with a mark, uniform 25px tall on a desktop. 18 project tags,
**18 with a mark**. Entry bundle unchanged at 36.0kB gzipped; the marks share
one lazy chunk, now 17.4kB. Checked in Slate and Manuscript, at 1440 and 390.

## 2026-09-14: the tools carry their own marks

Every named tool that has a logo now shows it, inline before the word: 25 marks
across Stack, the Experience cards and the project tags. 20 of the names get
nothing, and that is the correct answer for most of them.

### Where the paths come from, and why not by hand

`simple-icons` is a **devDependency**, not a runtime one. `scripts/gen-tool-icons.mjs`
reads it once, writes the marks this site actually names into
`src/components/toolIcons.js`, and that generated module is what ships. 3,460
marks in the dependency graph for 25 glyphs would be the wrong trade; so would
hand-writing them, which is 25 chances to ship a logo that is subtly wrong from
memory. The repo hand-writes four brand glyphs already, but those were checked
by eye against the real marks.

**The name-to-slug map is explicit.** A guess ("PySpark" → `pyspark`) matches
the wrong project as often as the right one, and labelling PySpark with someone
else's mark is worse than showing no mark.

### 20 terms get no icon, three different reasons

| Reason | Terms |
| --- | --- |
| It is a concept, not a product | RAG, MLOps, LLM, Vision, Evaluation, Embeddings, ETL pipelines, Exploratory analysis, Detection & tracking, Federated learning, Applied ML, Multimodal, Product, Live, SQL |
| The mark is not in simple-icons | Pinecone |
| The project removed the mark upstream over trademark policy | Azure, S3, DynamoDB — every Amazon and Microsoft logo is gone from the package |

A stand-in glyph for any of these would be decoration pretending to be
information, so they render as bare words. The rows are mixed and that is fine:
chips already vary in width.

### Lazy, because 25 logos are 17kB gzipped

Loading them with the entry bundle took it from 33.4kB to 50.7kB gzipped — a
52% tax on first paint for decoration. They now arrive in their own chunk,
fetched once on the first chip's mount, with one module-level cache and a
subscriber set rather than a context (a provider around 33 chips re-renders all
33 to deliver one object). **Entry bundle: 33.4 → 35.9kB gzipped**, and measured
layout shift from the glyphs arriving is **CLS 0.0001**.

### Two faults on the way, both found by looking at the page

**A regex "optimisation" corrupted six marks.** Rounding coordinates to two
decimals with `/\d*\.\d+/g` cut 44kB of path data to 31.6kB — and silently
destroyed every path using compact arc syntax. In `a5.5 5.5 0 01.5.5` the two
arc FLAGS and the following coordinate are written `01.5`; a regex that sees a
number there turns three tokens into one. Docker, MLflow and Kubernetes rendered
blank or as a single dot. The generated file still parsed, the build still
passed, lint said nothing. **Do not parse SVG path data with a regex.** The
rounding is gone; in a lazy chunk the bytes cost first paint nothing anyway.

**The glyphs first rendered above the words, not beside them.** The chip is
`inline-flex` on a phone and plain `inline` from 640px up — so the `gap-1.5`
that positioned the mark worked at one size and did nothing at the other, and
every chip became two lines tall. An `inline-block` glyph with `mr-1.5` and a
`-0.16em` baseline nudge behaves the same in both.

### Measured

33 Stack chips, 23 with a mark, every chip a uniform 25px tall on a desktop and
44px on a phone; bounding boxes on the rendered paths run 15–24px of ink in a
24px box, which is the check that a mark is really drawn rather than parsed.
Slate and Paper, 1440 and 390. `npm run lint` 0, `npm test` 12/12, `npm run
build` 0.
## 2026-09-14: the current role's edge becomes a light that runs around it

The mark on the role being read was a static hairline across the top. It marked
the card but said nothing about it, and on a deck where the top edge is often
the only part showing, a fixed bar reads as a divider between cards rather than
as a property of one.

It now travels the whole perimeter. The vocabulary is already on the page: the
hero field sends activations along its edges, the availability dot pulses, the
deploy diagram runs a signal through its pipeline. One more thing that moves the
way the rest moves.

### How it is drawn

`::before` covers the card and paints a conic gradient — transparent for most of
the turn, accent for about 25 degrees of it with a short fade behind. A
two-layer mask subtracts the padding box from the border box, leaving a 1.5px
ring: the gradient shows at the edge and nowhere else. `@property --role-edge`
declares the angle as an `<angle>` so it interpolates instead of being treated
as an unknown string, and animating that angle is what makes the lit part move.

**The fallback is a separate declaration on purpose.** A browser without
`@property` treats `var(--role-edge)` as invalid, throws the whole
conic-gradient away, and paints no ring at all — so the tinted border lives on
the element itself, where that browser still sees which role is current.

### Two passes, because the first was wrong

| Was | Why it failed | Now |
| --- | --- | --- |
| Base border `accent / 0.45` | The whole card read as selected, or as an error state, and the travelling segment had nothing to be brighter than | `accent / 0.18`: the base says "marked", the light says where you are looking |
| An even 88° of gradient over 6s | Looked like a pattern rotating rather than a light travelling; in a still it looked static | A ~25° lit core with a long fade behind it |
| 4.5s a turn | Quick enough to pull the eye off the sentence beside it, which is the opposite of what a state marker is for | **9s a turn.** Findable, not attention-seeking: a reader notices it once and reads on |

### Only the current role, and only on a desktop

Four cards each running a light is a decoration; one card running it is a state.

The animation stops below 640px — not from a measurement but from the house
rule every other ambient effect here already follows (the hero field, the career
diagrams, the token stream all stop on a phone), because a loop that runs
forever is battery spent on decoration. On a phone the lit core parks near the
top-left corner, which is where the old static hairline began.

### Measured

Desktop 1440x900, with the WebGL field also running: **60fps, zero frames over
20ms, worst 16.9ms**. At 9s a turn the angle advances **10 degrees per 250ms,
evenly** (9.33 / 10.66 / 10.67 / 9.33 / …, against 10.0 expected), which is the
measurement that matters: it is smooth, not stuttering.

**A note on measuring this, because the first numbers were wrong.** An rAF
sampler reports ~30fps for the ring when nothing else on screen animates — and
1fps when nothing animates at all. That is the browser declining to produce
frames it does not need, not jank. The hero's WebGL field stops when the hero
scrolls away, so by the time the Experience section is on screen there is
nothing else driving the clock. Even angle deltas are the honest check. Phone at 390x844: `animation-name: none`, the angle does not move
between two reads 1.2s apart. Checked in Slate and in Paper; on white the quiet
base nearly disappears and the travelling light does the marking, which is the
right way round for a light theme.

## 2026-09-14: a UI sweep, and the two things it found

Every interactive surface checked against the running build: 113 interactive
elements, six palettes, three viewports, both ends of the text-size control,
hover and focus states, the palette's edge cases, the mobile menu, the copy
buttons, and the console. **Two real faults, both introduced earlier today.**

### 1. A pinned role card taller than the screen hid its own bottom

The worst of the two, because it loses content rather than polish. A sticky card
holds the top of the viewport while the reader scrolls past it — so anything
below the fold when it pins never arrives. Measured at **1280x620 with the text
control at 140%: the tallest card is 686px against 524px of room, and 192px of
its bullets were unreachable.** A 1366x768 laptop window is exactly this shape.

`useDeckFits` now measures the tallest card against the room under the navbar
and drops the deck to a plain list when it will not fit. Three details worth
keeping:

- **It reads the sticky offset out of the resolved `top`** of a pinned card
  rather than repeating `6rem` in JavaScript, so it cannot drift from
  `--role-top` in the stylesheet.
- **A `ResizeObserver` on the list**, not a resize listener alone: the text-size
  control, a font swapping in and a wrap change all alter card heights without
  firing `resize`.
- **32px of hysteresis**, or a card sitting exactly on the threshold toggles the
  whole section's layout on every resize tick.

Verified after: at 1280x620 the deck is `sticky` at 100% and `static` at 140%;
at 1440x900 it stays `sticky` at both, because 690px fits in 780px of room; and
it comes back when the text size drops again.

### 2. One role card had three different right edges

Reported by eye, then measured: inside a card 616px wide, the bullet list
stopped at 544px — an old `max-w-[34rem]` — while the tool chips and the date
line ran the full width. So the paragraph ended 71px short of everything around
it and the chips read as overhanging the text.

The cap was correct when it was written: a role was then a row on a timeline, in
a 672px column with no padding of its own, and 34rem was the measure. Inside a
padded card the card IS the measure, and it is now the only one: bullets, chips
and dates all end at the same place, 1px inside the padding, at 1440, 768 and
390, at 100% and 140%.

The wider measure also took the hyphenation with it. Justification at 544px was
breaking "analytics" into "analyt-ics" and "extract" into "ex-tract"; at 614px
the same lines fit whole.

### 3. The current-role hairline read as a stray line laid on the card

The accent edge that marks the role being read was `inset: 0 0 auto 0` with
`border-radius: inherit` — which on a 16px-radius card draws a straight 2px bar
through both rounded corners and out to the square edge of the box. It looked
like a line dropped on top of the card rather than part of its edge.

Inset by the corner radius now, so it starts and ends where the straight part of
the top edge does. Same cue, and it looks drawn rather than dropped.

### 4. Half the `Ask ⌘K` chip lit up on hover

`hover:text-accent` on the button did not reach the `<span>` holding the
shortcut, which kept its own `text-faint`. So hovering turned "Ask" red and left
"Ctrl K" grey — which reads as a rendering fault, not a hierarchy. `group` on
the button, `group-hover:text-accent/70` on the span.

### What the sweep checked and found correct

| Checked | Result |
| --- | --- |
| Reveal animations after a scrollbar jump to the bottom, the middle and 80% | nothing stuck at opacity 0 on screen |
| Contrast, 9 elements x 6 palettes | no failures. The one apparent fail was the CTA, whose gradient the checker could not read: black-100 on the accent stop measures **5.70:1** |
| Hover: nav link, ask chip, CTA, project card, repo link, glossary chip | all change something. Nav secondary→white-100, CTA lifts 1px with a deepened shadow, card tilts (react-tilt) and tints its border, chip goes accent |
| `react-tilt` under reduced motion | already guarded: `max: reduced ? 0 : 8` |
| Glossary panel | opens on hover and on click, escapes the card without being clipped, stays inside the viewport, closes on Escape |
| Command palette: empty, 1 char, 400 chars, `<<>>&&""%%`, emoji, `'; DROP TABLE--` | no crash; the long and hostile ones fall to the empty state |
| Text-size control | clamps 100–140%, both buttons disable at their bound, no overflow at either end |
| Touch targets at 390px | every boxed control ≥44px. The bare Stack terms are narrower (S3 is 16px wide) and stay that way: WCAG 2.5.8 exempts targets inline in a block of text, and boxing them again costs the 17% length win the flow layout bought |
| Mobile menu | 44x44 trigger, close button reachable, body scroll locked while open and restored after, Escape closes |
| Copy buttons | live region announces "GitHub copied to clipboard" and clears after |
| Console, across the whole visit | no errors, no warnings |
| Document width at 390 / 1280 / 1440, at 100% and 140% | `scrollWidth === clientWidth` everywhere |

**One documentation correction.** The trap written this morning said any
ancestor with `overflow-x: hidden` kills the deck. `html` and `body` are the
exception — their overflow propagates to the viewport rather than making a
scroll container, which is why the deck works over the `body { overflow-x:
hidden }` that has been in `index.css` all along. The rule holds for every
element below those two.

## 2026-09-14: the clock adds the reader's own row, from their device

The hero rule read `CDT · EDT · IST` — his zone and two courtesies. It now also
reads the visitor's: `CDT 14:58 · EDT 15:58 · IST 01:28 · YOU 21:58 +7h`.

**The useful half is the `+7h`, not the clock.** A reader in Berlin knows what
time it is in Berlin. What decides whether they send the email now or in the
morning is that the person they are writing to is seven hours behind them, and
that is the number the row exists to print.

**Nothing leaves the machine.** `Intl.DateTimeFormat().resolvedOptions().timeZone`
is a setting the browser already hands every page: no geolocation prompt, no IP
lookup, no request, nothing recorded. The zone id ("Europe/Berlin") is a region
rather than an address, and it is the only place name involved.

### Three cases, all of them real

| Case | What renders |
| --- | --- |
| Reader in another zone | a fourth entry, `YOU 21:58 +7h`, with the zone id and the difference in its `title` |
| Reader already in one of his three | no fourth entry. That row is marked `· yours` instead, which is the more interesting fact |
| Browser will not say, or reports a zone `Intl` then rejects | nothing at all. A clock labelled with a guessed zone is worse than no clock |

### The offset is computed, not looked up

There is no API that hands you the UTC offset of an arbitrary IANA zone. The one
here formats the same instant twice — once in the zone, once in UTC — and
subtracts, using `Date.UTC` on the parts rather than parsing a localised string.
That makes it correct across a daylight-saving boundary by construction, which a
table of offsets is not: India to US Central is **+11:30h in January and +10:30h
in July**, and both are pinned by a test.

`npm test` now runs two files and 12 tests. The new five are named for what they
catch: an offset that is right in July and wrong in January, a zone that should
never move, the delta a reader actually reads, the formatting (`−6h` with a real
minus sign, `−5:45h` because the Chatham Islands exist), and the fact that the
place shown is a zone rather than an address.

### Measured on the built bundle

Simulated by overriding `resolvedOptions` at document start, which is the only
honest way to see another reader's page:

| Reader | Line |
| --- | --- |
| Europe/Berlin | `CDT 14:58 · EDT 15:58 · IST 01:28 · YOU 21:58 +7h`, 382px in the hero rule |
| Australia/Adelaide | `… · YOU 05:28 +14:30h` — a half-hour zone, and the arithmetic holds |
| America/Chicago (this machine) | `CDT 14:57 · yours · EDT 15:57 · IST 01:27`, no fourth entry |

At 390px the footer copy wraps to two lines and `scrollWidth === clientWidth`;
the hero copy is `hidden sm:inline` and unaffected.

## 2026-09-14: the hero field becomes actual 3D, and pays for itself in a chunk nobody else fetches

`NeuralField`'s header used to carry the argument against this, in the file
itself: *"Deliberately NOT a 3D engine. three.js plus a renderer is ~150kB gzip
against a ~115kB bundle."* The number was right. The decision was reversed
deliberately, by the owner, after being shown it — so the work was to make the
reversal cost what it should and no more.

**What it draws is the same claim, with the thing 2D could not give it.** The
input layer still sits on the real contact dock and the output layer on the real
section rail, coordinates from `getBoundingClientRect()` rather than invented,
and both planes are at z = 0. The two hidden layers are pushed 170px toward the
reader and 190px away, so the network is a volume between two fixed columns of
the interface instead of a lattice behind it. The pointer moves the camera, not
the scene — moving the scene would slide the input layer off the dock it is
anchored to, which is the one thing the drawing promises.

### Who pays, and the proof they do not

| Reader | What is fetched |
| --- | --- |
| Desktop, motion allowed, WebGL available | `NeuralField3D` chunk: **522.79 kB raw, 131.13 kB gzipped** |
| Phone, or any viewport under 1024px | nothing — verified in the network panel |
| `prefers-reduced-motion: reduce` | nothing — verified with `matchMedia` forced at document start |
| No WebGL context available | nothing: the probe creates a real context and throws it away, because a browser can expose the constructor and still refuse |

The entry bundle moved **100.22 → 101.62 kB raw, 32.77 → 33.42 kB gzipped**.
Everyone pays 0.65 kB gzipped for the decision; only the readers who get the
scene pay for the scene.

### Three things that had to be got right, each found by getting them wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| `vendor` chunk jumped to 193.49 kB gzipped and shipped to phones | `manualChunks` swept every `node_modules` id into `vendor`, including three, and `vendor` is in the entry graph | `vite.config.ts` returns `undefined` for three, leaving it in the chunk Rollup builds for the dynamic import |
| The lazy chunk was still 191.81 kB gzipped | `await import("three")` yields a namespace object, and a namespace has to carry every export — no tree-shaking | Ten named imports at module top. 191.81 → 131.13 kB gzipped; loaders, the animation system, audio and XR all dropped |
| Blank field, `THREE.WebGLRenderer: Cannot read properties of null (reading 'precision')` | The 3D module borrowed the canvas React renders, and `forceContextLoss()` on teardown poisons a canvas for the next renderer — React's development double-mount hits this on first load | The 3D module creates its own canvas. `NeuralField` also stopped calling `getContext("2d")` at mount, because that is permanent and would have denied WebGL a context before it loaded |

### Two judgement calls

**Fully connected was the first version and it was wrong.** An MLP is fully
connected, so the first build drew 110 edges — and at any opacity where one edge
is visible, 110 of them read as a mesh laid over the headline. The repo's
standing rule is that ambient work must not cross text. Each node now reaches
the two nodes opposite it in the next layer: 36 edges, still unmistakably a
network, and the type is left alone.

**The layer labels are DOM text, not geometry.** Text in WebGL means a canvas
texture per string or a font atlas, which is more machinery than four words
justify. As DOM they also scale with the reader's own text-size control. The 2D
field's rule stands unchanged: an unlabelled lattice is just lines moving.

### Measured

60 fps flat over 90 frames at 1440×900 (16.67ms average, 17ms worst). Theme
changes repaint the materials through a `MutationObserver` on `data-theme` —
checked in Manuscript, where the nodes and edges take the light palette's
`--c-line-strong` and the activations the Cornell-ish accent. The loop stops when
the hero scrolls away and when the tab is hidden; the field fades with the same
scroll rule the 2D one used, because a backdrop that follows the reader into
Experience is wallpaper competing with text.
## 2026-09-14: the four roles become a deck that holds still

The Experience timeline showed all four roles at once: a rail, four dots, four
blocks of text competing for the same eye, and a diagram in the margin
describing whichever role happened to be nearest the middle of the screen. The
ask was for one role at a time, with its own picture beside it, and the reader's
full attention on it.

**They stick.** Each role is now a card that pins to the top of the viewport
until the next one slides over it. Four cards, `z-index` ascending so a later
card covers an earlier one, and `top` descending 10px per card so the ones
already read keep a visible edge — a deck rather than a stack of one.

**No JavaScript in the effect at all.** `position: sticky`, four inline `top`
values and four `z-index` values. The scroll-driven alternative — a pinned stage
with roles swapped by scroll progress — would have meant JS scroll listeners,
scroll jacking, a separate mobile path and an accessibility argument about
whether the content is still in the document. All four roles are still plain
`<li>` elements in a plain `<ol>`, in order, and a crawler sees exactly what it
saw before.

### Three things that had to change with it

| | |
| --- | --- |
| **The fill had to go opaque** | `.glass-card` fades to 0.78 alpha at its lower edge, which in a stack means every card underneath shows through the top one. `.role-card` paints solid `--c-tertiary`. Opacity is not a style choice in a deck, it is what makes it legible |
| **The active-role rule was wrong for a stack** | `CareerTrack` picked the role nearest 45% of the viewport. Once cards pin, every arrived card sits within 40px of the same top, and that measure flickered between two roles on one scroll notch. It now picks the LAST card that has arrived — the one painted over the others |
| **The stack needed somewhere to end** | Without trailing room the last card unpins the instant the `<ol>` box ends, which drops the reader into Education mid-sentence. An 18vh spacer, desktop only |

### The phone gets none of it, and that was measured

Pinned first, checked after: at 390×844 the four cards collapse to ~215px each
behind their `What I did` disclosures, so the deck finished pinning after about
900px of scrolling and then left **~450px of empty page** below itself while the
reader waited for Education. A sticky card needs scroll distance to travel
through, and a phone does not have it to spare. `.role-sticky` is
`position: static` below 640px: the narrow viewport already gives one card at a
time, which is the entire point of the deck, so the phone gets the result
without the cost.

### Measured

| Check | Result |
| --- | --- |
| 1440×900, deck pinned | card tops 96 / 106 / 116 / 126, `z-index` 10–13, all four `position: sticky` |
| Active diagram through the scroll | role 1 → 2 → 3 → 4 in order, one swap per card, no flicker between two |
| 1024×800, Paper theme | card `rgb(247,245,242)` on a `rgb(255,255,255)` page, border `rgb(226,223,216)`, diagram column still drawn |
| 390×844 DPR 3 | `position: static`, plain card list, `scrollWidth === clientWidth`, no gap before Education |

`npm run lint` exit 0, `npm run build` exit 0. **The trap this leaves behind:**
one `overflow-x: hidden` on any ancestor turns the whole deck back into a flat
list, silently — an overflow container is also a scroll container, and sticky
resolves against the nearest one. The repo already had a standing rule against
that property; this is the second reason for it.
## 2026-09-14: the headline names the arc instead of the proof

`I ship the model. And the evidence it works.` → `From model development to
**real-world impact**.` The owner's call, and the reasoning against it is
recorded here rather than argued twice: the new line is a category rather than a
claim, it contains no verb he personally did, and it is close to a phrase that
appears on a great many profiles. What it buys is order — a reader now learns
what the work *is* before being told there is proof of it, and the old line led
with the proof of a thing it had not yet named.

**The promise did not leave the page, it moved one element down.** The lede still
reads "results reported as measured, including the ones that came back
negative", which is the same commitment in more specific words. Two component
comments justified their existence by quoting the old headline — `About.jsx` on
why six capability cards were deleted, `CodeCompletion.jsx` on why the hero band
runs real code — and both now cite the lede, with the date the headline changed.
A comment that quotes copy is a comment that goes stale when the copy does.

**`real-world` is held together with `whitespace-nowrap`.** Without it the line
broke at the hyphen and left `real-` hanging at the end of a line, which reads
as a broken word rather than a compound one. The hero's existing comment warns
that `nowrap` on a whole sentence overflowed the viewport at 140% text; ten
characters cannot, and that was measured rather than assumed.

| Viewport | Scale | h1 | Document |
| --- | --- | --- | --- |
| 1440×900 | 100% | 862×257, 3 lines | 1425 = client width |
| 1440×900 | 140% | 1152×360, 3 lines | 1425 = client width |
| 390×844 DPR 3 | 100% | 350×122 | 390 = client width |
| 390×844 DPR 3 | 140% | 350×228 | 390 = client width |

Three lines where there were two, and the phone still fits the code-completion
band underneath: it measures its own slack rather than trusting a breakpoint,
which is exactly the case it was built for.
## 2026-09-14: the page answers questions, out of its own words

The hero has claimed "retrieval that cites the passage it used" since the
rewrite. The page could not do it. `Ctrl K` opened a list of twelve commands —
five jumps, six themes, a copy-email — and a reader with an actual question
(*has he shipped anything on Azure? does he know Kubernetes? is he available?*)
had to scroll 8,659px and find out by reading.

The palette now retrieves. Type three characters or more and it searches the
same `constants` the sections render, and shows the passages that match with the
section they live in.

### The decision that shaped everything else: it quotes, it does not write

No API key, no backend, no model call. Not because one would be hard — because
this page's whole argument is that every number on it was measured, and a
generated sentence about the work is the one thing on the page nobody measured.
So `utils/answer.js` returns **verbatim strings from `constants`**, and the
footer says so: *answers are quoted, never generated*. A test asserts it, by
checking every returned passage against the joined source text.

It is also the cheapest version. Nothing to deploy, nothing to rotate, nothing
that breaks when a key expires, and it works on GitHub Pages exactly as it works
on a laptop with the network off.

### How it ranks, and the two things that had to be fixed to make it work

19 documents: one per role, per degree, per stack group, per project, plus the
availability card. Term overlap weighted by inverse document frequency, title
hits worth double. Then two corrections, each of which was found by asking it a
question and disliking the answer:

| Symptom | Cause | Fix |
| --- | --- | --- |
| "what did he ship on Azure" answered with `rag-pipeline-langchain`, which does not mention Azure | Long documents match more terms, so they win on volume | BM25's length normalisation, `0.4 + 0.6 · len/avg` |
| Still wrong after that: the project says "releases **ship**", the role says "**Shipped** a production RAG application" | `ship` and `shipped` were different keys, so the role matched only one of the two query words | A four-line stemmer: `-ing`, `-ed`, `-s`, then one doubled consonant (`shipp` → `ship`) |

Both are pinned by tests named for the failure — `test_ship_matches_shipped` is
the second one, and it exists because the first fix alone did not hold.

The stemmer is not linguistics and does not try to be. `running` folds to `run`,
`analytics` to `analytic`; neither is a word. It only has to be applied to the
question and to the page identically, which it is, because one function does
both.

**Six aliases, for words this site never uses.** `hire`, `hiring`, `job`,
`jobs`, `available`, `availability` — a recruiter's vocabulary, none of which
appears anywhere in the content. Without them, "are you available for hire"
retrieved nothing at all, which is the worst possible first impression for the
one feature the nav now advertises by name.

**Nonsense returns nothing, deliberately.** `ask("qwertyuiop")` is `[]`, and the
empty state gives the email address instead of a bad guess. A citation exists to
be checked; a wrong one costs more than none.

### Measured, on the running page

Chrome, dev server, both schemes:

| Check | Result |
| --- | --- |
| "what did he ship on Azure?" | AdvanSoft role first, Integer IT second, MLOps group third — all three contain Azure or shipping |
| `↵` on the top answer | closed the dialog, scrolled to `#experience` (0 → 1669, section top at 88px), `body.overflow` restored |
| Arrow keys across both groups | `cmdk-opt-1` (answer) → `cmdk-opt-2` (command) — one key set, two lists |
| Two characters typed | commands only; no answers flickering under the typist |
| `qwertyuiop zzz` | one row: *Nothing on this page says that* + the email |
| 390×844, DPR 3 | panel 358×490 inside a 844 viewport, `scrollWidth === clientWidth` |
| Preprint (light) | passage `rgb(17,17,19)` on a white panel, selected row `rgba(179,27,27,0.15)` |

Bundle: **100.22 kB → 103.84 kB raw, 32.77 → 34.18 kB gzipped** (+1.41 kB
gzipped), which is the index and the ranking code together. Measured by building
`main` and this branch in the same tree.

### Smaller things in the same change

- **The nav chip says `Ask ⌘K`, not `⌘K`.** A bare shortcut reads as a command
  palette, and a reader who never opens it never learns the page can answer a
  question. The mobile row changed from "quick actions" to "ask or act".
- **No "↵ to jump" on an answer row.** It shipped in the first draft and was cut
  after the phone screenshot: a touch device has no Enter key to offer, and the
  footer already says what Enter does.
- **CI runs `npm test` now**, between lint and build. The ranking is the only
  logic in this repo that a build cannot check — it compiles whatever it ranks.

## 2026-09-12: six reading themes

Two palettes became six. The architecture already supported it — CSS variables,
one attribute on `<html>`, a pre-paint boot script — so most of the work was
deciding what the palettes are for and proving they are legible.

### A second axis, because "not dark" stops scaling

The light-only rules (glass shadows, bloom, grain) read
`:not([data-theme="dark"])`. That is a sentence that stops being true the moment
a third palette lands. There is now `data-scheme`, light or dark, written
alongside `data-theme`; a palette declares its scheme once in the `themes`
registry and inherits every structural rule from it.

| Theme | Scheme | For |
| --- | --- | --- |
| Slate | dark | The default |
| Ink | dark | Near-black, cool, highest contrast of the six |
| Paper | light | The default light |
| Manuscript | light | Warm, low blue. Reading rather than scanning |
| Clarity | light | Neutral, high contrast, accent pulled back |
| Preprint | light | An arXiv or IEEE page |

**Preprint's accent is `#B31B1B`, arXiv's own Cornell red** — which happens to
sit in the same family as this site's lava red, so the theme reads as a paper
without the page giving up its identity. That is the detail that made it work
rather than fight.

**The content is identical in all six**, and that is the line worth holding. The
request was for themes "from the mindset of" a hiring manager, a recruiter, a
professor. A portfolio that shows a recruiter different claims than it shows a
professor is not a theme, it is a lie with a switch on it. What varies is the
reading condition — ground, contrast, warmth — and the picker says who each
suits rather than promising anyone their own version of the facts.

### Measured, not derived

Every palette was written, then read back out of the browser and run through the
WCAG formula. Lowest values per theme, against a 4.5 text floor and a 3.0
control-boundary floor:

| Theme | text | secondary | faint/card | accent as text | control edge |
| --- | --- | --- | --- | --- | --- |
| Slate | 12.57 | 8.15 | 4.89 | 6.00 | 4.16 |
| Ink | 16.42 | 9.10 | 5.53 | 7.92 | 3.77 |
| Paper | 13.59 | 6.97 | 4.53 | 5.78 | 3.56 |
| Manuscript | 13.72 | 7.39 | 4.54 | 6.80 | 3.24 |
| Clarity | 18.02 | 8.70 | 5.01 | 6.87 | 3.23 |
| Preprint | 18.86 | 11.32 | 5.72 | 8.39 | 3.93 |

All six clear both floors. Manuscript and Clarity are the tightest at the
control edge, and they sit where Paper already shipped.

### The picker, and two traps in it

A two-state sun/moon toggle does not scale to six: a control that cycles six
things tells you neither where you are nor how many presses remain. It is a menu
now, with a swatch, a name and a line about who each suits.

Two bugs found building the swatches, both worth remembering:

- **A nested element cannot opt into another palette.** The rules are
  `:root[data-theme=...]`, so setting the attribute on a swatch matches nothing
  — every swatch rendered in the *current* theme's colours. They paint from
  `theme.bar` and `theme.accent` directly instead.
- **A bare `<span>` is inline, and an inline box ignores width.** The swatches
  came out 2px wide with their height coming from the line box. `block` fixed
  it. Both were caught by measuring the rendered boxes, not by looking — at a
  glance they read as an intentional thin rule.

### Verified

All six applied in turn at 390x844: correct scheme on each, ground colour
correct, `scrollWidth` equal to the viewport in every one. The picker opens
inside the viewport on a phone (272px wide at x=46..318 of 390), its rows are
74px tall against a 44px minimum, and tapping one applies and persists it.
Mobile battery unchanged: no band overlap, menu reachable, close pinned, nav
visible after a jump.

## 2026-09-12: the premium pass

### Stack on a phone: the boxes came off

Thirty-three tools rendered as thirty-three bordered rectangles, each 44px tall
in rows of two or three, inside one long card. That is a form, not a vocabulary,
and it ran most of a screen per group. Above it sat the token wave in a strip of
its own, which at 390px is too short for a wave and too narrow for a sentence of
tokens: it rendered as struck-through fragments floating in empty space and read
as a rendering fault rather than an effect.

The terms are bare now — a `flow` variant of `TagTerm` with the box taken off.
The dotted underline was already marking which terms are definable, which is the
only thing the border was communicating, so removing the border loses nothing.
The two tiers move from fill to weight and colour: a headline tool reads as the
page's own text, the rest as prose beside it. Each group gains its count on the
right, which is the one number a reader might want from a list of tools.

**Measured, 390x844: the section went 1,364px to 1,131px, 233px shorter, 17%.**
Four groups now fit in a screen where two and a half did. All 33 terms still
clear the 44px touch target — it moved from the box to the line box — all 33
definition panels still open inside the viewport, and `scrollWidth` stays at the
viewport.

The phone strip took the `inline` variant of `TokenStream` with it; it was the
only caller, so the branch is gone rather than orphaned. The wave is desktop
only now, where it has a real band to live in.


Feedback: "looks like a website from 1990". It did not — it looked like **2020
developer-brand**, which is a different and more fixable problem. Four things
were doing it, and none of them was the content.

### Mono was doing everything

Navigation, the wordmark, the status line, every eyebrow, every card label, the
whole availability block. Terminal texture peaked around 2021, and at this
density it read as a terminal rather than a product.

One rule now: **mono is for identifiers — code, URLs, repo names, tool names,
clocks, counts. Everything else is the sans.** That converted eleven components
and the entire availability card, whose facts are a job title and an employer,
not data.

### Nothing had depth

Flat fills and 1px hairlines, on one plane, on a flat ground. Three additions:

- **Elevation.** `.glass-card` had one soft shadow, which reads as a blur behind
  a box. It has three now — a tight contact shadow, a wide ambient one, and the
  inner highlight — which is what makes a surface look like it is above the page
  rather than printed on it.
- **A bloom** behind the hero: two large radial gradients at ~10% alpha, so the
  headline sits in front of something.
- **Grain**, a fixed feTurbulence layer at 3.5%. A flat dark ground bands across
  1440px; noise breaks the bands and reads as material. One data URI, no request.

### The button was the single most dated element

A flat saturated rectangle at 6px radius. Now `.btn-accent`: a vertical gradient
so it looks lit from above, a **coloured** ambient shadow so the accent glows
into the ground instead of sitting on it, an inner top highlight, and a hover
that lifts by 1px instead of dimming. 22px radius.

### Radii

Large surfaces 12px → 18-22px; small controls 6px → 12px. A 6px control beside a
22px card is what makes the control look like a form element from another decade.

### The regression this introduced, and how it was caught

The bloom shipped as `inset: -20% -10% auto -10%`. The negative horizontal bled
39px past each edge and **took the document to 430px wide on a 390px phone** —
a sideways scrollbar on every page. Caught by re-running the mobile battery from
earlier in this session, which is the whole reason that battery exists. It is
`inset-x: 0` now; the gradient is soft enough that it needs no bleed, and the
negative top is safe because nothing scrolls above the document origin.

### Verified

Full mobile battery at 390x844 after the change: band does not overlap the copy,
menu's first link reachable, close button pinned, nav visible after a menu jump,
33 glossary panels all on screen, no contact address wraps, and `scrollWidth`
equal to the viewport at the top, with a panel open, and at contact. Light theme
checked separately — the bloom has its own much fainter light variant, because
the dark one on a near-white ground is a stain.

## 2026-09-12: the hero band flickered on a real phone

First real-device report of the session, and it found something no emulated
viewport could: **the code band flickered while scrolling.**

### The measurement was right; the thing it measured moves

A mobile browser collapses its URL bar as you scroll down and restores it as you
scroll up. The hero is a viewport-height box, so its height — and therefore the
slack under its copy, which is what the band measures itself against — changes
by the height of that bar several times in one gesture. Reproduced by stepping
the hero through the heights a ~100px bar produces:

| Hero height | Room | Lines that fit | Band |
| --- | --- | --- | --- |
| 844px | 213 | 8, renders 7 | shown |
| 784px | 153 | 5 | shown, window resizes under you |
| 744px | 113 | 2 | below MIN_LINES, fades out |

Back and forth, several times per scroll. That is the flicker, and every step of
it was the fit logic working exactly as written.

### Decide against the worst viewport, and stop deciding mid-gesture

Two changes:

- **`floor`** — the decision is taken against the smallest room seen, not the
  current one. Once the bar has been up once, the answer stops moving: the band
  shows only if it fits with the bar showing, which is the only honest question
  to ask. A bar that hides makes the room grow, and growth must never reopen a
  decision already taken against the smaller viewport.
- **debounce, 180ms** — a gesture that changes the height four times produces
  one decision at the end of it instead of four.

The floor resets on the two things that are real layout changes rather than
browser chrome: rotation, and the reader's text-size control, whose reflow of
the copy is the signal.

### Two bugs found while fixing it

**The floor latched a mid-animation reading and kept it forever.** The hero's
copy arrives on a framer transform, so for the first second its bottom edge is
16px low and the room reads smaller than it ever will again. Latching that cost
two lines of the window permanently. Fixed with a warm-up: while warming, a
measurement replaces the floor rather than min-ing with it.

**The warm-up then kept whatever the last warm measurement was**, because
nothing re-measures once the page is still — so it still latched a value from
mid-animation. It now takes a *fresh* reading at the moment it goes warm, from a
settled layout. The timer is 1500ms, past the hero's entrance: `container`
staggers six children 0.1s apart after a 0.08s delay, each running 0.6s, so the
last settles around 1.2s.

### Verified

At 390x844, type scale 1: room 213, chrome 66, line 16.5 — **7 lines, which is
exactly what fits**, and identical across ten samples over three seconds. Then
through the URL-bar sequence: it adjusts once as the bar first appears and never
moves again.

A note on the measuring, since it cost time: an earlier run of this check said
the band was rendering a line short. It was not. The browser had `type-scale
1.12` persisted in localStorage from earlier testing, which makes the line
height 18.48 and the room 181, and 5 lines is the right answer there. **Clear
the reader's own settings before trusting a layout measurement.**

## 2026-09-12: taking the template out of it

Asked whether the site reads as generated. Honest answer at the time: the craft
does not — the project schematics, the glossary definitions and most of the
project copy are specifically the opposite — but the **skeleton** did, and the
biggest block on the page was the worst of it. Three changes, and the first is a
deletion.

### The capability grid restated Stack, and it went

About carried six cards: `Data Engineering`, `Data Analytics`, `Data Science`,
`Machine Learning`, `AI Engineering`, `Software & Full-Stack`. Stack carries six
groups: `Data engineering`, `Data science`, `LLM / RAG`, `Computer vision`,
`MLOps & infra`, `Backend & apps`. **The same skills, partitioned six ways,
twice, about 2,000px apart.**

Worse, they were claims on a page whose hero promises "the evidence it works".
"Turning raw data into decisions" and "built to generalize past the demo" are
true of every ML engineer who has ever written a portfolio, and the real
evidence — shipped systems with diagrams of how they work — was 3,000px further
down. The grid cost about 700px between the lede and Experience, which is the
section a recruiter opens this page to read.

Deleted, along with the `services` constant, which had no other consumer.
**About went from 1,446px to 966px.** Breadth is still on the page: it is in
Stack, where it is named in tools rather than adjectives, and in Work, where it
is demonstrated.

### The diagrams build as you scroll

The six project covers are left-to-right pipelines — query, store, cited answer.
They now draw themselves in that direction as the card comes up the screen,
finishing by the time it reaches the middle, so the reader watches the system
get built in the direction it runs.

**It is a composited wipe over the finished frame, not a build parameter
threaded through six drawers.** Each drawer is ~250 lines of bespoke canvas and
already takes a `t` meaning "where in the loop am I"; a second axis meaning "how
much of me exists" would have meant rewriting all six and repeating the same
condition in each. `destination-out` with a 48px gradient does it once, for
every cover, including any added later.

Measured on a cover as it rises: 0 ink below the fold, then **276 ink all in the
left half with the right at exactly 0**, then both halves filling, then settled
at ~2,450. Static covers stop asking for frames once built (`settled`), so three
of the six do not hold a rAF open for the life of the page. Reduced motion draws
all six complete, verified by pixel count on each.

### The sections stopped announcing themselves identically

Five sections opened the same way: a mono eyebrow, the name, a full stop.
"SELECTED WORK / Projects." tells a reader nothing the nav did not. Uniform
openings are what make a page read as filled-in rather than written.

The eyebrow carries a fact now, and every fact is **derived, never typed**:

| Section | Was | Is |
| --- | --- | --- |
| About | INTRODUCTION / Overview. | Overview *(no meta: the first section sets no pattern)* |
| Experience | WHERE I'VE WORKED / Experience. | 4 roles · since 2020 |
| Stack | WHAT I USE / Stack. | 6 areas · 33 tools |
| Work | SELECTED WORK / Projects. | 6 built · 1 live |
| Contact | GET IN TOUCH / Contact. | 4 routes · US Central time |

Four because `experience` has four entries; 2020 because that is the earliest
`start` in it; 33 because that is the **set** size of the tools, not the sum of
the arrays, which would claim more than he lists; one live because one project
has a `live_link`. None of them can go stale, and they are the cheapest possible
instance of the thing the hero promises.

The full stop is gone. A one-word heading with a period after it is a house
style borrowed from a hundred agency templates. `SectionHead.jsx` owns the shape
now, so there is one place to change it.

### Not done

The section *names* are still the default set — Overview, Experience, Stack,
Projects, Contact. Renaming them is writing his copy, not mine.

## 2026-09-12: the availability card, and a reduced-motion claim that was false

### The layout problem was spacing, not wrapping

The card listed six rows — three labels, three values — in a one-column grid
with `gap-y-2`. That 8px sat between a label and its value AND between that
value and the next label, so every row was equidistant and nothing said which
value belonged to which label. On top of that, two values broke mid-phrase at
390px: "AdvanSoft / International, Inc" and "hybrid or / remote", because a
317px column was being asked to hold a sentence.

Each fact is now a block: label, a rule, then the value. **28px between facts
against 15px from a label to its value** — the ratio is what does the grouping,
and at `gap-5` it was 20 against 15, close enough that the six rows read evenly
spaced again.

The parts that were one sentence get a line each: role above employer, country
above arrangement. `status.where` was one string, `"United States: on-site,
hybrid or remote"`, and is now `country` and `arrangement`. His words are
unchanged; the layout supplies what the colon used to. Nothing wraps at any
width now — verified at 390 and 1440, every value exactly one line box.

### The motion

Three things, all measured running:

| What | Measured |
| --- | --- |
| Facts arrive in sequence | fact 1 at t=270ms, fact 2 at 360, fact 3 at 450 — the 90ms `staggerChildren` |
| A rule draws under each label | `scaleX` 0 → 1 in step with its fact: 0.36, 0.71, 0.87, 0.94, 1 |
| A rail fills as the card crosses the screen | `scaleY` 0.12 → 0.39 → 0.70 → 1.00, monotonic, then holds |

The rail is scroll-linked with `useScroll` on the same `offset` pair Works.jsx
uses for its cover parallax, so both scroll-driven things on the page are driven
the same way. It starts at 0.12 rather than 0, because a rail that is empty
until the card is halfway up the screen reads as broken rather than as progress.

### The reduced-motion claim was false, and had been

The old docstring said "all of it is CSS animation or framer, both already
neutralised by the reduced-motion handling". **Half of that was wrong, and it is
worth writing down because the assumption is a natural one.** The
`@media (prefers-reduced-motion: reduce)` block in index.css zeroes
`animation-duration` and `transition-duration`, which does cover the ping and
the specular sweep. Framer writes `opacity` and `y` as inline styles from its
own rAF loop, so that block never touched them.

Measured under an emulated reduced-motion preference: the three facts still slid
8px and faded in. `initial={reduced ? false : "hidden"}` is what actually stops
it — the same thing Hero.jsx already does — and the rail is pinned to full
through `useReducedMotion`. Re-measured after: sampled ten frames through the
window where the animation used to run, and opacity never left 1 and the
translate never left 0.

This was pre-existing, not introduced by the redesign. It is fixed now, and the
docstring says what is true instead of what was assumed.

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

### It shrinks before it hides

Follow-up, same day. The first version was all-or-nothing, and at 112% text it
hid over **one pixel**: 221px of slack against 222px needed. Vanishing over a
pixel is a worse answer than showing one line fewer, so the measurement now buys
lines rather than a yes/no — `floor((room - chrome) / lineHeight)`, clamped to
4..7, and it only hides when even four will not fit.

| Condition | Slack | Before | After |
| --- | --- | --- | --- |
| 390x844 | 253px | 7 lines | 7 lines |
| 390x844 at 112% | 221px | **hidden** | **5 lines** |
| 390x844 at 125% | 103px | hidden | hidden |
| 390x844 at 140% | 18px | hidden | hidden |
| 430x932 | 406px | 7 lines | 7 lines |
| 768x900 | 346px | 7 lines | 7 lines |
| 360x640 | 49px | hidden | hidden |

**It cannot oscillate, and that is the whole design of the division.** Both
quantities it divides by are independent of how many lines are currently shown:
the chrome around the code window (`band.offsetHeight - pre.offsetHeight`) and
one line's height. So the ResizeObserver's second pass computes the same answer
as the first and stops. Verified by sampling the line count 20 times over three
seconds at 112%: one distinct value.

The smaller window still works: at 5 lines, every settled result has the line
that produced it on screen — `missing` shows 8..12 with `return -1` active,
`empty` 0..4 with the guard's `return -1`, `found` 4..8 with `return mid`.

### Not done

Real-device QA on iOS and Android, still.

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
