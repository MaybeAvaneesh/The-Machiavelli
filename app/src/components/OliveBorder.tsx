"use client";

type Tier = "calm" | "conflict" | "crisis";

// Back-compat: "default" maps to the calm tier.
type OliveVariant = Tier | "default";

interface OliveBorderProps {
  children: React.ReactNode;
  variant?: OliveVariant;
}

interface Palette {
  stem: string;
  leaf: string;
  leafDark: string;
  olive: string;
  thorn: string;
  highlight: string;
}

const PALETTES: Record<Tier, Palette> = {
  calm: {
    stem: "#4a5020",
    leaf: "#5a7030",
    leafDark: "#3a4a18",
    olive: "#2a3a10",
    thorn: "#8a9040",
    highlight: "#b8c848",
  },
  conflict: {
    stem: "#3f3a44",
    leaf: "#565060",
    leafDark: "#2a2630",
    olive: "#241f26",
    thorn: "#9a4a4a",
    highlight: "#c06a6a",
  },
  crisis: {
    stem: "#5a1a1a",
    leaf: "#7a2222",
    leafDark: "#3a0e0e",
    olive: "#2a0808",
    thorn: "#aa3030",
    highlight: "#cc4444",
  },
};

export function OliveBorder({ children, variant = "default" }: OliveBorderProps) {
  const tier: Tier = variant === "default" ? "calm" : variant;
  const { stem, leaf, leafDark, olive, thorn, highlight } = PALETTES[tier];

  return (
    <div className="relative p-1.5">
      {/* Pixel border frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><rect width='12' height='12' fill='${stem}'/><rect x='2' y='2' width='8' height='8' fill='none'/><rect x='0' y='0' width='4' height='4' fill='${stem}'/><rect x='8' y='0' width='4' height='4' fill='${stem}'/><rect x='0' y='8' width='4' height='4' fill='${stem}'/><rect x='8' y='8' width='4' height='4' fill='${stem}'/></svg>`)}")  4 / 4px / 0 stretch`,
        }}
      />

      {/* Top pixel vine */}
      <svg viewBox="0 0 200 10" className="absolute -top-1 left-2 right-2 h-3 z-10" preserveAspectRatio="none">
        {/* Woven double stem */}
        <rect x="0" y="4" width="200" height="2" fill={stem} />
        <rect x="0" y="6" width="200" height="1" fill={leafDark} />
        {[0, 25, 50, 75, 100, 125, 150, 175].map((x, i) => (
          <rect key={`ts${i}`} x={x} y={i % 2 === 0 ? 3 : 5} width="25" height="2" fill={stem} />
        ))}
        {/* Pixel leaves (chunky, alternating sides, denser) */}
        {[6, 20, 34, 48, 62, 76, 90, 104, 118, 132, 146, 160, 174, 188].map((x, i) => (
          <g key={`tl${i}`}>
            <rect x={x} y={i % 2 === 0 ? 0 : 6} width="6" height="4" fill={leaf} />
            <rect x={x + 5} y={i % 2 === 0 ? 1 : 7} width="2" height="2" fill={leafDark} />
            <rect x={x + 1} y={i % 2 === 0 ? 1 : 7} width="2" height="1" fill={highlight} opacity="0.6" />
          </g>
        ))}
        {/* Pixel olives */}
        {[14, 42, 70, 98, 126, 154, 182].map((x, i) => (
          <g key={`to${i}`}>
            <rect x={x} y={i % 2 === 0 ? 1 : 6} width="4" height="3" fill={olive} />
            <rect x={x + 1} y={i % 2 === 0 ? 1 : 6} width="1" height="1" fill={highlight} opacity="0.4" />
          </g>
        ))}
        {/* Pixel thorns (regular, both directions) */}
        {[10, 24, 38, 52, 66, 80, 94, 108, 122, 136, 150, 164, 178, 192].map((x, i) => (
          <rect key={`tt${i}`} x={x} y={i % 2 === 0 ? 1 : 6} width="1" height="3" fill={thorn} />
        ))}
      </svg>

      {/* Bottom pixel vine */}
      <svg viewBox="0 0 200 10" className="absolute -bottom-1 left-2 right-2 h-3 z-10" preserveAspectRatio="none">
        <rect x="0" y="4" width="200" height="2" fill={stem} />
        <rect x="0" y="3" width="200" height="1" fill={leafDark} />
        {[0, 25, 50, 75, 100, 125, 150, 175].map((x, i) => (
          <rect key={`bs${i}`} x={x} y={i % 2 === 0 ? 5 : 3} width="25" height="2" fill={stem} />
        ))}
        {[6, 20, 34, 48, 62, 76, 90, 104, 118, 132, 146, 160, 174, 188].map((x, i) => (
          <g key={`bl${i}`}>
            <rect x={x} y={i % 2 === 0 ? 6 : 0} width="6" height="4" fill={leaf} />
            <rect x={x + 1} y={i % 2 === 0 ? 7 : 1} width="3" height="2" fill={leafDark} />
            <rect x={x + 2} y={i % 2 === 0 ? 7 : 1} width="1" height="1" fill={highlight} opacity="0.5" />
          </g>
        ))}
        {[14, 42, 70, 98, 126, 154, 182].map((x, i) => (
          <g key={`bo${i}`}>
            <rect x={x} y={i % 2 === 0 ? 6 : 1} width="4" height="3" fill={olive} />
            <rect x={x + 1} y={i % 2 === 0 ? 6 : 1} width="1" height="1" fill={highlight} opacity="0.4" />
          </g>
        ))}
        {[10, 24, 38, 52, 66, 80, 94, 108, 122, 136, 150, 164, 178, 192].map((x, i) => (
          <rect key={`bt${i}`} x={x} y={i % 2 === 0 ? 6 : 1} width="1" height="3" fill={thorn} />
        ))}
      </svg>

      {/* Left pixel vine */}
      <svg viewBox="0 0 10 200" className="absolute top-2 -left-1 bottom-2 w-3 z-10" preserveAspectRatio="none">
        <rect x="4" y="0" width="2" height="200" fill={stem} />
        <rect x="6" y="0" width="1" height="200" fill={leafDark} />
        {[0, 25, 50, 75, 100, 125, 150, 175].map((y, i) => (
          <rect key={`ls${i}`} x={i % 2 === 0 ? 3 : 5} y={y} width="2" height="25" fill={stem} />
        ))}
        {[6, 20, 34, 48, 62, 76, 90, 104, 118, 132, 146, 160, 174, 188].map((y, i) => (
          <g key={`ll${i}`}>
            <rect x={i % 2 === 0 ? 0 : 6} y={y} width="4" height="6" fill={leaf} />
            <rect x={i % 2 === 0 ? 0 : 6} y={y + 5} width="2" height="2" fill={leafDark} />
            <rect x={i % 2 === 0 ? 1 : 7} y={y + 1} width="1" height="2" fill={highlight} opacity="0.5" />
          </g>
        ))}
        {[14, 42, 70, 98, 126, 154, 182].map((y, i) => (
          <rect key={`lo${i}`} x={i % 2 === 0 ? 1 : 6} y={y} width="3" height="4" fill={olive} />
        ))}
        {[10, 24, 38, 52, 66, 80, 94, 108, 122, 136, 150, 164, 178, 192].map((y, i) => (
          <rect key={`lt${i}`} x={i % 2 === 0 ? 1 : 6} y={y} width="3" height="1" fill={thorn} />
        ))}
      </svg>

      {/* Right pixel vine */}
      <svg viewBox="0 0 10 200" className="absolute top-2 -right-1 bottom-2 w-3 z-10" preserveAspectRatio="none">
        <rect x="4" y="0" width="2" height="200" fill={stem} />
        <rect x="3" y="0" width="1" height="200" fill={leafDark} />
        {[0, 25, 50, 75, 100, 125, 150, 175].map((y, i) => (
          <rect key={`rs${i}`} x={i % 2 === 0 ? 5 : 3} y={y} width="2" height="25" fill={stem} />
        ))}
        {[6, 20, 34, 48, 62, 76, 90, 104, 118, 132, 146, 160, 174, 188].map((y, i) => (
          <g key={`rl${i}`}>
            <rect x={i % 2 === 0 ? 6 : 0} y={y} width="4" height="6" fill={leaf} />
            <rect x={i % 2 === 0 ? 8 : 2} y={y + 5} width="2" height="2" fill={leafDark} />
            <rect x={i % 2 === 0 ? 7 : 1} y={y + 1} width="1" height="2" fill={highlight} opacity="0.5" />
          </g>
        ))}
        {[14, 42, 70, 98, 126, 154, 182].map((y, i) => (
          <rect key={`ro${i}`} x={i % 2 === 0 ? 6 : 1} y={y} width="3" height="4" fill={olive} />
        ))}
        {[10, 24, 38, 52, 66, 80, 94, 108, 122, 136, 150, 164, 178, 192].map((y, i) => (
          <rect key={`rt${i}`} x={i % 2 === 0 ? 6 : 1} y={y} width="3" height="1" fill={thorn} />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
