import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { styles } from "../styles";
import { contact } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
const configured = EMAILJS.service && EMAILJS.template && EMAILJS.key;

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-2">
    <span className="font-mono text-[11px] uppercase tracking-label text-secondary">{label}</span>
    {children}
  </label>
);

const inputCls =
  "bg-primary border border-line rounded-lg px-4 py-3 font-serif text-white-100 text-[15px] placeholder:text-faint focus:border-accent transition-colors";

const Contact = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = new FormData(formRef.current);
    if (data.get("company")) return; // honeypot tripped — silently drop
    const name = data.get("name")?.trim();
    const email = data.get("email")?.trim();
    const message = data.get("message")?.trim();
    if (!name || !email || !message) return;

    // no EmailJS keys configured → fall back to the user's mail client
    if (!configured) {
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
        "Portfolio message from " + name
      )}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS.service,
        EMAILJS.template,
        { from_name: name, reply_to: email, message },
        { publicKey: EMAILJS.key }
      );
      setStatus("ok");
      formRef.current.reset();
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12">
      <div>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Get in touch</p>
          <h2 className={styles.sectionHeadText}>Contact.</h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-4 font-serif text-secondary text-[17px] leading-[1.6] max-w-md"
        >
          Open to data engineering, data science, ML, and AI engineering roles,
          across any domain. If something here is useful to you, reach out.
        </motion.p>

        <motion.div variants={fadeIn("up", "spring", 0.2, 0.7)} className="mt-8 flex flex-col gap-4">
          <button
            onClick={copyEmail}
            className="group flex items-center gap-3 self-start font-mono text-[14px] text-white-100"
          >
            <span className="text-secondary text-[11px] uppercase tracking-label w-14 text-left">email</span>
            <span className="group-hover:text-accent transition-colors border-b border-line group-hover:border-accent pb-0.5">
              {contact.email}
            </span>
            <span className="text-[11px] text-faint group-hover:text-accent">
              {copied ? "copied ✓" : "copy"}
            </span>
          </button>

          {contact.socials
            .filter((s) => s.k !== "email")
            .map((s) => (
              <a
                key={s.k}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 self-start font-mono text-[14px] text-white-100"
              >
                <span className="text-secondary text-[11px] uppercase tracking-label w-14 text-left">{s.k}</span>
                <span className="group-hover:text-accent transition-colors border-b border-line group-hover:border-accent pb-0.5">
                  {s.v} ↗
                </span>
              </a>
            ))}
        </motion.div>
      </div>

      <motion.form
        ref={formRef}
        onSubmit={onSubmit}
        variants={fadeIn("left", "spring", 0.2, 0.8)}
        className="flex flex-col gap-4 rounded-2xl border border-line bg-tertiary p-6 shadow-card"
      >
        {/* honeypot */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <Field label="Your name">
          <input name="name" required placeholder="Jane Doe" className={inputCls} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required placeholder="jane@company.com" className={inputCls} />
        </Field>
        <Field label="Message">
          <textarea name="message" required rows={5} placeholder="What are you building?" className={inputCls + " resize-y"} />
        </Field>
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-mono text-[13px] font-semibold text-primary hover:shadow-glow disabled:opacity-60 transition-shadow"
        >
          {status === "sending" ? "Sending…" : status === "ok" ? "Sent ✓" : "Send message"}
        </button>
        {status === "ok" && (
          <p className="font-mono text-[12px] text-live">Thanks — I&apos;ll get back to you.</p>
        )}
        {status === "err" && (
          <p className="font-mono text-[12px] text-accent">
            Something failed. Email me directly at {contact.email}.
          </p>
        )}
        {!configured && (
          <p className="font-mono text-[11px] text-faint">Opens your mail app.</p>
        )}
      </motion.form>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
