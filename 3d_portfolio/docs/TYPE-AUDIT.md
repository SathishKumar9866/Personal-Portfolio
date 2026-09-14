# Type audit, 2026-09-11

The report was that the content is not visible to a normal reader. It was
correct, and the cause was not contrast.

## The finding

The site was typeset like a dashboard and read like one. Measured on the running
page, light theme, 1536px wide, counting every element that owns a text node and
actually renders:

| | Before | After |
| --- | --- | --- |
| Text elements at **10px** | 26 | **0** |
| Text elements at **10 or 11px** | **137** | **7** |
| Text elements at 13px or smaller | 220 of 273 (**81%**) | 114 of 273 |
| Distinct font sizes on the page | 20 | 14 |
| Contrast failures (AA, both themes) | 2 | **0** |
| Smallest prose measure | 39 chars | 39 chars |
| Experience bullets | 14px / 76 chars | **16px / 70 chars** |

The seven elements still at 11px are the captions drawn *on* the project cover
artwork plus the "scroll" cue. They are labels on a picture, not content, and
they are supposed to sit under the drawing rather than compete with it.

In the source, 46 of 64 font-size declarations were 13px or smaller: fifteen at
11px, fourteen at 12px, nine at 13px, eight at 10px. Ten declarations in the
whole codebase were 14px or larger.

## Why it mattered, specifically

The audience is a recruiter or a hiring manager, reading on a laptop, giving the
page something like thirty seconds. Every fact that reader needs was in the
10-13px band, while the decoration around it was not:

| What a recruiter looks for | Was | Now |
| --- | --- | --- |
| Employer and location | 12px mono | **14px** |
| Dates | 11px uppercase mono | 12px |
| What he did in the role | 14px, 76 chars | **16px, 70 chars** |
| Technology chips (72 of them) | 11px mono | **13px** |
| Project name | 12px mono | **14px** |
| Project description | 14px | 15px |
| Repo and live links | 12px mono | **14px** |
| Email and profile URLs | 13px mono | **14px** |
| Stack group descriptions | 13px serif | **15px** |
| "Dotted terms" hint | 13.5px serif *italic* | **15px** serif italic |
| Section intros | 17px | 18px |

The headline was 84px and the thing it was selling was 11px.

## Two contrast failures, both real, both in both themes

Contrast was otherwise in good shape: a previous session measured 22 pairs and
fixed them, and that work holds. Two things escaped it.

1. **The logo monogram.** White on the accent fill: **3.62:1** light, **3.28:1**
   dark, against a 4.5 requirement. `index.css` already records this exact
   failure mode — *"White on the accent fill failed at 3.62:1, including the skip
   link"* — and the skip link was fixed with `--c-strong`. The monogram is the
   same fill and was missed. Same fix, now 4.68:1.

2. **The footer separator.** The `·` between footer items used `text-line`, which
   is the *decorative hairline* token, as a text colour: **1.33:1**. Invisible, so
   the footer items ran together into one string. It now uses `text-faint`, a
   token meant to be read.

A third thing is not a WCAG failure but was wrong anyway: the emphasised half of
the hero headline — *"evidence it works"* at the time, *"real-world impact"*
since 2026-09-14 — used `text-accent`. `index.css` states
the rule in the token's own comment: **`--c-accent` is FILLS ONLY, 3.62:1 as
text**. At 84px that passes AA-large, so no tool complained, but it meant the
punchline of the headline was the faintest text on the page. It now uses
`--c-accent-ink`, the token that exists for exactly this, at 5.78:1.

**A note on how the first pass got this wrong.** The initial sweep reported
`Ctrl K` at 1.33:1. That was a reporting bug in the audit script, not a finding:
it printed a *group* minimum next to the group's *first* sample, and `Ctrl K`
merely happened to be first among 91 elements sharing a style signature. The
1.33:1 belonged to the footer separator. Per-element reporting found the real
two. Worth recording, because a contrast audit that mislabels its own offenders
sends you to fix the wrong element.

## The change: a named scale instead of sixty-four literals

Sizes were arbitrary literals scattered across fourteen files, which is why the
page had twenty distinct sizes and no way to see that. They are now named for
the job they do, in `tailwind.config.js`, so the next audit is one file:

| Token | px | For |
| --- | --- | --- |
| `text-micro` | 11 | stamps sitting **on** artwork, and nothing else |
| `text-label` | 12 | uppercase tracked eyebrows, field names |
| `text-nav` | 13 | nav items, section eyebrows |
| `text-chip` | 13 | technology chips |
| `text-data` | 14 | mono facts: employers, dates, URLs, repo names |
| `text-body` | 15 | prose inside a card, where the measure is narrow |
| `text-prose` | 16 | prose at full measure |
| `text-lede` | 18 | section intros |

Fifty-six replacements, each an explicit decision rather than a find-and-replace:
the same `text-[12px]` became `text-label` where it was a field name and
`text-data` where it was an employer.

Line heights ride along with each token as defaults. An explicit `leading-*` on
an element still wins, because Tailwind emits `fontSize` before `lineHeight`.

## Judgement calls, and what they cost

**Card prose is 15px, not 16px.** Raising prose to 16px inside a three-up card
grid shortens the measure to about 37 characters, which reads choppy. 15px holds
39-45 characters there. Only the Roles bullets, which have a full-width
measure, get the full 16px: they land at 70 characters, the comfortable middle of
the 45-75 range.

**The About capability cards were the narrowest text on the page at 39
characters**, and that finding is now void: the cards were deleted in the
de-template pass, because they restated Stack's six groups in adjectives rather
than tools. The `max-w-5xl` measure they shared with the status card survives
them — it is what still keeps the status card from overshooting the lede.

**The hint stayed italic.** Italic serif at 13.5px was the least legible text on
the page, and the instinct is to remove the italic. But the italic was asked for
deliberately, and it was the *size* doing the damage. At 15px it reads fine, so
the styling intent survives.

**The project cover captions stayed small,** at 11px. They are drawn over a
canvas illustration as its caption. Raising them would make the label compete
with the drawing it describes.

**The command palette was raised but not prioritised.** It is a power-user
surface a recruiter will never open. It went off 10/11px anyway, because there is
no argument for keeping any text smaller than the floor.

## Touch targets, found while measuring

Three controls were under the 44px minimum on a phone, all pre-existing:

- **The live-project link** sat at 21px while the repo link beside it already had
  `min-h-11`. The link that goes to a working product was the smaller target.
- **The email address** in the contact list, at 39px.
- **The skip link itself**, at 40px: an accessibility affordance that missed the
  bar it exists to serve.

All three fixed. Two links remain under 44px and are left deliberately: both are
inline links inside a sentence, which WCAG 2.5.8 Target Size (Minimum) exempts,
and padding them out would wreck the paragraph they sit in.

## Verified

Measured on the running page, both themes, not read off the diff:

- 0 contrast failures, light and dark, every rendering text element checked
  against its composited background
- 0 elements below 11px; 7 at 11px, all of them captions on artwork
- no horizontal overflow at 1440px or at phone width
- Stack grid still two-up at desktop, one-up narrow, and **0 cards with chip-row
  overflow** after the chips grew from 11px to 13px
- line lengths land between 39 and 70 characters; Experience bullets at 70
- 0 non-exempt controls under 44x44 on a phone
- `npm run lint` 0 errors, 26 pre-existing react-refresh warnings
- `npm run build` clean

## Left alone, on purpose

- **Heading `clamp()` scales.** Hero, section heads and project titles were
  already generous and are not part of this problem.
- **The typefaces.** Barlow, Newsreader and JetBrains Mono are the brand. Mono at
  13px is legible; mono at 11px was not. The face was never the issue, the size
  was.
- **`Quote.jsx`** was dead code, converted to the scale here for consistency
  rather than deleted, because deleting it is a separate decision from a type
  audit. That decision was taken on 2026-09-12 and **the file is gone**: no
  reference anywhere in `src/`, and the built bundle already contained zero
  occurrences of its `figcaption`, so Rollup had tree-shaken it and the deletion
  changed the shipped output not at all.
