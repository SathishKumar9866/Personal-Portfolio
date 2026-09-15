/* ---------------------------------------------------------------------------
   PLAIN ENGLISH.

   The moving network behind the hero, drawn with real 3D (three.js) on a
   graphics card. Points are the neurons, lines are the connections, and the
   little bright dots travelling along them are activations.

   It is a DIAGRAM, not wallpaper: the first layer of points sits exactly on the
   contact icons down the left edge, and the last layer on the section dots down
   the right. Those coordinates are read from the real buttons, so the drawing
   stays wired to the interface.

   This file is ~131 kB gzipped once three.js is counted — about four times the
   whole app — which is why NeuralField.jsx only `import()`s it for a desktop
   reader who has not asked for reduced motion and whose browser grants WebGL.
   Everyone else gets the 2D version and never downloads this.

   Walked through slowly: docs/LEARNING-NOTES.md, section 5.
--------------------------------------------------------------------------- */
/**
 * Owns: the hero field as an actual 3D scene, rendered with three.js.
 *
 * Not a component. `NeuralField` decides whether this applies and hands it the
 * same canvas; everything here is plain DOM and WebGL, and `start()` returns
 * the function that tears it down. Keeping it out of React is what lets it be
 * `import()`-ed, which is the whole reason the weight is affordable: this file
 * and the three.js it pulls in are one 522.79kB chunk, 131.13kB gzipped, and a
 * phone, a reader who asked for reduced motion, and a browser with no WebGL
 * never request it at all. Verified in the network panel against the built
 * bundle, not assumed from the config.
 *
 * WHAT IT DRAWS, AND WHY IT IS STILL A DIAGRAM
 *
 * The same claim the 2D field makes, with the one thing 2D could not give it.
 * The input layer sits on the real contact dock and the output layer on the
 * real section rail — coordinates read from `getBoundingClientRect()`, not
 * invented — and both of those planes are at z = 0. The two hidden layers are
 * pushed toward the reader and away from them, so the network is a volume
 * between two fixed columns of the interface rather than a flat lattice
 * behind it. Moving the pointer moves the camera, and the parallax is the
 * point: depth you cannot see is depth you did not need.
 *
 * Activations still travel input → hidden → hidden → output. In 3D they travel
 * through the page rather than across it.
 *
 * THE COST, STATED PLAINLY
 *
 * `NeuralField`'s own header used to argue against exactly this: "three.js plus
 * a renderer is ~150kB gzip against a ~115kB bundle". That was true and is
 * still true; the decision was reversed deliberately, by the owner, after being
 * shown the number. What keeps it honest:
 *
 *  - dynamically imported, so it is a separate chunk nothing else waits on
 *  - never requested below 1024px, under reduced-motion, or without WebGL
 *  - one renderer, one scene, no post-processing, no textures, no shadows
 *  - `powerPreference: "low-power"`, antialias off, DPR capped at 1.5
 *  - the loop stops when the hero leaves the screen and when the tab hides
 *  - 36 edges and ≤ 14 live activations; the geometry is rebuilt on resize and
 *    on the 500ms dock poll, never per frame
 */

/**
 * Named imports, not `await import("three")` inside `start()`. A namespace
 * object has to carry every export, so the namespace form shipped the whole
 * library: 191.81kB gzipped. Naming the ten classes this scene actually uses
 * lets Rollup drop the rest — loaders, every material but two, the animation
 * system, the audio and XR code — and this module is itself dynamically
 * imported by NeuralField, so the shaken result is still a lazy chunk.
 */
import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

const HIDDEN = [8, 6]; // same shape as the 2D field: 4 -> 8 -> 6 -> 5
// Kept from the 2D field, and for the same stated reason: an unlabelled lattice
// is just lines moving. Naming the layers is what makes it a diagram a reader
// can follow rather than an ornament they scroll past.
const LAYER_LABELS = ["INPUT", "HIDDEN 1", "HIDDEN 2", "OUTPUT"];
const HIDDEN_DEPTH = [170, -190]; // toward the reader, then away
/**
 * EIGHT, NOT FOURTEEN, AND SLOW.
 *
 * The field is a diagram behind the page's most important words, and it was
 * winning. Fourteen activations crossing at roughly a screen every three
 * seconds is enough motion to pull the eye off a sentence and back again on
 * every pass — the reader keeps re-finding their line.
 *
 * The numbers below are all attention, not performance: the scene ran at 60fps
 * either way. Halved travel speed, a third of the spawn rate and six fewer
 * lights make it something you notice once and then read over.
 */
const MAX_SIGNALS = 8;
const FOV = 50;

const rgb = (root, name) => {
  const v = getComputedStyle(root).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return v.length === 3 && v.every((n) => Number.isFinite(n)) ? v : [128, 128, 128];
};

const shown = (el) => {
  const s = getComputedStyle(el);
  if (s.display === "none" || s.visibility === "hidden") return false;
  const b = el.getBoundingClientRect();
  return b.width > 0 && b.height > 0;
};

/** Screen centre of a fixed element, in the canvas's own pixel space. */
const centre = (el) => {
  const b = el.getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
};

export const start = () => {
  const root = document.documentElement;

  /**
   * Its own canvas, not the one NeuralField renders. A canvas keeps the first
   * context it is given for life, and `forceContextLoss()` on teardown poisons
   * it for the next renderer — which React's development double-mount does
   * immediately, and which produced exactly one symptom: "THREE.WebGLRenderer:
   * Cannot read properties of null (reading 'precision')" and a blank field.
   * A fresh element per start() cannot collide with anything.
   */
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "pointer-events-none fixed inset-0 z-0 opacity-[0.55]";
  document.body.appendChild(canvas);

  let w = window.innerWidth;
  let h = window.innerHeight;

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  // 1.5, not 2. This is a field of 1px points and hairlines behind text: the
  // third pixel of a retina backing store is invisible here and costs 78% more
  // fragments than 1.5 does.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, w / h, 1, 5000);

  /**
   * One world unit = one CSS pixel at z = 0. That is the only reason the input
   * layer can land exactly on the contact icons: the dock's rect is in pixels,
   * and with the camera pulled back to (h/2) / tan(fov/2) a pixel offset from
   * the centre of the screen is the same number in world space.
   */
  const fit = () => {
    camera.aspect = w / h;
    camera.position.z = h / 2 / Math.tan((FOV / 2) * (Math.PI / 180));
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  const toWorld = (p, z = 0) => new Vector3(p.x - w / 2, h / 2 - p.y, z);

  // --- materials, coloured from the live theme tokens -----------------------
  const nodeMat = new PointsMaterial({ size: 5, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false });
  // 0.14, under the canvas's own 0.55: an edge has to be findable when you look
  // for it and invisible when you are reading the headline in front of it.
  const edgeMat = new LineBasicMaterial({ transparent: true, opacity: 0.14, depthWrite: false });
  // Smaller and softer than the nodes it travels between. At size 8 and 0.95
  // alpha each activation was the brightest thing on a page whose brightest
  // thing should be the headline.
  const signalMat = new PointsMaterial({ size: 6.5, sizeAttenuation: true, transparent: true, opacity: 0.72, depthWrite: false });

  const paintTheme = () => {
    const [r, g, b] = rgb(root, "--c-line-strong");
    const [ar, ag, ab] = rgb(root, "--c-accent");
    nodeMat.color.setRGB(r / 255, g / 255, b / 255);
    edgeMat.color.setRGB(r / 255, g / 255, b / 255);
    signalMat.color.setRGB(ar / 255, ag / 255, ab / 255);
  };
  paintTheme();

  // One container, reused. Appending to <body> rather than next to the canvas
  // because the canvas is `fixed inset-0` and a sibling inside a transformed
  // ancestor would be positioned against that ancestor instead of the viewport.
  const labelBox = document.createElement("div");
  labelBox.setAttribute("aria-hidden", "true");
  labelBox.className = "pointer-events-none fixed inset-0 z-0 opacity-70";
  document.body.appendChild(labelBox);

  let nodes = null;   // Points
  let edges = null;   // LineSegments
  let layers = [];    // Vector3[][]

  const disposeGraph = () => {
    for (const obj of [nodes, edges]) {
      if (!obj) continue;
      scene.remove(obj);
      obj.geometry.dispose();
    }
    nodes = edges = null;
  };

  /**
   * Read the live interface and rebuild the graph. Called on resize and on a
   * 500ms poll — never per frame. A dock that hides itself removes its nodes,
   * the same rule the 2D field follows, because a diagram wired to controls
   * that are not there is a drawing of something else.
   */
  const build = () => {
    const inputs = [...document.querySelectorAll(
      'nav[aria-label="Contact shortcuts"] a, nav[aria-label="Contact shortcuts"] button'
    )].filter(shown).map(centre);
    const outputs = [...document.querySelectorAll('nav[aria-label="Sections"] a')]
      .filter(shown).map(centre);
    if (!inputs.length || !outputs.length) { disposeGraph(); layers = []; return; }

    const x0 = inputs[0].x, x1 = outputs[0].x;
    const spread = h * 0.44;
    const hidden = HIDDEN.map((count, li) => {
      const x = x0 + ((x1 - x0) * (li + 1)) / (HIDDEN.length + 1);
      return Array.from({ length: count }, (_, ni) =>
        toWorld(
          { x, y: h / 2 - spread / 2 + (spread * (ni + 0.5)) / count },
          // A little per-node jitter in z, or each hidden layer reads as a flat
          // card standing in space and the volume collapses back to 2D.
          HIDDEN_DEPTH[li] + Math.sin(ni * 2.3 + li) * 34
        )
      );
    });

    layers = [inputs.map((p) => toWorld(p)), ...hidden, outputs.map((p) => toWorld(p))];

    disposeGraph();

    const flat = layers.flat();
    const nodeGeo = new BufferGeometry().setFromPoints(flat);
    nodes = new Points(nodeGeo, nodeMat);
    scene.add(nodes);

    /**
     * Sparse on purpose: each node reaches the two nodes opposite it in the
     * next layer, not all of them. Fully connected is what an MLP actually is
     * and it was the first thing built — 110 edges, which at any opacity that
     * makes one edge visible reads as a mesh laid over the headline. The
     * repo's rule for ambient work is that it must not cross text; 36 edges
     * still says "network" and leaves the type alone.
     */
    const pairs = [];
    for (let i = 0; i < layers.length - 1; i++) {
      const from = layers[i], to = layers[i + 1];
      from.forEach((a, ai) => {
        const centreOf = Math.round(((ai + 0.5) / from.length) * to.length - 0.5);
        for (const d of [0, 1]) {
          const b = to[Math.min(to.length - 1, Math.max(0, centreOf + d))];
          if (b) pairs.push(a, b);
        }
      });
    }
    edges = new LineSegments(new BufferGeometry().setFromPoints(pairs), edgeMat);
    scene.add(edges);

    labelLayers();
  };

  /**
   * The layer names, as DOM text rather than anything in the scene. Text in
   * WebGL means either a canvas texture per string or a font atlas, and both
   * are more machinery than four words justify — and DOM text stays selectable,
   * scales with the reader's own text-size control, and costs no GL state.
   *
   * They are placed from the layer x positions, so a dock that moves takes its
   * label with it. The camera parallax is deliberately NOT applied here: a
   * label that slides under the pointer reads as a loose caption, and 46px of
   * camera travel is under a character's width at this size anyway.
   */
  const labelLayers = () => {
    if (!layers.length) { labelBox.replaceChildren(); return; }
    const spans = layers.map((layer, i) => {
      const el = document.createElement("span");
      el.className = "absolute -translate-x-1/2 font-mono text-label text-faint whitespace-nowrap";
      // Clamped 56px inside the viewport: the input layer sits on a dock that
      // is itself 20px from the edge, and a centred label under it hung half
      // off the left of the page.
      el.style.left = `${Math.min(w - 56, Math.max(56, layer[0].x + w / 2))}px`;
      el.style.bottom = "26px";
      el.textContent = `${LAYER_LABELS[i] ?? ""} ${layer.length}`;
      return el;
    });
    labelBox.replaceChildren(...spans);
  };

  // --- activations ----------------------------------------------------------
  const signalGeo = new BufferGeometry();
  const signalPos = new Float32Array(MAX_SIGNALS * 3);
  signalGeo.setAttribute("position", new BufferAttribute(signalPos, 3));
  const signals = new Points(signalGeo, signalMat);
  signals.frustumCulled = false;
  scene.add(signals);

  let live = []; // { path: Vector3[], t, speed }

  const spawn = () => {
    if (layers.length < 2 || live.length >= MAX_SIGNALS) return;
    live.push({
      path: layers.map((l) => l[Math.floor(Math.random() * l.length)]),
      t: 0,
      // Roughly half of what it was (0.26-0.46). A crossing now takes about
      // eight seconds instead of three.
      speed: 0.12 + Math.random() * 0.09,
    });
  };

  const stepSignals = (dt) => {
    live = live.filter((s) => (s.t += dt * s.speed) < 1);
    signalGeo.setDrawRange(0, live.length);
    live.forEach((s, i) => {
      const segs = s.path.length - 1;
      const u = s.t * segs;
      const k = Math.min(segs - 1, Math.floor(u));
      const a = s.path[k], b = s.path[k + 1], f = u - k;
      signalPos[i * 3] = a.x + (b.x - a.x) * f;
      signalPos[i * 3 + 1] = a.y + (b.y - a.y) * f;
      signalPos[i * 3 + 2] = a.z + (b.z - a.z) * f;
    });
    signalGeo.attributes.position.needsUpdate = true;
  };

  // --- camera parallax ------------------------------------------------------
  // The pointer moves the camera, not the scene: moving the scene would slide
  // the input layer off the dock it is anchored to, which is the one thing this
  // drawing promises.
  let px = 0, py = 0, cx = 0, cy = 0;
  const onPointer = (e) => {
    // 30/20, down from 46/30. The parallax is the thing that proves the scene
    // has depth, so it stays — but a reader moving the pointer toward a link
    // should not shift the whole backdrop behind the text they are reading.
    px = (e.clientX / w - 0.5) * 30;
    py = (e.clientY / h - 0.5) * 20;
  };

  // --- loop -----------------------------------------------------------------
  let raf = 0, last = 0, poll = 0, onScreen = true, hidden = false, fade = 1;

  const frame = (ts) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0;
    last = ts;
    if (!onScreen || hidden) return;

    // A longer tail on the easing, so the camera drifts to the pointer rather
    // than tracking it.
    cx += (px - cx) * 0.028;
    cy += (py - cy) * 0.028;
    camera.position.x = cx;
    camera.position.y = -cy;
    camera.lookAt(0, 0, 0);

    /**
     * 0.8 a second, down from 3.2 — and the arithmetic matters, because halving
     * the speed DOUBLES how long each activation lives, which cancels most of a
     * spawn-rate cut.
     *
     *   concurrent ≈ spawn rate × lifetime
     *   before: 3.2/s × ~3.0s  ≈ 9.6 lit at once
     *   at 1.1: 1.1/s × ~6.1s  ≈ 6.7  — barely quieter
     *   now:    0.8/s × ~6.1s  ≈ 4.9  — half the old field
     */
    if (Math.random() < dt * 0.8) spawn();
    stepSignals(dt);
    renderer.render(scene, camera);
  };

  // Scoped to the landing view, like the 2D field: a backdrop that follows the
  // reader through Experience and Contact is wallpaper competing with text.
  const onScroll = () => {
    const next = Math.max(0, 1 - window.scrollY / (h * 0.75));
    if (Math.abs(next - fade) > 0.01) {
      fade = next;
      canvas.style.opacity = String(fade);
      labelBox.style.opacity = String(fade * 0.7);
    }
    onScreen = fade > 0.02;
  };

  const onResize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    fit();
    build();
  };

  const onVisibility = () => { hidden = document.hidden; };

  const themeWatch = new MutationObserver(paintTheme);
  themeWatch.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-scheme"] });

  fit();
  build();
  onScroll();
  poll = window.setInterval(build, 500);
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    clearInterval(poll);
    themeWatch.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    disposeGraph();
    labelBox.remove();
    canvas.remove();
    signalGeo.dispose();
    nodeMat.dispose();
    edgeMat.dispose();
    signalMat.dispose();
    // Frees the GL context. Without it a resize that remounts this leaks one
    // context per mount, and browsers hard-cap the number a page may hold.
    renderer.dispose();
    renderer.forceContextLoss();
  };
};
