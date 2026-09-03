import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitContact } from "../api.js";

const SUBJECT_OPTIONS = ["Investor Enquiry", "Partnership Enquiry", "Media Enquiry", "Careers", "General Enquiry"];

export default function ContactForm({ compact = false }) {
  const [searchParams] = useSearchParams();
  const prefillSubject = searchParams.get("subject");
  const prefillSector = searchParams.get("sector");
  const validSubject = SUBJECT_OPTIONS.includes(prefillSubject) ? prefillSubject : "General Enquiry";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: validSubject,
    message: prefillSector ? `Re: ${prefillSector} — ` : "",
  });
  const [state, setState] = useState({ status: "idle", message: "", reference: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ status: "loading", message: "", reference: "" });
    try {
      const res = await submitContact(form);
      setState({ status: "success", message: res.message, reference: res.reference });
      setForm({ name: "", email: "", phone: "", subject: "General Enquiry", message: "" });
    } catch (err) {
      setState({ status: "error", message: err.message, reference: "" });
    }
  };

  if (state.status === "success") {
    return (
      <div className={`text-center ${compact ? "py-4" : "py-10"}`}>
        <CheckCircle2 size={40} className="mx-auto text-vh-green-accent" />
        <p className="mt-4 text-vh-cream">{state.message}</p>
        <p className="mt-2 text-xs text-vh-cream/50">Reference: {state.reference}</p>
        <button
          onClick={() => setState({ status: "idle", message: "", reference: "" })}
          className="mt-6 rounded-sm bg-vh-gold px-5 py-2.5 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
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
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-vh-cream/60">Phone</label>
          <input
            value={form.phone}
            onChange={update("phone")}
            className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream focus:outline-none focus:border-vh-gold"
          />
        </div>
        <div>
          <label className="text-xs text-vh-cream/60">Subject</label>
          <select
            value={form.subject}
            onChange={update("subject")}
            className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream focus:outline-none focus:border-vh-gold"
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-vh-forest text-vh-cream">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-vh-cream/60">Message *</label>
        <textarea
          required
          rows={compact ? 3 : 5}
          value={form.message}
          onChange={update("message")}
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
        Send Message
      </button>
    </form>
  );
}
