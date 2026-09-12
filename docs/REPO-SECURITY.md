# Repository protection, September 2026

What is configured across the `SathishKumarAI` account, what it actually buys,
and the two things it deliberately does not do.

This lives here rather than in `3d_portfolio/` because it describes the account,
not the site.

## The configuration

Applied to `main` (or `master`) on every eligible repo:

| Setting | Value | What it stops |
| --- | --- | --- |
| `allow_force_pushes` | `false` | History being rewritten over the top of what is published |
| `allow_deletions` | `false` | The default branch being deleted |
| `required_linear_history` | `true` | Merge commits; keeps the log readable |
| `required_conversation_resolution` | `true` | Merging a PR with unresolved review threads |
| `required_pull_request_reviews` | **`null`** | Nothing. Deliberately absent, see below |
| `enforce_admins` | `false` | Nothing. The owner is exempt |

## Coverage

| | Count | State |
| --- | --- | --- |
| Public repos | 28 | Protected and verified |
| Private repos | 23 | **Not protected.** Plan limitation |
| Forks | 9 | Deliberately skipped |
| **Total** | **60** | |

All 28 public repos were re-queried from the API after the run and confirmed to
report exactly `force-push false, deletions false, linear true, PR-required
false`. That check was run against GitHub rather than against the script's own
success count, which is how one repo was caught: the input file had no trailing
newline, so `while read` silently dropped its last line, a repo named `loan`.

## The three things worth understanding

### 1. Requiring pull requests would lock the owner out

The obvious configuration is "require a PR for everyone, let the admin bypass".
That is not available here. `bypass_pull_request_allowances` is an
**organization-only** field; on a user-owned repository the API rejects it with:

> Only organization repositories can have users and team restrictions

And `enforce_admins: false` is not sufficient on its own: with
`required_pull_request_reviews` set, a direct push from the owner is still
refused with *"Changes must be made through a pull request."* That was observed,
not assumed, when the first configuration blocked a push to this very repo.

So on a personal account the choice is binary: require PRs and use them
yourself, or protect history and keep pushing directly. The second was chosen.

**If an enforced PR workflow is ever wanted, the real path is moving the repos
under a GitHub organization,** where bypass lists exist.

### 2. Outside contributors were never able to push anyway

This is the important one, because it is what the protection is usually assumed
to be for.

Anyone without write access to a repository **cannot push to it at all**, with
or without branch protection. Their only route has always been: fork, commit on
the fork, open a pull request, which the owner reviews and merges. That is
inherent to GitHub's permission model.

Branch protection therefore guards against the owner's own mistakes and against
any future collaborator who is granted write access. It does not add a gate that
strangers were previously walking through, because there was no such gate.

### 3. Private repos need a paid plan

All 23 private repos failed with:

> Upgrade to GitHub Pro or make this repository public to enable this feature.

Branch protection on private repositories is a paid feature for personal
accounts. The options are GitHub Pro, making a repo public, or leaving it.
Leaving it is defensible: a private repo is visible only to its owner, so the
accidental-force-push risk is the owner's alone rather than a collaborator's.

## Why forks were skipped

`github-readme-stats`, `mlops-zoomcamp`, `kg-rag`,
`Data_Science_Learning_Material`, `smol-course`,
`building-applications-using-amazon-bedrock-3806107`, `data_insigits`,
`loan-default-prediction`, `Data_Science_Bootcamp_Projects`.

Blocking force-push on a fork breaks the common way of syncing one: hard-resetting
the local branch onto upstream and force-pushing. GitHub's *Sync fork* button
would still work (`allow_fork_syncing` is `true`), but the manual route would
not, and forks exist to track someone else's history rather than to hold your
own. They can be added on request.

## Reapplying

The configuration, as sent:

```json
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "required_linear_history": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
```

```bash
gh api -X PUT repos/SathishKumarAI/<repo>/branches/<branch>/protection --input protection.json
```

To check one:

```bash
gh api repos/SathishKumarAI/<repo>/branches/main/protection \
  --jq '[.allow_force_pushes.enabled, .allow_deletions.enabled,
         .required_linear_history.enabled, (.required_pull_request_reviews != null)]'
# expected: [false, false, true, false]
```

New repositories are **not** protected automatically. There is no account-level
default for this; it is a per-repository setting and has to be applied when a
repo is created.
