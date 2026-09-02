export default function LogoMark({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="#d3a24c" strokeWidth="2" />

      {/* left wing — layered feathers sweeping up and out */}
      <path d="M48 52 C36 48 24 38 16 22 C24 30 34 34 44 36 C38 30 34 22 32 12 C40 22 46 30 48 40 Z" fill="#d3a24c" />
      <path d="M47 58 C33 58 19 52 8 38 C18 44 30 46 41 44 C32 40 24 33 19 24 C29 32 38 38 47 44 Z" fill="#c48f3a" opacity="0.9" />

      {/* right wing — mirrored */}
      <path d="M52 52 C64 48 76 38 84 22 C76 30 66 34 56 36 C62 30 66 22 68 12 C60 22 54 30 52 40 Z" fill="#d3a24c" />
      <path d="M53 58 C67 58 81 52 92 38 C82 44 70 46 59 44 C68 40 76 33 81 24 C71 32 62 38 53 44 Z" fill="#c48f3a" opacity="0.9" />

      {/* body + head */}
      <path d="M50 38 C45 44 43 54 44 64 C45 74 47 82 50 88 C53 82 55 74 56 64 C57 54 55 44 50 38 Z" fill="#8c1f2b" />
      <circle cx="50" cy="40" r="6" fill="#8c1f2b" />
      <path d="M50 34 L54 40 L50 44 L46 40 Z" fill="#d3a24c" />
    </svg>
  );
}
