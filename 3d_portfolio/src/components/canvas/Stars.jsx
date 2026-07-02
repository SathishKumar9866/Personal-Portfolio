import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = ({ reduced, ...props }) => {
  const ref = useRef();
  // length divisible by 3 to avoid NaN positions
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5001), { radius: 1.2 })
  );

  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.x -= delta / 16;
    ref.current.rotation.y -= delta / 22;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#8a93a1"
          size={0.0022}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const reduced = useReducedMotion();
  return (
    <div className="w-full h-full absolute inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          <Stars reduced={reduced} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
