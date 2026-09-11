# Worklog

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
