"use client";

import { useState, useCallback, useRef } from "react";

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

const NARRATION_TOAST =
  "Live narration is unavailable right now. Showing the written chronicle instead.";

type GamePhase = "menu" | "playing" | "narrating" | "dead" | "victory";

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [game, setGame] = useState<GameView | null>(null);
  const [internalState, setInternalState] = useState<unknown>(null);
  const [narration, setNarration] = useState("");
  const [appliedChanges, setAppliedChanges] = useState<StatBlock | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

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

        const reader = res.ok ? res.body?.getReader() : undefined;
        if (!reader) {
          setNarration("The chronicler's ink has run dry. Fortune turns regardless.");
          showToast(NARRATION_TOAST);
          return;
        }
        let gotText = false;

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
                gotText = true;
                setNarration((prev) => prev + event.text);
              }
              if (event.type === "narration_unavailable") {
                showToast(NARRATION_TOAST);
              }
              if (event.type === "error") {
                showToast(NARRATION_TOAST);
                if (!gotText) {
                  gotText = true;
                  setNarration("The chronicler's ink has run dry. Fortune turns regardless.");
                }
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
        if (!gotText) {
          setNarration("The chronicler's ink has run dry. Fortune turns regardless.");
        }
      } catch {
        // Network drop mid-stream: never leave the player without a Continue button.
        setNarration((prev) => prev || "The chronicler's ink has run dry. Fortune turns regardless.");
        showToast(NARRATION_TOAST);
      } finally {
        setLoading(false);
      }
    },
    [internalState, showToast]
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
    toast,
    dismissToast,
  };
}
