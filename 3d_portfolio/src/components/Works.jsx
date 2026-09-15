import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { projects } from "../constants";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHead from "./SectionHead";
import { readable } from "./icons";
import TagTerm from "./TagTerm";
import Reveal from "./Reveal";
import MobileCollapse from "./MobileCollapse";
import { ICON_PATHS } from "./icons";
import { TAU, roundRect, hash, mulberry } from "../utils/draw";

/* ---- cover drawing ---- */
const RED = "#FF3621";
const BG = "#11262C"; // keep in step with --c-canvas in index.css
const bone = (a) => `rgba(233,230,223,${a})`;

const grid = (ctx, w, h) => {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 24; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 24; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
};
// rag-pipeline: a question is embedded, its nearest passages retrieved, and the
// answer marks the one it cites. Three labelled stages, left to right, so the
// card states the mechanic rather than decorating it.
const retrieval = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const mid = h * 0.5;
  const labelY = h * 0.88;
  const stage = (text, cx) => {
    ctx.font = '600 8px "JetBrains Mono Variable", monospace';
    ctx.fillStyle = bone(0.45);
    ctx.textAlign = "center";
    ctx.fillText(text, cx, labelY);
    ctx.textAlign = "left";
  };
  const arrow = (x0, x1) => {
    ctx.strokeStyle = bone(0.4); ctx.fillStyle = bone(0.4); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x1 - 4, mid); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1 - 5, mid - 3); ctx.lineTo(x1, mid); ctx.lineTo(x1 - 5, mid + 3);
    ctx.closePath(); ctx.fill();
  };

  // 1. the question, as typed
  const qx = w * 0.05, qw = w * 0.16, qh = h * 0.17;
  ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4;
  roundRect(ctx, qx, mid - qh / 2, qw, qh, 4); ctx.stroke();
  ctx.fillStyle = bone(0.5);
  roundRect(ctx, qx + 6, mid - 6, qw * 0.62, 3.5, 2); ctx.fill();
  roundRect(ctx, qx + 6, mid + 1.5, qw * 0.4, 3.5, 2); ctx.fill();
  stage("QUERY", qx + qw / 2);

  arrow(w * 0.215, w * 0.265);

  // 2. the store: the query lands as a point, the three nearest come back
  const sx = w * 0.27, sw = w * 0.3, sy = mid - h * 0.26, sh = h * 0.52;
  ctx.strokeStyle = bone(0.22); ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  roundRect(ctx, sx, sy, sw, sh, 6); ctx.stroke();
  ctx.setLineDash([]);
  const dots = [];
  for (let i = 0; i < 22; i++) {
    dots.push({ x: sx + 10 + rng() * (sw - 20), y: sy + 9 + rng() * (sh - 18) });
  }
  dots.forEach((d) => {
    ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, TAU); ctx.fillStyle = bone(0.35); ctx.fill();
  });
  const q = { x: sx + sw * 0.3, y: sy + sh * 0.5 };
  const near = dots
    .map((d, i) => ({ i, dd: (d.x - q.x) ** 2 + (d.y - q.y) ** 2 }))
    .sort((a, b) => a.dd - b.dd)
    .slice(0, 3);
  ctx.strokeStyle = "rgba(255,54,33,0.7)"; ctx.lineWidth = 1.2;
  near.forEach((o) => {
    const d = dots[o.i];
    ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(d.x, d.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(d.x, d.y, 3.2, 0, TAU); ctx.fillStyle = RED; ctx.fill();
  });
  if (t >= 0) {
    const p = t % 1;
    ctx.beginPath(); ctx.arc(q.x, q.y, 6 + p * 26, 0, TAU);
    ctx.strokeStyle = `rgba(255,54,33,${0.5 * (1 - p)})`; ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, TAU); ctx.fillStyle = RED; ctx.fill();
  stage("TOP-3 PASSAGES", sx + sw / 2);

  arrow(w * 0.585, w * 0.612);

  // 3. the answer, with the retrieved passage marked in it
  const ax = w * 0.63, aw = w * 0.27, rows = 6, rh = (sh - 12) / (rows - 1);
  for (let i = 0; i < rows; i++) {
    const y = sy + 8 + i * rh;
    const wid = aw * (0.5 + rng() * 0.5);
    if (i === 3) {
      ctx.fillStyle = "rgba(255,54,33,0.14)"; ctx.fillRect(ax - 6, y - 5, aw + 12, 12);
      ctx.fillStyle = RED; ctx.fillRect(ax - 6, y - 5, 2.5, 12);
      roundRect(ctx, ax, y - 2, wid, 4, 2); ctx.fill();
      ctx.font = '600 9px "JetBrains Mono Variable", monospace';
      ctx.fillText("[1]", ax + aw + 5, y + 3);
    } else {
      ctx.fillStyle = bone(0.45);
      roundRect(ctx, ax, y - 2, wid, 4, 2); ctx.fill();
    }
  }
  stage("CITED ANSWER", ax + aw / 2);
};

// due-diligence: cited answer
const citation = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const x0 = w * 0.14, x1 = w * 0.86, rows = 7, top = h * 0.2, rh = (h * 0.6) / rows, hi = 3;
  for (let i = 0; i < rows; i++) {
    const y = top + i * rh;
    const wid = (x1 - x0) * (0.45 + rng() * 0.5);
    if (i === hi) {
      ctx.fillStyle = "rgba(255,54,33,0.14)"; ctx.fillRect(x0 - 8, y - 5, x1 - x0 + 16, 12);
      ctx.fillStyle = RED; ctx.fillRect(x0 - 8, y - 5, 2.5, 12);
      ctx.fillStyle = RED; roundRect(ctx, x0, y - 2, wid, 4, 2); ctx.fill();
      ctx.font = '600 10px "JetBrains Mono Variable", monospace';
      ctx.fillStyle = RED; ctx.textAlign = "left"; ctx.fillText("[1]", x1 + 4, y + 3);
    } else {
      ctx.fillStyle = bone(0.45); roundRect(ctx, x0, y - 2, wid, 4, 2); ctx.fill();
    }
  }
};

// federated: one training round is two trips, not one. Local updates travel in,
// the aggregated global model travels back out to every client. Animating only
// the inbound leg said the clients give and never receive, which is the half of
// federated learning that is not federated.
const federated = (ctx, w, h, t) => {
  grid(ctx, w, h);
  const hub = { x: w * 0.5, y: h * 0.5 };
  const R = Math.min(w, h) * 0.34, N = 5;
  const clients = Array.from({ length: N }, (_, i) => {
    const a = -Math.PI / 2 + (i * TAU) / N;
    return { x: hub.x + Math.cos(a) * R, y: hub.y + Math.sin(a) * R };
  });
  ctx.strokeStyle = bone(0.4); ctx.lineWidth = 1;
  clients.forEach((c) => { ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(hub.x, hub.y); ctx.stroke(); });

  // Filled red inbound (this client's update), hollow outbound (the shared
  // model). Same two marks the rest of the covers use for "mine" and "given".
  const travel = (frac, inbound) => {
    clients.forEach((c, i) => {
      const pp = (frac + i / N) % 1;
      const k = inbound ? pp : 1 - pp;
      const x = c.x + (hub.x - c.x) * k;
      const y = c.y + (hub.y - c.y) * k;
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU);
      if (inbound) {
        ctx.fillStyle = RED; ctx.fill();
      } else {
        ctx.fillStyle = BG; ctx.fill();
        ctx.strokeStyle = bone(0.85); ctx.lineWidth = 1.4; ctx.stroke();
      }
    });
  };

  const inbound = t < 0 ? null : (t % 1) < 0.5;
  const p = t < 0 ? 0.5 : ((t % 1) % 0.5) / 0.5;

  if (inbound === null) {
    // Static cover: show both legs mid-flight so the round still reads.
    travel(0.5, true);
    travel(0.5, false);
  } else {
    travel(p, inbound);
    // the aggregate step, at the moment the round turns around
    if (!inbound && p < 0.4) {
      const q = p / 0.4;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 12 + q * 20, 0, TAU);
      ctx.strokeStyle = `rgba(233,230,223,${0.45 * (1 - q)})`; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }

  clients.forEach((c) => {
    ctx.beginPath(); ctx.arc(c.x, c.y, 7, 0, TAU); ctx.fillStyle = BG; ctx.fill();
    ctx.strokeStyle = bone(0.7); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = bone(0.55); ctx.fillRect(c.x - 2, c.y - 2, 4, 4);
  });
  ctx.beginPath(); ctx.arc(hub.x, hub.y, 10, 0, TAU); ctx.fillStyle = RED; ctx.fill();

  ctx.font = '600 8px "JetBrains Mono Variable", monospace';
  ctx.fillStyle = bone(0.45);
  ctx.textAlign = "center";
  ctx.fillText(
    inbound === null ? "ONE ROUND" : inbound ? "LOCAL UPDATES IN" : "GLOBAL MODEL OUT",
    w * 0.5,
    h * 0.94
  );
  ctx.textAlign = "left";
};

// reels: video frames become text
const frames = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const fw = w * 0.14, fh = fw * 0.68, fx = w * 0.12, top = h * 0.24;
  for (let i = 0; i < 3; i++) {
    const y = top + i * (fh + 8);
    ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4; ctx.strokeRect(fx, y, fw, fh);
    ctx.fillStyle = bone(0.45);
    for (let s = 0; s < 3; s++) { ctx.fillRect(fx + 3 + s * (fw / 3), y - 3, 3, 2); ctx.fillRect(fx + 3 + s * (fw / 3), y + fh + 1, 3, 2); }
  }
  const ax = fx + fw + w * 0.05;
  ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(ax, h * 0.5); ctx.lineTo(ax + w * 0.07, h * 0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ax + w * 0.07, h * 0.47); ctx.lineTo(ax + w * 0.09, h * 0.5); ctx.lineTo(ax + w * 0.07, h * 0.53); ctx.closePath(); ctx.fill();
  const tx = ax + w * 0.13, tw = w * 0.86 - tx;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = bone(0.45);
    roundRect(ctx, tx, top + i * (h * 0.6 / 6), tw * (0.5 + rng() * 0.5), 3.5, 2); ctx.fill();
  }
};

// pickleball vision: detection + tracking
const tracking = (ctx, w, h, t) => {
  grid(ctx, w, h);
  const fx = w * 0.12, fy = h * 0.16, fw = w * 0.76, fh = h * 0.64;
  ctx.strokeStyle = bone(0.45); ctx.lineWidth = 1; ctx.strokeRect(fx, fy, fw, fh);
  const bbox = (x, y, bw, bh) => {
    ctx.strokeStyle = RED; ctx.lineWidth = 1.4; ctx.strokeRect(x, y, bw, bh);
    const k = 5; ctx.beginPath();
    ctx.moveTo(x, y + k); ctx.lineTo(x, y); ctx.lineTo(x + k, y);
    ctx.moveTo(x + bw - k, y + bh); ctx.lineTo(x + bw, y + bh); ctx.lineTo(x + bw, y + bh - k);
    ctx.stroke();
  };
  bbox(fx + fw * 0.55, fy + fh * 0.28, fw * 0.22, fh * 0.4);
  const p = t >= 0 ? t % 1 : 0.5;
  const mx = fx + fw * 0.12 + p * fw * 0.28;
  ctx.strokeStyle = "rgba(255,54,33,0.4)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(fx + fw * 0.12 + fw * 0.1, fy + fh * 0.6); ctx.lineTo(mx + fw * 0.1, fy + fh * 0.6); ctx.stroke();
  ctx.setLineDash([]);
  bbox(mx, fy + fh * 0.45, fw * 0.2, fh * 0.3);
};

// pickleball shuffle: live scorekeeper app
const scorecard = (ctx, w, h) => {
  grid(ctx, w, h);
  const pw = w * 0.26, ph = h * 0.74, px = w * 0.5 - pw / 2, py = h * 0.5 - ph / 2;
  ctx.fillStyle = "rgba(233,230,223,0.04)"; roundRect(ctx, px, py, pw, ph, 10); ctx.fill();
  ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4; roundRect(ctx, px, py, pw, ph, 10); ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = bone(0.45); ctx.font = '600 8px "JetBrains Mono Variable", monospace';
  ctx.fillText("SCORE", w * 0.5, py + ph * 0.22);
  ctx.fillStyle = bone(0.9); ctx.font = '700 20px "Barlow", sans-serif';
  ctx.fillText("11: 9", w * 0.5, py + ph * 0.44);
  ctx.strokeStyle = bone(0.4); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px + 12, py + ph * 0.56); ctx.lineTo(px + pw - 12, py + ph * 0.56); ctx.stroke();
  ctx.fillStyle = RED; roundRect(ctx, w * 0.5 - pw * 0.32, py + ph * 0.66, pw * 0.64, ph * 0.13, 5); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = '700 8px "JetBrains Mono Variable", monospace';
  ctx.fillText("TWIST", w * 0.5, py + ph * 0.735);
};

const DRAWERS = { retrieval, citation, federated, frames, tracking, scorecard };
const LABELS = {
  retrieval: "retrieve, then cite", citation: "cited answer", federated: "federated",
  frames: "video → text", tracking: "detection", scorecard: "live app",
};
const ANIMATED = new Set(["retrieval", "federated", "tracking"]);

// How wide the leading edge of the build is, in px. A hard edge reads as a
// mask sliding across; 48px of feather reads as the drawing arriving.
const FEATHER = 48;

/**
 * The cover draws itself as the card comes up the screen.
 *
 * Every one of these diagrams is a left-to-right pipeline — query, then the
 * store, then the cited answer — so revealing it left to right is not a
 * transition dropped on top of the picture, it is the picture's own order. The
 * reader watches the system get built in the direction it runs.
 *
 * It is a composited wipe over the finished frame, not a build parameter
 * threaded through six drawers. The drawers are ~250 lines of bespoke canvas
 * each and they already take a `t` that means "where in the loop am I"; giving
 * them a second axis meaning "how much of me exists" would mean rewriting all
 * six and would put the same six-branch condition in each. `destination-out`
 * with a gradient does it once, for every cover, including ones added later.
 */
const ProjectCover = ({ cover = "retrieval", name }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  // Built by the time the card reaches the middle of the screen, so it is
  // finished while the reader is still reading it rather than after they pass.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  useEffect(() => {
    const c = ref.current;
    const drawer = DRAWERS[cover];
    if (!c) return;
    if (!drawer) {
      // A typo in a cover key used to render as an empty panel labelled
      // "preview", which reads like an intentional placeholder. It is not.
      if (import.meta.env.DEV) {
        console.warn(`ProjectCover: no drawer named "${cover}". Keys: ${Object.keys(DRAWERS).join(", ")}`);
      }
      return;
    }
    const ctx = c.getContext("2d");
    const seed = hash(name || cover);
    let dpr = 1, w = 0, h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
    };

    const render = (t, build = 1) => {
      if (!w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "left";
      drawer(ctx, w, h, t, mulberry(seed));
      if (build >= 1) return;
      // Erase what has not been drawn yet. The gradient runs transparent to
      // opaque across FEATHER, so the edge fades rather than cutting.
      const x = build * (w + FEATHER) - FEATHER;
      const g = ctx.createLinearGradient(x, 0, x + FEATHER, 0);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,1)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, w - x, h);
      ctx.globalCompositeOperation = "source-over";
    };

    resize();

    // Static covers draw exactly once, so they were the ones that stayed wrong:
    // squashed after a resize, and stuck in the fallback typeface if the canvas
    // won the race against the webfonts.
    if (reduced) {
      render(-1);
      const ro = new ResizeObserver(() => { resize(); render(-1); });
      ro.observe(c);
      let alive = true;
      document.fonts?.ready.then(() => { if (alive) render(-1); });
      return () => { alive = false; ro.disconnect(); };
    }

    // Every cover gets a loop now, because even a static diagram needs frames
    // while it is building. A static one that has finished building stops
    // asking for them again: `settled` is what keeps three of the six covers
    // from holding a rAF open for the life of the page.
    const animated = ANIMATED.has(cover);
    let raf, start = null, visible = true, settled = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) settled = false; // re-entering re-checks; resize may have changed w
    }, { threshold: 0.1 });
    io.observe(c);
    const ro = new ResizeObserver(() => { resize(); settled = false; });
    ro.observe(c);
    const loop = (ts) => {
      if (start === null) start = ts;
      if (visible && !settled) {
        const build = Math.max(0, Math.min(1, scrollYProgress.get()));
        render(animated ? ((ts - start) % 3200) / 3200 : -1, build);
        if (!animated && build >= 1) settled = true;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [cover, name, reduced, scrollYProgress]);

  return (
    <div className="relative w-full rounded-[14px] overflow-hidden border border-line-strong bg-canvas" style={{ aspectRatio: "16 / 9" }}>
      <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <span className="absolute top-2.5 left-3 font-mono text-micro tracking-label uppercase text-canvas-ink">
        {LABELS[cover] || "preview"}
      </span>
    </div>
  );
};

/**
 * An 8-degree tilt toward the pointer, written to the node as `--rx`/`--ry` for
 * the transform in `.project-card`. Same idiom as the Stack spotlight in
 * `Tech.jsx`, and imperative for the same reason: routing a pointermove through
 * React state would re-render six cards on every mouse pixel for an effect that
 * is pure compositing.
 *
 * This replaced `react-tilt`, a whole runtime dependency for one hover. The
 * library also wrote its transform to the style attribute of the element it
 * wrapped, which is exactly where framer-motion writes, so the two had to be
 * kept on separate elements. A CSS variable does not collide with anything.
 *
 * There is no matching "untilt": the transform is applied under `:hover` in
 * `.project-card`, so the pointer leaving resets it through the cascade and
 * cannot leave a card stuck at an angle because a handler did not fire.
 */
const MAX_TILT = 8;

const tilt = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  // -0.5..0.5 from the centre. Y drives rotateX and X drives rotateY, which
  // looks backwards and is not: tilting "up at the top" is rotation about X.
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--rx", `${-y * MAX_TILT * 2}deg`);
  el.style.setProperty("--ry", `${x * MAX_TILT * 2}deg`);
};

const ProjectCard = ({ index, name, cover, outcome, description, tags, source_code_link, live_link, featured }) => {
  const reduced = useReducedMotion();
  const isLive = Boolean(live_link);
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  // Small on purpose: enough to read as depth, not enough to look like drift.
  // Note: framer logs "container has a non-static position" in dev. The container
  // here is <html>, which is position:static on every site by default; the warning
  // is dev-only (NODE_ENV guard in on-scroll-handler.mjs) and the measured offsets
  // are correct. Silencing it would mean position:relative on <html>, which is a
  // real cascade change for no production benefit.
  const coverY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [14, -14]);
  return (
    <Reveal
      ref={cardRef}
      // Column-based, so a row arrives together and the next row waits for the
      // reader. Indexing by absolute position staggered all six off one event,
      // which on a phone finished before the reader reached card three.
      // The anchor About links to. Also what lets the reveal below know a
      // specific card was asked for: a repo name is already unique in `projects`
      // and already the visible label, so it needs no separate id scheme.
      id={name}
      delay={(index % 3) * 0.07}
      className={`h-full scroll-mt-[5.5rem] ${featured ? "sm:col-span-2" : ""}`}
    >
      <div
        onPointerMove={reduced ? undefined : tilt}
        className="project-card h-full glass-card p-5 rounded-2xl hover:border-accent/40 transition-colors flex flex-col"
      >
        <motion.div style={{ y: coverY }}>
          <ProjectCover cover={cover} name={name} />
        </motion.div>

        <div className="mt-5 flex items-center gap-3">
          <span
            className={`font-sans text-[12px] font-medium uppercase tracking-[0.09em] px-2 py-0.5 rounded ${
              isLive ? "text-live border border-live/40" : "text-archive border border-archive/40"
            }`}
          >
            {isLive ? "live" : "source"}
          </span>
          <span className="font-mono text-data text-faint min-w-0 break-all sm:truncate" title={name}>{name}</span>
        </div>

        <h3 className="mt-3 font-display font-semibold text-[calc(clamp(1.15rem,1.6vw,1.5rem)*var(--type-scale,1))] leading-[1.2] tracking-[-0.01em] text-white-100">
          {outcome}
        </h3>
        {/* On a phone the outcome above is the card; this is the detail
            behind it. Collapsed there, inline everywhere else. */}
        <MobileCollapse label="What it does">
          <p className="mt-2 font-sans text-secondary text-body leading-[1.6] max-w-[28rem]">
            {description}
          </p>

          <div className="mt-4">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-faint">
              built with
            </span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {tags.map((t) => (
                <TagTerm key={t} name={t} plain />
              ))}
            </div>
          </div>
        </MobileCollapse>

        <div className="mt-auto pt-4 border-t border-line flex flex-wrap gap-x-5 gap-y-1 font-mono text-data">
          <a href={source_code_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-secondary hover:text-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={ICON_PATHS.github} />
            </svg>
            GitHub repo ↗
          </a>
          {live_link && (
            <a href={live_link} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 sm:min-h-0 text-live hover:text-accent transition-colors">
              {readable(live_link)} ↗
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
};

// "live" is the count with a deployed URL, which is the only claim here that a
// reader can go and check for themselves.
const LIVE = projects.filter((p) => p.live_link).length;
const WORK_META = `${projects.length} built${LIVE ? ` · ${LIVE} live` : ""}`;

/**
 * How many project cards a phone gets before it has to ask for the rest.
 *
 * Measured at 390x844: the six cards are 2,818px of a 9,825px page — 29% of
 * everything, and the reader crosses all of it to reach Contact. Three is the
 * number because the grid is one column below `sm` and three cards is about two
 * screens, which is as much as one section can ask for before it has to earn
 * more.
 *
 * Nothing is deleted. The cut is a disclosure, not a shorter list: every card
 * is still in the DOM, still in `llms.txt`, still in the `<noscript>` block, and
 * one tap away. Above `sm` the grid is two or three columns and the whole thing
 * turns itself off.
 */
const PHONE_CARDS = 3;

const Works = () => {
  // Deep link wins over the limit. About cites three projects by name and one
  // of them, `pb-card-deck`, is the sixth — so on a phone the limit added in the
  // same change that introduced it sent a reader to a section where the card
  // they tapped was not drawn. Any link to a card past the cut opens the deck
  // first. `useState` initialiser, not an effect: the card has to be in the
  // layout before the browser looks for the anchor to scroll to.
  const asked = () => {
    if (typeof window === "undefined") return false;
    const name = decodeURIComponent(window.location.hash.slice(1));
    return projects.findIndex((p) => p.name === name) >= PHONE_CARDS;
  };
  const [showAll, setShowAll] = useState(asked);
  const gridRef = useRef(null);
  const hiddenCount = projects.length - PHONE_CARDS;

  // Same again for a link followed while the page is already open, which changes
  // the hash without reloading. The browser has ALREADY scrolled to the anchor
  // by then, while the three cards above it were still hidden, so it lands about
  // 1,800px short of the card.
  const reaim = useRef(null);
  useEffect(() => {
    const onHash = () => {
      if (!asked()) return;
      reaim.current = decodeURIComponent(window.location.hash.slice(1));
      setShowAll(true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Re-aim AFTER the commit, not in a `requestAnimationFrame` inside the
  // handler: that frame can run before React has painted the revealed cards, and
  // then the correction is computed against the same short layout that caused
  // the problem. An effect keyed on `showAll` cannot run too early.
  useEffect(() => {
    if (!showAll || !reaim.current) return;
    document.getElementById(reaim.current)?.scrollIntoView();
    reaim.current = null;
  }, [showAll]);

  /** The button removes itself once used, and a removed element takes the
   *  keyboard's place in the document with it: the next Tab would start again
   *  from the top of the page. So focus moves to the first card that just
   *  appeared, which is also where a reader's eye goes. */
  const revealAll = () => {
    setShowAll(true);
    requestAnimationFrame(() => {
      gridRef.current
        ?.children[PHONE_CARDS]?.querySelector("a, button")
        ?.focus({ preventScroll: true });
    });
  };

  return (
  <>
    <SectionHead title="Projects" meta={WORK_META} />

    <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 font-sans text-secondary text-lede max-w-[34rem] leading-[1.7]"
    >
      Production RAG on AWS, federated and real-time computer vision, multimodal
      search, and one app that is live and in use.
    </motion.p>

    {/* `items-stretch`, not `items-start`. Cards in a row now match height
        regardless of how long a description runs, because a ragged row of
        cards reads as an alignment error rather than as a design. */}
    {/* The limit is CSS, not a `slice`, and the reason is worth keeping: a
        `slice` would need JS to know the viewport width, which means a media
        query in JS, a listener, and a first render that guesses wrong. A
        `nth-child` rule inside a `max-width` block is the browser doing it. */}
    <div
      ref={gridRef}
      data-collapsed={showAll ? undefined : "true"}
      className="projects-grid mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
    >
      {projects.map((p, i) => (
        <ProjectCard key={p.name} index={i} featured={i === 0} {...p} />
      ))}
    </div>

    {/* `sm:hidden` alone, for the same reason: above `sm` the rule above does
        not apply, so a button offering to reveal what is already visible would
        be a lie. It removes itself from the tree once used. */}
    {!showAll && (
      <button
        type="button"
        onClick={revealAll}
        // Transparent, not `bg-canvas`: that token is the dark INK, not the page
        // ground, and it painted a near-black bar with 196,38,15 text on it at
        // about 2:1. The scene ground showing through puts `accent-ink` on
        // paper at 5.54:1 instead, and keeps this reading as a quiet control
        // rather than a second CTA competing with the hero's.
        className="sm:hidden mt-6 w-full min-h-11 rounded-xl border border-line-strong bg-transparent px-4 font-sans text-[13px] font-medium text-accent-ink"
      >
        Show {hiddenCount} more {hiddenCount === 1 ? "project" : "projects"}
      </button>
    )}
  </>
  );
};

export default SectionWrapper(Works, "projects");
