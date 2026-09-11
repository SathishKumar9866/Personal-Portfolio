import { useEffect, useRef } from "react";

/**
 * Owns: the wave of generated tokens behind ONE section.
 *
 * It lives in Stack, and only in Stack, because that is where the `LLM / RAG`
 * group sits — so a stream of sub-word pieces is an illustration of the content
 * rather than decoration behind it. The same effect running the length of the
 * page would trail the reader through Experience and Contact, where it means
 * nothing and competes with the text. That is the difference between a backdrop
 * that adds something and wallpaper.
 *
 * Scoped to a BAND, not to the section. Filling the section ran the wave behind
 * all six stack cards, which is the same wallpaper problem one level down. It
 * occupies the empty strip to the right of the intro copy and above the card
 * grid — the one part of this section that had nothing in it.
 *
 * Section-scoped, so unlike NeuralField it is positioned absolutely inside its
 * own section and needs no fixed-coordinate wiring.
 *
 * Cheap by construction:
 *  - the loop only runs while the section is on screen (IntersectionObserver)
 *  - desktop only; below 1024px the loop never starts
 *  - devicePixelRatio capped at 2
 *  - prefers-reduced-motion paints one still frame
 *  - pointer-events: none, aria-hidden
 */

// Real sub-word pieces, the way a tokenizer splits text.
const PIECES = [
  "re", "trie", "val", "▁aug", "ment", "ed", "▁cites", "▁the", "▁source",
  "▁it", "▁used", ".", "▁offline", "▁first", "▁eval", "uated", ".",
];

const cssColor = (el, name, alpha) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v ? `rgba(${v.split(/\s+/).join(",")},${alpha})` : `rgba(128,128,128,${alpha})`;
};

const TokenStream = () => {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1024px)");

    let dpr = 1, w = 0, h = 0, raf = 0, t0 = null, onScreen = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.max(1, w * dpr);
      c.height = Math.max(1, h * dpr);
    };

    const draw = (time) => {
      if (!w || !h) return;
      const ink = cssColor(root, "--c-line-strong", 1);
      const accent = cssColor(root, "--c-accent", 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // The wave descends and wraps. Slow on purpose — drift, not a progress bar.
      const bandH = h * 0.55;
      const baseY = ((time * 11) % (h + bandH)) - bandH * 0.3;
      const amp = Math.min(38, h * 0.05);
      const yAt = (x) => baseY + Math.sin(x / 190 + time * 0.45) * amp;

      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = yAt(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = accent.replace(",1)", ",0.14)");
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Tokens ride the curve they were emitted onto.
      ctx.font = '500 11px "JetBrains Mono Variable", ui-monospace, monospace';
      ctx.textBaseline = "middle";
      for (let i = 0; i < 10; i++) {
        const p = (time * 0.05 + i / 10) % 1;
        const x = p * (w + 180) - 90;
        const y = yAt(x);
        const label = PIECES[(Math.floor(time * 2) + i) % PIECES.length].replace("▁", " ");
        const tw = ctx.measureText(label).width + 8;
        const fade = Math.min(1, p * 8) * Math.min(1, (1 - p) * 8);
        if (fade <= 0.02) continue;
        ctx.strokeStyle = ink.replace(",1)", `,${0.1 * fade})`);
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y - 9, tw, 18);
        ctx.fillStyle =
          i === 0
            ? accent.replace(",1)", `,${0.5 * fade})`)
            : ink.replace(",1)", `,${0.28 * fade})`);
        ctx.fillText(label, x + 4, y);
      }
    };

    const frame = (ts) => {
      if (t0 === null) t0 = ts;
      if (onScreen) draw((ts - t0) / 1000);
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
    };

    const start = () => {
      if (!wide.matches) return stop();
      resize();
      if (reduced) return draw(5); // one still frame; the picture still reads
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // Only animate while this section is actually being looked at.
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
      threshold: 0,
    });
    io.observe(c);

    const ro = new ResizeObserver(() => start());
    ro.observe(c);

    start();
    wide.addEventListener("change", start);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      wide.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      // A BAND, not the section. Filling the section put the wave behind all six
      // cards — section-scoped wallpaper is still wallpaper. It now occupies only
      // the empty strip to the right of the intro text, above the grid, so it
      // crosses no content at all.
      className="pointer-events-none absolute top-0 right-0 -z-10 hidden rail:block h-[20rem] w-[52%] opacity-[0.6]"
    />
  );
};

export default TokenStream;
