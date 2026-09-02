import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Mail, Phone, Menu, X } from "lucide-react";
import LogoMark from "./Logo.jsx";
import { LinkedinIcon, TwitterIcon, FacebookIcon } from "./SocialIcons.jsx";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Businesses", to: "/businesses" },
  { label: "Investors", to: "/investors" },
  { label: "Sustainability", to: "/sustainability" },
  { label: "Careers", to: "/careers" },
  { label: "News", to: "/news" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `transition-colors hover:text-vh-gold ${isActive ? "text-vh-gold" : "text-vh-cream/85"}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-vh-black/95 backdrop-blur border-b border-vh-line" : "bg-vh-black/70 backdrop-blur"
      }`}
    >
      <div className="hidden lg:flex items-center justify-end gap-6 px-8 py-2 text-xs text-vh-cream/70 border-b border-white/5">
        <a href="mailto:investor.relations@vinkholdings.com" className="flex items-center gap-2 hover:text-vh-gold transition-colors">
          <Mail size={14} /> investor.relations@vinkholdings.com
        </a>
        <a href="tel:+260971234567" className="flex items-center gap-2 hover:text-vh-gold transition-colors">
          <Phone size={14} /> +260 97 123 4567
        </a>
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-vh-gold transition-colors">
            <LinkedinIcon />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-vh-gold transition-colors">
            <TwitterIcon />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-vh-gold transition-colors">
            <FacebookIcon />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMenuOpen(false)}>
          <LogoMark size={44} />
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-wide text-vh-cream">VINK</span>
            <span className="block text-[10px] tracking-[0.25em] text-vh-gold -mt-1">HOLDINGS</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="rounded-sm bg-vh-gold px-5 py-2.5 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <button
          className="lg:hidden text-vh-cream"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-vh-line bg-vh-black px-6 py-4 flex flex-col gap-4 text-sm">
          {[...NAV_LINKS, { label: "Contact Us", to: "/contact" }].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
