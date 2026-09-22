import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="px-6 lg:px-8 py-32 max-w-2xl mx-auto text-center">
      <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">404</p>
      <h1 className="font-display text-3xl text-vh-cream">Page not found</h1>
      <p className="mt-4 text-vh-cream/60">The page you're looking for doesn't exist or may have moved.</p>
      <Link
        to="/"
        className="btn-gold mt-8"
      >
        Back to Home →
      </Link>
    </div>
  );
}
