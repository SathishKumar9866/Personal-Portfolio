import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/sections/Hero";

describe("HeroSection", () => {
  it("renders the name as the main heading", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Sathish Kumar/ })
    ).toBeInTheDocument();
  });

  it("shows the first typewriter phrase and the FileTree", () => {
    render(<HeroSection />);
    expect(screen.getByText("LLM & RAG systems")).toBeInTheDocument();
    // FileTree (about-me filesystem) now lives in the Hero.
    expect(screen.getByRole("link", { name: "experience/" })).toHaveAttribute(
      "href",
      "#experience"
    );
  });

  it("has a 'Get in touch' mailto CTA", () => {
    render(<HeroSection />);
    const href = screen
      .getByRole("link", { name: /get in touch/i })
      .getAttribute("href");
    expect(href).toMatch(/^mailto:sathishkumar\.p9875@gmail\.com\?/);
    expect(href).toContain("subject=");
  });
});
