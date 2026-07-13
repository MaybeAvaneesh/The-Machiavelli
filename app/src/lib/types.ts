export interface StatBlock {
  [key: string]: number;
  influence: number;
  militaryPower: number;
  wealth: number;
  churchStanding: number;
}

export type StatKey = keyof StatBlock;

export type RelationshipLevel =
  | "hostile"
  | "wary"
  | "neutral"
  | "allied"
  | "loyal";

export const RELATIONSHIP_ORDER: RelationshipLevel[] = [
  "hostile",
  "wary",
  "neutral",
  "allied",
  "loyal",
];

export interface WorldState {
  relationships: Record<string, RelationshipLevel>;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
}

export interface WorldEffects {
  setFlags?: Record<string, boolean>;
  setRelationships?: Record<string, RelationshipLevel>;
  adjustCounters?: Record<string, number>;
}

export interface ScheduledConsequence {
  id: string;
  inRounds: number;
  reason: string;
  statChanges?: Partial<StatBlock>;
  effects?: WorldEffects;
}

export interface ChoiceEffects extends WorldEffects {
  schedule?: ScheduledConsequence[];
}

export interface DeferredConsequence {
  id: string;
  triggerRound: number;
  reason: string;
  statChanges?: Partial<StatBlock>;
  effects?: WorldEffects;
}

export type Precondition =
  | { type: "flag"; key: string; equals?: boolean }
  | {
      type: "relationship";
      key: string;
      is?: RelationshipLevel;
      atLeast?: RelationshipLevel;
      atMost?: RelationshipLevel;
    }
  | { type: "counter"; key: string; gte?: number; lte?: number }
  | { type: "stat"; key: StatKey; gte?: number; lte?: number }
  | { type: "round"; gte?: number; lte?: number };

export interface GameAction {
  round: number;
  choiceId: string;
  luck: LuckRoll;
}

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
  effects?: ChoiceEffects;
  requires?: Precondition[];
}

export interface Scenario {
  id: string;
  category: "political" | "military" | "economic" | "religious" | "crisis";
  title: string;
  description: string;
  choices: Choice[];
  preconditions?: Precondition[];
  priority?: number;
  city?: string;
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
  world: WorldState;
  deferred: DeferredConsequence[];
  actionLog: GameAction[];
}
