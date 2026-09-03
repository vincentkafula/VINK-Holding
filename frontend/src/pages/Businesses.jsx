import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, TrendingUp, Leaf, ShoppingCart, Zap, Users, ArrowRight } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import { getSectors } from "../api.js";

const ICONS = {
  building: Building2,
  "trending-up": TrendingUp,
  leaf: Leaf,
  "shopping-cart": ShoppingCart,
  zap: Zap,
  users: Users,
};

const HUES = ["#1d3324", "#1a2b3d", "#2c3018", "#1d2530", "#3d2f14", "#182a2c"];
const ICON_BG = ["bg-vh-gold", "bg-vh-green-accent", "bg-vh-gold", "bg-vh-green-accent", "bg-vh-gold", "bg-vh-green-accent"];

export default function Businesses() {
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
    <>
      <PageBanner
        eyebrow="Our Businesses"
        title="Six Sectors. Zero Overlap in How We Run Them."
        blurb="Every subsidiary has its own operating team, its own P&L, and its own sector expertise — what they share is group-level governance, capital discipline, and risk oversight."
      />
      <SlidingAdverts />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        {status === "loading" && (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-sm bg-vh-forest-card animate-pulse" />
            ))}
          </div>
        )}

        {status === "ready" && (
          <div className="grid md:grid-cols-2 gap-6">
            {sectors.map((sector, i) => {
              const Icon = ICONS[sector.icon] || Building2;
              return (
                <Link
                  key={sector.id}
                  to={`/businesses/${sector.id}`}
                  className="group flex gap-5 rounded-sm border border-vh-line bg-vh-forest-card p-6 hover:border-vh-gold/50 transition-colors"
                >
                  <div
                    className="w-14 h-14 rounded-sm shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${HUES[i % 6]}, #0e2118)` }}
                  >
                    <div className={`w-9 h-9 rounded-full ${ICON_BG[i % 6]} flex items-center justify-center`}>
                      <Icon size={17} className="text-vh-black" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg text-vh-cream">{sector.name}</h3>
                    <p className="mt-2 text-sm text-vh-cream/60 leading-relaxed line-clamp-2">{sector.shortDescription}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {sector.markets?.map((m) => (
                        <span key={m} className="text-[10px] px-2 py-0.5 rounded-full border border-vh-line text-vh-cream/50">
                          {m}
                        </span>
                      ))}
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-vh-gold">
                      View sector detail <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
