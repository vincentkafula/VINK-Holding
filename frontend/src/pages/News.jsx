import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import { getNews } from "../api.js";

const CATEGORY_COLORS = {
  Corporate: "bg-vh-green-accent",
  Sustainability: "bg-[#b5622f]",
  Community: "bg-vh-green-accent",
};
const HUES = ["#182a2c", "#22301a", "#241c2e", "#2c2418", "#1a2436"];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function News() {
  const [news, setNews] = useState([]);
  const [status, setStatus] = useState("loading");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    getNews()
      .then((data) => {
        setNews(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(news.map((n) => n.category))], [news]);
  const filtered = category === "All" ? news : news.filter((n) => n.category === category);

  return (
    <>
      <PageBanner
        eyebrow="News & Updates"
        title="Announcements From Across the Group"
        blurb="Corporate results, sustainability milestones, and community initiatives from Vink Holdings and its subsidiaries."
      />
      <SlidingAdverts />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                category === c
                  ? "bg-vh-gold text-vh-black border-vh-gold"
                  : "border-vh-line text-vh-cream/70 hover:border-vh-gold hover:text-vh-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {status === "loading" && (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-sm bg-vh-forest-card animate-pulse" />
            ))}
          </div>
        )}

        {status === "ready" && (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <article
                key={item.id}
                className="rounded-sm border border-vh-line bg-vh-forest-card overflow-hidden hover:border-vh-gold/50 transition-colors"
              >
                <div className="h-40 relative" style={{ background: `linear-gradient(135deg, ${HUES[i % HUES.length]}, #0e2118)` }}>
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
                  <p className="mt-2 text-xs text-vh-cream/55 leading-relaxed line-clamp-2">{item.excerpt}</p>
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
    </>
  );
}
