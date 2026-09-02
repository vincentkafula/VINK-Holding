import { useEffect, useState } from "react";
import { Globe, Building2, Users, BarChart3, MapPin } from "lucide-react";
import { getStats } from "../api.js";

const ICONS = {
  globe: Globe,
  building: Building2,
  users: Users,
  "bar-chart": BarChart3,
  "map-pin": MapPin,
};

export default function StatsBar() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats([]));
  }, []);

  if (!stats.length) return null;

  return (
    <div className="mx-6 lg:mx-8 max-w-7xl xl:mx-auto rounded-sm border border-vh-line bg-vh-forest-light">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y divide-vh-line lg:divide-y-0 lg:divide-x">
        {stats.map((stat) => {
          const Icon = ICONS[stat.icon] || Globe;
          return (
            <div key={stat.id} className="flex items-center gap-3 px-6 py-6">
              <div className="w-11 h-11 rounded-full bg-vh-forest-card flex items-center justify-center shrink-0">
                <Icon size={18} className="text-vh-gold" />
              </div>
              <div>
                <p className="font-display text-xl text-vh-cream leading-none">{stat.value}</p>
                <p className="text-xs text-vh-cream/60 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
