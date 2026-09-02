import { useEffect, useState } from "react";
import { Mail, Phone, Menu, X } from "lucide-react";
import LogoMark from "./Logo.jsx";
import { LinkedinIcon, TwitterIcon, FacebookIcon } from "./SocialIcons.jsx";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Businesses", href: "#sectors" },
  { label: "Investors", href: "#investors" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Careers", href: "#careers" },
  { label: "News", href: "#news" },
  { label: "Contact Us", href: "#contact" },
];

export default function Header({ onOpenContact, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    if (href === "#contact") {
      onOpenContact();
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-vh-black/95 backdrop-blur border-b border-vh-line" : "bg-vh-black/70 backdrop-blur"
      }`}
    >
      {/* top strip */}
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

      {/* main nav */}
      <div className="flex items-center justify-between px-6 lg:px-8 py-4">
        <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex items-center gap-3 shrink-0">
          <LogoMark size={44} />
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-wide text-vh-cream">VINK</span>
            <span className="block text-[10px] tracking-[0.25em] text-vh-gold -mt-1">HOLDINGS</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {NAV_LINKS.slice(0, -1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`transition-colors hover:text-vh-gold ${
                activeSection === link.href.slice(1) ? "text-vh-gold" : "text-vh-cream/85"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <button
            onClick={onOpenContact}
            className="rounded-sm bg-vh-gold px-5 py-2.5 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
          >
            Contact Us
          </button>
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-vh-cream/85 hover:text-vh-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
