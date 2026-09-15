// Databricks-clean: bold Barlow display, generous scale, mono eyebrows.
const styles = {
  /**
   * `rail:px-[4.5rem]` is not cosmetic — it is what stops the page running under
   * the two fixed docks.
   *
   * From 1024px up, `ContactRail` pins icons to the left edge (8px + 40px wide,
   * 16px + 44px from `xl`) and `SideRail` pins section markers to the right.
   * Neither is in the flow, so neither pushes anything: the page has to leave
   * room for them itself.
   *
   * `4.5vw` does not leave enough. At exactly 1024px it computes to 46px, and
   * the left dock ends at 48px — measured, with Stack's intro paragraph running
   * two pixels under the icons. The flat 4.5rem (72px) from the same breakpoint
   * the docks appear at clears the widest of them (60px at `xl`) with 12px to
   * spare, and at wider viewports `max-w-7xl` centring makes the value moot.
   */
  paddingX: "px-[clamp(1.25rem,4.5vw,4rem)] rail:px-[4.5rem]",
  paddingY: "py-[clamp(1.5rem,4vw,4rem)]",
  padding: "px-[clamp(1.25rem,4.5vw,4rem)] rail:px-[4.5rem] py-[clamp(3rem,7vw,6rem)]",

  heroHeadText:
    "font-display font-bold text-white-100 tracking-[-0.02em] leading-[1.02] text-[calc(clamp(2.5rem,6.5vw,5.25rem)*var(--type-scale,1))]",
  heroSubText:
    "font-sans text-secondary text-[calc(clamp(1rem,1.6vw,1.3rem)*var(--type-scale,1))] leading-[1.55]",

  // Up from clamp(2rem,5vw,3.5rem). A section head that opens a scene has to
  // hold the top of a screen on its own; at the old size it read as a paragraph
  // heading inside a document, which is what the page was before the scenes.
  sectionHeadText:
    "font-display font-bold text-white-100 tracking-[-0.025em] leading-[0.98] text-[calc(clamp(2.5rem,6.5vw,4.75rem)*var(--type-scale,1))]",
  // The section meta is DATA — "4 roles · since 2020" — so it keeps the mono.
  // Tracking is down from `tracking-label`: wide-tracked uppercase mono is the
  // texture that made the page read as a terminal, and at this size the
  // tracking was doing nothing for legibility.
  sectionSubText:
    "font-mono text-label sm:text-nav text-accent-ink uppercase tracking-[0.06em]",

  // UI chrome: navigation, buttons, status. Sentence case in the sans.
  // Mono belongs to code, URLs, tool names and numbers; it does not belong to
  // every label on the page, which is where it had ended up.
  uiNav:
    "font-sans text-[15px] font-medium tracking-[-0.01em]",
  uiLabel:
    "font-sans text-[13px] font-medium tracking-[-0.005em]",
};

export { styles };
