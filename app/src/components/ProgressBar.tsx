"use client";

interface ProgressBarProps {
  round: number;
  maxRounds: number;
}

export function ProgressBar({ round, maxRounds }: ProgressBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[9px] text-[#8a7e6a] uppercase tracking-widest font-heading">
        <span>Campaign</span>
        <span>{round} of {maxRounds}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: maxRounds }, (_, i) => {
          const roundNum = i + 1;
          const completed = roundNum < round;
          const current = roundNum === round;

          return (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                completed
                  ? "bg-[#c9a84c]"
                  : current
                    ? "bg-[#c9a84c]/60 animate-pulse"
                    : "bg-[#2a2318]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
