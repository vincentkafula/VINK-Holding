import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import StatsBar from "../components/StatsBar.jsx";
import { getInvestorReports } from "../api.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Investors() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getInvestorReports()
      .then((data) => {
        setReports(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <>
      <PageBanner
        eyebrow="Investors"
        title="The Numbers, Not Just the Story"
        blurb="Group-wide financial controls, independent audit, and third-party assurance across every subsidiary — reported to the same standard we'd expect if we were listed."
      />
      <SlidingAdverts />

      <div className="py-4">
        <StatsBar />
      </div>

      <section id="reports" className="scroll-mt-24 px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-vh-line" />
          <h2 className="text-xs tracking-[0.2em] text-vh-gold whitespace-nowrap">FINANCIAL REPORTS</h2>
          <div className="h-px flex-1 bg-vh-line" />
        </div>

        {status === "ready" && reports.length > 0 && (
          <p className="text-sm text-vh-cream/60 mb-6">
            New here? Start with the <span className="text-vh-gold">FY2025 Annual Report</span> — everything else
            in this list builds on it.
          </p>
        )}

        {status === "loading" && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-sm bg-vh-forest-card animate-pulse" />
            ))}
          </div>
        )}

        {status === "ready" && (
          <div className="divide-y divide-vh-line border border-vh-line rounded-sm overflow-hidden">
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() =>
                  window.alert(
                    `${r.title}\n\nThis is a demo build — in production this would download the PDF from secure investor storage.`
                  )
                }
                className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-vh-forest-card hover:bg-vh-forest-light transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className="text-vh-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-vh-cream truncate">{r.title}</p>
                    <p className="text-xs text-vh-cream/50">
                      {r.type} • {formatDate(r.date)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 flex items-center gap-1.5 text-xs text-vh-gold">
                  <Download size={13} /> Download
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section id="governance" className="scroll-mt-24 px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 rounded-sm border border-vh-line bg-vh-forest-light p-8">
            <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">SHAREHOLDER INFORMATION</p>
            <h2 className="font-display text-xl text-vh-cream leading-tight">
              Built for institutional-grade diligence
            </h2>
            <p className="mt-3 text-sm text-vh-cream/70 leading-relaxed">
              Group-wide financial controls, an independent audit function, and third-party assurance on
              financial statements across all subsidiaries.
            </p>
          </div>
          <div className="md:col-span-3 rounded-sm border border-vh-gold/40 bg-vh-forest-card p-8">
            <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">INVESTOR RELATIONS</p>
            <h2 className="font-display text-2xl text-vh-cream leading-tight">
              Get the Group CFO's Office Directly
            </h2>
            <p className="mt-3 text-sm text-vh-cream/70 leading-relaxed">
              No account executive, no queue — investor enquiries go straight to the CFO's team.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="mailto:investor.relations@vinkholdings.com"
                className="text-vh-gold hover:text-vh-gold-light text-sm"
              >
                investor.relations@vinkholdings.com
              </a>
              <Link
                to="/contact?subject=Investor+Enquiry"
                className="rounded-sm bg-vh-gold px-6 py-3 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
              >
                Request a Call →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
