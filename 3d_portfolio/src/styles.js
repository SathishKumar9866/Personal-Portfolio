// Databricks-clean: bold Barlow display, generous scale, mono eyebrows.
const styles = {
  paddingX: "px-[clamp(1.25rem,4.5vw,4rem)]",
  paddingY: "py-[clamp(1.5rem,4vw,4rem)]",
  padding: "px-[clamp(1.25rem,4.5vw,4rem)] py-[clamp(3rem,7vw,6rem)]",

  heroHeadText:
    "font-display font-bold text-white-100 tracking-[-0.02em] leading-[1.02] text-[calc(clamp(2.5rem,6.5vw,5.25rem)*var(--type-scale,1))]",
  heroSubText:
    "font-sans text-secondary text-[calc(clamp(1rem,1.6vw,1.3rem)*var(--type-scale,1))] leading-[1.55]",

  sectionHeadText:
    "font-display font-bold text-white-100 tracking-[-0.02em] leading-[1.02] text-[calc(clamp(2rem,5vw,3.5rem)*var(--type-scale,1))]",
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
