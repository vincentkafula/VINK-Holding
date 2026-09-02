import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BLOCKS = [
  {
    to: "/investors",
    eyebrow: "Investors",
    title: "Transparent Governance, Steady Returns",
    body: "We report performance across all six sectors with the same discipline institutional investors expect, backed by strong governance and a long-term capital allocation strategy.",
  },
  {
    to: "/sustainability",
    eyebrow: "Sustainability",
    title: "Growth That Doesn't Cost the Future",
    body: "Every subsidiary operates against group-wide environmental and social standards, from renewable energy investment to responsible land use in agriculture.",
  },
  {
    to: "/careers",
    eyebrow: "Careers",
    title: "Build Your Career Across Six Industries",
    body: "With 2,500+ employees and 20+ subsidiary companies, Vink Holdings offers career paths that move across sectors, not just up a single ladder.",
  },
];

export default function SupportingSections() {
  return (
    <section className="px-6 lg:px-8 py-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
      {BLOCKS.map((block) => (
        <Link
          key={block.to}
          to={block.to}
          className="group scroll-mt-24 rounded-sm border border-vh-line bg-vh-forest-card p-6 hover:border-vh-gold/50 transition-colors"
        >
          <p className="text-vh-gold text-xs tracking-[0.2em] mb-3">{block.eyebrow.toUpperCase()}</p>
          <h3 className="font-display text-lg text-vh-cream leading-snug">{block.title}</h3>
          <p className="mt-3 text-xs text-vh-cream/60 leading-relaxed">{block.body}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs text-vh-green-accent group-hover:text-vh-gold transition-colors">
            Learn more <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      ))}
    </section>
  );
}
