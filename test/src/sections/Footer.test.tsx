import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/sections/Footer";

describe("Footer", () => {
  it("shows the copyright with the name", () => {
    render(<Footer />);
    // Name appears in the copyright and the crawler note - just assert present.
    expect(screen.getAllByText(/Sathish Kumar/).length).toBeGreaterThan(0);
  });

  it("has a mailto link in the crawler note", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /sathishkumar\.p9875@gmail\.com/i })
    ).toHaveAttribute("href", "mailto:sathishkumar.p9875@gmail.com");
  });
});
