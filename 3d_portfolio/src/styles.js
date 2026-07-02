// Type scale is modular (~1.28) and fluid via clamp().
// Display = Bricolage Grotesque, prose = Newsreader, labels = JetBrains Mono.
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-24 py-16",

  heroHeadText:
    "font-display font-semibold text-white-100 tracking-[-0.02em] leading-[0.95] text-[clamp(2.75rem,9vw,7rem)]",
  heroSubText:
    "font-serif text-secondary text-[clamp(1rem,2.2vw,1.5rem)] leading-[1.5]",

  sectionHeadText:
    "font-display font-semibold text-white-100 tracking-[-0.02em] leading-[1] text-[clamp(2rem,6vw,3.75rem)]",
  sectionSubText:
    "font-mono text-[12px] sm:text-[13px] text-accent uppercase tracking-label",
};

export { styles };
