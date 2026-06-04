import { profile } from "@/data/resume";
import GithubIcon from "@/assets/icons/github.svg";
import LinkedinIcon from "@/assets/icons/linkedin.svg";
import MailIcon from "@/assets/icons/mail.svg";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
] as const;

export const socials = [
  { label: "GitHub", href: profile.github, Icon: GithubIcon, external: true },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    Icon: LinkedinIcon,
    external: true,
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    Icon: MailIcon,
    external: false,
  },
] as const;
