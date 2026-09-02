import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getAds } from "../api.js";

const THEME = {
  gold: { bg: "from-[#3d2f14] to-[#0e2118]", chip: "bg-vh-gold text-vh-black" },
  green: { bg: "from-[#152a1c] to-[#0e2118]", chip: "bg-vh-green-accent text-white" },
};

export default function SlidingAdverts() {
  const [ads, setAds] = useState([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    getAds()
      .then(setAds)
      .catch(() => setAds([]));
  }, []);

  const next = useCallback(() => setActive((i) => (ads.length ? (i + 1) % ads.length : 0)), [ads.length]);
  const prev = () => setActive((i) => (ads.length ? (i - 1 + ads.length) % ads.length : 0));

  useEffect(() => {
    if (paused || ads.length < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, ads.length]);

  if (!ads.length) return null;

  return (
    <section
      aria-label="Latest announcements"
      className="px-6 lg:px-8 py-3 max-w-7xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-sm border border-vh-line overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {ads.map((ad) => {
            const theme = THEME[ad.theme] || THEME.gold;
            return (
              <Link
                key={ad.id}
                to={ad.link}
                className={`min-w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r ${theme.bg} hover:brightness-110 transition-[filter]`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-sm ${theme.chip}`}>
                    {ad.eyebrow.toUpperCase()}
                  </span>
                  <p className="text-sm text-vh-cream truncate">
                    <span className="font-medium">{ad.title}</span>
                    <span className="hidden sm:inline text-vh-cream/60"> — {ad.body}</span>
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 text-xs text-vh-gold whitespace-nowrap">
                  {ad.cta} <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>

        {ads.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous announcement"
              className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 items-center justify-center text-vh-cream"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={next}
              aria-label="Next announcement"
              className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 items-center justify-center text-vh-cream"
            >
              <ChevronRight size={15} />
            </button>
          </>
        )}
      </div>

      {ads.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {ads.map((ad, i) => (
            <button
              key={ad.id}
              onClick={() => setActive(i)}
              aria-label={`Show announcement ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-vh-gold" : "w-1.5 bg-vh-cream/25 hover:bg-vh-cream/45"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
