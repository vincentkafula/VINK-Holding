import { Link } from "react-router-dom";

export default function ClosingCTA() {
  return (
    <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
      <div className="rounded-sm border border-vh-line bg-vh-forest-light p-10 text-center">
        <h2 className="font-display text-2xl sm:text-3xl text-vh-cream leading-tight max-w-2xl mx-auto">
          Whether you're allocating capital, building a partnership, or building a career — start here.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact?subject=Investor+Enquiry"
            className="rounded-sm bg-vh-gold px-6 py-3 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
          >
            Contact Investor Relations →
          </Link>
          <Link
            to="/careers"
            className="rounded-sm border border-vh-cream/30 px-6 py-3 text-sm font-medium text-vh-cream hover:border-vh-gold hover:text-vh-gold transition-colors"
          >
            Explore Careers →
          </Link>
          <Link
            to="/contact?subject=Partnership+Enquiry"
            className="rounded-sm border border-vh-cream/30 px-6 py-3 text-sm font-medium text-vh-cream hover:border-vh-gold hover:text-vh-gold transition-colors"
          >
            Partner With Us →
          </Link>
        </div>
      </div>
    </section>
  );
}
