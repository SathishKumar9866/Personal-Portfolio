// Databricks-clean: bold Barlow display, generous scale, mono eyebrows.
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-24 py-16",

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
