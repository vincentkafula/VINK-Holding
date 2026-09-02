const BLOCKS = [
  {
    id: "investors",
    eyebrow: "Investors",
    title: "Transparent Governance, Steady Returns",
    body: "We report performance across all six sectors with the same discipline institutional investors expect, backed by strong governance and a long-term capital allocation strategy.",
  },
  {
    id: "sustainability",
    eyebrow: "Sustainability",
    title: "Growth That Doesn't Cost the Future",
    body: "Every subsidiary operates against group-wide environmental and social standards, from renewable energy investment to responsible land use in agriculture.",
  },
  {
    id: "careers",
    eyebrow: "Careers",
    title: "Build Your Career Across Six Industries",
    body: "With 2,500+ employees and 20+ subsidiary companies, Vink Holdings offers career paths that move across sectors, not just up a single ladder.",
  },
];

export default function SupportingSections() {
  return (
    <section className="px-6 lg:px-8 py-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
      {BLOCKS.map((block) => (
        <div key={block.id} id={block.id} className="scroll-mt-24 rounded-sm border border-vh-line bg-vh-forest-card p-6">
          <p className="text-vh-gold text-xs tracking-[0.2em] mb-3">{block.eyebrow.toUpperCase()}</p>
          <h3 className="font-display text-lg text-vh-cream leading-snug">{block.title}</h3>
          <p className="mt-3 text-xs text-vh-cream/60 leading-relaxed">{block.body}</p>
        </div>
      ))}
    </section>
  );
}
