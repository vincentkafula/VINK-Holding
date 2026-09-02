import { useEffect, useState } from "react";
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
        title="Growth That Doesn't Cost the Future"
        blurb="Every subsidiary operates against group-wide environmental and social standards, from renewable energy investment to responsible land use in agriculture."
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
                <h3 className="mt-4 font-display text-lg text-vh-cream">{pillar.title}</h3>
                <p className="mt-2 text-sm text-vh-cream/65 leading-relaxed">{pillar.body}</p>
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
    </>
  );
}
