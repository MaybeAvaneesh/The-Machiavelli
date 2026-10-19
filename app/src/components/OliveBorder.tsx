"use client";

interface OliveBorderProps {
  children: React.ReactNode;
  variant?: "default" | "crisis";
}

export function OliveBorder({ children, variant = "default" }: OliveBorderProps) {
  const stem = variant === "crisis" ? "#5a1a1a" : "#4a5020";
  const leaf = variant === "crisis" ? "#7a2222" : "#5a7030";
  const leafDark = variant === "crisis" ? "#3a0e0e" : "#3a4a18";
  const olive = variant === "crisis" ? "#2a0808" : "#2a3a10";
  const thorn = variant === "crisis" ? "#aa3030" : "#8a9040";
  const highlight = variant === "crisis" ? "#cc4444" : "#b8c848";

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
        {/* Stem - chunky pixels */}
        <rect x="0" y="4" width="200" height="2" fill={stem} />
        <rect x="10" y="3" width="20" height="2" fill={stem} />
        <rect x="60" y="5" width="15" height="2" fill={stem} />
        <rect x="110" y="3" width="25" height="2" fill={stem} />
        <rect x="160" y="5" width="20" height="2" fill={stem} />
        {/* Pixel leaves */}
        {[15, 45, 75, 105, 135, 165].map((x, i) => (
          <g key={`tl${i}`}>
            <rect x={x} y={i % 2 === 0 ? 0 : 6} width="6" height="4" fill={leaf} />
            <rect x={x + 2} y={i % 2 === 0 ? 1 : 7} width="2" height="2" fill={highlight} opacity="0.6" />
          </g>
        ))}
        {/* Pixel olives */}
        {[30, 90, 150].map((x, i) => (
          <g key={`to${i}`}>
            <rect x={x} y={i % 2 === 0 ? 1 : 6} width="4" height="3" fill={olive} />
            <rect x={x + 1} y={i % 2 === 0 ? 1 : 6} width="2" height="1" fill={highlight} opacity="0.3" />
          </g>
        ))}
        {/* Pixel thorns */}
        {[22, 52, 82, 120, 148, 178].map((x, i) => (
          <rect key={`tt${i}`} x={x} y={i % 2 === 0 ? 2 : 6} width="1" height="3" fill={thorn} />
        ))}
      </svg>

      {/* Bottom pixel vine */}
      <svg viewBox="0 0 200 10" className="absolute -bottom-1 left-2 right-2 h-3 z-10" preserveAspectRatio="none">
        <rect x="0" y="4" width="200" height="2" fill={stem} />
        <rect x="20" y="5" width="18" height="2" fill={stem} />
        <rect x="80" y="3" width="15" height="2" fill={stem} />
        <rect x="140" y="5" width="22" height="2" fill={stem} />
        {[10, 40, 70, 100, 130, 160, 190].map((x, i) => (
          <g key={`bl${i}`}>
            <rect x={x} y={i % 2 === 0 ? 6 : 0} width="6" height="4" fill={leaf} />
            <rect x={x + 1} y={i % 2 === 0 ? 7 : 1} width="3" height="2" fill={leafDark} />
          </g>
        ))}
        {[55, 115, 175].map((x, i) => (
          <rect key={`bo${i}`} x={x} y={i % 2 === 0 ? 6 : 1} width="4" height="3" fill={olive} />
        ))}
        {[25, 65, 95, 135, 165].map((x, i) => (
          <rect key={`bt${i}`} x={x} y={i % 2 === 0 ? 6 : 2} width="1" height="3" fill={thorn} />
        ))}
      </svg>

      {/* Left pixel vine */}
      <svg viewBox="0 0 10 200" className="absolute top-2 -left-1 bottom-2 w-3 z-10" preserveAspectRatio="none">
        <rect x="4" y="0" width="2" height="200" fill={stem} />
        <rect x="3" y="15" width="2" height="18" fill={stem} />
        <rect x="5" y="70" width="2" height="15" fill={stem} />
        <rect x="3" y="130" width="2" height="20" fill={stem} />
        {[10, 40, 70, 100, 130, 160, 190].map((y, i) => (
          <g key={`ll${i}`}>
            <rect x={i % 2 === 0 ? 0 : 6} y={y} width="4" height="6" fill={leaf} />
            <rect x={i % 2 === 0 ? 1 : 7} y={y + 2} width="2" height="2" fill={highlight} opacity="0.5" />
          </g>
        ))}
        {[55, 115, 175].map((y, i) => (
          <rect key={`lo${i}`} x={i % 2 === 0 ? 1 : 6} y={y} width="3" height="4" fill={olive} />
        ))}
        {[25, 85, 145].map((y, i) => (
          <rect key={`lt${i}`} x={i % 2 === 0 ? 2 : 6} y={y} width="3" height="1" fill={thorn} />
        ))}
      </svg>

      {/* Right pixel vine */}
      <svg viewBox="0 0 10 200" className="absolute top-2 -right-1 bottom-2 w-3 z-10" preserveAspectRatio="none">
        <rect x="4" y="0" width="2" height="200" fill={stem} />
        <rect x="5" y="25" width="2" height="20" fill={stem} />
        <rect x="3" y="90" width="2" height="15" fill={stem} />
        <rect x="5" y="150" width="2" height="18" fill={stem} />
        {[15, 45, 75, 105, 135, 165].map((y, i) => (
          <g key={`rl${i}`}>
            <rect x={i % 2 === 0 ? 6 : 0} y={y} width="4" height="6" fill={leaf} />
            <rect x={i % 2 === 0 ? 7 : 1} y={y + 1} width="2" height="3" fill={leafDark} />
          </g>
        ))}
        {[35, 95, 155].map((y, i) => (
          <rect key={`ro${i}`} x={i % 2 === 0 ? 6 : 1} y={y} width="3" height="4" fill={olive} />
        ))}
        {[60, 120, 180].map((y, i) => (
          <rect key={`rt${i}`} x={i % 2 === 0 ? 6 : 2} y={y} width="3" height="1" fill={thorn} />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
