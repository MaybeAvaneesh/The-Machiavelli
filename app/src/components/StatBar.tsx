"use client";

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M3 18h18v2H3v-2zm1-2l2-8 4 4 3-6 3 6 4-4 2 8H4z" fill="#c9a84c" />
    </svg>
  );
}

function SwordsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M6.2 3L2 7.2l1.4 1.4L5 7l4.3 4.3-1.4 1.4 1.4 1.4 1.4-1.4L15 17l-1.6 1.6 1.4 1.4L19 15.8 6.2 3z" fill="#8b4040" />
      <path d="M17.8 3L22 7.2l-1.4 1.4L19 7l-4.3 4.3 1.4 1.4-1.4 1.4-1.4-1.4L9 17l1.6 1.6-1.4 1.4L5 15.8 17.8 3z" fill="#8b4040" opacity="0.7" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="9" cy="9" r="6" fill="#c9a84c" opacity="0.6" />
      <circle cx="15" cy="15" r="6" fill="#c9a84c" />
      <circle cx="15" cy="15" r="3" fill="none" stroke="#12100e" strokeWidth="0.5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M10 2h4v7h7v4h-7v9h-4v-9H3v-4h7V2z" fill="#8a7e6a" />
    </svg>
  );
}

const STAT_CONFIG: Record<
  string,
  { label: string; icon: () => React.ReactNode; barColor: string }
> = {
  influence: {
    label: "Influence",
    icon: CrownIcon,
    barColor: "bg-[#c9a84c]",
  },
  militaryPower: {
    label: "Military",
    icon: SwordsIcon,
    barColor: "bg-[#8b4040]",
  },
  wealth: {
    label: "Wealth",
    icon: CoinsIcon,
    barColor: "bg-[#b8942e]",
  },
  churchStanding: {
    label: "Church",
    icon: CrossIcon,
    barColor: "bg-[#8a7e6a]",
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

  return (
    <div className="flex items-center gap-3">
      <div className="w-6 flex items-center justify-center opacity-80">
        <Icon />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-heading text-[#d4c5a0] tracking-wide">
            {config.label}
          </span>
          <div className="flex items-center gap-2">
            {change !== undefined && change !== 0 && (
              <span
                className={`text-xs font-bold font-heading ${change > 0 ? "text-[#6aaa64]" : "text-[#8b2020]"}`}
              >
                {change > 0 ? "+" : ""}
                {change}
              </span>
            )}
            <span
              className={`text-sm font-bold font-heading ${inCritical ? "text-[#8b2020] animate-pulse" : inDanger ? "text-[#c9a84c]" : "text-[#e8dcc8]"}`}
            >
              {value}
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-[#2a2318] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              inCritical
                ? "bg-[#8b2020] animate-pulse"
                : inDanger
                  ? "bg-[#c9a84c]"
                  : config.barColor
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
        {inDanger && (
          <div className="flex justify-between mt-0.5">
            {value <= 14 && (
              <span className="text-[9px] text-[#8b2020] uppercase tracking-widest font-heading">
                Exile
              </span>
            )}
            {value >= 86 && (
              <span className="text-[9px] text-[#8b2020] uppercase tracking-widest font-heading ml-auto">
                Marked
              </span>
            )}
          </div>
        )}
      </div>
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
    <div className="space-y-3 parchment-card rounded-xl p-4">
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
