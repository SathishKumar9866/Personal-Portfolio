import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "@/sections/About";

describe("AboutSection", () => {
  it("renders the sathish.py code card", () => {
    render(<AboutSection />);
    expect(screen.getByText("sathish.py")).toBeInTheDocument();
    expect(screen.getByText("MLEngineer")).toBeInTheDocument();
  });

  it("renders quick facts", () => {
    render(<AboutSection />);
    expect(screen.getByText("role")).toBeInTheDocument();
    expect(screen.getByText("experience")).toBeInTheDocument();
    expect(screen.getByText("location")).toBeInTheDocument();
  });
});
