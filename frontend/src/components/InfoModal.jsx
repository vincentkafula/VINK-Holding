import { X } from "lucide-react";

export default function InfoModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-sm border border-vh-line bg-vh-forest max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-vh-line">
          <h3 className="font-display text-lg text-vh-cream pr-4">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-vh-cream/60 hover:text-vh-gold shrink-0">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 text-sm text-vh-cream/75 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
