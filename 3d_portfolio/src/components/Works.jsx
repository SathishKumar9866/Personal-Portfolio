import { useEffect, useRef } from "react";
import { Tilt } from "react-tilt";
import { motion, useReducedMotion } from "framer-motion";
import { styles } from "../styles";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

// deterministic RNG so each project gets a stable, unique cover
const seedFrom = (str) => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

// generative node/edge cover — a small map of the project's moving parts
const ProjectCover = ({ name }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const rng = seedFrom(name);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = c.clientWidth,
      h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    // hairline grid
    ctx.strokeStyle = "rgba(42,50,61,0.6)";
    ctx.lineWidth = 1;
    for (let x = 24; x < w; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 24; y < h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // nodes
    const n = 7 + Math.floor(rng() * 4);
    const pts = Array.from({ length: n }, () => ({
      x: 20 + rng() * (w - 40),
      y: 20 + rng() * (h - 40),
    }));
    // edges to nearest neighbours
    ctx.strokeStyle = "rgba(227,164,76,0.45)";
    pts.forEach((p, i) => {
      const near = pts
        .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      near.forEach(({ j }) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      });
    });
    // node dots
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, i === 0 ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#e3a44c" : "rgba(232,228,217,0.85)";
      ctx.fill();
    });
  }, [name]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-line bg-[#0d1015]" style={{ aspectRatio: "16 / 9" }}>
      <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />
    </div>
  );
};

const ProjectCard = ({ index, name, outcome, description, tags, source_code_link, live_link, featured }) => {
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
        <ProjectCover name={name} />

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
        <p className="mt-2 font-serif text-secondary text-[14px] leading-[1.55]">{description}</p>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          {tags.map((t) => (
            <span key={t.name} className="font-mono text-[12px] text-faint">
              #{t.name}
            </span>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-line flex gap-5 font-mono text-[12px]">
          <a href={source_code_link} target="_blank" rel="noreferrer" className="text-secondary hover:text-accent transition-colors">
            repo ↗
          </a>
          {live_link && (
            <a href={live_link} target="_blank" rel="noreferrer" className="text-live hover:text-accent transition-colors">
              live ↗
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
      className="mt-4 font-serif text-secondary text-[17px] max-w-2xl leading-[1.6]"
    >
      Six projects across RAG, computer vision, and shipped products. Each links
      to its source; one runs live.
    </motion.p>

    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {projects.map((p, i) => (
        <ProjectCard key={p.name} index={i} featured={i === 0} {...p} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Works, "work");
