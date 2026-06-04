import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page link integrity", () => {
  it("renders without crashing and has links", () => {
    const { container } = render(<Home />);
    const anchors = Array.from(container.querySelectorAll("a"));
    expect(anchors.length).toBeGreaterThan(0);
  });

  it("has no dead links (empty or bare '#')", () => {
    const { container } = render(<Home />);
    const anchors = Array.from(container.querySelectorAll("a"));
    for (const a of anchors) {
      const href = a.getAttribute("href") ?? "";
      expect(href, `dead link text="${a.textContent?.trim()}"`).not.toBe("");
      expect(href, `bare # link text="${a.textContent?.trim()}"`).not.toBe("#");
    }
  });

  it("every in-page anchor (#id) resolves to a matching element", () => {
    const { container } = render(<Home />);
    const anchors = Array.from(
      container.querySelectorAll('a[href^="#"]')
    ) as HTMLAnchorElement[];
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) {
      const id = a.getAttribute("href")!.slice(1);
      expect(
        container.querySelector(`#${CSS.escape(id)}`),
        `nav link "${a.textContent?.trim()}" points to #${id} which has no target`
      ).not.toBeNull();
    }
  });

  it("non-anchor links are well-formed (http(s), mailto, or local asset) and open safely", () => {
    const { container } = render(<Home />);
    const links = (
      Array.from(container.querySelectorAll("a")) as HTMLAnchorElement[]
    ).filter((a) => !(a.getAttribute("href") ?? "").startsWith("#"));
    for (const a of links) {
      const href = a.getAttribute("href")!;
      // external (http/mailto) or a root-relative local asset like /resume.pdf
      expect(href).toMatch(/^(https?:\/\/|mailto:|\/)/);
      if (href.startsWith("http") && a.getAttribute("target") === "_blank") {
        expect(a.getAttribute("rel") ?? "").toContain("noopener");
      }
    }
  });
});
