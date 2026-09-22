import { Link } from "react-router-dom";

export default function ClosingCTA() {
  return (
    <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
      <div className="panel-premium p-10 text-center">
        <h2 className="font-display text-2xl sm:text-3xl text-vh-cream leading-tight max-w-2xl mx-auto">
          Whether you're allocating capital, building a partnership, or building a career — start here.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact?subject=Investor+Enquiry"
            className="btn-gold"
          >
            Contact Investor Relations →
          </Link>
          <Link
            to="/careers"
            className="btn-outline"
          >
            Explore Careers →
          </Link>
          <Link
            to="/contact?subject=Partnership+Enquiry"
            className="btn-outline"
          >
            Partner With Us →
          </Link>
        </div>
      </div>
    </section>
  );
}
