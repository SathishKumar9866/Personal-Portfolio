import { useEffect, useRef } from "react";

/**
 * Owns: the hairline scroll readout pinned to the top of the page.
 *
 * Writes the width directly to the DOM inside a rAF rather than going through
 * React state. The previous version called setState on every scroll event and
 * read documentElement.scrollHeight inside the handler — a layout-forcing
 * property — which made it the most expensive thing happening during a scroll
 * on the ~10,000px page.
 */
const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const el = document.documentElement;
    let max = el.scrollHeight - el.clientHeight;
    let raf = 0;

    const paint = () => {
      raf = 0;
      const p = max > 0 ? (el.scrollTop / max) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${p}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    // scrollHeight is only re-read when the document can actually have changed
    // size, never during a scroll.
    const ro = new ResizeObserver(() => {
      max = el.scrollHeight - el.clientHeight;
      onScroll();
    });
    ro.observe(document.body);

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent" aria-hidden="true">
      <div ref={barRef} className="h-full bg-accent" style={{ width: 0 }} />
    </div>
  );
};

export default ScrollProgress;
