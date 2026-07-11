"use client";

interface OliveBorderProps {
  children: React.ReactNode;
  variant?: "default" | "crisis";
}

export function OliveBorder({ children, variant = "default" }: OliveBorderProps) {
  const branchColor = variant === "crisis" ? "#6b2020" : "#6b5a30";
  const leafColor = variant === "crisis" ? "#4a1818" : "#4a5a2a";
  const thornColor = variant === "crisis" ? "#8b2020" : "#8a7e4a";
  const oliveColor = variant === "crisis" ? "#3a1010" : "#3a4a20";

  return (
    <div className="relative">
      {/* Top border */}
      <svg viewBox="0 0 600 28" className="absolute -top-3.5 left-0 right-0 w-full h-7 z-10" preserveAspectRatio="none">
        {/* Main branch */}
        <path d={`M0 14 C50 10, 100 18, 150 12 S250 18, 300 14 S400 8, 450 15 S550 10, 600 14`} stroke={branchColor} strokeWidth="2" fill="none" />
        {/* Thorns along branch */}
        {[60, 130, 200, 270, 340, 410, 480, 540].map((x, i) => (
          <g key={`tt${i}`}>
            <line x1={x} y1={i % 2 === 0 ? 13 : 15} x2={x + (i % 2 === 0 ? 4 : -4)} y2={i % 2 === 0 ? 6 : 22} stroke={thornColor} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}
        {/* Leaves */}
        {[40, 110, 180, 250, 320, 390, 460, 530].map((x, i) => (
          <g key={`tl${i}`}>
            <ellipse cx={x + 8} cy={i % 2 === 0 ? 8 : 20} rx="10" ry="4" fill={leafColor} opacity="0.7" transform={`rotate(${i % 2 === 0 ? -30 : 30} ${x + 8} ${i % 2 === 0 ? 8 : 20})`} />
            <ellipse cx={x - 4} cy={i % 2 === 0 ? 20 : 8} rx="9" ry="3.5" fill={leafColor} opacity="0.5" transform={`rotate(${i % 2 === 0 ? 25 : -25} ${x - 4} ${i % 2 === 0 ? 20 : 8})`} />
          </g>
        ))}
        {/* Olives */}
        {[90, 230, 370, 510].map((x, i) => (
          <circle key={`to${i}`} cx={x} cy={i % 2 === 0 ? 10 : 18} r="3" fill={oliveColor} opacity="0.6" />
        ))}
      </svg>

      {/* Bottom border */}
      <svg viewBox="0 0 600 28" className="absolute -bottom-3.5 left-0 right-0 w-full h-7 z-10" preserveAspectRatio="none">
        <path d={`M0 14 C60 18, 120 8, 180 15 S280 10, 340 14 S440 20, 500 12 S560 16, 600 14`} stroke={branchColor} strokeWidth="2" fill="none" />
        {[50, 120, 190, 260, 330, 400, 470, 550].map((x, i) => (
          <g key={`bt${i}`}>
            <line x1={x} y1={i % 2 === 0 ? 14 : 13} x2={x + (i % 2 === 0 ? -5 : 5)} y2={i % 2 === 0 ? 22 : 5} stroke={thornColor} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}
        {[30, 100, 170, 240, 310, 380, 450, 520].map((x, i) => (
          <g key={`bl${i}`}>
            <ellipse cx={x + 6} cy={i % 2 === 0 ? 20 : 7} rx="10" ry="4" fill={leafColor} opacity="0.6" transform={`rotate(${i % 2 === 0 ? 20 : -20} ${x + 6} ${i % 2 === 0 ? 20 : 7})`} />
          </g>
        ))}
        {[80, 220, 360, 500].map((x, i) => (
          <circle key={`bo${i}`} cx={x} cy={i % 2 === 0 ? 18 : 10} r="3" fill={oliveColor} opacity="0.6" />
        ))}
      </svg>

      {/* Left border */}
      <svg viewBox="0 0 28 400" className="absolute top-0 -left-3.5 h-full w-7 z-10" preserveAspectRatio="none">
        <path d={`M14 0 C10 40, 18 80, 12 120 S18 200, 14 240 S8 320, 15 360 S12 380, 14 400`} stroke={branchColor} strokeWidth="2" fill="none" />
        {[40, 100, 160, 220, 280, 340].map((y, i) => (
          <g key={`lt${i}`}>
            <line x1={i % 2 === 0 ? 13 : 15} y1={y} x2={i % 2 === 0 ? 5 : 23} y2={y + (i % 2 === 0 ? -5 : 5)} stroke={thornColor} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}
        {[60, 130, 200, 270, 330].map((y, i) => (
          <g key={`ll${i}`}>
            <ellipse cx={i % 2 === 0 ? 7 : 21} cy={y} rx="4" ry="10" fill={leafColor} opacity="0.6" transform={`rotate(${i % 2 === 0 ? -15 : 15} ${i % 2 === 0 ? 7 : 21} ${y})`} />
          </g>
        ))}
        {[90, 250].map((y, i) => (
          <circle key={`lo${i}`} cx={i % 2 === 0 ? 9 : 19} cy={y} r="3" fill={oliveColor} opacity="0.6" />
        ))}
      </svg>

      {/* Right border */}
      <svg viewBox="0 0 28 400" className="absolute top-0 -right-3.5 h-full w-7 z-10" preserveAspectRatio="none">
        <path d={`M14 0 C18 50, 10 100, 16 150 S10 220, 14 260 S20 320, 12 370 S16 390, 14 400`} stroke={branchColor} strokeWidth="2" fill="none" />
        {[50, 120, 190, 260, 320, 370].map((y, i) => (
          <g key={`rt${i}`}>
            <line x1={i % 2 === 0 ? 15 : 13} y1={y} x2={i % 2 === 0 ? 23 : 5} y2={y + (i % 2 === 0 ? 4 : -4)} stroke={thornColor} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}
        {[70, 140, 210, 290, 350].map((y, i) => (
          <g key={`rl${i}`}>
            <ellipse cx={i % 2 === 0 ? 21 : 7} cy={y} rx="4" ry="10" fill={leafColor} opacity="0.6" transform={`rotate(${i % 2 === 0 ? 15 : -15} ${i % 2 === 0 ? 21 : 7} ${y})`} />
          </g>
        ))}
        {[110, 280].map((y, i) => (
          <circle key={`ro${i}`} cx={i % 2 === 0 ? 19 : 9} cy={y} r="3" fill={oliveColor} opacity="0.6" />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
