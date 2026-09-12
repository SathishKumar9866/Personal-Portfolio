import { useEffect, useRef } from "react";

/**
 * Owns, the page-wide ambient field behind everything.
 *
 * The idea, and why it is not decoration, the left contact dock and the right
 * section rail are already two columns of dots on opposite edges of a fixed
 * viewport. This reads them as the INPUT and OUTPUT layers of a network, puts
 * two hidden layers between them, and sends activations left to right along real
 * paths. The nodes are not invented: their coordinates come from
 * getBoundingClientRect() on the actual controls, so the drawing stays wired to
 * the interface even when a dock hides itself or the window resizes.
 *
 * Scoped to the LANDING VIEW and faded out as the hero leaves. The token stream
 * lives separately, in the one section where tokens mean something
 * (TokenStream.jsx): a backdrop that follows the reader everywhere is wallpaper.
 *
 * Deliberately NOT a 3D engine. three.js plus a renderer is ~150kB gzip against
 * a ~115kB bundle; this is one 2D canvas and a few hundred lines.
 *
 * Cheap by construction:
 *  - one rAF loop for the whole page, not one per effect
 *  - devicePixelRatio capped at 2
 *  - node positions re-read on resize and every 500ms, never per frame
 *  - `prefers-reduced-motion` paints one settled frame and stops
 *  - pointer-events: none, and aria-hidden, it is never in anyone's way
 */

// Real sub-word pieces, the way a tokenizer splits text, so the stream reads as
// tokens being emitted rather than as boxes sliding past.
// Hidden widths. The input (4) and output (5) counts are fixed by the interface,
// four contact links and five sections, so only these are free, and they are
// chosen so the shape is one an ML reader would not query.
//
// 4 -> 8 -> 6 -> 5 is a plain MLP funnel: expand into a wider representation,
// then taper to the output dimension. The previous 4 -> 5 -> 4 -> 5 was not
// wrong, but it oscillated and put a 4-unit layer immediately before a 5-unit
// output, which is a bottleneck nobody draws by accident. A diagram on a
// portfolio should not invite a question the owner then has to answer.
const HIDDEN = [8, 6];

// Labelled, because an unlabelled lattice is just lines moving. Naming the
// layers is what turns it from decoration into a diagram a reader can follow.
const LAYER_LABELS = ["INPUT", "HIDDEN 1", "HIDDEN 2", "OUTPUT"];

const token = (el, name, alpha) => {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v ? `rgba(${v.split(/\s+/).join(",")},${alpha})` : `rgba(128,128,128,${alpha})`;
};

const centre = (el) => {
  const b = el.getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
};

/** Is this control actually on screen? A hidden dock must not anchor an edge. */
const shown = (el) => {
  const s = getComputedStyle(el);
  if (s.display === "none" || s.visibility === "hidden") return false;
  const b = el.getBoundingClientRect();
  return b.width > 0 && b.height > 0;
};

const NeuralField = () => {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Desktop only. The two docks it wires together do not exist below the
    // `rail` breakpoint, so there is nothing to draw, and more to the point, a
    // requestAnimationFrame loop on a phone is battery spent on decoration
    // nobody asked for. This STOPS the loop rather than hiding the canvas.
    const wide = window.matchMedia("(min-width: 1024px)");

    // Scoped to the landing view. The canvas must stay position:fixed, because
    // it is wired to two docks that are themselves fixed, so it is scoped by
    // FADING OUT as the hero leaves and halting the loop, not by re-parenting.
    // A field that follows the reader through Experience and Contact is
    // wallpaper competing with text, which is the opposite of what it is for.
    let heroVisible = 1;

    let dpr = 1, w = 0, h = 0, raf = 0, poll = 0;
    let layers = [];      // [inputs, hidden1, hidden2, outputs]
    let signals = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.max(1, w * dpr);
      c.height = Math.max(1, h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
    };

    /**
     * Read the live interface. Inputs are the left contact dock, outputs the
     * right section rail; both are position:fixed, so their rects are already in
     * the canvas's coordinate space and need no scroll correction.
     */
    const readLayers = () => {
      const inputs = [
        ...document.querySelectorAll(
          'nav[aria-label="Contact shortcuts"] a, nav[aria-label="Contact shortcuts"] button'
        ),
      ].filter(shown).map(centre);
      const outputs = [
        ...document.querySelectorAll('nav[aria-label="Sections"] a'),
      ].filter(shown).map(centre);

      if (!inputs.length || !outputs.length) return [];

      const x0 = inputs[0].x, x1 = outputs[0].x;
      const midY = h / 2;
      const hidden = HIDDEN.map((count, li) => {
        const x = x0 + ((x1 - x0) * (li + 1)) / (HIDDEN.length + 1);
        const spread = h * 0.42;
        return Array.from({ length: count }, (_, ni) => ({
          x,
          y: midY - spread / 2 + (spread * (ni + 0.5)) / count,
        }));
      });
      return [inputs, ...hidden, outputs];
    };

    // One activation travelling input -> hidden -> hidden -> output.
    const spawn = () => {
      if (layers.length < 2) return;
      const path = layers.map((l) => l[Math.floor(Math.random() * l.length)]);
      signals.push({ path, t: 0, speed: 0.28 + Math.random() * 0.22 });
    };

    const draw = () => {
      const ink = token(root, "--c-line-strong", 1);
      const accent = token(root, "--c-accent", 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (heroVisible <= 0.01) return;
      ctx.globalAlpha = heroVisible;

      if (layers.length >= 2) {
        // every edge, faint
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = ink.replace(",1)", ",0.055)");
        for (let li = 0; li < layers.length - 1; li++) {
          layers[li].forEach((a) => {
            layers[li + 1].forEach((b) => {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            });
          });
        }

        // Layer labels, on a baseline along the bottom with a tick rising to each
        // column. They sit there rather than above the nodes because the columns
        // pass behind the headline, and a caption landing on the type would cost
        // more than it explains.
        const labelY = h - 54;
        ctx.font = '500 10px "JetBrains Mono Variable", ui-monospace, monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        layers.forEach((layer, li) => {
          const label = LAYER_LABELS[li];
          if (!label || !layer.length) return;
          const x = layer[0].x;
          const lowest = Math.max(...layer.map((n) => n.y));

          // tick from the column down to the baseline
          ctx.beginPath();
          ctx.moveTo(x, lowest + 10);
          ctx.lineTo(x, labelY - 12);
          ctx.strokeStyle = ink.replace(",1)", ",0.22)");
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle =
            li === 0 || li === layers.length - 1
              ? accent.replace(",1)", ",0.85)")  // the two the reader can point at
              : ink.replace(",1)", ",0.7)");
          ctx.fillText(label, x, labelY);

          // node count under the name, the one number that explains the shape
          ctx.fillStyle = ink.replace(",1)", ",0.45)");
          ctx.fillText(`${layer.length} nodes`, x, labelY + 11);
        });
        ctx.textAlign = "start";

        // hidden units
        layers.slice(1, -1).flat().forEach((n) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = ink.replace(",1)", ",0.3)");
          ctx.fill();
        });

        // activations in flight
        signals.forEach((s) => {
          const segs = s.path.length - 1;
          const at = s.t * segs;
          const i = Math.min(segs - 1, Math.floor(at));
          const f = at - i;
          const a = s.path[i], b = s.path[i + 1];
          const x = a.x + (b.x - a.x) * f;
          const y = a.y + (b.y - a.y) * f;

          // the trail it is leaving on this segment
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(x, y);
          ctx.strokeStyle = accent.replace(",1)", ",0.3)");
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = accent.replace(",1)", ",0.85)");
          ctx.fill();
        });
      }
    };

    const frame = () => {
      // How much of the hero is still on screen, 1 at the top and 0 once it has
      // scrolled away. Read from scroll position rather than an observer so the
      // fade is continuous rather than a step.
      const hero = document.querySelector('section[aria-label="Intro"]');
      if (hero) {
        const b = hero.getBoundingClientRect();
        heroVisible = Math.max(0, Math.min(1, (b.bottom - h * 0.15) / (h * 0.5)));
      }

      signals.forEach((s) => (s.t += s.speed * 0.016));
      signals = signals.filter((s) => s.t < 1);
      if (heroVisible > 0.05 && Math.random() < 0.035) spawn();

      draw();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      clearInterval(poll);
      raf = 0;
      poll = 0;
      signals = [];
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
    };

    const start = () => {
      if (!wide.matches) return stop();
      resize();
      layers = readLayers();
      if (reduced) {
        // one settled frame, the picture still reads, it just holds still
        draw();
        return;
      }
      if (!raf) raf = requestAnimationFrame(frame);
      // The docks appear, hide and move; re-read on a slow interval rather than
      // per frame, which would cost a layout flush 60 times a second.
      if (!poll) poll = setInterval(() => { layers = readLayers(); }, 500);
    };

    start();

    const onResize = () => start();
    window.addEventListener("resize", onResize);
    wide.addEventListener("change", start);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      wide.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden rail:block opacity-[0.55]"
    />
  );
};

export default NeuralField;
