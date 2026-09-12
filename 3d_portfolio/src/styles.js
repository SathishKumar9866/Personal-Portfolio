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
  sectionSubText:
    "font-mono text-label sm:text-nav text-accent-ink uppercase tracking-label",
};

export { styles };
