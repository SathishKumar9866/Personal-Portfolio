import { useState } from "react";
import { styles } from "../styles";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary/80 backdrop-blur-md`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <a
          href="#"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-mauve to-blue flex items-center justify-center text-primary font-black">
            S
          </span>
          <p className="text-white-100 text-[18px] font-bold cursor-pointer flex">
            Sathish&nbsp;
            <span className="sm:block hidden text-secondary font-medium">
              | AI Engineer
            </span>
          </p>
        </a>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((n) => (
            <li
              key={n.id}
              className={`${
                active === n.title ? "text-white-100" : "text-secondary"
              } hover:text-white-100 text-[18px] font-medium cursor-pointer transition-colors`}
              onClick={() => setActive(n.title)}
            >
              <a href={`#${n.id}`}>{n.title}</a>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            onClick={() => setToggle(!toggle)}
            className="text-white-100 text-[24px] leading-none"
            aria-label="Menu"
          >
            {toggle ? "✕" : "☰"}
          </button>
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-16 right-4 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex flex-col gap-4">
              {navLinks.map((n) => (
                <li
                  key={n.id}
                  className="text-white-100 font-medium cursor-pointer"
                  onClick={() => {
                    setToggle(false);
                    setActive(n.title);
                  }}
                >
                  <a href={`#${n.id}`}>{n.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
