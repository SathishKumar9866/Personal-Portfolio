# Contributing

Contributions are welcome here, and on any of the repositories linked from this
site. That includes people who found a project through a paper, a search, or an
LLM summary and want to poke at it.

You do not need permission to open an issue or a pull request. You do not need
to know the codebase. A question counts as a contribution: if something was
unclear enough that you had to ask, the documentation has a gap, and that is
worth knowing.

## What is genuinely useful

| Kind | Why it helps |
| --- | --- |
| A bug, with the steps that produce it | The steps are the whole value. "It broke" cannot be acted on |
| A correction to something factually wrong | Every number on this site is measured or absent. If one is wrong, that is serious |
| A gap in the docs, named specifically | "I could not tell whether X runs offline" is a better issue than "docs unclear" |
| A feature you actually wanted while using it | Wanting it is the evidence. Speculative features are not |
| Accessibility or readability problems | Especially on hardware or at a text size I do not have |

Small and specific beats large and general. A one-line fix with a clear reason
gets merged faster than a refactor that touches thirty files.

## Using an LLM to contribute

Use one. Claude, Codex, Gemini, Grok, whatever you already have open. Writing
the patch with a model is not something to disclose apologetically, and it is
not held against a pull request here.

There is one condition, and it is the same condition a human contribution has:
**the pull request has to explain itself.** Not the diff, the reasoning.

Concretely, a good description answers:

1. **What was wrong**, stated as behaviour, not as a file name.
2. **How you know**, with the command you ran and its output, or the steps you
   followed and what you saw. Measured, not assumed.
3. **Why this fix and not another one.** If you considered something simpler and
   rejected it, say why. That sentence is usually the most useful one.
4. **What you did not do**, and what might still be wrong.

This is not ceremony. Both a reviewer and a model reading the history six months
later reconstruct intent from that description, and "refactored for clarity"
reconstructs nothing. A patch a model wrote and nobody can explain is a patch
nobody can safely change later.

If the model asserts something you did not verify, say that in the PR rather
than presenting it as checked. An honest "I did not test this on Windows" is
worth more than a confident claim that turns out to be false.

## Before you open a pull request

```bash
cd 3d_portfolio
npm install
npm run dev        # http://localhost:5173
npm run lint       # must exit 0 errors
npm run build      # must succeed
```

The repo has conventions that are load-bearing rather than decorative, and
`3d_portfolio/README.md` is the map. Two that catch people:

- **Do not add a bare `text-[Npx]`.** Type sizes come from the named scale in
  `tailwind.config.js`. The reason is in `docs/TYPE-AUDIT.md`.
- **Content lives in `src/constants/index.js`.** A fact hard-coded in a
  component is a bug.

## What happens next

I read everything. I will not merge everything, and a decline is not a judgement
about the work: sometimes a change is right for your fork and wrong for a
personal site that has to stay small.

If it is a correction to a fact, I will act on it quickly. If it is a feature, I
may sit on it, because the fastest way for a personal site to get worse is to
accept every reasonable addition.

## Working together, beyond a patch

I am interested in people who think differently from me. Different field,
different stack, different reason for caring about the problem: that is usually
where I learn the most, and it is the main reason this site links to its source
at all.

I pick things up quickly, I would rather ask an obvious question than guess, and
I try to write and speak plainly enough that someone outside my specialism can
follow. If you are looking for a collaborator on something research-adjacent,
open source, or just unfinished, I am open to it.

The two routes that reach me:

- **LinkedIn**, <https://www.linkedin.com/in/sathishkumarai> — I am active there
  and usually reply quickly. Best for a conversation or a call.
- **Email**, <sathishkumar786.ml@gmail.com> — best for anything with detail
  attached.

Say who you are and what you are working on. That is enough.

## Licence

Code is MIT. The written content and images are not: see the
[License section of the README](README.md#license). A contribution to the code
is offered under the same MIT terms.
