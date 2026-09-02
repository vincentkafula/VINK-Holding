import { CheckCircle2 } from "lucide-react";

const POINTS = ["Strong Governance", "Innovation Driven", "Sustainable Growth", "People Focused"];

export default function WhyPartner({ onLearnMore }) {
  return (
    <section id="about" className="px-6 lg:px-8 py-24 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">WHY PARTNER WITH US</p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight text-vh-cream">
            A Legacy of Excellence.
            <br />A Future of Possibilities.
          </h2>
          <div className="mt-5 h-px w-16 bg-vh-gold" />
          <p className="mt-6 text-vh-cream/70 leading-relaxed max-w-md">
            We combine strategic insight, operational excellence and a commitment to sustainability
            to create long-term value for our stakeholders.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
            {POINTS.map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm text-vh-cream/85">
                <CheckCircle2 size={16} className="text-vh-green-accent shrink-0" />
                {point}
              </div>
            ))}
          </div>

          <button
            onClick={onLearnMore}
            className="mt-9 rounded-sm bg-vh-gold px-6 py-3 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
          >
            Learn More About Us →
          </button>
        </div>

        <div className="relative rounded-sm overflow-hidden border border-vh-line h-80 lg:h-[420px]">
          <svg viewBox="0 0 700 500" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="skyOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8a862" />
                <stop offset="45%" stopColor="#7a5138" />
                <stop offset="100%" stopColor="#182a20" />
              </linearGradient>
              <linearGradient id="roomFloor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e1c14" />
                <stop offset="100%" stopColor="#060d09" />
              </linearGradient>
              <linearGradient id="glowIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0b56e" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f0b56e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* window band with sunset skyline outside */}
            <rect width="700" height="240" fill="url(#skyOut)" />
            {[70, 130, 210, 290, 360, 430, 500, 570, 630].map((x, i) => (
              <rect key={i} x={x} y={240 - (60 + (i % 4) * 30)} width="30" height={60 + (i % 4) * 30} fill="#111d16" opacity="0.85" />
            ))}
            <rect width="700" height="240" fill="url(#glowIn)" />

            {/* room + floor */}
            <rect y="240" width="700" height="260" fill="url(#roomFloor)" />

            {/* mullions */}
            {Array.from({ length: 9 }).map((_, i) => (
              <rect key={`mul-${i}`} x={40 + i * 76} y="10" width="5" height="230" fill="#060d09" opacity="0.9" />
            ))}

            {/* ceiling light line */}
            <rect x="40" y="6" width="620" height="4" fill="#f0b56e" opacity="0.5" />

            {/* conference table */}
            <ellipse cx="350" cy="360" rx="230" ry="42" fill="#2a1c10" />
            <ellipse cx="350" cy="352" rx="230" ry="40" fill="#3d2916" />
            <ellipse cx="350" cy="352" rx="200" ry="30" fill="#4a3319" opacity="0.6" />

            {/* chairs around table */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const cx = 350 + Math.cos(angle) * 250;
              const cy = 360 + Math.sin(angle) * 55;
              return <rect key={`ch-${i}`} x={cx - 12} y={cy - 16} width="24" height="34" rx="4" fill="#141210" opacity="0.9" />;
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
