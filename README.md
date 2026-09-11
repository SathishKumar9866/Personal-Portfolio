# Personal portfolio

The personal site of Sathish Kumar. **The site is `3d_portfolio/`** — everything else here
is supporting material.

```
3d_portfolio/    the site. Vite + React. Start here.
Research_Docs/   notes, command cheat-sheets, brainstorms
STATUS.md        where work stopped, the next action, the traps. Read on return.
```

Despite the folder name there is no 3D in it; the name survives from a version that had it.

## Run

```bash
cd 3d_portfolio
npm install
npm run dev        # http://localhost:5173 (5174 if 5173 is taken)
npm run build
npm run lint
```

On Windows, a `node_modules` installed under Linux will not work — it has no `.bin` shims
and none of the platform binaries (`@rollup/rollup-win32-x64-msvc`, `@esbuild/win32-x64`).
Re-run `npm install` on the machine you are building on.

## Where the earlier drafts went

Six attempts at this site accumulated in this directory. On 2026-09-11 the five that are
not the site were moved out, keeping their git history. Nothing was deleted.

| Was | Now | Why it moved |
|---|---|---|
| `test/` | `~/coding/archive/portfolio-template-bundle` | A third-party starter kit ("Single Page Dev Portfolio Resource Bundle"), not our code |
| `portfolio/` | `~/coding/archive/portfolio-nextjs-july-2026` | One commit, three source files, abandoned July 2026 |
| `sathishkumarai.github.io/` | `~/coding/archive/portfolio-github-pages-annotated` | Superseded draft. **Read its `docs/DECISIONS.md` before redesigning anything** — it records three generations and why two were dropped |
| `innit/` | `~/coding/archive/innit-empty` | Empty |
| `SathishKumarAI/` | `~/coding/shelf/product/SathishKumarAI` | Not a draft — the GitHub *profile* README repo, with its own remote. Archived nowhere; it is live |

`test/` and `innit/` were tracked here, so they also remain on the branch
`archive/pre-consolidation-2026-09-11`, at commit `443d3e5`.

## Traps

- **`.gitignore` must stay ASCII.** It was corrupted once by a PowerShell `>>` redirect
  writing UTF-16LE; git stops parsing at the first NUL byte, so every rule after that point
  silently did nothing — including the block that was supposed to ignore these nested
  repos. Append with `printf` or an editor, never `>>` from Windows PowerShell.
- Nested clones in this directory are ignored by name. Cloning something new here will not
  be ignored automatically.
