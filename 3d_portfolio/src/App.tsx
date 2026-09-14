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
import Collaborate from "./components/Collaborate";
import NeuralField from "./components/NeuralField";
import SpecBand from "./components/SpecBand";

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
          {/* Over everything, under nothing that matters: a fixed noise layer at
              3.5% so a flat dark ground stops banding and starts reading as a
              material. See `.grain` in index.css. */}
          <span aria-hidden="true" className="grain" />
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
            {/* The spec sheet, straight after the hero: four derived numbers at
                the size a car company sets a 0-100 time. Outside the section
                rhythm on purpose — it is a band, not a section, and it has no
                heading because the numbers are the heading. */}
            <SpecBand />
            <About />
            <Experience />
            <Tech />
            <Works />
            <Contact />
            {/* Last on the page, and desktop only. It is a closing note rather
                than a section someone came for, and on a phone it is in the
                menu instead. Inside <main>, not after it: a page gets one main
                landmark, and an earlier version split it in two. */}
            <Collaborate />
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
