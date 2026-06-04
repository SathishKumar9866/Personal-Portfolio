import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/sections/Header";
import { profile } from "@/data/resume";

describe("Header nav", () => {
  // The header renders responsive copies (mobile top pill + desktop side
  // rail), so links can appear more than once - assert at least one matches.
  const hrefs = (name: string | RegExp) =>
    screen.getAllByRole("link", { name }).map((el) => el.getAttribute("href"));

  it("links the brand wordmark home", () => {
    render(<Header />);
    expect(hrefs(/sathish/i)).toContain("#home");
  });

  it("shows contact icons (GitHub, LinkedIn, Email)", () => {
    render(<Header />);
    expect(hrefs("GitHub")).toContain(profile.github);
    expect(hrefs("LinkedIn")).toContain(profile.linkedin);
    expect(hrefs("Email")).toContain(`mailto:${profile.email}`);
  });
});
