export default function PageBanner({ eyebrow, title, blurb }) {
  return (
    <section className="relative overflow-hidden border-b border-vh-line">
      <div className="absolute inset-0">
        <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <linearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d2a17" />
              <stop offset="45%" stopColor="#1a2b20" />
              <stop offset="100%" stopColor="#0a1710" />
            </linearGradient>
          </defs>
          <rect width="1440" height="360" fill="url(#bannerGrad)" />
          {Array.from({ length: 16 }).map((_, i) => {
            const x = i * 92 + 20;
            const h = 60 + ((i * 47) % 160);
            return <rect key={i} x={x} y={360 - h} width="34" height={h} fill="#101f18" opacity="0.7" />;
          })}
        </svg>
      </div>
      <div className="relative px-6 lg:px-8 py-16 lg:py-20 max-w-7xl mx-auto">
        <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">{eyebrow.toUpperCase()}</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-vh-cream leading-tight max-w-2xl">{title}</h1>
        {blurb && <p className="mt-5 max-w-xl text-vh-cream/70 leading-relaxed">{blurb}</p>}
      </div>
    </section>
  );
}
