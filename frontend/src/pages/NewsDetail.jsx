import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getArticle } from "../api.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    getArticle(id)
      .then((data) => {
        setArticle(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") {
    return <div className="px-6 lg:px-8 py-24 max-w-3xl mx-auto text-center text-vh-cream/60 text-sm">Loading article…</div>;
  }

  if (status === "error" || !article) {
    return (
      <div className="px-6 lg:px-8 py-24 max-w-3xl mx-auto text-center">
        <p className="text-vh-cream/70">We couldn't find that article.</p>
        <Link to="/news" className="mt-4 inline-block text-vh-gold hover:text-vh-gold-light text-sm">
          ← Back to News
        </Link>
      </div>
    );
  }

  return (
    <article className="px-6 lg:px-8 py-16 max-w-3xl mx-auto">
      <Link to="/news" className="inline-flex items-center gap-1.5 text-xs text-vh-cream/60 hover:text-vh-gold mb-8">
        <ArrowLeft size={13} /> Back to News
      </Link>

      <p className="text-vh-gold text-xs tracking-[0.2em] mb-4">
        {article.category.toUpperCase()} • {formatDate(article.date)}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-vh-cream leading-tight">{article.title}</h1>
      <div className="mt-6 h-px w-16 bg-vh-gold" />

      <div className="mt-8 space-y-5 text-vh-cream/80 leading-relaxed text-base">
        {article.body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-vh-line flex items-center justify-between">
        <Link to="/news" className="text-sm text-vh-gold hover:text-vh-gold-light">
          ← All News
        </Link>
        <Link to="/contact" className="text-sm text-vh-cream/60 hover:text-vh-gold">
          Media enquiries →
        </Link>
      </div>
    </article>
  );
}
