import { useEffect, useRef } from "react";

/**
 * Owns: the ambient canvas behind the hero — a small, honest depiction of the
 * work: tokens being generated, a network settling as it trains, and a deploy
 * pulse travelling out when a run finishes.
 *
 * Deliberately NOT a 3D engine. three.js plus a renderer is ~150kB gzip against
 * a ~115kB total bundle; this is a few hundred lines of canvas and costs about
 * 1kB. On the phones where most people open a portfolio, that difference is the
 * whole first paint.
 *
 * Cheap by construction:
 *  - one rAF loop, paused by an IntersectionObserver the moment it scrolls away
 *  - devicePixelRatio capped at 2
 *  - `prefers-reduced-motion` renders a single settled frame and stops
 *  - colours read from the theme tokens, so it follows light/dark
 */
// Real sub-word pieces, the way a tokenizer actually splits text — so the lane
// reads as TOKENS being emitted, not as boxes sliding past. Featureless
// rectangles were the first version and they said nothing.
const PIECES = [
  "re", "trie", "val", "▁aug", "ment", "ed", "▁gen", "er", "ation",
  "▁cites", "▁the", "▁source", "▁it", "▁used", ".", "▁offline", "▁first",
  "▁eval", "uated", "▁not", "▁demo", "ed", ".",
];
const NODES = [5, 7, 7, 4]; // layer sizes

const rgb = (el, name, alpha) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v ? `rgba(${v.split(/\s+/).join(",")},${alpha})` : `rgba(128,128,128,${alpha})`;
};

const Backdrop = () => {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = 1, w = 0, h = 0, raf = 0, visible = true, t0 = null;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.max(1, w * dpr);
      c.height = Math.max(1, h * dpr);
    };

    // Layer positions are computed once per resize, in the right half of the
    // canvas so the hero's text column stays clear of them.
    const layout = () => {
      const x0 = w * 0.56, x1 = w * 0.94;
      return NODES.map((count, li) => {
        const x = NODES.length > 1 ? x0 + ((x1 - x0) * li) / (NODES.length - 1) : x0;
        return Array.from({ length: count }, (_, ni) => ({
          x,
          y: h * 0.3 + ((h * 0.4) * (ni + 0.5)) / count,
          // a stable pseudo-weight per edge, so the "training" looks like the
          // same network settling rather than random noise every frame
          seed: (li * 31 + ni * 17) % 97,
        }));
      });
    };

    let layers = [];

    const draw = (t) => {
      const ink = rgb(root, "--c-line-strong", 1);
      const accent = rgb(root, "--c-accent", 1);
      const faint = rgb(root, "--c-line-strong", 0.35);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // ---- the network, settling ----
      for (let li = 0; li < layers.length - 1; li++) {
        layers[li].forEach((a) => {
          layers[li + 1].forEach((b) => {
            // weight oscillates early and converges as t grows — "learning"
            const phase = (a.seed + b.seed) * 0.11;
            const settle = Math.min(1, t / 9);
            const wgt = (Math.sin(t * 1.6 + phase) * (1 - settle) + settle) * 0.5 + 0.5;
            ctx.strokeStyle = `rgba(${rgb(root, "--c-line-strong", 1)
              .slice(5, -3)},${0.05 + wgt * 0.14})`;
            ctx.lineWidth = 0.6 + wgt * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          });
        });
      }
      layers.flat().forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = faint;
        ctx.fill();
      });

      // ---- tokens, emitted one at a time, left to right ----
      const laneY = h * 0.84;
      const RATE = 2.4; // tokens per second
      ctx.font = '500 11px "JetBrains Mono Variable", ui-monospace, monospace';
      ctx.textBaseline = "middle";

      const emitted = Math.floor(t * RATE);
      let penX = w * 0.56;
      const laneEnd = w * 0.97;

      for (let k = Math.max(0, emitted - 22); k <= emitted; k++) {
        const piece = PIECES[k % PIECES.length];
        const label = piece.replace("▁", " ");
        const tw = ctx.measureText(label).width + 8;
        if (penX + tw > laneEnd) break;

        const age = t * RATE - k;            // 0 = just emitted
        const arrive = Math.min(1, age * 3); // slides in and settles
        const fade = Math.min(1, age * 2) * Math.min(1, (22 - age) / 6);
        if (fade > 0.02) {
          const x = penX + (1 - arrive) * 10;
          // the boundary box a tokenizer would draw around the piece
          ctx.strokeStyle = ink.replace(",1)", `,${0.1 * fade})`);
          ctx.lineWidth = 1;
          ctx.strokeRect(x, laneY - 9, tw, 18);
          ctx.fillStyle =
            age < 0.6
              ? accent.replace(",1)", `,${0.75 * fade})`)   // the newest one
              : ink.replace(",1)", `,${0.35 * fade})`);
          ctx.fillText(label, x + 4, laneY);
        }
        penX += tw + 3;
      }

      // the caret, where the next token lands
      if (Math.floor(t * 2) % 2 === 0 && penX < laneEnd) {
        ctx.fillStyle = accent.replace(",1)", ",0.6)");
        ctx.fillRect(penX, laneY - 8, 1.5, 16);
      }

      // ---- deploy pulse: one ring every ~7s from the last layer ----
      const cycle = t % 7;
      if (cycle < 1.6 && layers.length) {
        const last = layers[layers.length - 1];
        const cx = last[0].x, cy = h * 0.5;
        const p = cycle / 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, 8 + p * 90, 0, Math.PI * 2);
        ctx.strokeStyle = accent.replace(",1)", `,${0.28 * (1 - p)})`);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    };

    const frame = (ts) => {
      if (t0 === null) t0 = ts;
      if (visible) draw((ts - t0) / 1000);
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      resize();
      layers = layout();
      if (reduced) draw(12); // a settled frame, not a blank one
    });
    ro.observe(c);

    resize();
    layers = layout();

    if (reduced) {
      draw(12);
    } else {
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
        threshold: 0,
      });
      io.observe(c);
      raf = requestAnimationFrame(frame);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
      };
    }

    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.55]"
    />
  );
};

export default Backdrop;
