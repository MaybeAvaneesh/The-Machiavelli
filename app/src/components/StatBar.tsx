"use client";

function CrownIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ imageRendering: "pixelated" as const }}>
      <rect x="2" y="12" width="12" height="2" fill="#c9a84c" />
      <rect x="2" y="10" width="2" height="2" fill="#c9a84c" />
      <rect x="4" y="8" width="2" height="2" fill="#c9a84c" />
      <rect x="6" y="6" width="2" height="2" fill="#c9a84c" />
      <rect x="8" y="4" width="2" height="2" fill="#c9a84c" />
      <rect x="10" y="6" width="2" height="2" fill="#c9a84c" />
      <rect x="12" y="8" width="2" height="2" fill="#c9a84c" />
      <rect x="6" y="8" width="2" height="4" fill="#c9a84c" />
      <rect x="8" y="6" width="2" height="6" fill="#c9a84c" />
      <rect x="10" y="8" width="2" height="4" fill="#c9a84c" />
      <rect x="4" y="10" width="2" height="2" fill="#c9a84c" />
      <rect x="12" y="10" width="2" height="2" fill="#c9a84c" />
    </svg>
  );
}

function SwordsIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ imageRendering: "pixelated" as const }}>
      <rect x="2" y="2" width="2" height="2" fill="#8b4040" />
      <rect x="4" y="4" width="2" height="2" fill="#8b4040" />
      <rect x="6" y="6" width="2" height="2" fill="#8b4040" />
      <rect x="8" y="8" width="2" height="2" fill="#8b4040" />
      <rect x="10" y="10" width="2" height="2" fill="#8b4040" />
      <rect x="12" y="12" width="2" height="2" fill="#8b4040" />
      <rect x="12" y="2" width="2" height="2" fill="#aa5555" />
      <rect x="10" y="4" width="2" height="2" fill="#aa5555" />
      <rect x="4" y="10" width="2" height="2" fill="#aa5555" />
      <rect x="2" y="12" width="2" height="2" fill="#aa5555" />
      <rect x="6" y="8" width="2" height="2" fill="#6b2020" />
      <rect x="8" y="6" width="2" height="2" fill="#6b2020" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ imageRendering: "pixelated" as const }}>
      <rect x="4" y="2" width="2" height="2" fill="#b8942e" />
      <rect x="6" y="2" width="2" height="2" fill="#b8942e" />
      <rect x="2" y="4" width="2" height="2" fill="#b8942e" />
      <rect x="8" y="4" width="2" height="2" fill="#b8942e" />
      <rect x="2" y="6" width="2" height="2" fill="#b8942e" />
      <rect x="8" y="6" width="2" height="2" fill="#b8942e" />
      <rect x="4" y="8" width="2" height="2" fill="#b8942e" />
      <rect x="6" y="8" width="2" height="2" fill="#b8942e" />
      <rect x="8" y="8" width="2" height="2" fill="#d4b848" />
      <rect x="10" y="8" width="2" height="2" fill="#d4b848" />
      <rect x="6" y="10" width="2" height="2" fill="#d4b848" />
      <rect x="12" y="10" width="2" height="2" fill="#d4b848" />
      <rect x="6" y="12" width="2" height="2" fill="#d4b848" />
      <rect x="12" y="12" width="2" height="2" fill="#d4b848" />
      <rect x="8" y="14" width="2" height="2" fill="#d4b848" />
      <rect x="10" y="14" width="2" height="2" fill="#d4b848" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ imageRendering: "pixelated" as const }}>
      <rect x="6" y="1" width="4" height="4" fill="#8a7e6a" />
      <rect x="4" y="5" width="8" height="3" fill="#8a7e6a" />
      <rect x="6" y="8" width="4" height="7" fill="#8a7e6a" />
      <rect x="7" y="2" width="2" height="2" fill="#a8997a" />
    </svg>
  );
}

const STAT_CONFIG: Record<
  string,
  { label: string; icon: () => React.ReactNode; barColor: string }
> = {
  influence: {
    label: "INF",
    icon: CrownIcon,
    barColor: "#c9a84c",
  },
  militaryPower: {
    label: "MIL",
    icon: SwordsIcon,
    barColor: "#8b4040",
  },
  wealth: {
    label: "WLT",
    icon: CoinsIcon,
    barColor: "#b8942e",
  },
  churchStanding: {
    label: "CHR",
    icon: CrossIcon,
    barColor: "#8a7e6a",
  },
};

interface StatBarProps {
  stat: string;
  value: number;
  change?: number;
}

export function StatBar({ stat, value, change }: StatBarProps) {
  const config = STAT_CONFIG[stat];
  if (!config) return null;

  const inDanger = value >= 86 || value <= 14;
  const inCritical = value >= 90 || value <= 10;
  const Icon = config.icon;

  const barColor = inCritical ? "#8b2020" : inDanger ? "#c9a84c" : config.barColor;

  return (
    <div className="flex items-center gap-2">
      <div className="w-5 flex items-center justify-center">
        <Icon />
      </div>
      <span className="text-[10px] font-heading text-[#8a7e6a] w-7 tracking-wider">
        {config.label}
      </span>
      <div className="flex-1 retro-bar-track rounded-sm overflow-hidden">
        <div
          className={`h-full retro-bar-fill ${inCritical ? "animate-retro-blink" : ""}`}
          style={{
            width: `${value}%`,
            background: `linear-gradient(180deg, ${barColor} 0%, ${barColor}aa 100%)`,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <div className="flex items-center gap-1 w-12 justify-end">
        {change !== undefined && change !== 0 && (
          <span
            className={`text-[10px] font-bold font-heading ${change > 0 ? "text-[#6aaa64]" : "text-[#cc4444]"}`}
          >
            {change > 0 ? "+" : ""}{change}
          </span>
        )}
        <span
          className={`text-xs font-bold font-heading ${inCritical ? "text-[#cc4444] animate-retro-blink" : "text-[#e8dcc8]"}`}
        >
          {value}
        </span>
      </div>
      {inDanger && (
        <span className="text-[8px] text-[#cc4444] uppercase font-heading w-8">
          {value <= 14 ? "LOW" : "HIGH"}
        </span>
      )}
    </div>
  );
}

export function StatPanel({
  stats,
  changes,
}: {
  stats: { [key: string]: number };
  changes?: { [key: string]: number } | null;
}) {
  return (
    <div className="space-y-2 parchment-card rounded-lg p-3">
      {Object.entries(stats).map(([key, value]) => (
        <StatBar
          key={key}
          stat={key}
          value={value}
          change={changes?.[key]}
        />
      ))}
    </div>
  );
}
