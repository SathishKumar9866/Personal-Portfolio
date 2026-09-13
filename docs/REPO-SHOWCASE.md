# Repo showcase: what to market, and how

**Measured 2026-09-12** against the GitHub API for `SathishKumarAI`. Every number
below was read from the API or from the repo's own README — none is an estimate.
The method is at the end.

| | |
|---|---|
| Repos on the account | **60** |
| Forks (not yours to market) | 9 — all public |
| Your own | **51** — 28 public, 23 private |
| Stars across all of them | **4**, one each on `instagram-reels-extractor`, `pickleball-vision-llm`, `rag-pipeline-langchain`, `github-repo-generator-template` |
| Followers | 11 |
| Pinned on the profile | **4 of 6 slots** |

**The finding in one line:** the account holds eight genuinely strong projects and
about twenty that dilute them, and the four currently pinned are not the four
strongest. A recruiter sees the pins, the profile README, and maybe two repos.
Everything here is about what those first three clicks land on.

---

## 1. The tiers

Ranked by what a reader can verify in sixty seconds: does it run, is there a
story in the README, and does the history show sustained work rather than a
weekend.

### Tier 1 — the showcase six

These six should be pinned, and these six should be what the portfolio site
carries.

| Repo | Commits | README | Live | Why it sells |
|---|---:|---:|---|---|
| **bujo** | **830** | 17.3 KB | ✅ <https://bujo-journal.vercel.app> | The most sustained thing on the account, and it is a *product* — local-first bullet journal, competitor table, client-side correlation engine, one-click export. Nothing else here shows product thinking this clearly. |
| **prepforge** | 252 | 32.3 KB | — | 100 curated questions, 16,639 seeded cards, 703 pre-authored answers, SM-2 scheduling, six routes, ingest for your own material. Reads like a shipped app, not a study repo. |
| **federated-yolov8-object-detection** | 131 | 11.3 KB | — | The most senior ML story you have: the privacy constraint shapes the architecture, one command runs the whole pipeline, experiment presets for seeds / strategies / partitions / alpha, a RUNBOOK, CI badge, Apache-2.0. |
| **instagram-reels-extractor** | 58 | 16.2 KB | — | Multimodal in the real sense — transcript + on-screen OCR + vision fused into *typed* records with per-fact provenance, then semantic search and RAG on top. |
| **dsa_problems** *(private)* | 89 | 7.4 KB | — | 107 problems across 10 patterns, 87 with interactive learning journeys that teach the insight before naming the pattern. React 19 + TS + Tailwind v4. Publish it — see §5. |
| **pediatric-group-llc-website** *(private)* | **467** | 7.5 KB | Vercel, behind SSO | The only repo that proves you ship for a paying client: five offices, Astro, Lighthouse ≥95 on all nine pages, automated WCAG pass. Needs client consent — see §5. |

### Tier 2 — real, but each needs one fix before it earns a pin

| Repo | Commits | The gap |
|---|---:|---|
| `pickleball-vision-llm` | 66 | **Pinned today, and its README is a directory listing.** 2.2 KB of folder tree — no problem statement, no result, no image. The widest gap on the account between prominence and presentation. |
| `pb-card-deck` | 38 | Good README, live app — but **the URL in the README is dead**: `pickleball-card-games.vercel.app` returns **404**. The working one is `pb-card-deck.vercel.app` (200), which is what the portfolio site already links. |
| `liver-report-ai-public` | 3 | Excellent privacy-first framing — invented rather than de-identified data, a pre-commit PHI guard, a three-layer scanner — attached to a three-commit history. The story is better than the repo; move more of the private twin's work across. |
| `pediatric-care-platform` | 19 | A merge of two prior projects with a documented rationale. Good narrative, thin history. |
| `loan-division-emi-tracker` | 12 | Decimal-safe reducing-balance EMI engine, 29 tests green, every figure expandable to its formula. Niche, but the clearest "I get correctness right" exhibit you have. |
| `rsna-knee-2026` | 3 | A live Kaggle entry with rules and ethics docs and a VRAM probe. Worth exactly as much as finishing it before **Oct 22 2026**. |
| `dotfiles` | 56 | Pinned today. 32 KB README, real tooling (mise + chezmoi, Catppuccin) — but dotfiles say "I configure my machine", not "I ship ML". Keep public, **unpin**. |

### Tier 3 — quiet: keep public, do not promote

`system-design-interview-prep` (16 commits, reads as study notes),
`rocky-dev-setup`, `Personal-Portfolio` (the shopfront, not a product),
`SathishKumarAI.github.io` (deploy target), `SathishKumarAI` (the profile README,
and it is good — leave it alone).

### Tier 4 — archive these eight

Public, stale, and each one spends a reader's attention while they scan:

| Repo | Last push | Why it goes |
|---|---|---|
| `loan` | 2021-03-15 | Five years cold |
| `github-repo-generator-template` | 2024-07-20 | Superseded by `project-scaffold-sample` |
| `Project-Med` | 2025-02-01 | No description, superseded by `pediatric-care-platform` |
| `project-lee-landing-page` | 2025-03-13 | No description, client one-off |
| `python-data-structures` | 2025-08-17 | Superseded by `dsa_problems` |
| `prompts` | 2026-01-08 | No code in it |
| `flashcards` | 2026-06-06 | Superseded by `prepforge` |
| `project-scaffold-sample` | 2026-06-06 | Its own description says "created from a script" |

Archiving keeps the history and the URL, greys the repo out, and takes it off the
default profile view. Cheapest single improvement on this list.

---

## 2. The three identical RAG repos — fix this first

`engineering-intelligence-hub`, `healthcare-knowledge-navigator` and
`ai-due-diligence-copilot` are **the same codebase with the corpus swapped**.
Not an impression — byte-identical:

| | engineering-intelligence-hub | healthcare-knowledge-navigator | ai-due-diligence-copilot |
|---|---|---|---|
| `app/rag.py` blob SHA | `b7d92c8…` | `b7d92c8…` | `b7d92c8…` |
| `app/main.py` blob SHA | `f37c0cd…` | `f37c0cd…` | `470d903…` |
| Files at HEAD | 145 | 145 | 153 |
| Commits | 10 | 9 | 33 |

Their READMEs are the same paragraphs with three nouns changed, down to the
feature codes (`F03`, `F16`, `F17`, `F20`, `F21`, `F23`).

**Why it matters:** a reader who opens two of them learns that one project was
counted three times, which reads worse than having one project. Three thin
histories (10, 9, 33) on identical code is the exact shape of portfolio padding.

**The fix, best first:**

1. **One repo, three corpora.** Keep `ai-due-diligence-copilot` (most commits, and
   its corpus is real SEC EDGAR filings), rename it to what the engine actually
   is — `grounded-rag` or similar — and ship the three corpora as presets. The
   headline becomes *"one retrieval engine, proven across finance, clinical and
   engineering documents"*, a stronger claim than any of the three makes alone.
   Archive the other two with a README line pointing at the survivor.
2. **Cheaper: keep one, archive two.** Pick by the job you want — healthcare if
   you are targeting clinical AI, since it pairs with `liver-report-ai-public`
   and `pediatric-care-platform`; due-diligence if fintech.

Either way the portfolio site should stop listing one of these *and*
`rag-pipeline-langchain` as two separate RAG projects — see §4.

---

## 3. Name your repos what your README calls them

Three projects answer to two names each. Every one costs search hits and makes a
link look like it points somewhere else:

| Repo name | README title | Do this |
|---|---|---|
| `prepforge` | **Recall** | Pick one. `recall` is the better product name, `prepforge` the better search term — a README title of *"prepforge — recall what you learn"* keeps both. |
| `instagram-reels-extractor` | **reels-scrap** | Fix the README title. Consider renaming the repo too: "extractor" invites a scraping-policy question you do not need in a first impression, where `reels-to-knowledge-base` describes the output. |
| `dsa_problems` | **dsa.patterns** | Rename to `dsa-patterns` on publish. Underscores are unusual in repo names, and "problems" undersells a teaching app. |

---

## 4. The portfolio site is showing the wrong six

`3d_portfolio/src/constants/index.js` → `projects` currently carries:

| # | Project | Verdict |
|---|---|---|
| 1 | `rag-pipeline-langchain` | **Drop.** 9 commits and a **535-byte** README that defers the project structure to another document. It is the weakest public repo on the site, and the site's copy promises a production AWS RAG that the repo does not show. |
| 2 | `ai-due-diligence-copilot` | Keep **only after §2 is resolved**, then present it as one engine with three corpora. |
| 3 | `federated-yolov8-object-detection` | Keep — strongest ML entry. |
| 4 | `instagram-reels-extractor` | Keep. |
| 5 | `pickleball-vision-llm` | Keep only after its README is rewritten. |
| 6 | `pb-card-deck` | Keep — the only entry with a working live link. |

**Missing, and both belong there:** `bujo` (830 commits, live demo, the clearest
product story on the account) and `prepforge` (252 commits). A portfolio that
omits your two most-worked projects is under-selling by a wide margin.

Recommended six, in this order — the order is the argument, heaviest ML first,
shipped product last:

1. `federated-yolov8-object-detection` — privacy-preserving distributed training
2. the consolidated RAG engine (§2) — grounded answers, citation per claim
3. `instagram-reels-extractor` — multimodal video into typed, cited records
4. `prepforge` — local-first learning platform with a spaced-repetition engine
5. `bujo` — local-first product, live, 830 commits
6. `pb-card-deck` — live PWA, no backend by design

**Profile pins (6 slots, 4 used):** the same six. Drop `dotfiles`; hold
`pickleball-vision-llm` back until its README is fixed.

---

## 5. The private repos

23 private, and three of them are better than most of what is public.

| Repo | Commits | Call |
|---|---:|---|
| `dsa_problems` | 89 | **Publish** as `dsa-patterns`. Interview-prep apps attract stars, and it is the strongest front-end work you have that is not `bujo`. Nothing in it is confidential. |
| `paper-code-gen` | 2 | **Publish once it has a history.** A faithful reproduction of arXiv:2606.20363 that reproduces a *negative* result is rare and reads as research maturity. Two commits is too thin to show today. |
| `pediatric-group-llc-website` | 467 | **Ask the client first.** With consent, publish — Lighthouse ≥95 across nine pages plus an automated WCAG pass is the hardest evidence on the account. Without consent, write it up as a case study on the portfolio: numbers, no code, no client data. Never publish the form access key or provider data either way. |
| `liver-report-ai` | — | Keep private; it is the real-data twin of the public one. Move technique across, never data. |
| `secret-vault` | — | **Keep private, permanently.** A password-vault repo is a liability in a portfolio even when the crypto is right. |
| `grad-school-usa`, `job-search-ai-ml`, `dice-outreach-email-platform`, `dice-job-application-extension`, `resume-automation`, `Sathish-Kumar-Resume` | — | Keep private. Job-search tooling tells a reader you are shopping, which is not the note to open on. |
| `punch_card_website_and_app`, `dsa_visualizer`, `launcher`, `medical-research-notebooks`, `learning-roadmap`, `personal-finance-study`, `ai-engineering-bootcamp-materials`, `personal-notes`, `claude-prompt-and-code`, `aio-cooling-verify`, `data-engineer-project`, `pediatrics-flutter-app` | — | Keep private. Personal tooling and study material; publishing adds count, not signal. |

---

## 6. Hygiene sweep

Mechanical, cheap, and it is what GitHub's own search indexes.

**16 public repos have no topics:** `Personal-Portfolio`,
`SathishKumarAI.github.io`, `prepforge`, `system-design-interview-prep`,
`loan-division-emi-tracker`, `rsna-knee-2026`, `liver-report-ai-public`,
`SathishKumarAI`, `project-scaffold-sample`, `flashcards`, `prompts`,
`python-data-structures`, `project-lee-landing-page`, `Project-Med`,
`github-repo-generator-template`, `loan`.

Topics are a discovery channel — `rag`, `llm`, `computer-vision` and
`federated-learning` all get browsed. The repos that already carry them show you
know how; the rest were just never done.

| Repo | Topics to add |
|---|---|
| `prepforge` | `spaced-repetition` `local-first` `interview-prep` `fastapi` `react` `typescript` |
| `liver-report-ai-public` | `ocr` `healthcare` `privacy` `local-first` `python` `document-ai` |
| `rsna-knee-2026` | `kaggle` `medical-imaging` `pytorch` `mri` `deep-learning` |
| `loan-division-emi-tracker` | `react` `typescript` `fintech` `local-first` `decimal` |
| `Personal-Portfolio` | `portfolio` `react` `vite` `tailwindcss` `accessibility` |

**4 public repos have no description:** `flashcards`, `project-lee-landing-page`,
`Project-Med`, `loan`. All four are on the archive list, so archiving settles it.

**Only one public repo sets a homepage URL** (`pb-card-deck`). `bujo` has a live
demo in its README and an empty homepage field — GitHub shows that field beside
the description at the top of the repo and in search results. Set it on `bujo`,
and on `Personal-Portfolio` (→ `https://sathishkumarai.github.io/`).

**Repo size is a first-impression cost.** `git clone` pulls **601 MB** for
`federated-yolov8-object-detection`, 201 MB for `pickleball-vision-llm`, 137 MB
for `prepforge`, 95 MB for `pediatric-group-llc-website`. Nobody clones 601 MB to
read your code. Move datasets and weights out of git history — LFS, a release
asset, or a download script — on at least the pinned ones.

---

## 7. Do this in order

Payoff per minute, not size:

1. **Archive the eight Tier-4 repos.** Ten minutes, and the profile stops looking
   like a scratchpad.
2. **Fix the dead link in `pb-card-deck`'s README** (`pickleball-card-games.vercel.app`
   → `pb-card-deck.vercel.app`). A 404 in the one repo with a live demo is the
   most expensive typo on the account.
3. **Resolve the three identical RAG repos** (§2) — the only item on this list a
   careful reader will hold against you.
4. **Repin to the six in §4.**
5. **Rewrite `pickleball-vision-llm`'s README:** problem, one result, one image,
   then the structure.
6. **Add `bujo` and `prepforge` to the portfolio site**, drop `rag-pipeline-langchain`.
7. **Publish `dsa_problems`** as `dsa-patterns`.
8. **Topics and homepage fields** (§6).
9. **Slim the two biggest repos' history** (§6).
10. **Ask the pediatric client about publishing**, or write the case study instead.

---

## Method

`gh repo list --limit 300 --json …` for the inventory; `gh api repos/{repo}/readme`
for README size and content; `gh api repos/{repo}/commits?per_page=1 -i` with the
`Link: rel="last"` header for commit counts; `gh api repos/{repo}/git/trees/HEAD?recursive=1`
and `contents/{path}` blob SHAs for the duplicate-code proof;
`curl -o /dev/null -w "%{http_code}"` for the live URLs. Commit counts are on the
default branch. Sizes are GitHub's own `diskUsage` (KB), converted to MB.
