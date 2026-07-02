import { useEffect, useState } from "react";

// thin instrument-panel readout of scroll position
const ScrollProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent" aria-hidden="true">
      <div className="h-full bg-accent" style={{ width: `${p}%` }} />
    </div>
  );
};

export default ScrollProgress;
