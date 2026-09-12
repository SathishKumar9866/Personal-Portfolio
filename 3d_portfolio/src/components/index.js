// Canvases are code-split and lazy-imported at their use sites (Hero, App),
// so they are intentionally NOT re-exported here, that keeps three.js out of
// the initial bundle.
import Hero from "./Hero";
import Navbar from "./Navbar";
import About from "./About";
import Tech from "./Tech";
import Works from "./Works";
import Contact from "./Contact";

export { Hero, Navbar, About, Tech, Works, Contact };
