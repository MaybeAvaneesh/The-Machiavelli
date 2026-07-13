"use client";

import { useState } from "react";

interface Character {
  id: number;
  name: string;
  title: string;
  difficulty: string;
  description: string;
  startingStats: Record<string, number>;
  perk: { name: string; description: string };
  downside: { name: string; description: string };
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Noble",
  medium: "Condottiere",
  hard: "Outcast",
};

const STAT_LABELS: Record<string, string> = {
  influence: "INF",
  militaryPower: "MIL",
  wealth: "WLT",
  churchStanding: "CHR",
};

interface CharacterSelectProps {
  onSelect: (characterId: number) => void;
  onRandom: () => void;
  loading: boolean;
}

export function CharacterSelect({ onSelect, onRandom, loading }: CharacterSelectProps) {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const loadCharacters = async () => {
    if (characters) return;
    const res = await fetch("/api/game/characters");
    const data = await res.json();
    setCharacters(data.characters);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 py-6">
        <div className="divider mb-4" />
        <h1 className="text-3xl font-heading font-bold text-[#e8dcc8] tracking-[0.15em]"
          style={{ textShadow: "0 2px 8px rgba(201,168,76,0.15)" }}>
          THE MACHIAVELLI
        </h1>
        <p className="text-[#8a7e6a] text-[10px] font-heading uppercase tracking-[0.3em]">
          Power &middot; Treachery &middot; Survival
        </p>
        <div className="divider mt-4" />
        <p className="text-[#d4c5a0] text-sm font-body max-w-sm mx-auto leading-relaxed pt-2">
          Navigate one hundred years of Renaissance Italy.
          Every advantage is a liability. Every alliance is temporary.
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={onRandom}
          disabled={loading}
          className="px-5 py-2.5 rounded retro-btn
            disabled:opacity-50 text-sm font-heading tracking-wide text-[#c9a84c] cursor-pointer"
        >
          {loading ? "Summoning fate..." : "Random Character"}
        </button>
        <button
          onClick={loadCharacters}
          className="px-5 py-2.5 rounded retro-btn
            text-sm font-heading tracking-wide text-[#8a7e6a] hover:text-[#d4c5a0] cursor-pointer"
        >
          Choose Your Prince
        </button>
      </div>

      {characters && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {["easy", "medium", "hard"].map((diff) => (
            <div key={diff}>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 bg-[#3a3020]" />
                <span className="text-[9px] font-heading uppercase tracking-[0.2em] text-[#8a7e6a]">
                  {DIFFICULTY_LABELS[diff]}
                </span>
                <div className="h-px flex-1 bg-[#3a3020]" />
              </div>
              <div className="space-y-1">
                {characters
                  .filter((c) => c.difficulty === diff)
                  .map((c) => (
                    <div key={c.id} className="parchment-card-light rounded overflow-hidden">
                      <button
                        onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                        className="w-full text-left px-3 py-2.5 hover:bg-[#2a2318]/50
                          transition-all flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-heading text-[#e8dcc8] tracking-wide">
                            {c.name}
                          </span>
                          <span className="text-xs text-[#8a7e6a] font-body italic">{c.title}</span>
                        </div>
                      </button>

                      {expanded === c.id && (
                        <div className="px-3 py-3 bg-[#0a0806]/50 space-y-3 border-t border-[#3a3020]">
                          <p className="text-xs text-[#d4c5a0] leading-relaxed font-body">
                            {c.description}
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(c.startingStats).map(([k, v]) => (
                              <div key={k} className="text-center parchment-card rounded p-1.5">
                                <p className="text-[8px] text-[#8a7e6a] uppercase font-heading tracking-wider">
                                  {STAT_LABELS[k] || k}
                                </p>
                                <p className="text-sm font-bold text-[#e8dcc8] font-heading">{v}</p>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-1.5 text-xs font-body">
                            <p>
                              <span className="text-[#c9a84c]">{c.perk.name}</span>
                              <span className="text-[#8a7e6a]"> — {c.perk.description}</span>
                            </p>
                            <p>
                              <span className="text-[#cc4444]">{c.downside.name}</span>
                              <span className="text-[#8a7e6a]"> — {c.downside.description}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => onSelect(c.id)}
                            disabled={loading}
                            className="w-full py-2 rounded retro-btn
                              text-xs font-heading tracking-wide text-[#c9a84c]
                              disabled:opacity-50 cursor-pointer"
                          >
                            Play as {c.name}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
