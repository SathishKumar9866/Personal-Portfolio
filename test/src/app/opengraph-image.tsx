import { ImageResponse } from "next/og";
import { profile } from "@/data/resume";

export const alt = `${profile.name} - ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#0D1117",
        color: "#E6EDF3",
        padding: "80px",
        fontFamily: "monospace",
      }}
    >
      <div style={{ color: "#2DD4BF", fontSize: 28, letterSpacing: 2 }}>
        {profile.tagline.toUpperCase()}
      </div>
      <div style={{ fontSize: 92, fontWeight: 700, marginTop: 16 }}>
        {profile.name}
      </div>
      <div style={{ fontSize: 40, color: "#8B949E", marginTop: 8 }}>
        {profile.title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 48,
          fontSize: 26,
          color: "#2DD4BF",
        }}
      >
        {profile.url.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    size
  );
}
