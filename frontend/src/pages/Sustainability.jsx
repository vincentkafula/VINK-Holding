import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Sprout, HeartHandshake, ShieldCheck } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import { getSustainability } from "../api.js";

const ICONS = [Sun, Sprout, HeartHandshake, ShieldCheck];

export default function Sustainability() {
  const [pillars, setPillars] = useState([]);

  useEffect(() => {
    getSustainability()
      .then((data) => setPillars(data.pillars || []))
      .catch(() => setPillars([]));
  }, []);

  return (
    <>
      <PageBanner
        eyebrow="Sustainability"
        title="Sustainability You Can Verify, Not Just Claim"
        blurb="Every subsidiary tracks its own environmental and social data against group-wide targets — here's what that adds up to."
      />
      <SlidingAdverts />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={pillar.title} className="rounded-sm border border-vh-line bg-vh-forest-card p-6">
                <div className="w-11 h-11 rounded-full bg-vh-gold flex items-center justify-center">
                  <Icon size={19} className="text-vh-black" />
                </div>
                <p className="mt-4 font-display text-lg text-vh-cream leading-snug">{pillar.stat}</p>
                <p className="mt-1 text-xs tracking-[0.1em] text-vh-gold">{pillar.title.toUpperCase()}</p>
                <p className="mt-3 text-sm text-vh-cream/65 leading-relaxed">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="rounded-sm border border-vh-line bg-vh-forest-light p-8">
          <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">OUR APPROACH</p>
          <h2 className="font-display text-2xl text-vh-cream leading-tight max-w-xl">
            Sustainability reporting is coordinated centrally, delivered locally
          </h2>
          <p className="mt-4 text-sm text-vh-cream/70 leading-relaxed max-w-2xl">
            Each subsidiary tracks its own environmental and social data — energy use, emissions, water,
            community spend, and safety incidents — against group-wide targets set by our Group Head of
            Sustainability. This data rolls up into our annual Group ESG & Sustainability Report, available
            to shareholders and partners via the Investors section.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-16 max-w-7xl mx-auto text-center">
        <h2 className="font-display text-xl text-vh-cream">Doing ESG diligence on a potential partnership?</h2>
        <Link
          to="/investors#reports"
          className="mt-6 inline-block rounded-sm bg-vh-gold px-6 py-3 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
        >
          Download the Group ESG & Sustainability Report →
        </Link>
      </section>
    </>
  );
}
