import { profile } from "../data/portfolio.js";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons.jsx";

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon
};

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 className="hero-name" id="hero-title" data-scramble-text={profile.name}>{profile.name}</h1>
      <div className="hero-role" aria-live="polite">
        {profile.roles.map((role, index) => (
          <span key={role} className={`hero-role-item ${index === 0 ? "is-active" : ""}`}>{role}</span>
        ))}
      </div>
      <p className="hero-tagline">{profile.tagline}</p>
      <div className="hero-socials" aria-label="Social links">
        {profile.socials.map((social) => {
          const Icon = socialIcons[social.icon];
          const isExternal = social.href.startsWith("http");

          return (
            <a
              key={social.label}
              href={social.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className="magnetic-icon"
              data-magnetic
              aria-label={social.label}
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </section>
  );
}
