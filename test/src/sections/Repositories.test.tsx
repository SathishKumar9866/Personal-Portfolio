import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RepositoriesSection } from "@/sections/Repositories";
import { repositories } from "@/data/repositories";

describe("RepositoriesSection", () => {
  it("renders a card for every public repo", () => {
    render(<RepositoriesSection />);
    for (const repo of repositories) {
      expect(
        screen.getByRole("heading", { name: repo.name }),
        `missing repo card: ${repo.name}`
      ).toBeInTheDocument();
    }
  });

  it("every repo links to a valid GitHub URL", () => {
    render(<RepositoriesSection />);
    const links = screen.getAllByRole("link") as HTMLAnchorElement[];
    const repoLinks = links.filter((l) =>
      l.getAttribute("href")?.includes("github.com/SathishKumarAI/")
    );
    expect(repoLinks.length).toBeGreaterThanOrEqual(repositories.length);
    for (const repo of repositories) {
      expect(links.some((l) => l.getAttribute("href") === repo.url)).toBe(true);
    }
  });

  it("has a 'View all on GitHub' link to the profile", () => {
    render(<RepositoriesSection />);
    expect(
      screen.getByRole("link", { name: /view all on github/i })
    ).toHaveAttribute("href", "https://github.com/SathishKumarAI");
  });

  it("repository data has no empty names or urls", () => {
    for (const repo of repositories) {
      expect(repo.name.trim().length).toBeGreaterThan(0);
      expect(repo.url).toMatch(/^https:\/\/github\.com\//);
    }
  });
});
