import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <span className="canvas-loader" />
        <p
          style={{
            fontFamily: '"JetBrains Mono Variable", ui-monospace, monospace',
            fontSize: 12,
            letterSpacing: "0.1em",
            color: "#e3a44c",
            margin: 0,
          }}
        >
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

export default CanvasLoader;
