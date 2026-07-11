export function HeroVaultArt() {
  const radii = [72, 108, 144, 180, 216];

  return (
    <div
      className="relative flex h-full min-h-[280px] w-full items-center justify-center md:min-h-[400px] lg:min-h-0"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="vault-dot-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="12" r="0.75" fill="#E5E5E5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vault-dot-grid)" />
      </svg>

      <svg
        viewBox="0 0 480 480"
        className="relative h-auto w-full max-w-[520px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {radii.map((r) => (
          <circle
            key={r}
            cx="240"
            cy="240"
            r={r}
            fill="none"
            stroke="rgba(184, 149, 106, 0.2)"
            strokeWidth="1"
          />
        ))}

        <g className="vault-dial-rotate">
          <circle cx="240" cy="24" r="5" fill="#B8956A" opacity="0.85" />
        </g>

        <line
          x1="240"
          y1="204"
          x2="240"
          y2="276"
          stroke="rgba(184, 149, 106, 0.4)"
          strokeWidth="1"
        />
        <line
          x1="204"
          y1="240"
          x2="276"
          y2="240"
          stroke="rgba(184, 149, 106, 0.4)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
