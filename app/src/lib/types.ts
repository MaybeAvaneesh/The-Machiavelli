export interface StatBlock {
  [key: string]: number;
  influence: number;
  militaryPower: number;
  wealth: number;
  churchStanding: number;
}

export type StatKey = keyof StatBlock;

export interface CharacterPerkEffect {
  type: string;
  [key: string]: unknown;
}

export interface Character {
  id: number;
  name: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  startingStats: StatBlock;
  perk: {
    name: string;
    description: string;
    effect: CharacterPerkEffect;
  };
  downside: {
    name: string;
    description: string;
    effect: CharacterPerkEffect;
  };
}

export interface Choice {
  id: string;
  text: string;
  statChanges: StatBlock;
  narration: string;
}

export interface Scenario {
  id: string;
  category: "political" | "military" | "economic" | "religious" | "crisis";
  title: string;
  description: string;
  choices: Choice[];
}

export interface Award {
  id: string;
  name: string;
  description: string;
  condition: Record<string, unknown>;
  rarity: "rare" | "epic" | "legendary";
}

export interface LuckRoll {
  die1: number;
  die2: number;
  total: number;
  band: "Negligible" | "Mild" | "Moderate" | "Dramatic";
  multiplier: number;
}

export interface GameState {
  characterId: number;
  character: Character;
  stats: StatBlock;
  round: number;
  maxRounds: number;
  alive: boolean;
  deathCause: string | null;
  scenarioHistory: string[];
  statHistory: StatBlock[];
  crisisCount: number;
  dangerZoneHistory: number;
  perkUsesRemaining: Record<string, number>;
  currentScenario: Scenario | null;
  lastLuckRoll: LuckRoll | null;
  awards: Award[];
}
