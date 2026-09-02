import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { submitContact } from "../api.js";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ status: "idle", message: "", reference: "" });

  if (!open) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ status: "loading", message: "", reference: "" });
    try {
      const res = await submitContact(form);
      setState({ status: "success", message: res.message, reference: res.reference });
      setForm(initialForm);
    } catch (err) {
      setState({ status: "error", message: err.message, reference: "" });
    }
  };

  const handleClose = () => {
    setState({ status: "idle", message: "", reference: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg rounded-sm border border-vh-line bg-vh-forest max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-vh-line">
          <h3 className="font-display text-lg text-vh-cream">Contact Vink Holdings</h3>
          <button onClick={handleClose} aria-label="Close" className="text-vh-cream/60 hover:text-vh-gold">
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
                onClick={handleClose}
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
                  <input
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="General Enquiry"
                    className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream placeholder:text-vh-cream/30 focus:outline-none focus:border-vh-gold"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-vh-cream/60">Message *</label>
                <textarea
                  required
                  rows={4}
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
          )}
        </div>
      </div>
    </div>
  );
}
