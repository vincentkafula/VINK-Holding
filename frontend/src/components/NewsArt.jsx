const ARTS = {
  Corporate: (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="news-corp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8934f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0a1710" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#news-corp)" />
      {[10, 45, 80, 115, 150, 185, 220, 255].map((x, i) => (
        <rect key={i} x={x} y={160 - (40 + (i % 4) * 26)} width="24" height={40 + (i % 4) * 26} fill="#0f1f18" />
      ))}
      {Array.from({ length: 40 }).map((_, i) => (
        <rect key={`w${i}`} x={14 + ((i * 19) % 260)} y={60 + ((i * 13) % 90)} width="3" height="4" fill="#f4d99a" opacity="0.35" />
      ))}
    </svg>
  ),
  Sustainability: (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="news-sus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0b56e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#12210f" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#news-sus)" />
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={10 + col * 48}
            y={40 + row * 26}
            width="42"
            height="20"
            fill="#1c2e3a"
            stroke="#2a4356"
            strokeWidth="1"
          />
        ))
      )}
    </svg>
  ),
  Community: (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="news-com" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c4030" />
          <stop offset="100%" stopColor="#0a1710" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#news-com)" />
      {[90, 150, 210].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={70 - (i % 2) * 8} r="16" fill="#3a5a40" opacity="0.9" />
          <rect x={cx - 22} y={90 - (i % 2) * 8} width="44" height="50" rx="10" fill="#3a5a40" opacity="0.9" />
        </g>
      ))}
    </svg>
  ),
};

export default function NewsArt({ category }) {
  return ARTS[category] || ARTS.Corporate;
}
