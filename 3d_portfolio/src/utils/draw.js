/**
 * Owns: the geometry and the deterministic RNG shared by the page's canvases.
 * Does not own: any colour. Palettes differ by surface and must not live here.
 * The project covers draw on a fixed dark ground (`--c-canvas`, the same in
 * both themes by design); `CareerTrack` draws on the page ground and has to
 * read theme tokens at paint time. A shared colour helper would have to know
 * which, so it would not be shared, it would be a switch.
 *
 * Extracted from Works.jsx when a second canvas needed the same four helpers.
 * They are pure and have no state.
 */

export const TAU = Math.PI * 2;

/** Rounded rectangle path. Leaves the path open; the caller fills or strokes. */
export const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/** FNV-1a over a string. Used to seed a cover from its own name. */
export const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

/**
 * Deterministic PRNG. Seeded per drawing so a cover is stable across frames and
 * reloads: an illustration that reshuffles itself every repaint is noise.
 */
export const mulberry = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Resolve a CSS custom property holding an "R G B" triplet into an rgba()
 * string. Canvas cannot read CSS variables, so every theme-aware canvas has to
 * do this at paint time rather than at mount: the tokens change under it when
 * the reader switches theme.
 */
export const cssColor = (el, name, alpha) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v ? `rgba(${v.split(/\s+/).join(",")},${alpha})` : `rgba(128,128,128,${alpha})`;
};
