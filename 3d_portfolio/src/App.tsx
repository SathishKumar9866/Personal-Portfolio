import { MotionConfig } from "framer-motion";
import { About, Contact, Hero, Navbar, Tech, Works } from "./components";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import CommandPalette from "./components/CommandPalette";
import SideRail from "./components/SideRail";
import ContactRail from "./components/ContactRail";
import AgentNote from "./components/AgentNote";
import NeuralField from "./components/NeuralField";

function App() {
  return (
    <ErrorBoundary>
      {/* The CSS reduced-motion block only covers CSS animation; every
          framer-motion animation on the page is JS-driven and ignored it. */}
      <MotionConfig reducedMotion="user">
        <div className="relative z-0 bg-primary">
          {/* Behind everything: reads the two docks as input and output layers.
              Sections sit later in the DOM at the same z, so they paint over it. */}
          <NeuralField />
          <ScrollProgress />
          {/* Targets #main, not #about, the old target skipped the whole hero, the h1, the pitch and both CTAs. The .hash-span ids are
              non-focusable spans, so tabIndex={-1} on <main> is what actually
              moves the focus point. */}
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <main id="main" tabIndex={-1}>
            <div className="hero-bg bg-cover bg-no-repeat bg-center">
              <Hero />
            </div>
            <About />
            <Experience />
            <Tech />
            <Works />
            <Contact />
          </main>
          <AgentNote />
          <Footer />
          <SideRail />
          <ContactRail />
          <BackToTop />
          <CommandPalette />
        </div>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
