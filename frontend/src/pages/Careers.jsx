import { useEffect, useMemo, useState } from "react";
import { Briefcase, MapPin, Clock, Loader2, CheckCircle2, X } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import { getJobs, submitApplication } from "../api.js";

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverNote: "" });
  const [state, setState] = useState({ status: "idle", message: "", reference: "" });

  if (!job) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ status: "loading", message: "", reference: "" });
    try {
      const res = await submitApplication({ jobId: job.id, jobTitle: job.title, ...form });
      setState({ status: "success", message: res.message, reference: res.reference });
    } catch (err) {
      setState({ status: "error", message: err.message, reference: "" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-sm border border-vh-line bg-vh-forest max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-vh-line">
          <h3 className="font-display text-lg text-vh-cream pr-4">Apply — {job.title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-vh-cream/60 hover:text-vh-gold shrink-0">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {state.status === "success" ? (
            <div className="text-center py-6">
              <CheckCircle2 size={40} className="mx-auto text-vh-green-accent" />
              <p className="mt-4 text-vh-cream">{state.message}</p>
              <p className="mt-2 text-xs text-vh-cream/50">Reference: {state.reference}</p>
              <button
                onClick={onClose}
                className="mt-6 rounded-sm bg-vh-gold px-5 py-2.5 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-vh-cream/60">Full Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={update("name")}
                    className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream focus:outline-none focus:border-vh-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-vh-cream/60">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream focus:outline-none focus:border-vh-gold"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-vh-cream/60">Phone</label>
                <input
                  value={form.phone}
                  onChange={update("phone")}
                  className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream focus:outline-none focus:border-vh-gold"
                />
              </div>
              <div>
                <label className="text-xs text-vh-cream/60">Why you're a fit</label>
                <textarea
                  rows={4}
                  value={form.coverNote}
                  onChange={update("coverNote")}
                  className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream focus:outline-none focus:border-vh-gold resize-none"
                />
              </div>
              {state.status === "error" && <p className="text-xs text-red-400">{state.message}</p>}
              <button
                type="submit"
                disabled={state.status === "loading"}
                className="w-full rounded-sm bg-vh-gold px-5 py-3 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {state.status === "loading" && <Loader2 size={16} className="animate-spin" />}
                Submit Application
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [department, setDepartment] = useState("All");
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    getJobs()
      .then((data) => {
        setJobs(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const departments = useMemo(() => ["All", ...new Set(jobs.map((j) => j.department))], [jobs]);
  const filtered = department === "All" ? jobs : jobs.filter((j) => j.department === department);

  return (
    <>
      <PageBanner
        eyebrow="Careers"
        title="Build Your Career Across Six Industries"
        blurb="With 2,500+ employees and 20+ subsidiary companies, Vink Holdings offers career paths that move across sectors, not just up a single ladder."
      />
      <SlidingAdverts />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-vh-line" />
          <h2 className="text-xs tracking-[0.2em] text-vh-gold whitespace-nowrap">OPEN ROLES</h2>
          <div className="h-px flex-1 bg-vh-line" />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDepartment(d)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                department === d
                  ? "bg-vh-gold text-vh-black border-vh-gold"
                  : "border-vh-line text-vh-cream/70 hover:border-vh-gold hover:text-vh-gold"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {status === "loading" && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-sm bg-vh-forest-card animate-pulse" />
            ))}
          </div>
        )}

        {status === "ready" && (
          <div className="space-y-3">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-sm border border-vh-line bg-vh-forest-card p-5"
              >
                <div>
                  <h3 className="text-sm font-medium text-vh-cream">{job.title}</h3>
                  <p className="mt-1 text-xs text-vh-cream/60">{job.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-vh-cream/50">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={12} className="text-vh-gold" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-vh-gold" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-vh-gold" /> {job.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setApplyJob(job)}
                  className="shrink-0 rounded-sm bg-vh-gold px-5 py-2.5 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
                >
                  Apply Now
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-vh-cream/60 text-center py-8">No open roles in this department right now.</p>
            )}
          </div>
        )}
      </section>

      <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
    </>
  );
}
