import { About, Contact, Hero, Navbar, Tech, Works } from "./components";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import CommandPalette from "./components/CommandPalette";
import Quote from "./components/Quote";
import { quotes } from "./constants";

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
          <Quote text={quotes[0].text} author={quotes[0].author} />
          <Tech />
          <Quote text={quotes[1].text} author={quotes[1].author} align="right" />
          <Works />
          <Quote text={quotes[2].text} author={quotes[2].author} />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <CommandPalette />
      </div>
    </ErrorBoundary>
  );
}

export default App;
