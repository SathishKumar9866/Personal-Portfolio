import { contact, SITE_REPO } from "../constants";
import Reveal from "./Reveal";

/**
 * Owns: the invitation to work on these projects with him, sitting between the
 * project grid and the contact details.
 *
 * Does not own: how to reach him. That is Contact, one section down, and this
 * deliberately does not repeat the full list. Two routes are named here because
 * the invitation is useless without at least one, and naming two specific ones
 * with a reason attached is different from printing the same four links twice.
 *
 * Why it sits after Work rather than inside Contact: it is about the
 * repositories the reader has just been looking at, not about hiring. Putting
 * it in Contact would have made it a second paragraph under a heading that says
 * something else.
 *
 * A band, not a section: no nav entry, no `SectionWrapper`, no h2 competing
 * with the five real sections. It is an aside in the flow of the page, which is
 * also what `AgentNote` is, and it borrows that shape on purpose.
 */

const Collaborate = () => (
  <aside aria-labelledby="collab-title" className="w-full border-t border-line bg-tertiary/40">
    <div className="max-w-7xl mx-auto px-6 sm:px-16 py-12 sm:py-16">
      <Reveal>
        <p className="font-mono text-label uppercase tracking-label text-faint">
          Open to collaborators
        </p>
        <h2
          id="collab-title"
          className="mt-2 font-display font-semibold text-[calc(clamp(1.3rem,2.2vw,1.9rem)*var(--type-scale,1))] leading-tight tracking-[-0.01em] text-white-100 max-w-[34rem]"
        >
          If something here is useful to you, it is yours to build on.
        </h2>
      </Reveal>

      <ul className="mt-8 grid gap-x-10 gap-y-6 list-none sm:grid-cols-2 lg:grid-cols-3">
        <Reveal as="li" delay={0.05} className="border-t border-line pt-4">
          <h3 className="font-mono text-label uppercase tracking-label text-accent-ink">
            Issues and pull requests
          </h3>
          <p className="mt-2 font-sans text-secondary text-body leading-[1.65]">
            On any repository linked from this page. You do not need permission
            and you do not need to know the codebase. A question counts: if
            something was unclear enough to ask about, the documentation has a
            gap, and that is worth knowing.
          </p>
        </Reveal>

        <Reveal as="li" delay={0.12} className="border-t border-line pt-4">
          <h3 className="font-mono text-label uppercase tracking-label text-accent-ink">
            Write it with an LLM
          </h3>
          <p className="mt-2 font-sans text-secondary text-body leading-[1.65]">
            Claude, Codex, Gemini, Grok, whatever you already have open. That is
            not something to apologise for here. One condition, and it is the
            same one a human patch has: the pull request has to explain its
            reasoning, not its diff, so that a reviewer or a model reading it
            later can follow why.
          </p>
        </Reveal>

        <Reveal as="li" delay={0.19} className="border-t border-line pt-4">
          <h3 className="font-mono text-label uppercase tracking-label text-accent-ink">
            Or just work together
          </h3>
          <p className="mt-2 font-sans text-secondary text-body leading-[1.65]">
            I am interested in people who think differently to me: different
            field, different stack, different reason for caring. I pick things
            up quickly, I would rather ask the obvious question than guess, and
            I try to explain things plainly enough to follow from outside the
            specialism.
          </p>
        </Reveal>
      </ul>

      <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={`https://www.linkedin.com/${contact.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center min-h-11 sm:min-h-0 font-mono text-data text-accent-ink hover:underline"
        >
          LinkedIn, for a conversation or a call ↗
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center min-h-11 sm:min-h-0 font-mono text-data text-accent-ink hover:underline"
        >
          Email, for anything with detail attached ↗
        </a>
        <a
          href={SITE_REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center min-h-11 sm:min-h-0 font-mono text-data text-secondary hover:text-accent-ink transition-colors"
        >
          CONTRIBUTING.md ↗
        </a>
      </Reveal>
    </div>
  </aside>
);

export default Collaborate;
