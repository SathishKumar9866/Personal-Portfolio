import { useEffect, useRef } from "react";
import { Tilt } from "react-tilt";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { styles } from "../styles";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import TagTerm from "./TagTerm";
import { ICON_PATHS } from "./icons";

/* ---- cover drawing ---- */
const RED = "#FF3621";
const BG = "#11262C"; // keep in step with --c-canvas in index.css
const bone = (a) => `rgba(233,230,223,${a})`;

// deterministic RNG so each cover is stable
const mulberry = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

const grid = (ctx, w, h) => {
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 24; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 24; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
};
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};
const TAU = Math.PI * 2;

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

const ProjectCover = ({ cover = "retrieval", name }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
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

    const render = (t) => {
      if (!w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "left";
      drawer(ctx, w, h, t, mulberry(seed));
    };

    resize();

    // Static covers draw exactly once, so they were the ones that stayed wrong:
    // squashed after a resize, and stuck in the fallback typeface if the canvas
    // won the race against the webfonts.
    if (reduced || !ANIMATED.has(cover)) {
      render(-1);
      const ro = new ResizeObserver(() => { resize(); render(-1); });
      ro.observe(c);
      let alive = true;
      document.fonts?.ready.then(() => { if (alive) render(-1); });
      return () => { alive = false; ro.disconnect(); };
    }

    let raf, start = null, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(c);
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const loop = (ts) => {
      if (start === null) start = ts;
      if (visible) render(((ts - start) % 3200) / 3200);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [cover, name, reduced]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-line-strong bg-canvas" style={{ aspectRatio: "16 / 9" }}>
      <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <span className="absolute top-2.5 left-3 font-mono text-micro tracking-label uppercase text-canvas-ink">
        {LABELS[cover] || "preview"}
      </span>
    </div>
  );
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
    <motion.div
      ref={cardRef}
      variants={fadeIn("up", "spring", index * 0.12, 0.6)}
      className={featured ? "sm:col-span-2" : ""}
    >
      <Tilt
        options={{ max: reduced ? 0 : 8, scale: 1, speed: 400 }}
        className="h-full glass-card p-5 rounded-2xl hover:border-accent/40 transition-colors flex flex-col"
      >
        <motion.div style={{ y: coverY }}>
          <ProjectCover cover={cover} name={name} />
        </motion.div>

        <div className="mt-5 flex items-center gap-3">
          <span
            className={`font-mono text-label uppercase tracking-label px-2 py-0.5 rounded ${
              isLive ? "text-live border border-live/40" : "text-archive border border-archive/40"
            }`}
          >
            {isLive ? "live" : "source"}
          </span>
          <span className="font-mono text-data text-faint truncate" title={name}>{name}</span>
        </div>

        <h3 className="mt-3 font-display font-semibold text-[clamp(1.15rem,1.6vw,1.5rem)] leading-[1.2] tracking-[-0.01em] text-white-100">
          {outcome}
        </h3>
        <p className="mt-2 font-sans text-secondary text-body leading-[1.6] max-w-[28rem]">
          {description}
        </p>

        <div className="mt-4">
          <span className="font-mono text-label uppercase tracking-label text-faint">
            built with
          </span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <TagTerm key={t} name={t} plain />
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-x-5 gap-y-1 font-mono text-data">
          <a href={source_code_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-secondary hover:text-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={ICON_PATHS.github} />
            </svg>
            repo ↗
          </a>
          {live_link && (
            <a href={live_link} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 sm:min-h-0 text-live hover:text-accent transition-colors">
              {live_link.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
            </a>
          )}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Selected work</p>
      <h2 className={styles.sectionHeadText}>Projects.</h2>
    </motion.div>

    <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 font-sans text-secondary text-lede max-w-[34rem] leading-[1.7]"
    >
      Production RAG on AWS, federated and real-time computer vision, multimodal
      search, and one app that is live and in use.
    </motion.p>

    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {projects.map((p, i) => (
        <ProjectCard key={p.name} index={i} featured={i === 0} {...p} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Works, "work");
