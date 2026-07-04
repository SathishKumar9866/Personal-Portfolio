# Sathish Kumar — portfolio

A fast, type-led personal site for an ML / AI engineer. Databricks-inspired
visual system, light + dark themes, no heavy 3D.

**Live headline:** *"Everyone's building AI agents. I ship the ones that reach production."*

## Stack

| Area | Choice |
| --- | --- |
| Build | Vite 5 + `@vitejs/plugin-react-swc` |
| UI | React 18 |
| Styling | Tailwind CSS (CSS-variable design tokens) |
| Motion | Framer Motion |
| Type | Barlow (display + body), JetBrains Mono (labels), self-hosted via `@fontsource` |
| Contact | EmailJS (optional; falls back to `mailto:`) |

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

Optional — enables the contact form to send email in-page (otherwise it opens
the visitor's mail client). Copy `.env.example` → `.env.local` and fill in:

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Full step-by-step (including the required template variables): see
[`docs/EMAIL-SETUP.md`](docs/EMAIL-SETUP.md).

## Editing content

All content is data-driven in `src/constants/index.js`:

- `navLinks`, `services` (Overview), `stackGroups` (Stack, each with a `note`),
- `projects` (each with `outcome`, `description`, `stages` for the pipeline
  graphic, `tags`, links), `quotes`, and `contact`.

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
- **Generative project covers** — each card draws the project's real pipeline
  (e.g. `ingest → embed → retrieve → generate`).
- **Live clock** — IST / EST / CST in the hero and footer.
- **Accessibility** — semantic landmarks, single `h1`, skip link, visible focus,
  `prefers-reduced-motion` honored, keyboard-navigable palette.
- **Performance** — vendor chunks split for caching; no runtime 3D.
