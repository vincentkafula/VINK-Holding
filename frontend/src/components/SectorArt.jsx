const ARTS = {
  building: (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-building" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8a862" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0e2118" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#bg-building)" />
      {[20, 60, 100, 140, 180, 220, 260].map((x, i) => (
        <rect key={i} x={x} y={160 - (50 + (i % 3) * 30)} width="26" height={50 + (i % 3) * 30} fill="#0f1f18" opacity="0.85" />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={`w${i}`} x={26 + ((i * 17) % 260)} y={70 + ((i * 23) % 70)} width="3" height="4" fill="#f4d99a" opacity="0.4" />
      ))}
    </svg>
  ),
  "trending-up": (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-trend" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2b3d" />
          <stop offset="100%" stopColor="#0a1420" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#bg-trend)" />
      <polyline points="10,120 50,100 90,110 130,70 170,85 210,45 250,55 290,20" fill="none" stroke="#4fb0e8" strokeWidth="2.5" opacity="0.85" />
      {[20, 70, 120, 170, 220, 270].map((x, i) => (
        <rect key={i} x={x} y={160 - (30 + (i % 4) * 22)} width="14" height={30 + (i % 4) * 22} fill={i % 2 === 0 ? "#3fae5c" : "#c0453f"} opacity="0.7" />
      ))}
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b56b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1c2c14" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#bg-leaf)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={0} y={70 + i * 12} width="300" height="4" fill="#3c5a2a" opacity="0.5" />
      ))}
      <rect x="40" y="60" width="30" height="60" rx="3" fill="#2a3a1e" />
      <rect x="52" y="30" width="6" height="36" fill="#2a3a1e" />
    </svg>
  ),
  "shopping-cart": (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-cart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2018" />
          <stop offset="100%" stopColor="#0e0e0e" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#bg-cart)" />
      {[20, 70, 120, 170, 220, 270].map((x, i) => (
        <g key={i}>
          <rect x={x} y="20" width="34" height="120" fill="#1c1c1c" opacity="0.6" />
          {[35, 60, 85, 110].map((y, j) => (
            <rect key={j} x={x + 4} y={y} width="26" height="8" fill="#caa563" opacity="0.5" />
          ))}
        </g>
      ))}
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-zap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8934f" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0a1710" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#bg-zap)" />
      {[60, 150, 240].map((x, i) => (
        <g key={i}>
          <rect x={x - 2} y="30" width="4" height="110" fill="#151515" />
          <line x1={x - 30} y1="55" x2={x + 30} y2="45" stroke="#151515" strokeWidth="3" />
          <line x1={x - 30} y1="80" x2={x + 30} y2="70" stroke="#151515" strokeWidth="3" />
        </g>
      ))}
    </svg>
  ),
  users: (
    <svg viewBox="0 0 300 160" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-users" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c2e22" />
          <stop offset="100%" stopColor="#0a1710" />
        </linearGradient>
      </defs>
      <rect width="300" height="160" fill="url(#bg-users)" />
      <circle cx="120" cy="70" r="18" fill="#2c4030" />
      <rect x="95" y="90" width="50" height="55" rx="12" fill="#2c4030" />
      <circle cx="180" cy="65" r="18" fill="#3a5a40" />
      <rect x="155" y="85" width="50" height="60" rx="12" fill="#3a5a40" />
    </svg>
  ),
};

export default function SectorArt({ icon }) {
  return ARTS[icon] || ARTS.building;
}
