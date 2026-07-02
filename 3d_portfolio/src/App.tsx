import { lazy, Suspense } from "react";
import { About, Contact, Hero, Navbar, Tech, Works } from "./components";

// Code-split the second WebGL canvas out of the initial bundle.
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

function App() {
  return (
    <div className="relative z-0 bg-primary">
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <div className="hero-bg bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <main id="main">
        <About />
        <Tech />
        <Works />
        <div className="relative z-0">
          <Contact />
          <Suspense fallback={null}>
            <StarsCanvas />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
