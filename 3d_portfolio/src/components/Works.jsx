import { useEffect, useRef } from "react";
import { Tilt } from "react-tilt";
import { motion, useReducedMotion } from "framer-motion";
import { styles } from "../styles";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

/* ---- cover drawing ---- */
const RED = "#FF3621";
const BG = "#11262C";
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

// RAG — retrieval in an embedding space
const embeddings = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const dots = [];
  [[0.28, 0.4], [0.64, 0.34], [0.52, 0.7]].forEach(([fx, fy]) => {
    for (let i = 0; i < 9; i++) dots.push({ x: fx * w + (rng() - 0.5) * w * 0.18, y: fy * h + (rng() - 0.5) * h * 0.26 });
  });
  dots.forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, TAU); ctx.fillStyle = bone(0.4); ctx.fill(); });
  const q = { x: w * 0.42, y: h * 0.5 };
  const near = dots.map((d, i) => ({ i, dd: (d.x - q.x) ** 2 + (d.y - q.y) ** 2 })).sort((a, b) => a.dd - b.dd).slice(0, 3);
  ctx.strokeStyle = "rgba(255,54,33,0.7)"; ctx.lineWidth = 1.2;
  near.forEach((o) => {
    const d = dots[o.i];
    ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(d.x, d.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, TAU); ctx.fillStyle = RED; ctx.fill();
  });
  if (t >= 0) {
    const p = t % 1;
    ctx.beginPath(); ctx.arc(q.x, q.y, 6 + p * 24, 0, TAU);
    ctx.strokeStyle = `rgba(255,54,33,${0.5 * (1 - p)})`; ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(q.x, q.y, 4.5, 0, TAU); ctx.fillStyle = RED; ctx.fill();
};

// due-diligence — cited answer
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
      ctx.fillStyle = bone(0.3); roundRect(ctx, x0, y - 2, wid, 4, 2); ctx.fill();
    }
  }
};

// federated — updates flow in, data stays local
const federated = (ctx, w, h, t) => {
  grid(ctx, w, h);
  const hub = { x: w * 0.5, y: h * 0.5 };
  const R = Math.min(w, h) * 0.34, N = 5;
  const clients = Array.from({ length: N }, (_, i) => {
    const a = -Math.PI / 2 + (i * TAU) / N;
    return { x: hub.x + Math.cos(a) * R, y: hub.y + Math.sin(a) * R };
  });
  ctx.strokeStyle = bone(0.22); ctx.lineWidth = 1;
  clients.forEach((c) => { ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(hub.x, hub.y); ctx.stroke(); });
  if (t >= 0) {
    const p = t % 1;
    clients.forEach((c, i) => {
      const pp = (p + i / N) % 1;
      ctx.beginPath();
      ctx.arc(c.x + (hub.x - c.x) * pp, c.y + (hub.y - c.y) * pp, 2.5, 0, TAU);
      ctx.fillStyle = RED; ctx.fill();
    });
  }
  clients.forEach((c) => {
    ctx.beginPath(); ctx.arc(c.x, c.y, 7, 0, TAU); ctx.fillStyle = BG; ctx.fill();
    ctx.strokeStyle = bone(0.7); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.fillStyle = bone(0.55); ctx.fillRect(c.x - 2, c.y - 2, 4, 4);
  });
  ctx.beginPath(); ctx.arc(hub.x, hub.y, 10, 0, TAU); ctx.fillStyle = RED; ctx.fill();
};

// reels — video frames become text
const frames = (ctx, w, h, t, rng) => {
  grid(ctx, w, h);
  const fw = w * 0.14, fh = fw * 0.68, fx = w * 0.12, top = h * 0.24;
  for (let i = 0; i < 3; i++) {
    const y = top + i * (fh + 8);
    ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4; ctx.strokeRect(fx, y, fw, fh);
    ctx.fillStyle = bone(0.3);
    for (let s = 0; s < 3; s++) { ctx.fillRect(fx + 3 + s * (fw / 3), y - 3, 3, 2); ctx.fillRect(fx + 3 + s * (fw / 3), y + fh + 1, 3, 2); }
  }
  const ax = fx + fw + w * 0.05;
  ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(ax, h * 0.5); ctx.lineTo(ax + w * 0.07, h * 0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ax + w * 0.07, h * 0.47); ctx.lineTo(ax + w * 0.09, h * 0.5); ctx.lineTo(ax + w * 0.07, h * 0.53); ctx.closePath(); ctx.fill();
  const tx = ax + w * 0.13, tw = w * 0.86 - tx;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = bone(0.32);
    roundRect(ctx, tx, top + i * (h * 0.6 / 6), tw * (0.5 + rng() * 0.5), 3.5, 2); ctx.fill();
  }
};

// pickleball vision — detection + tracking
const tracking = (ctx, w, h, t) => {
  grid(ctx, w, h);
  const fx = w * 0.12, fy = h * 0.16, fw = w * 0.76, fh = h * 0.64;
  ctx.strokeStyle = bone(0.3); ctx.lineWidth = 1; ctx.strokeRect(fx, fy, fw, fh);
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

// pickleball shuffle — live scorekeeper app
const scorecard = (ctx, w, h) => {
  grid(ctx, w, h);
  const pw = w * 0.26, ph = h * 0.74, px = w * 0.5 - pw / 2, py = h * 0.5 - ph / 2;
  ctx.fillStyle = "rgba(233,230,223,0.04)"; roundRect(ctx, px, py, pw, ph, 10); ctx.fill();
  ctx.strokeStyle = bone(0.5); ctx.lineWidth = 1.4; roundRect(ctx, px, py, pw, ph, 10); ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = bone(0.45); ctx.font = '600 8px "JetBrains Mono Variable", monospace';
  ctx.fillText("SCORE", w * 0.5, py + ph * 0.22);
  ctx.fillStyle = bone(0.9); ctx.font = '700 20px "Barlow", sans-serif';
  ctx.fillText("11 — 9", w * 0.5, py + ph * 0.44);
  ctx.strokeStyle = bone(0.2); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px + 12, py + ph * 0.56); ctx.lineTo(px + pw - 12, py + ph * 0.56); ctx.stroke();
  ctx.fillStyle = RED; roundRect(ctx, w * 0.5 - pw * 0.32, py + ph * 0.66, pw * 0.64, ph * 0.13, 5); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.font = '700 8px "JetBrains Mono Variable", monospace';
  ctx.fillText("TWIST", w * 0.5, py + ph * 0.735);
};

const DRAWERS = { embeddings, citation, federated, frames, tracking, scorecard };
const LABELS = {
  embeddings: "vector space", citation: "cited answer", federated: "federated",
  frames: "video → text", tracking: "detection", scorecard: "live app",
};
const ANIMATED = new Set(["embeddings", "federated", "tracking"]);

const ProjectCover = ({ cover = "embeddings", name }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const c = ref.current;
    const drawer = DRAWERS[cover];
    if (!c || !drawer) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    const ctx = c.getContext("2d");
    const seed = hash(name || cover);

    const render = (t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "left";
      drawer(ctx, w, h, t, mulberry(seed));
    };

    if (reduced || !ANIMATED.has(cover)) { render(-1); return; }

    let raf, start = null, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(c);
    const loop = (ts) => {
      if (start === null) start = ts;
      if (visible) render(((ts - start) % 3200) / 3200);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [cover, name, reduced]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-line bg-[#11262C]" style={{ aspectRatio: "16 / 9" }}>
      <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <span className="absolute top-2.5 left-3 font-mono text-[10px] tracking-label uppercase text-faint">
        {LABELS[cover] || "preview"}
      </span>
    </div>
  );
};

const ProjectCard = ({ index, name, cover, outcome, description, tags, source_code_link, live_link, featured }) => {
  const reduced = useReducedMotion();
  const isLive = Boolean(live_link);
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.12, 0.6)}
      className={featured ? "sm:col-span-2" : ""}
    >
      <Tilt
        options={{ max: reduced ? 0 : 8, scale: 1, speed: 400 }}
        className="h-full bg-tertiary p-5 rounded-2xl border border-line shadow-card hover:border-accent/40 transition-colors flex flex-col"
      >
        <ProjectCover cover={cover} name={name} />

        <div className="mt-5 flex items-center gap-3">
          <span
            className={`font-mono text-[10px] uppercase tracking-label px-2 py-0.5 rounded ${
              isLive ? "text-live border border-live/40" : "text-archive border border-archive/40"
            }`}
          >
            {isLive ? "live" : "source"}
          </span>
          <span className="font-mono text-[12px] text-faint truncate">{name}</span>
        </div>

        <h3 className="mt-3 font-display text-[19px] leading-tight text-white-100">{outcome}</h3>
        <p className="mt-2 font-sans text-secondary text-[14px] leading-[1.55]">{description}</p>

        <div className="mt-4">
          <span className="font-mono text-[10px] uppercase tracking-label text-faint">built with</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t.name} className="font-mono text-[11px] text-secondary px-2 py-0.5 rounded border border-line">
                {t.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px]">
          <a href={source_code_link} target="_blank" rel="noreferrer" className="text-secondary hover:text-accent transition-colors">
            repo ↗
          </a>
          {live_link && (
            <a href={live_link} target="_blank" rel="noreferrer" className="text-live hover:text-accent transition-colors">
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
      className="mt-4 font-sans text-secondary text-[17px] max-w-2xl leading-[1.6]"
    >
      Six projects that put the stack to work — production RAG on AWS, federated
      and real-time computer vision, multimodal search, and a live shipped app.
      Each card visualises what the project actually does and the tools it was
      built with; each links to its source, and one is live.
    </motion.p>

    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {projects.map((p, i) => (
        <ProjectCard key={p.name} index={i} featured={i === 0} {...p} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Works, "work");
