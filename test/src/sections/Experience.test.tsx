import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "@/sections/Experience";
import { experience, education } from "@/data/resume";

describe("ExperienceSection", () => {
  it("renders every role and company", () => {
    render(<ExperienceSection />);
    for (const job of experience) {
      // company names can repeat (e.g. SIU also appears under Education), so use getAllByText
      expect(
        screen.getAllByText(new RegExp(job.role)).length,
        `missing role: ${job.role}`
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(new RegExp(job.company)).length,
        `missing company: ${job.company}`
      ).toBeGreaterThan(0);
    }
  });

  it("renders every education entry", () => {
    render(<ExperienceSection />);
    for (const edu of education) {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
      expect(screen.getAllByText(edu.school).length).toBeGreaterThan(0);
    }
  });
});
