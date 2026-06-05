import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "@/sections/About";

describe("AboutSection", () => {
  it("renders the sathish.py code card", () => {
    render(<AboutSection />);
    expect(screen.getByText("sathish.py")).toBeInTheDocument();
    expect(screen.getByText("MLEngineer")).toBeInTheDocument();
  });

  it("renders the bio with the GitHub link", () => {
    render(<AboutSection />);
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });

  it("has the Download résumé button", () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("link", { name: /download résumé/i })
    ).toHaveAttribute("href", "/Sathish_Kumar_Resume.pdf");
  });
});
