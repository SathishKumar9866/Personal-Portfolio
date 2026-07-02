import { About, Contact, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";

function App() {
  return (
    <div className="relative z-0 bg-primary">
      <div className="hero-bg bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Tech />
      <Works />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
    </div>
  );
}

export default App;
