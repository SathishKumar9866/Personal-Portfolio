import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import { ContactSection } from "@/sections/Contact";
import { AboutSection } from "@/sections/About";
import { ExperienceSection } from "@/sections/Experience";
import { ProjectsSection } from "@/sections/Projects";
import { SkillsSection } from "@/sections/Skills";
import { RepositoriesSection } from "@/sections/Repositories";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      {/* md:pr reserves a right gutter for the fixed header rail so page
          content never slides under it (overlap-proof at any zoom). */}
      <main id="main" className="md:pr-16 lg:pr-20">
        <HeroSection />
        <ContactSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <RepositoriesSection />
      </main>
      <Footer />
    </>
  );
}
