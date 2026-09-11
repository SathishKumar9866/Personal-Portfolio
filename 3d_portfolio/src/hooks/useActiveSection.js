import { useEffect, useState } from "react";
import { navLinks } from "../constants";

/**
 * Owns: which section the reader is currently inside.
 * Used by the top navbar and the right-hand rail, so the two can never disagree
 * about where you are — and so there is one observer, not one per consumer.
 *
 * Two details that were bugs before:
 *  - It observes the SECTIONS, not the zero-height `.hash-span` anchors. A point
 *    crosses the detection band once and is gone; a section overlaps it for as
 *    long as you are actually inside it.
 *  - It tracks the SET of sections in the band and clears when the set empties,
 *    so returning to the hero does not leave the last section lit.
 */
const useActiveSection = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = navLinks
      .map((n) => document.getElementById(n.id)?.closest("section"))
      .filter(Boolean);
    if (!els.length) return;

    const inBand = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = e.target.querySelector(".hash-span")?.id ?? e.target.id;
          if (e.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        });
        setActive([...inBand].at(-1) ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
};

export default useActiveSection;
