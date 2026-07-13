"use client";

import type { GameView } from "@/lib/useGame";
import { StatPanel } from "./StatBar";

const RARITY_STYLES: Record<string, string> = {
  rare: "border-[#3a3020] bg-[#1a1610] text-[#d4c5a0]",
  epic: "border-[#6b5a30] bg-[#1a1610] text-[#c9a84c]",
  legendary: "border-[#c9a84c] bg-[#2a2010] text-[#c9a84c]",
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
    <div className="space-y-5 animate-fade-in">
      <div className="text-center space-y-2 py-3">
        <div className="divider" />
        <h1 className="text-2xl font-heading font-bold text-[#e8dcc8] tracking-[0.12em] pt-3"
          style={{ textShadow: "0 2px 8px rgba(201,168,76,0.15)" }}>
          {isDead ? "Your Story Ends" : "Legacy Secured"}
        </h1>
        <p className="text-[#8a7e6a] text-[10px] font-heading uppercase tracking-[0.2em]">
          {isDead
            ? `${game.character.name} — fallen in round ${game.round - 1}`
            : `${game.character.name} — survived all ${game.maxRounds} rounds`}
        </p>
        <div className="divider" />
      </div>

      {narration && (
        <div className="scroll-bg rounded-lg p-4">
          <p className="text-[#e8dcc8] font-body leading-relaxed text-base text-center italic whitespace-pre-wrap">
            {narration}
          </p>
        </div>
      )}

      <StatPanel stats={game.stats} />

      <div className="parchment-card rounded-lg p-3 text-center">
        <p className="text-[9px] text-[#8a7e6a] uppercase tracking-[0.2em] font-heading mb-1">
          Legacy Score
        </p>
        <p className="text-3xl font-bold text-[#c9a84c] font-heading"
          style={{ textShadow: "0 0 12px rgba(201,168,76,0.3)" }}>
          {totalStats}
        </p>
        <p className="text-xs text-[#8a7e6a] font-body mt-1">Combined stat total</p>
      </div>

      {game.awards && game.awards.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#3a3020]" />
            <span className="text-[9px] font-heading uppercase tracking-[0.2em] text-[#8a7e6a]">
              Awards Earned
            </span>
            <div className="h-px flex-1 bg-[#3a3020]" />
          </div>
          {game.awards.map((award) => (
            <div
              key={award.id}
              className={`border-2 rounded p-2.5 ${RARITY_STYLES[award.rarity] || RARITY_STYLES.rare}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-heading font-semibold tracking-wide">{award.name}</span>
                <span className="text-[8px] uppercase tracking-[0.15em] opacity-60 font-heading">
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
        className="w-full py-2.5 rounded retro-btn
          text-sm font-heading tracking-wide text-[#c9a84c] cursor-pointer"
      >
        Play Again
      </button>
    </div>
  );
}
