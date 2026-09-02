import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getNews } from "../api.js";
import NewsArt from "./NewsArt.jsx";

const CATEGORY_COLORS = {
  Corporate: "bg-vh-green-accent",
  Sustainability: "bg-[#b5622f]",
  Community: "bg-vh-green-accent",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NewsUpdates({ limit = 3 }) {
  const [news, setNews] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getNews()
      .then((data) => {
        setNews(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const items = limit ? news.slice(0, limit) : news;

  return (
    <section id="news" className="px-6 lg:px-8 py-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-vh-line" />
        <h2 className="text-xs tracking-[0.2em] text-vh-gold whitespace-nowrap">NEWS &amp; UPDATES</h2>
        <div className="h-px flex-1 bg-vh-line" />
        <Link
          to="/news"
          className="text-xs text-vh-gold hover:text-vh-gold-light whitespace-nowrap flex items-center gap-1 shrink-0"
        >
          View All News <ArrowRight size={12} />
        </Link>
      </div>

      {status === "loading" && (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-sm bg-vh-forest-card animate-pulse" />
          ))}
        </div>
      )}

      {status === "ready" && (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <article
              key={item.id}
              className="rounded-sm border border-vh-line bg-vh-forest-card overflow-hidden hover:border-vh-gold/50 transition-colors"
            >
              <div
                className="h-40 relative overflow-hidden"
              >
                <NewsArt category={item.category} />
                <span
                  className={`absolute top-3 left-3 text-[10px] tracking-wide font-medium text-white px-2.5 py-1 rounded-sm ${
                    CATEGORY_COLORS[item.category] || "bg-vh-green-accent"
                  }`}
                >
                  {item.category.toUpperCase()}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-medium text-vh-cream leading-snug">{item.title}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-vh-cream/50">
                  <span>{formatDate(item.date)}</span>
                  <span>•</span>
                  <Link to={`/news/${item.id}`} className="text-vh-gold hover:text-vh-gold-light">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
