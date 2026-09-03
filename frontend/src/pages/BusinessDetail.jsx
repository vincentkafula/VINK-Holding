import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, TrendingUp, Leaf, ShoppingCart, Zap, Users, MapPin, ArrowLeft } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import { getSector } from "../api.js";

const ICONS = {
  building: Building2,
  "trending-up": TrendingUp,
  leaf: Leaf,
  "shopping-cart": ShoppingCart,
  zap: Zap,
  users: Users,
};

export default function BusinessDetail() {
  const { id } = useParams();
  const [sector, setSector] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    getSector(id)
      .then((data) => {
        setSector(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") {
    return <div className="px-6 lg:px-8 py-24 max-w-3xl mx-auto text-center text-vh-cream/60 text-sm">Loading sector…</div>;
  }

  if (status === "error" || !sector) {
    return (
      <div className="px-6 lg:px-8 py-24 max-w-3xl mx-auto text-center">
        <p className="text-vh-cream/70">We couldn't find that business sector.</p>
        <Link to="/businesses" className="mt-4 inline-block text-vh-gold hover:text-vh-gold-light text-sm">
          ← Back to Our Businesses
        </Link>
      </div>
    );
  }

  const Icon = ICONS[sector.icon] || Building2;

  return (
    <>
      <PageBanner eyebrow="Our Businesses" title={sector.name} blurb={sector.statLedSubhead || sector.shortDescription} />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <Link to="/businesses" className="inline-flex items-center gap-1.5 text-xs text-vh-cream/60 hover:text-vh-gold mb-8">
          <ArrowLeft size={13} /> Back to Our Businesses
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="w-14 h-14 rounded-full bg-vh-gold flex items-center justify-center mb-6">
              <Icon size={24} className="text-vh-black" />
            </div>
            <p className="text-vh-cream/75 leading-relaxed text-base">{sector.description}</p>

            <div className="mt-8">
              <p className="text-xs tracking-[0.15em] text-vh-gold mb-3">SUBSIDIARY COMPANIES</p>
              <ul className="space-y-2">
                {sector.subsidiaries?.map((s) => (
                  <li key={s} className="text-sm text-vh-cream/80 border-b border-vh-line pb-2">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <p className="text-xs tracking-[0.15em] text-vh-gold mb-3">MARKETS</p>
              <div className="flex flex-wrap gap-2">
                {sector.markets?.map((m) => (
                  <span
                    key={m}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-vh-line text-vh-cream/70"
                  >
                    <MapPin size={11} className="text-vh-gold" /> {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-vh-line bg-vh-forest-card p-6 h-fit">
            <p className="text-xs tracking-[0.15em] text-vh-gold mb-4">SECTOR AT A GLANCE</p>
            <dl className="space-y-4">
              {sector.stats?.map((stat) => (
                <div key={stat.label} className="border-b border-vh-line pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs text-vh-cream/60">{stat.label}</dt>
                  <dd className="font-display text-xl text-vh-cream mt-0.5">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              to={`/contact?subject=Partnership+Enquiry&sector=${encodeURIComponent(sector.name)}`}
              className="mt-6 block text-center rounded-sm bg-vh-gold px-5 py-2.5 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
            >
              {sector.ctaLabel || "Discuss this sector →"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
