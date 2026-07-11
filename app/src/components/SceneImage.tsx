"use client";

function PoliticalScene() {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-full">
      <defs>
        <linearGradient id="pol-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1428" />
          <stop offset="100%" stopColor="#2a1f3d" />
        </linearGradient>
        <linearGradient id="pol-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2318" />
          <stop offset="100%" stopColor="#12100e" />
        </linearGradient>
        <radialGradient id="pol-glow" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="200" fill="url(#pol-sky)" />
      <rect y="140" width="500" height="60" fill="url(#pol-floor)" />
      <circle cx="250" cy="60" r="120" fill="url(#pol-glow)" />

      {/* Palazzo arches */}
      <path d="M30 140 L30 50 Q80 15 130 50 L130 140" stroke="#6b5a30" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M150 140 L150 45 Q210 5 270 45 L270 140" stroke="#6b5a30" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M290 140 L290 45 Q350 5 410 45 L410 140" stroke="#6b5a30" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M430 140 L430 50 Q460 25 490 50 L490 140" stroke="#6b5a30" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Columns */}
      {[30, 130, 150, 270, 290, 410].map((x, i) => (
        <rect key={i} x={x - 3} y="45" width="6" height="95" fill="#6b5a30" opacity="0.3" />
      ))}

      {/* Central throne */}
      <rect x="220" y="80" width="60" height="60" fill="#2a2318" stroke="#c9a84c" strokeWidth="1" opacity="0.5" rx="2" />
      <path d="M220 80 L250 60 L280 80" fill="#2a2318" stroke="#c9a84c" strokeWidth="1" opacity="0.5" />
      {/* Crown on throne */}
      <path d="M238 72 L242 65 L246 70 L250 63 L254 70 L258 65 L262 72 Z" fill="#c9a84c" opacity="0.5" />

      {/* Figures - courtiers */}
      {[80, 160, 340, 420].map((x, i) => (
        <g key={i} opacity={0.3 + i * 0.05}>
          <ellipse cx={x} cy="125" rx="8" ry="4" fill="#1a1428" />
          <rect x={x - 6} y="100" width="12" height="28" fill="#2a1f3d" rx="2" />
          <circle cx={x} cy="95" r="6" fill="#d4c5a0" opacity="0.3" />
        </g>
      ))}

      {/* Candelabras */}
      {[100, 400].map((x, i) => (
        <g key={i}>
          <rect x={x - 1} y="70" width="2" height="35" fill="#6b5a30" opacity="0.4" />
          <ellipse cx={x} cy="67" rx="3" ry="5" fill="#c9a84c" opacity="0.25" />
          <ellipse cx={x} cy="65" rx="6" ry="8" fill="#c9a84c" opacity="0.08" />
        </g>
      ))}

      {/* Floor tiles */}
      <line x1="0" y1="155" x2="500" y2="155" stroke="#6b5a30" strokeWidth="0.5" opacity="0.2" />
      <line x1="0" y1="170" x2="500" y2="170" stroke="#6b5a30" strokeWidth="0.5" opacity="0.15" />
      <line x1="0" y1="185" x2="500" y2="185" stroke="#6b5a30" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

function MilitaryScene() {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-full">
      <defs>
        <linearGradient id="mil-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0808" />
          <stop offset="40%" stopColor="#2a1515" />
          <stop offset="100%" stopColor="#12100e" />
        </linearGradient>
        <radialGradient id="mil-fire" cx="50%" cy="70%">
          <stop offset="0%" stopColor="#8b4040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b4040" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="200" fill="url(#mil-sky)" />
      <circle cx="300" cy="150" r="100" fill="url(#mil-fire)" />

      {/* Fortress */}
      <rect x="280" y="60" width="120" height="100" fill="#2a1515" stroke="#6b5a30" strokeWidth="1" opacity="0.6" />
      <rect x="300" y="40" width="15" height="30" fill="#2a1515" stroke="#6b5a30" strokeWidth="1" opacity="0.5" />
      <rect x="340" y="35" width="20" height="35" fill="#2a1515" stroke="#6b5a30" strokeWidth="1" opacity="0.6" />
      <rect x="380" y="40" width="15" height="30" fill="#2a1515" stroke="#6b5a30" strokeWidth="1" opacity="0.5" />
      {/* Battlements */}
      {[280, 295, 310, 325, 340, 355, 370, 385].map((x, i) => (
        <rect key={i} x={x} y="55" width="10" height="8" fill="#2a1515" stroke="#6b5a30" strokeWidth="0.5" opacity="0.5" />
      ))}
      {/* Gate */}
      <path d="M325 160 L325 110 Q340 95 355 110 L355 160" fill="#1a0808" stroke="#6b5a30" strokeWidth="1" opacity="0.5" />

      {/* Soldiers approaching */}
      {[60, 90, 120, 150, 180].map((x, i) => (
        <g key={i} opacity={0.25 + i * 0.05}>
          <rect x={x - 3} y={125 + i * 3} width="6" height="18" fill="#8b4040" rx="1" />
          <circle cx={x} cy={122 + i * 3} r="4" fill="#d4c5a0" opacity="0.3" />
          {/* Spear */}
          <line x1={x + 5} y1={110 + i * 3} x2={x + 5} y2={145 + i * 3} stroke="#6b5a30" strokeWidth="1" opacity="0.4" />
          <path d={`M${x + 3} ${110 + i * 3} L${x + 5} ${105 + i * 3} L${x + 7} ${110 + i * 3}`} fill="#8b4040" opacity="0.5" />
        </g>
      ))}

      {/* Cannon */}
      <rect x="200" y="140" width="35" height="12" fill="#2a1515" rx="3" stroke="#6b5a30" strokeWidth="1" opacity="0.5" />
      <circle cx="210" cy="155" r="6" fill="none" stroke="#6b5a30" strokeWidth="1" opacity="0.3" />
      <circle cx="228" cy="155" r="6" fill="none" stroke="#6b5a30" strokeWidth="1" opacity="0.3" />

      {/* Smoke/fire from fortress */}
      <ellipse cx="340" cy="45" rx="25" ry="12" fill="#8b4040" opacity="0.1" />
      <ellipse cx="330" cy="35" rx="18" ry="10" fill="#8b4040" opacity="0.08" />
      <ellipse cx="350" cy="30" rx="15" ry="8" fill="#2a1515" opacity="0.15" />

      {/* Banner */}
      <line x1="80" y1="100" x2="80" y2="135" stroke="#6b5a30" strokeWidth="1.5" opacity="0.5" />
      <path d="M80 100 L105 107 L80 114" fill="#8b4040" opacity="0.4" />

      {/* Ground */}
      <line x1="0" y1="160" x2="500" y2="160" stroke="#6b5a30" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

function EconomicScene() {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-full">
      <defs>
        <linearGradient id="eco-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a0e" />
          <stop offset="100%" stopColor="#12100e" />
        </linearGradient>
        <radialGradient id="eco-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="200" fill="url(#eco-bg)" />
      <circle cx="250" cy="100" r="150" fill="url(#eco-glow)" />

      {/* Market stalls / arched marketplace */}
      {[50, 170, 290, 410].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 130 L${x} 65 Q${x + 40} 40 ${x + 80} 65 L${x + 80} 130`} stroke="#6b5a30" strokeWidth="1" fill="none" opacity="0.4" />
          <rect x={x + 10} y="90" width="60" height="40" fill="#2a2318" opacity="0.3" rx="1" />
        </g>
      ))}

      {/* Central scales of justice/commerce */}
      <line x1="250" y1="45" x2="250" y2="105" stroke="#c9a84c" strokeWidth="2" opacity="0.5" />
      <line x1="210" y1="65" x2="290" y2="65" stroke="#c9a84c" strokeWidth="2" opacity="0.5" />
      {/* Scale pans */}
      <path d="M205 65 Q210 85 220 65" stroke="#c9a84c" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M280 65 Q285 80 295 65" stroke="#c9a84c" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Chains */}
      <line x1="210" y1="65" x2="212" y2="78" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />
      <line x1="220" y1="65" x2="218" y2="78" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />
      <line x1="280" y1="65" x2="282" y2="75" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />
      <line x1="290" y1="65" x2="288" y2="75" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />

      {/* Scattered coins */}
      {[80, 120, 330, 380, 420, 160, 350].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={110 + (i % 3) * 15} rx={6 + i % 2 * 2} ry={5 + i % 2} fill="none" stroke="#c9a84c" strokeWidth="1" opacity={0.3 + i * 0.04} />
          <text x={x} y={113 + (i % 3) * 15} textAnchor="middle" fontSize="5" fill="#c9a84c" opacity={0.2 + i * 0.03} fontFamily="serif">F</text>
        </g>
      ))}

      {/* Ledger / books */}
      <rect x="60" y="120" width="30" height="20" fill="#2a2318" stroke="#6b5a30" strokeWidth="0.5" opacity="0.4" rx="1" />
      <line x1="65" y1="125" x2="85" y2="125" stroke="#6b5a30" strokeWidth="0.5" opacity="0.2" />
      <line x1="65" y1="130" x2="82" y2="130" stroke="#6b5a30" strokeWidth="0.5" opacity="0.2" />
      <line x1="65" y1="135" x2="80" y2="135" stroke="#6b5a30" strokeWidth="0.5" opacity="0.2" />

      {/* Merchant figure */}
      <g opacity="0.35">
        <circle cx="420" cy="100" r="7" fill="#d4c5a0" opacity="0.3" />
        <rect x="414" y="108" width="12" height="25" fill="#2a2318" rx="2" />
        <rect x="410" y="120" width="20" height="3" fill="#6b5a30" opacity="0.3" rx="1" />
      </g>

      {/* Ground line */}
      <line x1="0" y1="155" x2="500" y2="155" stroke="#6b5a30" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

function ReligiousScene() {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-full">
      <defs>
        <linearGradient id="rel-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10121a" />
          <stop offset="100%" stopColor="#12100e" />
        </linearGradient>
        <radialGradient id="rel-glow" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#c9a84c" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="200" fill="url(#rel-bg)" />
      <circle cx="250" cy="50" r="150" fill="url(#rel-glow)" />

      {/* Cathedral rose window */}
      <circle cx="250" cy="65" r="40" fill="none" stroke="#8a7e6a" strokeWidth="1.5" opacity="0.4" />
      <circle cx="250" cy="65" r="30" fill="none" stroke="#8a7e6a" strokeWidth="0.5" opacity="0.25" />
      <circle cx="250" cy="65" r="20" fill="none" stroke="#8a7e6a" strokeWidth="0.5" opacity="0.2" />
      {/* Spokes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={i} x1={250 + Math.cos(rad) * 20} y1={65 + Math.sin(rad) * 20} x2={250 + Math.cos(rad) * 40} y2={65 + Math.sin(rad) * 40} stroke="#8a7e6a" strokeWidth="0.5" opacity="0.2" />
        );
      })}

      {/* Gothic arch frame */}
      <path d="M190 160 L190 50 Q250 5 310 50 L310 160" stroke="#8a7e6a" strokeWidth="2" fill="none" opacity="0.35" />

      {/* Central cross */}
      <rect x="246" y="35" width="8" height="45" fill="#8a7e6a" opacity="0.2" rx="1" />
      <rect x="236" y="50" width="28" height="8" fill="#8a7e6a" opacity="0.2" rx="1" />

      {/* Side pillars */}
      {[120, 380].map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y="40" width="10" height="120" fill="#8a7e6a" opacity="0.15" rx="2" />
          <rect x={x - 8} y="38" width="16" height="6" fill="#8a7e6a" opacity="0.2" rx="1" />
          <rect x={x - 8} y="155" width="16" height="6" fill="#8a7e6a" opacity="0.2" rx="1" />
        </g>
      ))}

      {/* Candles */}
      {[140, 170, 330, 360].map((x, i) => (
        <g key={i}>
          <rect x={x - 1.5} y="120" width="3" height="30" fill="#8a7e6a" opacity="0.25" />
          <ellipse cx={x} cy="117" rx="3" ry="5" fill="#c9a84c" opacity="0.3" />
          <ellipse cx={x} cy="114" rx="7" ry="10" fill="#c9a84c" opacity="0.05" />
        </g>
      ))}

      {/* Robed figures */}
      {[200, 230, 270, 300].map((x, i) => (
        <g key={i} opacity="0.2">
          <path d={`M${x - 8} 160 L${x - 5} 125 Q${x} 118 ${x + 5} 125 L${x + 8} 160`} fill="#8a7e6a" />
          <circle cx={x} cy={115} r="5" fill="#d4c5a0" opacity="0.3" />
        </g>
      ))}

      {/* Floor */}
      <line x1="100" y1="160" x2="400" y2="160" stroke="#8a7e6a" strokeWidth="0.5" opacity="0.15" />
    </svg>
  );
}

function CrisisScene() {
  return (
    <svg viewBox="0 0 500 200" className="w-full h-full">
      <defs>
        <linearGradient id="cri-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0505" />
          <stop offset="100%" stopColor="#12100e" />
        </linearGradient>
        <radialGradient id="cri-fire" cx="35%" cy="80%">
          <stop offset="0%" stopColor="#8b2020" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b2020" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="200" fill="url(#cri-bg)" />
      <circle cx="175" cy="160" r="120" fill="url(#cri-fire)" />

      {/* Storm clouds */}
      <ellipse cx="100" cy="25" rx="80" ry="25" fill="#2a1010" opacity="0.7" />
      <ellipse cx="250" cy="20" rx="100" ry="28" fill="#2a1010" opacity="0.8" />
      <ellipse cx="400" cy="28" rx="85" ry="22" fill="#2a1010" opacity="0.6" />
      <ellipse cx="170" cy="15" rx="60" ry="18" fill="#3a1515" opacity="0.5" />

      {/* Lightning */}
      <path d="M200 35 L190 65 L205 60 L188 100 L200 95 L182 130" stroke="#c9a84c" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M200 35 L190 65 L205 60 L188 100 L200 95 L182 130" stroke="#c9a84c" strokeWidth="6" fill="none" opacity="0.05" />

      {/* Burning buildings */}
      <rect x="80" y="100" width="40" height="60" fill="#2a1010" stroke="#6b5a30" strokeWidth="0.5" opacity="0.5" />
      <rect x="130" y="90" width="35" height="70" fill="#2a1010" stroke="#6b5a30" strokeWidth="0.5" opacity="0.4" />
      {/* Flames */}
      <ellipse cx="100" cy="95" rx="15" ry="10" fill="#8b2020" opacity="0.3" />
      <ellipse cx="95" cy="88" rx="8" ry="12" fill="#c9a84c" opacity="0.15" />
      <ellipse cx="147" cy="85" rx="12" ry="10" fill="#8b2020" opacity="0.25" />

      {/* Ruined tower */}
      <rect x="350" y="70" width="30" height="90" fill="#2a1010" stroke="#6b5a30" strokeWidth="1" opacity="0.5" />
      <path d="M350 70 L345 75 L348 70 L343 78" stroke="#6b5a30" strokeWidth="0.5" opacity="0.4" />
      <path d="M380 70 L385 73 L382 72 L387 78" stroke="#6b5a30" strokeWidth="0.5" opacity="0.4" />

      {/* Fleeing figures */}
      {[250, 280, 310, 340].map((x, i) => (
        <g key={i} opacity={0.2 + i * 0.03}>
          <circle cx={x} cy={135 + i * 3} r="4" fill="#d4c5a0" opacity="0.3" />
          <path d={`M${x - 5} ${140 + i * 3} Q${x} ${150 + i * 3} ${x + 8} ${160 + i * 3}`} stroke="#8a7e6a" strokeWidth="1" fill="none" opacity="0.3" />
        </g>
      ))}

      {/* Rain */}
      {[40, 120, 200, 280, 360, 440, 70, 150, 230, 310, 390, 460].map((x, i) => (
        <line key={i} x1={x} y1={40 + (i % 4) * 10} x2={x - 5} y2={60 + (i % 4) * 10} stroke="#8a7e6a" strokeWidth="0.5" opacity="0.12" />
      ))}

      {/* Skull */}
      <g opacity="0.15" transform="translate(430, 130)">
        <ellipse cx="0" cy="0" rx="12" ry="14" fill="#d4c5a0" />
        <ellipse cx="-4" cy="-3" rx="3" ry="4" fill="#1a0505" />
        <ellipse cx="4" cy="-3" rx="3" ry="4" fill="#1a0505" />
        <path d="M-3 6 L0 8 L3 6" stroke="#1a0505" strokeWidth="1" fill="none" />
      </g>

      {/* Ground */}
      <line x1="0" y1="160" x2="500" y2="160" stroke="#6b5a30" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

const SCENES: Record<string, () => React.ReactNode> = {
  political: PoliticalScene,
  military: MilitaryScene,
  economic: EconomicScene,
  religious: ReligiousScene,
  crisis: CrisisScene,
};

export function SceneImage({ category }: { category: string }) {
  const Scene = SCENES[category] || SCENES.political;

  return (
    <div className="relative h-44 overflow-hidden rounded-t-xl">
      <Scene />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-transparent to-transparent opacity-80" />
    </div>
  );
}
