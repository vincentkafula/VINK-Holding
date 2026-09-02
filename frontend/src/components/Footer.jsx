import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Send, ArrowUp, Loader2 } from "lucide-react";
import LogoMark from "./Logo.jsx";
import { LinkedinIcon, TwitterIcon, FacebookIcon, YoutubeIcon } from "./SocialIcons.jsx";
import { subscribeNewsletter } from "../api.js";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Leadership", to: "/about#leadership" },
      { label: "Governance", to: "/about#governance" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Our Businesses",
    links: [
      { label: "Real Estate & Development", to: "/businesses/real-estate" },
      { label: "Financial Services", to: "/businesses/financial-services" },
      { label: "Agriculture & Agro-Processing", to: "/businesses/agriculture" },
      { label: "Trading & Distribution", to: "/businesses/trading-distribution" },
      { label: "Energy & Infrastructure", to: "/businesses/energy-infrastructure" },
      { label: "Hospitality & Services", to: "/businesses/hospitality" },
    ],
  },
  {
    title: "Investors",
    links: [
      { label: "Investor Overview", to: "/investors" },
      { label: "Financial Reports", to: "/investors#reports" },
      { label: "Shareholder Information", to: "/investors#governance" },
      { label: "News & Announcements", to: "/news" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ status: "idle", message: "" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setState({ status: "loading", message: "" });
    try {
      const res = await subscribeNewsletter(email);
      setState({ status: "success", message: res.message });
      setEmail("");
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  };

  return (
    <footer className="border-t border-vh-line">
      <div className="px-6 lg:px-8 pt-16 pb-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <LogoMark size={40} />
              <span className="leading-tight">
                <span className="block font-display text-base text-vh-cream">VINK</span>
                <span className="block text-[10px] tracking-[0.25em] text-vh-gold -mt-1">HOLDINGS</span>
              </span>
            </Link>
            <p className="mt-4 text-xs text-vh-cream/60 leading-relaxed max-w-[220px]">
              Building sustainable value across generations through diverse businesses and strategic investments in seven African markets.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[LinkedinIcon, TwitterIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Social link"
                  className="w-8 h-8 rounded-full border border-vh-line flex items-center justify-center text-vh-cream/70 hover:text-vh-gold hover:border-vh-gold transition-colors"
                >
                  <Icon width={14} height={14} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs tracking-[0.15em] text-vh-gold mb-4">{col.title.toUpperCase()}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-xs text-vh-cream/65 hover:text-vh-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs tracking-[0.15em] text-vh-gold mb-4">CONTACT US</h4>
            <ul className="space-y-3 text-xs text-vh-cream/65">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-vh-gold" />
                Stand No. 1234, Independence Ave, Lusaka, Zambia
              </li>
              <li>
                <a href="tel:+260971234567" className="flex items-center gap-2 hover:text-vh-gold transition-colors">
                  <Phone size={14} className="text-vh-gold" /> +260 97 123 4567
                </a>
              </li>
              <li>
                <a href="mailto:info@vinkholdings.com" className="flex items-center gap-2 hover:text-vh-gold transition-colors">
                  <Mail size={14} className="text-vh-gold" /> info@vinkholdings.com
                </a>
              </li>
              <li>
                <Link to="/contact" className="inline-block mt-1 text-vh-gold hover:text-vh-gold-light">
                  Full contact page →
                </Link>
              </li>
            </ul>

            <div className="mt-6 rounded-sm border border-vh-line p-4">
              <p className="text-xs tracking-[0.15em] text-vh-gold">STAY CONNECTED</p>
              <p className="text-[11px] text-vh-cream/55 mt-1">Subscribe to our newsletter</p>
              <form onSubmit={handleSubscribe} className="mt-3 flex items-stretch gap-0">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 bg-vh-black/40 border border-vh-line border-r-0 rounded-l-sm px-3 py-2 text-xs text-vh-cream placeholder:text-vh-cream/40 focus:outline-none focus:border-vh-gold"
                />
                <button
                  type="submit"
                  disabled={state.status === "loading"}
                  aria-label="Subscribe"
                  className="rounded-r-sm bg-vh-gold px-3 flex items-center justify-center text-vh-black hover:bg-vh-gold-light transition-colors disabled:opacity-60"
                >
                  {state.status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
              {state.status === "success" && <p className="mt-2 text-[11px] text-vh-green-accent">{state.message}</p>}
              {state.status === "error" && <p className="mt-2 text-[11px] text-red-400">{state.message}</p>}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-vh-line flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-vh-cream/50">
          <p>© 2025 Vink Holdings. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-vh-gold">Privacy Policy</a>
            <span>|</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-vh-gold">Terms of Use</a>
            <span>|</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-vh-gold">Sitemap</a>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 hover:text-vh-gold transition-colors"
          >
            Back to Top <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
