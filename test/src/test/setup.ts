import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement these; framer-motion / next-themes touch them.
if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }

  if (!("IntersectionObserver" in window)) {
    class MockIntersectionObserver {
      root = null;
      rootMargin = "";
      thresholds = [];
      disconnect() {}
      observe() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    }
    const g = globalThis as unknown as Record<string, unknown>;
    g.IntersectionObserver = MockIntersectionObserver;
    (window as unknown as Record<string, unknown>).IntersectionObserver =
      MockIntersectionObserver;
  }
}
