import { useEffect, useState } from "react";
import { MapPin, CheckCircle2 } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import { getCompany, getMarkets, getLeadership } from "../api.js";

export default function About() {
  const [company, setCompany] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [governance, setGovernance] = useState([]);

  useEffect(() => {
    getCompany().then(setCompany).catch(() => {});
    getMarkets().then(setMarkets).catch(() => {});
    getLeadership()
      .then((data) => {
        setLeadership(data.leadership || []);
        setGovernance(data.governance || []);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageBanner
        eyebrow="About Us"
        title="Two Decades of Disciplined, Diversified Growth"
        blurb="Vink Holdings builds and acquires businesses that compound value over decades — not just across one industry, but across the industries that African economies are built on."
      />
      <SlidingAdverts />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">OUR STORY</p>
          <h2 className="font-display text-2xl sm:text-3xl text-vh-cream leading-tight">
            Founded in {company?.founded || "2011"}, headquartered in {company?.headquarters || "Lusaka, Zambia"}
          </h2>
          <div className="mt-5 h-px w-16 bg-vh-gold" />
          <p className="mt-6 text-vh-cream/75 leading-relaxed">
            {company?.description ||
              "Vink Holdings is a diversified holding company committed to driving growth, innovation, and positive impact across key industries and communities."}
          </p>
          <p className="mt-4 text-vh-cream/75 leading-relaxed">
            We don't chase every opportunity — we build where we can bring real operating capability: real estate
            and infrastructure where we can develop and manage assets directly, financial services where we can
            underwrite credit risk ourselves, and agriculture and trading businesses where regional logistics and
            distribution density create a durable advantage. Each subsidiary is run by an operating team with
            sector expertise, reporting into a lean group centre that focuses on capital allocation, risk, and
            governance rather than day-to-day management.
          </p>
        </div>

        <div className="rounded-sm border border-vh-line bg-vh-forest-card p-6 h-fit">
          <p className="text-xs tracking-[0.15em] text-vh-gold mb-4">AT A GLANCE</p>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-vh-line pb-3">
              <dt className="text-vh-cream/60">Founded</dt>
              <dd className="text-vh-cream">{company?.founded || "2011"}</dd>
            </div>
            <div className="flex justify-between border-b border-vh-line pb-3">
              <dt className="text-vh-cream/60">Headquarters</dt>
              <dd className="text-vh-cream text-right">{company?.headquarters || "Lusaka, Zambia"}</dd>
            </div>
            <div className="flex justify-between border-b border-vh-line pb-3">
              <dt className="text-vh-cream/60">Markets</dt>
              <dd className="text-vh-cream">{markets.length || 7} countries</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-vh-cream/60">Sectors</dt>
              <dd className="text-vh-cream">6</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-vh-line" />
          <h2 className="text-xs tracking-[0.2em] text-vh-gold whitespace-nowrap">OUR MARKETS</h2>
          <div className="h-px flex-1 bg-vh-line" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map((m) => (
            <div key={m.code} className="rounded-sm border border-vh-line bg-vh-forest-card p-5">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-vh-gold" />
                <h3 className="text-sm font-medium text-vh-cream">{m.country}</h3>
                <span className="ml-auto text-[10px] text-vh-cream/40">since {m.since}</span>
              </div>
              <p className="mt-3 text-xs text-vh-cream/60 leading-relaxed">{m.role}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.sectors.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full border border-vh-line text-vh-cream/60">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="leadership" className="scroll-mt-24 px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-vh-line" />
          <h2 className="text-xs tracking-[0.2em] text-vh-gold whitespace-nowrap">GROUP LEADERSHIP</h2>
          <div className="h-px flex-1 bg-vh-line" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((person) => (
            <div key={person.id} className="rounded-sm border border-vh-line bg-vh-forest-card p-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vh-gold to-vh-green-accent" />
              <h3 className="mt-4 text-sm font-medium text-vh-cream">{person.name}</h3>
              <p className="text-xs text-vh-gold mt-0.5">{person.role}</p>
              <p className="mt-3 text-xs text-vh-cream/60 leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="governance" className="scroll-mt-24 px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="rounded-sm border border-vh-line bg-vh-forest-light p-8">
          <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">GOVERNANCE</p>
          <h2 className="font-display text-2xl text-vh-cream leading-tight max-w-lg">
            Governance built for a diversified group, not a single business
          </h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl">
            {governance.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-vh-cream/80">
                <CheckCircle2 size={16} className="text-vh-green-accent shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
