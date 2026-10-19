"use client";

interface ProgressBarProps {
  round: number;
  maxRounds: number;
}

export function ProgressBar({ round, maxRounds }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[9px] text-[#8a7e6a] uppercase tracking-widest font-heading">
        <span>Campaign</span>
        <span>{round} of {maxRounds}</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: maxRounds }, (_, i) => {
          const roundNum = i + 1;
          const completed = roundNum < round;
          const current = roundNum === round;

          return (
            <div
              key={i}
              className={`flex-1 retro-pip rounded-sm ${
                completed
                  ? "retro-pip-done"
                  : current
                    ? "retro-pip-current animate-retro-blink"
                    : "retro-pip-empty"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
