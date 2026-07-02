import { lazy, Suspense } from "react";
import { About, Contact, Hero, Navbar, Tech, Works } from "./components";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// Code-split the second WebGL canvas out of the initial bundle.
const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

function App() {
  return (
    <ErrorBoundary>
      <div className="relative z-0 bg-primary">
        <ScrollProgress />
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
        <Footer />
        <BackToTop />
      </div>
    </ErrorBoundary>
  );
}

export default App;
