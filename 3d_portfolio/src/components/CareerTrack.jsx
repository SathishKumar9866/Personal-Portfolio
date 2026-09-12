import { useEffect, useRef } from "react";
import { TAU, roundRect, cssColor } from "../utils/draw";

/**
 * Owns: one diagram in the empty column beside the Experience timeline, showing
 * what the role the reader is currently looking at actually did.
 *
 * Why here, and why only here. The roles list is `max-w-2xl` inside a
 * `max-w-7xl` section, which leaves a 480px column empty down the whole
 * section: measured, the largest unclaimed horizontal space on the page. The
 * repo's rule for ambient motion is that an effect has to illustrate the
 * content it sits beside or it is wallpaper, and that it must cross no text.
 * This satisfies both more strictly than a backdrop could, because it is not
 * behind anything: it is a figure in a margin, and it changes to match the role
 * next to it.
 *
 * One canvas and one rAF loop for four diagrams, not four canvases. Four loops
 * in one section is the cost problem the existing two effects were written to
 * avoid.
 *
 * Cheap by construction, the same six guards the other canvases carry:
 *  - desktop only; below 1024px the loop never starts
 *  - one rAF loop, stopped when the section is off screen
 *  - devicePixelRatio capped at 2
 *  - the active-role lookup is polled on a timer, never read per frame
 *  - prefers-reduced-motion paints one still frame
 *  - pointer-events: none, aria-hidden
 *
 * Every diagram is labelled. An unlabelled schematic is just shapes moving.
 */

const LABEL_FONT = '600 11px "JetBrains Mono Variable", ui-monospace, monospace';
const BODY_FONT = '400 11px "JetBrains Mono Variable", ui-monospace, monospace';

/** Small caps label, used for every stage name so the four read as one system. */
const label = (ctx, text, x, y, color, align = "left") => {
  ctx.font = LABEL_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
};

const arrow = (ctx, x0, x1, y, color) => {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1 - 4, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1 - 5, y - 3);
  ctx.lineTo(x1, y);
  ctx.lineTo(x1 - 5, y + 3);
  ctx.closePath();
  ctx.fill();
};

/* ---------------------------------------------------------------------------
   AdvanSoft: a knowledge graph, queried. Cypher and embedding similarity pick
   the neighbourhood; the LLM answers over it.
--------------------------------------------------------------------------- */
const graph = (ctx, w, h, t, C) => {
  const nodes = [
    [0.16, 0.30], [0.34, 0.18], [0.52, 0.32], [0.70, 0.20],
    [0.26, 0.56], [0.46, 0.62], [0.66, 0.52], [0.82, 0.66], [0.38, 0.40],
  ].map(([x, y]) => ({ x: x * w, y: y * h }));
  const edges = [[0, 8], [8, 1], [8, 2], [1, 2], [2, 3], [4, 8], [4, 5], [5, 2], [5, 6], [6, 3], [6, 7]];

  ctx.strokeStyle = C.faint(0.45);
  ctx.lineWidth = 1;
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  // the matched neighbourhood: one seed and the hops the query reached
  const hot = [8, 2, 5];
  ctx.strokeStyle = C.accent(0.75);
  ctx.lineWidth = 1.6;
  [[8, 2], [8, 5]].forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  nodes.forEach((n, i) => {
    const on = hot.includes(i);
    ctx.beginPath();
    ctx.arc(n.x, n.y, on ? 5.5 : 3.5, 0, TAU);
    ctx.fillStyle = on ? C.accent(1) : C.ink(0.5);
    ctx.fill();
  });

  if (t >= 0) {
    const p = t % 1;
    ctx.beginPath();
    ctx.arc(nodes[8].x, nodes[8].y, 7 + p * 30, 0, TAU);
    ctx.strokeStyle = C.accent(0.45 * (1 - p));
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  label(ctx, "KNOWLEDGE GRAPH", 0, h * 0.06, C.text(0.75));
  label(ctx, "CYPHER + EMBEDDING SIMILARITY", 0, h * 0.86, C.faint(0.9));
  label(ctx, "ONE SOURCE OF TRUTH", 0, h * 0.97, C.faint(0.6));
};

/* ---------------------------------------------------------------------------
   Integer IT: support feedback in, three labelled extractions out, and a drift
   check underneath, because the models were watched after they shipped.
--------------------------------------------------------------------------- */
const triage = (ctx, w, h, t, C) => {
  const midY = h * 0.34;
  // incoming feedback
  ctx.fillStyle = C.ink(0.4);
  for (let i = 0; i < 4; i++) {
    roundRect(ctx, 0, h * 0.2 + i * 11, w * 0.17 * (0.6 + (i % 3) * 0.2), 4, 2);
    ctx.fill();
  }
  arrow(ctx, w * 0.2, w * 0.29, midY, C.faint(0.6));

  // the model
  ctx.strokeStyle = C.ink(0.7);
  ctx.lineWidth = 1.4;
  roundRect(ctx, w * 0.3, midY - 22, w * 0.16, 44, 5);
  ctx.stroke();
  ctx.font = BODY_FONT;
  ctx.fillStyle = C.text(0.85);
  ctx.textAlign = "center";
  ctx.fillText("NLP", w * 0.38, midY + 4);
  ctx.textAlign = "left";

  // three labelled outputs
  const outs = ["INTENT", "SENTIMENT", "ENTITIES"];
  outs.forEach((o, i) => {
    const y = h * 0.16 + i * (h * 0.18);
    arrow(ctx, w * 0.47, w * 0.56, y, C.faint(0.55));
    const on = t >= 0 && Math.floor(t * 1.5) % 3 === i;
    ctx.strokeStyle = on ? C.accent(0.9) : C.ink(0.5);
    ctx.lineWidth = on ? 1.6 : 1;
    roundRect(ctx, w * 0.57, y - 10, w * 0.4, 20, 4);
    ctx.stroke();
    label(ctx, o, w * 0.6, y + 4, on ? C.accent(1) : C.text(0.7));
  });

  // drift, watched
  const dy = h * 0.82;
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = C.faint(0.55);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, dy - 14);
  ctx.lineTo(w * 0.62, dy - 14);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * w * 0.62;
    const wob = Math.sin(i * 0.6 + (t >= 0 ? t * 1.2 : 0)) * 4 + Math.sin(i * 0.21) * 3;
    const y = dy - 2 + wob;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = C.accent(0.75);
  ctx.lineWidth = 1.4;
  ctx.stroke();
  label(ctx, "DRIFT + EVAL CHECKS", w * 0.66, dy, C.faint(0.9));
};

/* ---------------------------------------------------------------------------
   Southern Illinois: frames through a small convolutional stack, then a
   detection. Federated because the datasets could not be moved.
--------------------------------------------------------------------------- */
const vision = (ctx, w, h, t, C) => {
  const top = h * 0.18;
  // input frame with a sweeping scan line
  const fw = w * 0.2, fh = fw * 0.72;
  ctx.strokeStyle = C.ink(0.6);
  ctx.lineWidth = 1.3;
  ctx.strokeRect(0, top, fw, fh);
  if (t >= 0) {
    const sx = ((t * 0.6) % 1) * fw;
    ctx.strokeStyle = C.accent(0.55);
    ctx.beginPath();
    ctx.moveTo(sx, top);
    ctx.lineTo(sx, top + fh);
    ctx.stroke();
  }
  label(ctx, "FRAME", 0, top - 8, C.faint(0.9));

  // convolutional stack: the maps get smaller and deeper
  let x = w * 0.28;
  for (let i = 0; i < 3; i++) {
    const s = 1 - i * 0.22;
    const bw = w * 0.09 * s, bh = fh * s;
    const y = top + (fh - bh) / 2;
    ctx.strokeStyle = C.ink(0.55);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x, y, bw, bh);
    ctx.fillStyle = C.ink(0.1);
    ctx.fillRect(x, y, bw, bh);
    x += bw + w * 0.035;
  }
  label(ctx, "CONV", w * 0.28, top - 8, C.faint(0.9));

  // detection
  const dx = w * 0.68, dw = w * 0.32, dh = fh;
  ctx.strokeStyle = C.ink(0.6);
  ctx.lineWidth = 1.3;
  ctx.strokeRect(dx, top, dw, dh);
  const pulse = t >= 0 ? 0.65 + Math.sin(t * 2.4) * 0.25 : 0.8;
  ctx.strokeStyle = C.accent(pulse);
  ctx.lineWidth = 1.6;
  const bx = dx + dw * 0.22, by = top + dh * 0.24, bw2 = dw * 0.44, bh2 = dh * 0.5;
  ctx.strokeRect(bx, by, bw2, bh2);
  const k = 5;
  ctx.beginPath();
  ctx.moveTo(bx, by + k); ctx.lineTo(bx, by); ctx.lineTo(bx + k, by);
  ctx.moveTo(bx + bw2 - k, by + bh2); ctx.lineTo(bx + bw2, by + bh2); ctx.lineTo(bx + bw2, by + bh2 - k);
  ctx.stroke();
  label(ctx, "DETECTION", dx, top - 8, C.faint(0.9));

  // the constraint that shaped it
  const fy = h * 0.78;
  const hub = { x: w * 0.5, y: fy + 16 };
  const clients = [-1, 0, 1].map((o) => ({ x: w * 0.5 + o * w * 0.17, y: fy + 40 }));
  ctx.strokeStyle = C.faint(0.5);
  ctx.lineWidth = 1;
  clients.forEach((c) => {
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(hub.x, hub.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4, 0, TAU);
    ctx.fillStyle = C.ink(0.55);
    ctx.fill();
  });
  if (t >= 0) {
    clients.forEach((c, i) => {
      const p = (t * 0.5 + i / 3) % 1;
      ctx.beginPath();
      ctx.arc(c.x + (hub.x - c.x) * p, c.y + (hub.y - c.y) * p, 2.4, 0, TAU);
      ctx.fillStyle = C.accent(1);
      ctx.fill();
    });
  }
  ctx.beginPath();
  ctx.arc(hub.x, hub.y, 6, 0, TAU);
  ctx.fillStyle = C.accent(1);
  ctx.fill();
  label(ctx, "FEDERATED: UPDATES MOVE, DATA DOES NOT", 0, h * 0.99, C.faint(0.9));
};

/* ---------------------------------------------------------------------------
   DotIn: the delivery path, and the rollout shape at the end of it.
--------------------------------------------------------------------------- */
const pipeline = (ctx, w, h, t, C) => {
  const stages = ["COMMIT", "TEST", "PACK", "DEPLOY"];
  const y = h * 0.3;
  const bw = w * 0.2, gap = (w - bw * 4) / 3;
  const at = t >= 0 ? Math.floor(t * 0.9) % 4 : 1;
  stages.forEach((s, i) => {
    const x = i * (bw + gap);
    const on = i === at;
    ctx.strokeStyle = on ? C.accent(0.9) : C.ink(0.55);
    ctx.lineWidth = on ? 1.6 : 1.2;
    roundRect(ctx, x, y - 15, bw, 30, 4);
    ctx.stroke();
    if (on) {
      ctx.fillStyle = C.accent(0.1);
      ctx.fill();
    }
    ctx.font = LABEL_FONT;
    ctx.fillStyle = on ? C.accent(1) : C.text(0.7);
    ctx.textAlign = "center";
    ctx.fillText(s, x + bw / 2, y + 4);
    ctx.textAlign = "left";
    if (i < 3) arrow(ctx, x + bw + 3, x + bw + gap - 3, y, C.faint(0.6));
  });
  label(ctx, "TERRAFORM, ANSIBLE, JENKINS", 0, h * 0.08, C.faint(0.9));

  // blue / green, one lane live
  const ly = h * 0.62;
  const live = t >= 0 ? Math.floor(t * 0.35) % 2 : 0;
  ["BLUE", "GREEN"].forEach((name, i) => {
    const yy = ly + i * 34;
    const on = i === live;
    ctx.strokeStyle = on ? C.accent(0.85) : C.ink(0.45);
    ctx.lineWidth = on ? 1.6 : 1.1;
    roundRect(ctx, 0, yy - 11, w * 0.62, 22, 4);
    ctx.stroke();
    label(ctx, name, 10, yy + 4, on ? C.accent(1) : C.text(0.55));
    if (on) {
      ctx.beginPath();
      ctx.arc(w * 0.66, yy, 4, 0, TAU);
      ctx.fillStyle = C.accent(1);
      ctx.fill();
      label(ctx, "LIVE", w * 0.7, yy + 4, C.accent(1));
    }
  });
  label(ctx, "BLUE / GREEN + CANARY ON EKS", 0, h * 0.99, C.faint(0.9));
};

const GLYPHS = { graph, triage, vision, pipeline };

const CareerTrack = ({ glyphs }) => {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1024px)");

    let dpr = 1, w = 0, h = 0, raf = 0, t0 = null, onScreen = false;
    let active = 0, fadeFrom = 0, fadeAt = -1;

    const C = {
      ink: (a) => cssColor(root, "--c-line-strong", a),
      faint: (a) => cssColor(root, "--c-faint", a),
      accent: (a) => cssColor(root, "--c-accent", a),
      text: (a) => cssColor(root, "--c-secondary", a),
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.max(1, w * dpr);
      c.height = Math.max(1, h * dpr);
    };

    // Which role is the reader looking at? A layout read, so it runs on a timer
    // rather than inside the frame loop: getBoundingClientRect per frame on
    // every role is exactly the cost the other canvases were written to avoid.
    const pickActive = () => {
      const items = document.querySelectorAll("[data-role-index]");
      if (!items.length) return;
      const centre = window.innerHeight * 0.45;
      let best = 0, bestD = Infinity;
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - centre);
        if (d < bestD) {
          bestD = d;
          best = Number(el.dataset.roleIndex);
        }
      });
      if (best !== active) {
        fadeFrom = active;
        active = best;
        fadeAt = performance.now();
      }
    };

    const draw = (time) => {
      if (!w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // One glyph per frame. The swap fades the whole canvas out and back in
      // rather than cross-fading two drawings, which would double the work for
      // 300ms every time the reader moves between roles.
      let alpha = 1;
      let which = active;
      if (fadeAt >= 0) {
        const p = Math.min(1, (performance.now() - fadeAt) / 320);
        alpha = Math.abs(p - 0.5) * 2;
        which = p < 0.5 ? fadeFrom : active;
        if (p >= 1) fadeAt = -1;
      }
      const key = glyphs[which];
      const fn = GLYPHS[key];
      if (!fn) return;

      ctx.globalAlpha = alpha;
      ctx.translate(10, 8);
      fn(ctx, w - 20, h - 16, time, C);
      ctx.globalAlpha = 1;
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
      pickActive();
      if (reduced) return draw(-1); // one still frame; the diagram still reads
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0 });
    io.observe(c);
    const ro = new ResizeObserver(() => start());
    ro.observe(c);
    const poll = setInterval(pickActive, 400);
    document.fonts?.ready.then(() => { if (reduced) draw(-1); });

    start();
    wide.addEventListener("change", start);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearInterval(poll);
      wide.removeEventListener("change", start);
    };
  }, [glyphs]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none hidden rail:block w-full h-[22rem]"
    />
  );
};

export default CareerTrack;
