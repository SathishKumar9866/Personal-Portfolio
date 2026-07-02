import { Suspense, useEffect, useMemo, useRef, useState, Component } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, Icosahedron } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import CanvasLoader from "../Loader";

const AMBER = "#e3a44c";

// A node/edge graph — a stand-in for the data → model → interface path I work on.
function DataMesh({ reduced }) {
  const group = useRef();
  const { pointer } = useThree();

  // shared icosahedron geometry drives both the edge wireframe and the vertex nodes
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.9, 1), []);

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!reduced) group.current.rotation.y += delta * 0.18;
    // gentle mouse parallax
    const tx = reduced ? 0 : pointer.y * 0.18;
    const ty = reduced ? 0 : pointer.x * 0.28;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (ty - group.current.rotation.z) * 0.05;
  });

  return (
    <group ref={group} rotation={[0.2, 0, 0]}>
      {/* faceted inner core */}
      <Icosahedron args={[1.12, 0]}>
        <meshStandardMaterial
          color="#1b222b"
          emissive={AMBER}
          emissiveIntensity={0.06}
          flatShading
          roughness={0.7}
          metalness={0.2}
        />
      </Icosahedron>
      {/* edge graph */}
      <lineSegments>
        <wireframeGeometry args={[geo]} />
        <lineBasicMaterial color={AMBER} transparent opacity={0.55} />
      </lineSegments>
      {/* vertex nodes */}
      <points geometry={geo}>
        <pointsMaterial
          color={AMBER}
          size={0.08}
          sizeAttenuation
          transparent
          opacity={0.95}
        />
      </points>
    </group>
  );
}

// If WebGL fails, show a designed poster instead of a blank canvas.
class GLBoundary extends Component {
  constructor(p) {
    super(p);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

const Poster = () => (
  <div className="!absolute inset-0 z-0 flex items-center justify-center" aria-hidden="true">
    <div
      className="w-[min(70vw,420px)] aspect-square rounded-full"
      style={{
        background:
          "radial-gradient(closest-side, rgba(227,164,76,0.28), rgba(227,164,76,0.05) 60%, transparent 72%)",
        boxShadow: "inset 0 0 0 1px rgba(227,164,76,0.25)",
      }}
    />
  </div>
);

const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
};

const ComputersCanvas = () => {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const wrap = useRef(null);
  const [inView, setInView] = useState(true);

  // pause the render loop while the hero is scrolled offscreen
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const animate = inView && !reduced;

  return (
    <div ref={wrap} className="absolute inset-0 z-0">
      <GLBoundary fallback={<Poster />}>
        <Canvas
          className="!absolute inset-0"
          frameloop={animate ? "always" : "demand"}
          dpr={[1, isMobile ? 1.3 : 2]}
          camera={{ position: [0, 0, 6], fov: 42 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[4, 5, 5]} intensity={1.6} color="#f4d9a8" />
            <pointLight position={[-5, -3, -4]} intensity={30} color="#4f9a8e" />
            <DataMesh reduced={reduced} />
          </Suspense>
          <Preload all />
        </Canvas>
      </GLBoundary>
    </div>
  );
};

export default ComputersCanvas;
