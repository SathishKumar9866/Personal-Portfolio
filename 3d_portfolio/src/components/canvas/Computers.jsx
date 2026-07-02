import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  Float,
  MeshDistortMaterial,
  Icosahedron,
} from "@react-three/drei";
import CanvasLoader from "../Loader";

// Procedural hero object, no external 3D model needed.
const HeroObject = () => (
  <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.4}>
    <Icosahedron args={[1.6, 4]}>
      <MeshDistortMaterial
        color="#cba6f7"
        emissive="#585b70"
        roughness={0.2}
        metalness={0.5}
        distort={0.4}
        speed={1.8}
      />
    </Icosahedron>
  </Float>
);

const ComputersCanvas = () => (
  <Canvas
    className="!absolute inset-0 z-0"
    camera={{ position: [0, 0, 6], fov: 40 }}
    gl={{ preserveDrawingBuffer: true }}
  >
    <Suspense fallback={<CanvasLoader />}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 5]} intensity={2} color="#b4befe" />
      <pointLight position={[-5, -3, -4]} intensity={40} color="#89b4fa" />
      <HeroObject />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.1}
      />
    </Suspense>
    <Preload all />
  </Canvas>
);

export default ComputersCanvas;
