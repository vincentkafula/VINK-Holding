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
      <circle cx="50" cy="50" r="47" stroke="#d3a24c" strokeWidth="2" />
      <path
        d="M50 20 C38 30 20 34 8 32 C16 42 28 46 38 46 C30 50 20 58 16 70 C28 66 40 58 46 50 C46 62 44 76 38 86 C46 82 52 72 54 62 C58 72 66 80 76 84 C72 74 68 62 68 52 C74 58 84 62 92 62 C86 52 76 46 66 44 C76 42 86 36 92 28 C80 30 66 28 56 20 C54 24 52 28 50 32 C48 28 50 24 50 20 Z"
        fill="#d3a24c"
        opacity="0.95"
      />
      <path
        d="M50 34 C46 46 46 60 50 76 C54 60 54 46 50 34 Z"
        fill="#8c1f2b"
        opacity="0.9"
      />
    </svg>
  );
}
