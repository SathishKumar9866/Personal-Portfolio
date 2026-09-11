# Sathish Kumar — portfolio

A fast, type-led personal site for an ML / AI engineer. Databricks-inspired
visual system, light + dark themes, no heavy 3D.


## Stack

| Area | Choice |
| --- | --- |
| Build | Vite 5 + `@vitejs/plugin-react-swc` |
| UI | React 18 |
| Styling | Tailwind CSS (CSS-variable design tokens) |
| Motion | Framer Motion |
| Type | Barlow (display + body), JetBrains Mono (labels), self-hosted via `@fontsource` |
| Contact | Copyable address + `mailto:` — no form, no service |

## Design system

- **Themes.** Every color is a CSS variable (`--c-*`, RGB triples) read through
  Tailwind tokens, so light/dark swap by toggling `data-theme` on `<html>`. An
  inline script in `index.html` sets the theme before first paint (no flash) and
  respects `prefers-color-scheme`. `ThemeToggle` persists the choice.
- **Palette.** Databricks-style: white / navy ink / oat in light, deep navy in
  dark, one lava-red accent (`#FF3621`).
- **Type scale + spacing.** 4px base; fluid `clamp()` headings.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the build
npm run lint
```

## Configuration

None. The site is static and takes no environment variables.

Contact is a copyable address plus an icon row — there is no form and no mail
service. `docs/EMAIL-SETUP.md` and `.env.example` describe the removed EmailJS
form and are kept only as history.

## Editing content

All content is data-driven in `src/constants/index.js`:

- `navLinks`, `services` (Overview), `stackGroups` (Stack, each with a `note`),
- `projects` (each with `outcome`, `description`, `tags`, links), `quotes`,
  and `contact`. Note: `stages` is present on each project but is currently
  dead data — no component reads it.

## Structure

```
src/
  components/   Hero, Navbar, About, Tech, Works, Contact, Footer,
                Quote, CommandPalette, ThemeToggle, LiveClock, ...
  constants/    all site content
  hoc/          SectionWrapper (scroll-reveal + layout)
  utils/        motion variants
  styles.js     shared type/spacing class strings
  index.css     theme tokens + base styles
```

## Notable details

- **⌘K command palette** — jump to sections, copy email, open socials, toggle theme.
- **Generative project covers** — each card draws an abstract diagram of what
  the project does (a retrieval neighbourhood, a cited passage, a federated
  hub-and-spoke), selected by its `cover` key and seeded deterministically from
  the project name. Not screenshots, and not the literal pipeline stages.
- **Live clock** — IST and US Eastern / Central in the hero and footer, with
  zone abbreviations derived so they track daylight saving.
- **Accessibility** — semantic landmarks, single `h1`, skip link, visible focus,
  `prefers-reduced-motion` honored, keyboard-navigable palette.
- **Performance** — vendor chunks split for caching; no runtime 3D.
