"use client";

import { useGame } from "@/lib/useGame";
import { CharacterSelect } from "@/components/CharacterSelect";
import { ScenarioCard } from "@/components/ScenarioCard";
import { StatPanel } from "@/components/StatBar";
import { NarrationPanel } from "@/components/NarrationPanel";
import { GameOverScreen } from "@/components/GameOverScreen";
import { ProgressBar } from "@/components/ProgressBar";
import { MapPanel } from "@/components/MapPanel";

export default function Home() {
  const {
    phase,
    game,
    narration,
    appliedChanges,
    loading,
    startGame,
    makeChoice,
    continueAfterNarration,
    resetGame,
  } = useGame();

  const showGame = (phase === "playing" || phase === "narrating") && game && game.currentScenario;

  return (
    <div className="min-h-screen bg-[#0a0806]">
      <div className="max-w-xl mx-auto px-4 py-8">
        {phase === "menu" && (
          <CharacterSelect
            onSelect={(id) => startGame(id)}
            onRandom={() => startGame()}
            loading={loading}
          />
        )}

        {showGame && (
          <div className={`space-y-5 ${phase === "narrating" ? "pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-heading font-semibold text-[#e8dcc8] tracking-wide">
                  {game.character.name}
                </h2>
                <p className="text-xs text-[#8a7e6a] font-body italic">{game.character.title}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-[#c9a84c] font-heading uppercase tracking-widest">
                  {game.character.perk.name}
                </p>
              </div>
            </div>

            <ProgressBar round={game.round} maxRounds={game.maxRounds} />
            <MapPanel
              category={game.currentScenario!.category}
              city={game.currentScenario!.city}
              relationships={game.world?.relationships}
            />
            <StatPanel stats={game.stats} changes={appliedChanges} />

            <ScenarioCard
              scenario={game.currentScenario!}
              round={game.round}
              maxRounds={game.maxRounds}
              onChoice={makeChoice}
              disabled={loading || phase === "narrating"}
            />
          </div>
        )}

        {/* Narration popup overlays on top of the game view */}
        {phase === "narrating" && game && (
          <NarrationPanel
            narration={narration}
            isStreaming={loading}
            onContinue={continueAfterNarration}
            isDead={!game.alive}
          />
        )}

        {(phase === "dead" || phase === "victory") && game && (
          <GameOverScreen
            game={game}
            narration={narration}
            isDead={phase === "dead"}
            onRestart={resetGame}
          />
        )}
      </div>
    </div>
  );
}
