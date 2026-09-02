import { useEffect, useState } from "react";
import { Building2, TrendingUp, Leaf, ShoppingCart, Zap, Users, ArrowRight } from "lucide-react";
import { getSectors } from "../api.js";

const ICONS = {
  building: Building2,
  "trending-up": TrendingUp,
  leaf: Leaf,
  "shopping-cart": ShoppingCart,
  zap: Zap,
  users: Users,
};

const FALLBACK_IMAGE_HUES = ["#1d3324", "#1a2b3d", "#2c3018", "#1d2530", "#3d2f14", "#182a2c"];
const ICON_BG = ["bg-vh-gold", "bg-vh-green-accent", "bg-vh-gold", "bg-vh-green-accent", "bg-vh-gold", "bg-vh-green-accent"];

export default function BusinessSectors({ onSelect }) {
  const [sectors, setSectors] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getSectors()
      .then((data) => {
        setSectors(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section id="sectors" className="px-6 lg:px-8 py-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-vh-line" />
        <h2 className="text-xs tracking-[0.2em] text-vh-gold whitespace-nowrap">OUR BUSINESS SECTORS</h2>
        <div className="h-px flex-1 bg-vh-line" />
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-sm bg-vh-forest-card animate-pulse" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="text-center text-vh-cream/60 text-sm">
          Unable to load business sectors right now. Please refresh the page.
        </p>
      )}

      {status === "ready" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sectors.map((sector, i) => {
            const Icon = ICONS[sector.icon] || Building2;
            return (
              <button
                key={sector.id}
                onClick={() => onSelect(sector)}
                className="group text-left rounded-sm border border-vh-line bg-vh-forest-card overflow-hidden hover:border-vh-gold/60 transition-colors"
              >
                <div
                  className="h-28 relative flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${FALLBACK_IMAGE_HUES[i % 6]}, #0e2118)` }}
                >
                  <div className={`absolute top-2 left-2 w-9 h-9 rounded-full ${ICON_BG[i % 6]} flex items-center justify-center`}>
                    <Icon size={17} className="text-vh-black" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-vh-cream leading-snug">{sector.name}</h3>
                  <p className="mt-2 text-xs text-vh-cream/60 leading-relaxed line-clamp-3">{sector.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-vh-green-accent group-hover:text-vh-gold transition-colors">
                    Explore <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
