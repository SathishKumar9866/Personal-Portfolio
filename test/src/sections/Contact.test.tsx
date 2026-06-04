import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactSection } from "@/sections/Contact";

describe("ContactSection", () => {
  it("renders the 'what I do' impact strip", () => {
    render(<ContactSection />);
    expect(screen.getByText(/RAG \+ knowledge graphs/i)).toBeInTheDocument();
    expect(screen.getByText(/MLOps that lasts/i)).toBeInTheDocument();
    expect(screen.getByText(/shipping ML/i)).toBeInTheDocument();
  });
});
