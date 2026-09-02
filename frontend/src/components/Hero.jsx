import { useEffect, useState } from "react";
import { Play } from "lucide-react";

const SLIDES = [
  {
    eyebrow: "Diverse Businesses. Stronger Together.",
    heading: "Building Sustainable\nValue Across Generations",
    body: "Vink Holdings is a diversified holding company committed to driving growth, innovation, and positive impact across key industries and communities.",
  },
  {
    eyebrow: "Six Sectors. One Vision.",
    heading: "Real Assets Behind\nEvery Business We Build",
    body: "From real estate to energy, agriculture to financial services, every sector we invest in is built to compound value over decades, not quarters.",
  },
  {
    eyebrow: "Governance & Growth.",
    heading: "Strong Foundations for\nLong-Term Partnership",
    body: "Our governance and investment discipline give partners and shareholders the confidence to grow alongside us across the region.",
  },
  {
    eyebrow: "People at the Centre.",
    heading: "2,500+ People Driving\nRegional Impact Daily",
    body: "Our subsidiaries employ thousands of people across the region, building careers and communities as they build our businesses.",
  },
];

export default function Hero({ onWatchVideo }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section id="home" className="relative overflow-hidden border-b border-vh-line">
      {/* backdrop */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stopColor="#e8934f" />
              <stop offset="22%" stopColor="#c9713f" />
              <stop offset="45%" stopColor="#6b4632" />
              <stop offset="70%" stopColor="#233524" />
              <stop offset="100%" stopColor="#0a1710" />
            </linearGradient>
            <linearGradient id="fadeLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a1710" stopOpacity="1" />
              <stop offset="42%" stopColor="#0a1710" stopOpacity="0.94" />
              <stop offset="70%" stopColor="#0a1710" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0a1710" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="sunGlow" cx="72%" cy="18%" r="45%">
              <stop offset="0%" stopColor="#f5b56a" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f5b56a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="waterFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a1710" stopOpacity="0" />
              <stop offset="100%" stopColor="#0a1710" stopOpacity="1" />
            </linearGradient>
          </defs>

          <rect width="1440" height="800" fill="url(#skyGrad)" />
          <rect width="1440" height="800" fill="url(#sunGlow)" />

          {/* far skyline, low contrast */}
          {Array.from({ length: 20 }).map((_, i) => {
            const x = 480 + i * 52 + (i % 5) * 6;
            const w = 20 + (i % 3) * 6;
            const h = 90 + ((i * 41) % 160);
            return <rect key={`f-${i}`} x={x} y={640 - h} width={w} height={h} fill="#2c2f3a" opacity="0.5" />;
          })}

          {/* main skyline, varied heights, taller central towers */}
          {[
            { x: 560, w: 34, h: 260 }, { x: 604, w: 46, h: 400 }, { x: 660, w: 30, h: 220 },
            { x: 700, w: 54, h: 460 }, { x: 764, w: 26, h: 200 }, { x: 800, w: 40, h: 340 },
            { x: 850, w: 60, h: 500 }, { x: 920, w: 32, h: 250 }, { x: 962, w: 44, h: 380 },
            { x: 1016, w: 28, h: 210 }, { x: 1054, w: 50, h: 420 }, { x: 1114, w: 34, h: 280 },
            { x: 1158, w: 42, h: 350 }, { x: 1210, w: 30, h: 230 }, { x: 1250, w: 46, h: 390 },
            { x: 1306, w: 32, h: 260 }, { x: 1348, w: 38, h: 310 }, { x: 1396, w: 28, h: 220 },
          ].map((b, i) => (
            <rect key={`m-${i}`} x={b.x} y={640 - b.h} width={b.w} height={b.h} fill={i % 2 === 0 ? "#0f1f18" : "#16281d"} />
          ))}

          {/* lit windows scattered across towers */}
          {Array.from({ length: 220 }).map((_, i) => {
            const x = 560 + ((i * 37) % 850);
            const y = 220 + ((i * 53) % 400);
            return (
              <rect
                key={`w-${i}`}
                x={x}
                y={y}
                width="3.5"
                height="5"
                fill="#f4d99a"
                opacity={0.2 + ((i * 17) % 55) / 100}
              />
            );
          })}

          {/* water reflection band */}
          <rect x="560" y="640" width="880" height="90" fill="#1a2a20" opacity="0.5" />
          <rect x="560" y="640" width="880" height="160" fill="url(#waterFade)" />

          <rect width="1440" height="800" fill="url(#fadeLeft)" />
        </svg>
      </div>

      <div className="relative px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 max-w-7xl mx-auto">
        <p className="text-vh-gold text-xs tracking-[0.2em] font-medium mb-5">{slide.eyebrow.toUpperCase()}</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] max-w-2xl whitespace-pre-line text-vh-cream">
          {slide.heading}
        </h1>
        <div className="mt-6 h-px w-16 bg-vh-gold" />
        <p className="mt-6 max-w-md text-vh-cream/75 text-base leading-relaxed">{slide.body}</p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-sm bg-vh-gold px-6 py-3 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
          >
            About Vink Holdings →
          </a>
          <button
            onClick={onWatchVideo}
            className="flex items-center gap-2 rounded-sm border border-vh-cream/30 px-6 py-3 text-sm font-medium text-vh-cream hover:border-vh-gold hover:text-vh-gold transition-colors"
          >
            <Play size={16} /> Watch Corporate Video
          </button>
        </div>

        <div className="mt-14 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-vh-gold" : "w-2 bg-vh-cream/30 hover:bg-vh-cream/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
