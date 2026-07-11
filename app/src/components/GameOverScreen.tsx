"use client";

import type { GameView } from "@/lib/useGame";
import { StatPanel } from "./StatBar";

const RARITY_STYLES: Record<string, string> = {
  rare: "border-[#6b5a30]/40 bg-[#2a2318]/60 text-[#d4c5a0]",
  epic: "border-[#c9a84c]/40 bg-[#2a2318]/80 text-[#c9a84c]",
  legendary: "border-[#c9a84c]/60 bg-[#3a2a10]/60 text-[#c9a84c]",
};

interface GameOverScreenProps {
  game: GameView;
  narration: string;
  isDead: boolean;
  onRestart: () => void;
}

export function GameOverScreen({ game, narration, isDead, onRestart }: GameOverScreenProps) {
  const totalStats = Object.values(game.stats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-3 py-4">
        <div className="divider" />
        <h1 className="text-3xl font-heading font-bold text-[#e8dcc8] tracking-[0.12em] pt-4">
          {isDead ? "Your Story Ends" : "Legacy Secured"}
        </h1>
        <p className="text-[#8a7e6a] text-xs font-heading uppercase tracking-[0.2em]">
          {isDead
            ? `${game.character.name} — fallen in round ${game.round - 1}`
            : `${game.character.name} — survived all ${game.maxRounds} rounds`}
        </p>
        <div className="divider" />
      </div>

      {narration && (
        <div className="parchment-card rounded-xl p-5">
          <p className="text-[#e8dcc8] font-body leading-relaxed text-base text-center italic whitespace-pre-wrap">
            {narration}
          </p>
        </div>
      )}

      <StatPanel stats={game.stats} />

      <div className="parchment-card rounded-xl p-4 text-center">
        <p className="text-[9px] text-[#8a7e6a] uppercase tracking-[0.2em] font-heading mb-1">
          Legacy Score
        </p>
        <p className="text-3xl font-bold text-[#c9a84c] font-heading">{totalStats}</p>
        <p className="text-xs text-[#8a7e6a] font-body mt-1">Combined stat total</p>
      </div>

      {game.awards && game.awards.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#6b5a30]/20" />
            <span className="text-[9px] font-heading uppercase tracking-[0.2em] text-[#8a7e6a]">
              Awards Earned
            </span>
            <div className="h-px flex-1 bg-[#6b5a30]/20" />
          </div>
          {game.awards.map((award) => (
            <div
              key={award.id}
              className={`border rounded-lg p-3 ${RARITY_STYLES[award.rarity] || RARITY_STYLES.rare}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-heading font-semibold tracking-wide">{award.name}</span>
                <span className="text-[9px] uppercase tracking-[0.15em] opacity-60 font-heading">
                  {award.rarity}
                </span>
              </div>
              <p className="text-xs opacity-80 font-body">{award.description}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full py-3 rounded-lg parchment-card hover:border-[#c9a84c]/40
          transition-all text-sm font-heading tracking-wide text-[#c9a84c] cursor-pointer"
      >
        Play Again
      </button>
    </div>
  );
}
