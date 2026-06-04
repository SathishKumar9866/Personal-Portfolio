import { ThemeToggle } from "@/components/ThemeToggle";
import { socials } from "@/data/nav";

// Social icon links - shared by the mobile top pill and the desktop side rail.
const Socials = () =>
  socials.map(({ label, href, Icon, external }) => (
    <a
      key={label}
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="rounded-full p-2 text-muted transition duration-200 hover:scale-110 hover:text-fg"
    >
      <Icon className="size-4" />
    </a>
  ));

const pill =
  "pointer-events-auto rounded-full border border-line bg-canvas/80 backdrop-blur shadow-sm";

export const Header = () => {
  return (
    <header>
      {/* ── Small screens: horizontal pills in the top corners. The strip is
          a thin top band (not a full-screen overlay) so it can never swallow
          hover/clicks on the page below. ── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 md:hidden">
        <div className="container flex items-start justify-between pt-4">
          <a
            href="#home"
            className={`${pill} px-3 py-1.5 font-mono font-semibold tracking-tight`}
          >
            sathish<span className="text-accent">.</span>kumar
          </a>
          <div className={`${pill} flex items-center gap-1 px-1.5 py-1`}>
            <Socials />
          </div>
        </div>
      </div>

      {/* ── md+: ONE vertical rail, vertically centered on the right edge
          (name + socials + theme). Lives in a reserved right gutter (main has
          md:pr-*) so it never overlays text/UI at any width/zoom. ── */}
      <div
        className={`${pill} fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-1 px-1 py-3 md:flex`}
      >
        <a
          href="#home"
          aria-label="Home"
          className="px-1 py-2 font-mono font-semibold tracking-tight text-fg transition-colors [writing-mode:vertical-rl] hover:text-accent"
        >
          sathish<span className="text-accent">.</span>kumar
        </a>
        <span className="my-0.5 h-px w-5 bg-line" aria-hidden="true" />
        <Socials />
        <span className="my-0.5 h-px w-5 bg-line" aria-hidden="true" />
        <ThemeToggle vertical />
      </div>
    </header>
  );
};
