import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        title="Built to Operate Six Industries — Not Just Own Them"
        blurb="Founded in 2011 in Lusaka, Zambia, Vink Holdings has grown into a diversified operating group across seven African markets — not by chasing every opportunity, but by building where we can bring real operating capability."
      />
      <SlidingAdverts />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">OUR STORY</p>
          <h2 className="font-display text-2xl sm:text-3xl text-vh-cream leading-tight">
            We'd rather be excellent at six sectors than mediocre across all of them
          </h2>
          <div className="mt-5 h-px w-16 bg-vh-gold" />
          <p className="mt-6 text-vh-cream/75 leading-relaxed">
            {company?.description ||
              "Vink Holdings is a diversified holding company committed to driving growth, innovation, and positive impact across key industries and communities."}
          </p>
          <p className="mt-4 text-vh-cream/75 leading-relaxed">
            We don't run a portfolio of passive stakes. Each subsidiary is led by an operating team with
            sector-specific expertise — property managers who manage buildings, credit officers who underwrite
            loans, agronomists who work fields — reporting into a lean group centre focused on capital allocation,
            risk, and governance rather than day-to-day management. A holding company that tries to run six
            industries centrally ends up mediocre at all of them; we'd rather be disciplined about which six
            we're in.
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
        <p className="text-sm text-vh-cream/60 -mt-6 mb-8 max-w-xl">
          Seven markets, chosen the same way we choose sectors: where we can bring real operating advantage, not
          just capital.
        </p>
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
          <p className="mt-3 text-sm text-vh-cream/60 max-w-lg">
            Governance built for a diversified group has to work differently than governance for a single
            business — here's what that looks like in practice:
          </p>
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

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto text-center">
        <h2 className="font-display text-2xl text-vh-cream">Want the detail behind these numbers?</h2>
        <Link
          to="/investors#reports"
          className="mt-6 inline-block rounded-sm bg-vh-gold px-6 py-3 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
        >
          Read Our Latest Investor Report →
        </Link>
      </section>
    </>
  );
}
