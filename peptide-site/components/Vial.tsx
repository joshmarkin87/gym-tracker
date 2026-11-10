import type { LotStatus } from "@/lib/data";

/** Cap colour per product, picked from the lot prefix so each product keeps its own colour. */
const CAPS: [string, string][] = [
  ["#5ff5e2", "#0f9c8c"],
  ["#8fb6ff", "#2f5fd6"],
  ["#c6a4ff", "#6a3fd0"],
  ["#ffd27a", "#c98a12"],
  ["#ff9db0", "#c7385a"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * An illustrated vial with its real label: product, size, lot code and a QR-style mark.
 * Drawn in SVG so no photography is needed and every lot gets its own label. Decorative:
 * the same facts are always in the text next to it.
 */
export function Vial({
  name,
  size,
  lotCode,
  prefix,
  status,
  className = "h-56",
}: {
  name: string;
  size: string;
  lotCode?: string;
  prefix: string;
  status?: LotStatus;
  className?: string;
}) {
  const [capA, capB] = CAPS[hash(prefix) % CAPS.length];
  const id = `v-${prefix}-${(lotCode ?? "x").replace(/\W/g, "")}`;
  const seed = hash(lotCode ?? name);
  const failed = status?.startsWith("FAILED");
  const testing = status === "In testing";
  const cells: boolean[] = Array.from({ length: 49 }, (_, i) => ((seed >> (i % 31)) ^ (i * 2654435761)) % 3 !== 0);
  const corner = (i: number) => {
    const x = i % 7, y = Math.floor(i / 7);
    return (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4);
  };

  return (
    <svg viewBox="0 0 160 260" className={`${className} w-auto shrink-0 select-none`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor={capB} />
          <stop offset="0.35" stopColor={capA} />
          <stop offset="1" stopColor={capB} />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" x2="1">
          <stop offset="0" stopColor="#5b6772" />
          <stop offset="0.3" stopColor="#e8eef2" />
          <stop offset="0.6" stopColor="#9aa7b1" />
          <stop offset="1" stopColor="#4a5560" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.18" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.8" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-cake`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d6dc" />
        </linearGradient>
        <radialGradient id={`${id}-floor`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={capA} stopOpacity="0.55" />
          <stop offset="1" stopColor={capA} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="80" cy="246" rx="64" ry="10" fill={`url(#${id}-floor)`} />

      {/* cap, crimp, neck */}
      <rect x="46" y="6" width="68" height="30" rx="6" fill={`url(#${id}-cap)`} />
      <rect x="46" y="6" width="68" height="6" rx="3" fill="#fff" fillOpacity="0.25" />
      <rect x="42" y="34" width="76" height="16" rx="3" fill={`url(#${id}-metal)`} />
      <rect x="54" y="50" width="52" height="14" fill={`url(#${id}-glass)`} stroke="#ffffff" strokeOpacity="0.25" />

      {/* body */}
      <path d="M54 64 C34 68 30 78 30 90 V228 a14 14 0 0 0 14 14 H116 a14 14 0 0 0 14 -14 V90 C130 78 126 68 106 64 Z" fill="#0b141c" fillOpacity="0.55" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.2" />
      {/* lyophilized cake */}
      <path d="M34 210 q46 -9 92 0 V228 a10 10 0 0 1 -10 10 H44 a10 10 0 0 1 -10 -10 Z" fill={`url(#${id}-cake)`} fillOpacity={failed ? 0.35 : 0.92} />
      <path d="M54 64 C34 68 30 78 30 90 V228 a14 14 0 0 0 14 14 H116 a14 14 0 0 0 14 -14 V90 C130 78 126 68 106 64 Z" fill={`url(#${id}-glass)`} />
      <rect x="36" y="80" width="5" height="150" rx="2.5" fill="#fff" fillOpacity="0.28" />

      {/* label */}
      <rect x="30" y="98" width="100" height="100" fill="#f4f8f9" />
      <rect x="30" y="98" width="100" height="5" fill={capA} />
      <text x="38" y="121" fontSize="13" fontWeight="700" fill="#0a1017" style={{ fontFamily: "var(--font-sans)" }} textLength={name.length > 9 ? 84 : undefined} lengthAdjust="spacingAndGlyphs">
        {name}
      </text>
      <text x="38" y="137" fontSize="11" fontWeight="600" fill="#0a1017" style={{ fontFamily: "var(--font-mono)" }}>
        {size}
      </text>
      <line x1="38" y1="144" x2="122" y2="144" stroke="#0a1017" strokeOpacity="0.2" />
      <text x="38" y="156" fontSize="6" fill="#4b5763" letterSpacing="0.8" style={{ fontFamily: "var(--font-mono)" }}>
        LOT
      </text>
      <text x="38" y="167" fontSize="8.2" fontWeight="700" fill="#0a1017" style={{ fontFamily: "var(--font-mono)" }}>
        {lotCode ?? "—"}
      </text>
      <text x="38" y="181" fontSize="4.6" fill="#4b5763" style={{ fontFamily: "var(--font-sans)" }}>
        FOR RESEARCH USE ONLY.
      </text>
      <text x="38" y="188" fontSize="4.6" fill="#4b5763" style={{ fontFamily: "var(--font-sans)" }}>
        NOT FOR HUMAN CONSUMPTION.
      </text>
      {/* QR-style mark */}
      <g transform="translate(96 150)">
        <rect x="-2" y="-2" width="29" height="29" fill="#fff" />
        {cells.map((on, i) =>
          on || corner(i) ? <rect key={i} x={(i % 7) * 3.6} y={Math.floor(i / 7) * 3.6} width="3.6" height="3.6" fill="#0a1017" /> : null,
        )}
      </g>
      {(failed || testing) && (
        <g transform="rotate(-14 80 128)">
          <rect x="34" y="118" width="92" height="20" rx="3" fill={failed ? "#ff7468" : "#ffc25c"} />
          <text x="80" y="132" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0a1017" letterSpacing="1" style={{ fontFamily: "var(--font-mono)" }}>
            {failed ? "FAILED" : "IN TESTING"}
          </text>
        </g>
      )}
    </svg>
  );
}
