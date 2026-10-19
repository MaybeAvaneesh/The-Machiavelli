"use client";

import { useState, useCallback } from "react";

interface StatBlock {
  [key: string]: number;
  influence: number;
  militaryPower: number;
  wealth: number;
  churchStanding: number;
}

interface ChoiceOption {
  id: string;
  text: string;
}

interface ScenarioView {
  id: string;
  category: string;
  title: string;
  description: string;
  choices: ChoiceOption[];
  city?: string;
}

export interface WorldView {
  relationships: Record<string, string>;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
}

interface Character {
  id: number;
  name: string;
  title: string;
  difficulty: string;
  description: string;
  startingStats: StatBlock;
  perk: { name: string; description: string };
  downside: { name: string; description: string };
}

interface LuckRoll {
  die1: number;
  die2: number;
  total: number;
  band: string;
  multiplier: number;
}

interface Award {
  id: string;
  name: string;
  description: string;
  rarity: string;
}

export interface GameView {
  character: Character;
  stats: StatBlock;
  round: number;
  maxRounds: number;
  alive: boolean;
  deathCause: string | null;
  currentScenario: ScenarioView | null;
  awards: Award[];
  lastLuckRoll: LuckRoll | null;
  statHistory: StatBlock[];
  perkUsesRemaining: Record<string, number>;
  world?: WorldView;
}

type GamePhase = "menu" | "playing" | "narrating" | "dead" | "victory";

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [game, setGame] = useState<GameView | null>(null);
  const [internalState, setInternalState] = useState<unknown>(null);
  const [narration, setNarration] = useState("");
  const [appliedChanges, setAppliedChanges] = useState<StatBlock | null>(null);
  const [loading, setLoading] = useState(false);

  const startGame = useCallback(async (characterId?: number) => {
    setLoading(true);
    setNarration("");
    setAppliedChanges(null);

    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId }),
      });
      const data = await res.json();

      if (data.success) {
        setGame(data.gameState);
        setInternalState(data._internal);
        setPhase("playing");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const makeChoice = useCallback(
    async (choiceId: string) => {
      if (!internalState) return;
      setLoading(true);
      setNarration("");
      setAppliedChanges(null);
      setPhase("narrating");

      try {
        const res = await fetch("/api/game/choose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameState: internalState, choiceId }),
        });

        const reader = res.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6);

            try {
              const event = JSON.parse(json);

              if (event.type === "state_update") {
                setGame(event.gameState);
                setAppliedChanges(event.appliedChanges);
              }
              if (event.type === "internal") {
                setInternalState(event._internal);
              }
              if (event.type === "narration_chunk") {
                setNarration((prev) => prev + event.text);
              }
              if (event.type === "death") {
                setNarration((prev) => prev + "\n\n" + event.text);
              }
              if (event.type === "done") {
                // Stay in narrating phase — player must click to continue
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [internalState]
  );

  const continueAfterNarration = useCallback(() => {
    if (!game) return;
    if (!game.alive) {
      setPhase("dead");
    } else if (game.round > game.maxRounds || !game.currentScenario) {
      setPhase("victory");
    } else {
      setPhase("playing");
    }
  }, [game]);

  const resetGame = useCallback(() => {
    setPhase("menu");
    setGame(null);
    setInternalState(null);
    setNarration("");
    setAppliedChanges(null);
  }, []);

  return {
    phase,
    game,
    narration,
    appliedChanges,
    loading,
    startGame,
    makeChoice,
    continueAfterNarration,
    resetGame,
  };
}
